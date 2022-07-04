//see console log to find out the data structure!
//WARNING: THIS IS COMPLICATED!
const skillRetriever = (function () {
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
        console.log("The rearranged data:");
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
    const groupMap = {};
    let resultContainer;
    let resultTemplate;
    let currentSkill;
    const dialogId = "skill-finder";
    window.addEventListener("load", function () {
        _target = document.querySelector(".Type");
        
        const inputGroup = document.querySelector("#skill-input-group");
        const inputGroupRadios = [...inputGroup.querySelectorAll("[data-type]")];

        const inputDetail = document.querySelector("#skill-input-detail");
        const allDetails = [...inputDetail.querySelectorAll("[data-skill-detail]")]; 

        resultContainer = document.querySelector(".skill-result");
        resultTemplate = resultContainer.querySelector("template").content;
        
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
        const openSkillWindow = function() {
            if(!currentSkill) return;
            const type = currentSkill.Type;
            if(groupMap[type]) {
                groupMap[type].toggle.checked = true;
                updateLegend(type, currentSkill);
            }
            else{
                for(const toggle of inputGroupRadios) {
                    toggle.checked = false;
                }
                updateLegend("", null);
            }
            DialogManager.openDialog(dialogId);
        };
        const closeSkillWindow = ()=>DialogManager.closeDialog(dialogId);
        _target.parentElement.querySelector("a").addEventListener("click",openSkillWindow);
        document.querySelector(".skill-close").addEventListener("click", closeSkillWindow);
        
        console.log("The DOM of data:");
        console.log(groupMap);
        addUpdaters("Attack");
        addUpdaters("Command");
        addUpdaters("Status Effect");
        
        return {
            open:openSkillWindow
        };
        
        function updateLegend(dataType, skill) {
            for(const detail of allDetails) {
                detail.style.display=(dataType === detail.dataset.skillDetail)?"block":"none";
            }
            if(!dataType) {
                resultContainer.textContent ="";
                return;
            }
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
    });
    window.addEventListener("skillLoaded", function(e) {
        currentSkill = e.detail;
        const type = e.detail.Type;
        if(!groupMap[type] && _target)
            _target.textContent = "Other";
        DialogManager.closeDialog(dialogId);
    })

    function calculateAttack() {
        const detailContent = groupMap.Attack["detail-content"];
        const attackTypeElems = detailContent["Attack Type"];
        const door = detailContent["Door"];
        const detailData = dataBySkillType.Attack;
        let resultData = {};
        for(var elem of Object.values(attackTypeElems)){
            if(elem.checked) {
                const attackTypeKey = elem.dataset.skillValue;
                combineObjects(resultData, detailData.Door[attackTypeKey]);

                if(!door.checked){
                    combineObjects(resultData, detailData.NoDoor[attackTypeKey]);
                }
            }
        }
        updateResult(resultData);
    }
    function calculateCommand() {
        const detailContent = groupMap.Command["detail-content"]["Command"];
        const detailData = dataBySkillType.Command;
        let resultData = {};
        for(var elem of Object.values(detailContent)){
            if(elem.checked) {
                const cmdTypeKey = elem.dataset.skillValue;
                combineObjects(resultData, detailData[cmdTypeKey]);
            }
        }
        updateResult(resultData);
    }
    function calculateStatusEffect() {
        const detailContent = groupMap["Status Effect"]["detail-content"]["Status"];
        const detailData = dataBySkillType["Status Effect"];
        let resultData = {};
        for(var elem of Object.values(detailContent)){
            if(elem.checked) {
                const statusEffect = elem.dataset.skillValue;
                combineObjects(resultData, detailData[statusEffect]);
            }
        }
        updateResult(resultData);
    }
    function combineObjects(objSample, objToAppend) {
        for(var key of Object.keys(objToAppend)) {
            const objData = objToAppend[key];
            if(objSample[key]) {
                for(const val of objData) {
                    objSample[key].add(val);
                }
            }
            else {
                objSample[key] = new Set(objData);
            }
        }
    }
    function updateResult(data) {
        resultContainer.textContent = "";
        for(var cl of Object.keys(data)) {
            const currentData = data[cl];
            const cloned = resultTemplate.cloneNode(true);
            cloned.querySelector("summary").textContent = cl;
            const list = cloned.querySelector("ul");
            for(var skl of currentData){
                createAndAppend(skl.Name, "li", list);
            }
            resultContainer.appendChild(cloned);
        }
    }
})();