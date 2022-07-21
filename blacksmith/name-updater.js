(async function(){
    const [typeData] = await Promise.all([
        getJsonFetchPromise("./item-type.json"),
        new Promise((res)=>window.addEventListener("load", res)) //window load
    ]);
    const resultFields = [...document.querySelectorAll(".requirement-label")].sort(l => Number(l.dataset.array));
    window.addEventListener("eqUpdated", setName);
    //dom---
    function setName(e) {
        const value = e.detail.data.material;
        for(let i=0;i<resultFields.length;i++) {
            resultFields[i].textContent = typeData[value][i];
        }
    }
})();