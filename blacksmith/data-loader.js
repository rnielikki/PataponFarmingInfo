let calculate;
(async function(){
    const [amountData] = await Promise.all([
        getJsonFetchPromise("./material.json"),
        new Promise((res)=>window.addEventListener("load", res)) //window load
    ]);

    const titleLevelFrom = document.querySelector(".title-level-from");
    const titleLevelTo = document.querySelector(".title-level-to");
    const resultElements = (function(){
        let arr = [];
        for(const req of [...document.querySelectorAll(".requirement")]) {
            const level = Number(req.dataset.level);
            if(!isNaN(level)) {
                arr[level-1] = req;
            }
        }
        return arr;
    })();
    const levelFromField = document.querySelector("#input-level-from");
    const levelToField = document.querySelector("#input-level-to");
    const errorField = document.querySelector(".level-error");

    const loadData = function(levelFrom, levelTo) {
        titleLevelFrom.textContent = levelFrom;
        titleLevelTo.textContent = levelTo;
        if(isNaN(levelFrom) || isNaN(levelTo) ||
            levelFrom>=levelTo || levelFrom < 0 || levelTo > 40) {
            errorField.removeAttribute("hidden");
            for(let i= 0;i<resultElements.length;i++) {
                resultElements[i].textContent = "-";
            }
            return;
        }
        else {
            errorField.setAttribute("hidden", "");
        }
        let res = [0,0,0,0,0];
        for(let i=levelFrom;i<levelTo;i++) {
            const current = amountData[i].requirements;
            for(let j=0;j<res.length;j++) {
                res[j]+=current[j];
            }
        }
        for(let i= 0;i<resultElements.length;i++) {
            resultElements[i].textContent = res[i];
        }
    }
    loadData(0, 39);
    return function() {
            loadData(Number(levelFromField.value), Number(levelToField.value));
    }
})().then(res => calculate = res);