window.addEventListener("load",async function(){
    let data = await fetch("boss.json").then(res => res.json());
    let template = await fetch("template.html").then(res => res.text()).then(res => (new DOMParser()).parseFromString(res, 'text/html').body.firstElementChild);
    let materialInfoElems = document.querySelectorAll(".material-index-content");

    let nav = document.querySelector("nav");
    let contentRoot = document.querySelector(".content-root");
    let navFrag = document.createDocumentFragment();
    let body = document.createDocumentFragment();
    let materialIndexElem = document.querySelector(".material-index");

    for(let material of Object.keys(data)){
        let block = appendElementWithText(material, navFrag, "material", "a");
        block.href = "#";
        block.addEventListener("click", ()=>loadContent(material));
    }
    nav.appendChild(navFrag);
    
    function loadContent(material) {
        contentRoot.textContent = "";
        let materialData = data[material];
        let bossData = materialData.Boss;

        addMaterialIndex(material, materialData.Items);

        for(let boss of Object.keys(bossData)){
            let elem = addContent(boss, bossData[boss]);
            body.appendChild(elem);
        }
        contentRoot.appendChild(body);
    }
    
    function addMaterialIndex(materialType, materialArray) {
        //Hide until the image and text is fully loaded, to avoid confusion
        materialIndexElem.classList.add("hidden");
        for(let i=0;i<5;i++) {
            let materialInfoElem = materialInfoElems[i];
            materialInfoElem.querySelector("img").src = `materials/${materialType}/${i}.png`;
            materialInfoElem.querySelector(".material-index-content-name").textContent = materialArray[i];
        }
        materialIndexElem.classList.remove("hidden");
    }

    function addContent(bossName, content){
        let container = template.cloneNode(true);
        container.classList.add("boss-"+content.difficulty);
        addInformation(bossName, ".boss-head");
        for(var info of Object.keys(content)){
            if(info !== "difficulty"){
                let targetElement = addInformation(content[info], `.prop-${info}`);
                switch(info){
                    case "nostagger":
                        let img = document.createElement("img");
                        img.src = `nostagger/${bossName}.gif`;
                        targetElement.after(img);
                        break;
                    case "weakness":
                        let value = content[info];
                        if(value !== null && content[value] === true)
                        {
                            container.querySelector(".prop-"+value).classList.add("prop-switch-highlight");
                        }
                        break;
                }
            }
        }

        return container;
        function addInformation(value, query){
            let targetElem = container.querySelector(query);
            if(value === false){
                targetElem.style.display = "none";
            }
            else if(typeof value !== "boolean" && value !== null)
            {
                container.querySelector(query).textContent = value;
            }
            return targetElem;
        }
    }
    function appendElementWithText(text, target, className, type = "div"){
        let elem = document.createElement(type);
        elem.classList.add(className);
        elem.textContent = text;
        target.appendChild(elem);
        return elem;
    }
});