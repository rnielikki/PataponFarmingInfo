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
(function () {
    let currentData;
    window.addEventListener("load", function () {
        const titleLevelFrom = document.querySelector(".title-level-from");
        const titleLevelTo = document.querySelector(".title-level-to");
        const resultElements = (function () {
            let arr = [];
            for (const req of [...document.querySelectorAll(".requirement")]) {
                const level = Number(req.dataset.level);
                if (!isNaN(level)) {
                    arr[level - 1] = req;
                }
            }
            return arr;
        })();
        const kachingResultElement = document.querySelector(".kaching");
        const levelFromField = document.querySelector("#input-level-from");
        const levelToField = document.querySelector("#input-level-to");
        const errorField = document.querySelector(".level-error");

        const loadData = function (levelFrom, levelTo) {
            if(!currentData) return;
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
            kachingResultElement.textContent = kachings * currentData.kaching;
        }
        const calcData = () => loadData(Number(levelFromField.value), Number(levelToField.value));
        window.addEventListener("eqUpdated", updateData);
        calculator = { "calculate": calcData };
    })
    function updateData(ev) {
        currentData = ev.detail;
        calculator.calculate();
    }
})();