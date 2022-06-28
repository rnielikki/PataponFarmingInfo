(function () {
    let _target;
    let _typeData = new Map();
    window.addEventListener("load", function () {
        _target = document.querySelector(".Type");
        _target.addEventListener("click", LoadData);
    });
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
})();