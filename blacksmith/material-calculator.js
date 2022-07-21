const multipliers = (function () {
    let preCalculated = [];
    for (let i = 0; i < 40; i++) {
        preCalculated[i] = getData(i);
    }
    function getData(level) {
        //material
        const material = getMaterialRequirements(level);
        //ka-ching
        return {
            material: material,
            kaching: 0.375 * level * level + 1.125 * level + 1
        }
        function getMaterialRequirements(level) {
            let res = [];
            for (let tier = 1; tier < 6; tier++) {
                res[tier - 1] = getMaterialRequirementByTier(level, tier);
            }
            return res;
            function getMaterialRequirementByTier(level, tier) {
                if (tier === 1) return level;
                else if (level <= 20) {
                    return Math.max(Math.ceil((level + 1) / 5) - tier, 0);
                }
                else {
                    return Math.ceil((level + 1) / 10) - tier + 2;
                }
            }
        }
    }
    return preCalculated;
})();
const calculator = (function () {
    const calc = new Calculator();
    return calc;
    function Calculator() {
        let titleLevelFrom;
        let titleLevelTo;

        let kachingResultElement;
        let levelFromField;
        let levelToField;
        let errorField;
        let resultElements;
        
        let currentData;
        let currentMultiplier;
        
        let isReady;
        
        window.addEventListener("eqUpdated", updateData);
        return { calculate : calculate };

        function init() {
            if(isReady) return;
            titleLevelFrom = document.querySelector(".title-level-from");
            titleLevelTo = document.querySelector(".title-level-to");

            kachingResultElement = document.querySelector(".kaching");
            levelFromField = document.querySelector("#input-level-from");
            levelToField = document.querySelector("#input-level-to");
            errorField = document.querySelector(".level-error");
            
            resultElements = (function () {
                let arr = [];
                for (const req of [...document.querySelectorAll(".requirement")]) {
                    const level = Number(req.dataset.level);
                    if (!isNaN(level)) {
                        arr[level - 1] = req;
                    }
                }
                return arr;
            })();
            isReady = true;
        }

        function loadData(levelFrom, levelTo) {
            if(!isReady) init();
            titleLevelFrom.textContent = levelFrom;
            titleLevelTo.textContent = levelTo;
            if (isNaN(levelFrom) || isNaN(levelTo) ||
                levelFrom >= levelTo || levelFrom < 0 || levelTo > 40) {
                errorField.removeAttribute("hidden");
                for (let i = 0; i < resultElements.length; i++) {
                    resultElements[i].textContent = "-";
                }
                return;
            }
            else {
                errorField.setAttribute("hidden", "");
            }
            let kachings = 0;
            let res = [0, 0, 0, 0, 0];
            for (let i = levelFrom; i < levelTo; i++) {
                const current = multipliers[i].material;
                for (let j = 0; j < res.length; j++) {
                    res[j] += current[j];
                }
                kachings += multipliers[i].kaching;
            }
            for (let i = 0; i < resultElements.length; i++) {
                resultElements[i].textContent = res[i];
            }
            kachingResultElement.textContent = kachings * currentData.kaching * currentMultiplier;
        }

        function updateData(ev) {
            currentData = ev.detail.data;
            currentMultiplier = ev.detail.enchantment;
            calculate();
        }

        function calculate () {
            if(!isReady) init();
            loadData(Number(levelFromField.value), Number(levelToField.value));
        }
    }
})();