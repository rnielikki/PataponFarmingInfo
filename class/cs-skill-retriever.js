(function () {
    let _target;
    let _map = {}
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
        
        function updateLegend(dataType) {
            for(const detail of allDetails) {
                detail.style.display=(dataType === detail.dataset.skillDetail)?"block":"none";
            }
        }
        
        //_target.addEventListener("click", LoadData);
    });
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