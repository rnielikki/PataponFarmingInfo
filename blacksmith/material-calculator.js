const multipliers = (function() {
    let preCalculated=[];
    for(let i=0;i<40;i++) {
        preCalculated[i] = getData(i);
    }
    function getData(level) {
        //material
        const material = getMaterialRequirements(level);
        //ka-ching
        return {
            material:material,
            kaching:0.375*level*level+1.125*level+1
        }
        function getMaterialRequirements(level) {
            let res=[];
            for(let tier=1;tier<6;tier++){
                res[tier-1] = getMaterialRequirementByTier(level, tier);
            }
            return res;
            function getMaterialRequirementByTier(level, tier) {
                if(tier === 1) return level;
                else if(level<=20) {
                    return Math.max(Math.ceil((level+1) / 5) - tier, 0);
                }
                else {
                    return Math.ceil((level+1)/10) - tier + 2;
                }
            }
        }
    }
    return preCalculated;
})();