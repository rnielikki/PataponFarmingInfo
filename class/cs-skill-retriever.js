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
        
        const groupMap = new Map();
        const inputGroup = document.querySelector("#skill-input-group");
        const inputGroupRadios = [...inputGroup.querySelectorAll("[data-type]")];

        const detailMap = new Map();
        const inputDetail = document.querySelector("#skill-input-detail");
        const allDetails = [...inputDetail.querySelectorAll("[data-skill-detail]")]; 
        
        for(const detail of allDetails)
        {
            detailMap.set(detail.dataset.skillDetail, detail);
            detail.style.display = "none";
        }
        for(const toggle of inputGroupRadios)
        {
            groupMap.set(toggle.dataset.type, toggle);
            toggle.addEventListener("change", function(e){
                updateLegend(e.target.dataset.type);
            })
        }

        window.addEventListener("skillLoaded", function(e) {
            const type = e.detail.Type;
            if(groupMap.has(type)) {
                groupMap.get(type).checked = true;
                updateLegend(type);
            }
            else{
                _target.textContent = "Other";
                for(const toggle of inputGroupRadios) {
                    toggle.checked = false;
                }
                updateLegend("");
            }
        });
        addUpdaters("Attack");
        addUpdaters("Command");
        addUpdaters("Status Effect");
        
        function updateLegend(dataType) {
            for(const detail of allDetails) {
                detail.style.display=(dataType === detail.dataset.skillDetail)?"block":"none";
            }
            if(!dataType) return;
            const calculator = calculators[dataType];
            if(calculator)  calculator();
        }
        function addUpdaters(type) {
            for(const elem of [...detailMap.get(type).querySelectorAll("input")]){
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