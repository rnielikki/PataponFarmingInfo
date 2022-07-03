const hashCutter = (function(){
    //async to sync?
    let data;
    window.addEventListener("dataLoaded", (e) => data = e.detail);
    const retrieveData = function(hash){
        const splitted = hash.substring(1).split("/",2);
        const cls = splitted[0];
        const skl = splitted[1]?.replaceAll("%20", " ");
        if(!data[cls]) return {};
        let skill;
        if(skl) {
            let skills = data[cls].Skills;
            if(!Array.isArray(skills)) {
                const skillFrag = Object.values(skills).find(s => s.find(s2 => s2.Name === skl));
                if(skillFrag){
                    skill = skillFrag.find(s => s.Name===skl);
                }
            }
            else{
                skill = skills.find(s => s.Name === skl);
            }
        }
        return {
            class:cls,
            skill:skill
        }
    }
    return {
        retrieve : retrieveData
    }
})();