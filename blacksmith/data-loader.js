(async function(){
    const [data, enc] = await Promise.all([
        getJsonFetchPromise("./data.json"),
        getJsonFetchPromise("./enchantments.json"),
        new Promise((res)=>window.addEventListener("load", res)) //window load
    ])
    const onDataLoaded = new CustomEvent("dataLoaded", { detail:{ data: data, enchantments: enc } });
    window.dispatchEvent(onDataLoaded);
})();