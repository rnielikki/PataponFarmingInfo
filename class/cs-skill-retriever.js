(function () {
    let _target;
    const calculators = {
       "Attack" : calculateAttack,
       "Command" : calculateCommand,
       "Status Effect": calculateStatusEffect
    };
    const dataBySkillType = {
        "Attack":
        {
            "Door":{
                "Attack":{},
                "Defend":{},
                "Charge Attack":{},
                "Charge Defend":{}
            },
            "NoDoor":{
                "Attack":{},
                "Defend":{},
                "Charge Attack":{},
                "Charge Defend":{}
            }
        },
        "Command":{
            "PATAPATA":{},
            "CHAKACHAKA":{}
        },
        "Status Effect": {
            "Stagger":{},
            "Knockback":{},
            "Fire":{},
            "Ice":{},
            "Sleep":{},
            "Poison":{}
        }
    };

    window.addEventListener("dataLoaded", function(e){
        const allClassData = e.detail;
        for(const className of Object.keys(allClassData))
        {
            const classData = allClassData[className];
            let skillList = classData.Skills;
            if(!Array.isArray(skillList)) skillList = Object.values(skillList).flat();
            for(const skill of skillList) {
                switch(skill.Type){
                    case "Attack":
                        const attackTypes = skill["Attack Type"];
                        if(attackTypes && Array.isArray(attackTypes)){
                            for(const attackType of attackTypes){

                                const dataByAttackType =
                                    skill.Door?
                                    dataBySkillType.Attack.Door[attackType]:
                                    dataBySkillType.Attack.NoDoor[attackType];
                                addOrCreate(dataByAttackType, skill, className);
                            }
                        }
                        break;
                    case "Command":
                        const command = skill["Command"].toUpperCase();
                        if(command) {
                            const dataByCommand = dataBySkillType.Command[command];
                            if(dataByCommand) addOrCreate(dataByCommand, skill, className);
                        }
                        break;
                    case "Status Effect":
                        const status = skill["Status"];
                        if (status) {
                            const dataByStatusEffect = dataBySkillType["Status Effect"];
                            if(!dataByStatusEffect) break;
                            if(status != "Any") addOrCreate(dataByStatusEffect[status], skill, className);
                            else {
                                for(const stData of Object.values(dataByStatusEffect)) {
                                    addOrCreate(stData, skill, className);
                                }
                            }
                        }
                        break;
                }
            }
        }
        console.log(dataBySkillType);
        function addOrCreate(group, unitData, unitName) {
            if (group) {
                if (!group[unitName]) {
                    group[unitName] = [unitData]
                }
                else {
                    group[unitName].push(unitData);
                }
            }
        }
    });
    window.addEventListener("load", function () {
        _target = document.querySelector(".Type");
        
        const groupMap = {};
        const inputGroup = document.querySelector("#skill-input-group");
        const inputGroupRadios = [...inputGroup.querySelectorAll("[data-type]")];

        const inputDetail = document.querySelector("#skill-input-detail");
        const allDetails = [...inputDetail.querySelectorAll("[data-skill-detail]")]; 
        
        for(const detail of allDetails)
        {
            groupMap[detail.dataset.skillDetail] = {};
            groupMap[detail.dataset.skillDetail]["detail"]=detail;
            groupMap[detail.dataset.skillDetail]["detail-content"]={};
            const detailContentMap = groupMap[detail.dataset.skillDetail]["detail-content"];
            for(const detailContent of [...detail.querySelectorAll("[data-skill-index]")])
            {
                if(!detailContentMap[detailContent.dataset.skillIndex]) detailContentMap[detailContent.dataset.skillIndex] = {};
                if(!detailContent.dataset.skillValue) detailContentMap[detailContent.dataset.skillIndex] = detailContent;
                else detailContentMap[detailContent.dataset.skillIndex][detailContent.dataset.skillValue.toLowerCase()] = detailContent;
            }
            detail.style.display = "none";
        }
        for(const toggle of inputGroupRadios)
        {
            groupMap[toggle.dataset.type]["toggle"] = toggle;
            toggle.addEventListener("change", function(e){
                updateLegend(e.target.dataset.type);
            })
        }

        window.addEventListener("skillLoaded", function(e) {
            const type = e.detail.Type;
            if(groupMap[type]) {
                groupMap[type].toggle.checked = true;
                updateLegend(type, e.detail);
            }
            else{
                _target.textContent = "Other";
                for(const toggle of inputGroupRadios) {
                    toggle.checked = false;
                }
                updateLegend("", null);
            }
        });
        console.log(groupMap);
        addUpdaters("Attack");
        addUpdaters("Command");
        addUpdaters("Status Effect");
        
        function updateLegend(dataType, skill) {
            for(const detail of allDetails) {
                detail.style.display=(dataType === detail.dataset.skillDetail)?"block":"none";
            }
            if(!dataType) return;
            if(skill){
                const detailContents = groupMap[dataType]["detail-content"];
                for(const detailIndex of Object.keys(detailContents)) {
                    const skillDetailData = skill[detailIndex];
                    //array
                    if(Array.isArray(skillDetailData)) {
                        for(const detailKey of Object.keys(detailContents[detailIndex])) {
                            const skillDetail = detailContents[detailIndex][detailKey].dataset.skillValue;
                            const skillDetailLower = skillDetail.toLowerCase();
                            detailContents[detailIndex][skillDetailLower].checked = skillDetailData.findIndex(k => k.toLowerCase() === detailKey) > -1;
                        }
                    }
                    //true/false checkbox
                    else if(typeof(skillDetailData)==="boolean") {
                        if(detailContents[detailIndex]) {
                            detailContents[detailIndex].checked = skillDetailData;
                        }
                    }
                    //not an array
                    else {
                        const elem = detailContents[detailIndex][skillDetailData.toLowerCase()];
                        //console.log(`${skillDetailData} and ${detailIndex}`);
                        if(skillDetailData && detailContents[detailIndex]) {
                            elem.checked =
                                skillDetailData.toLowerCase() === elem.dataset.skillValue.toLowerCase();
                        }
                    }
                }
            }
            const calculator = calculators[dataType];
            if(calculator) calculator();
        }
        function addUpdaters(type) {
            for(const elem of [...groupMap[type].detail.querySelectorAll("input")]){
                elem.addEventListener("change", calculators[type]);
            }
        }
        //_target.addEventListener("click", LoadData);
    });
    function calculateAttack() {
        console.log("attack");
    }
    function calculateCommand() {
        console.log("command");
        
    }
    function calculateStatusEffect() {
        console.log("status");
    }
    function loadData() {
    }
    /*
    function LoadData(){
        if(currentSkillData==null) return;
        console.log(findData(currentSkillData));
    }
    function findData(data){
        if(allClasses === {} || !(data?.Type)) return [];
        let relatedSkills = [];
        for(const className of Object.keys(allClasses)) {
            let csList = allClasses[className].Skills;
            if(!Array.isArray(csList)) {
                csList = Object.values(csList);
            }
            for(const skill of csList) {
                if(skill?.Type === data.Type && compareIfRelated(data, skill)) {
                    relatedSkills.push(skill);
                }
            }
        }
        return relatedSkills;
    }
    function compareIfRelated(skillOne, skillTwo) {
        if(skillOne === skillTwo) return false;
        switch(skillOne.Type) {
            case "Attack":
                if((skillOne.Door && !skillTwo.Door)) return false;
                const firstAttackType = skillOne["Attack Type"];
                const secondAttackType = skillTwo["Attack Type"];
                if(firstAttackType && secondAttackType &&
                    Array.isArray(firstAttackType) && Array.isArray(secondAttackType)){
                    return testOverlap(firstAttackType, secondAttackType);
                }
                return true;
            case "Command":
                return skillOne.Command === skillTwo.Command;
            case "Status Effect":
                if(skillOne.Status === "Any" || skillTwo.Status === "Any") return true;
                else return skillOne.Status === skillTwo.Status;
            default:
                return true;
        }
        function testOverlap(arrayOne, arrayTwo){
            for(const dataOne of arrayOne) {
                if(arrayTwo.indexOf(dataOne) > -1) return true;
            }
            return false;
        }
    }
    */
})();