window.addEventListener("load",async function(){
    let region = (function(){
        let region = (new URLSearchParams(window.location.search)).get('region');
        switch(region){
            case "eu":
            case "us":
                return region;
            default:
                //I'll ask it later how to check if it's from EU?
                return "eu";
        }
    })();

    let [data, materialData] =
        await Promise.all(
            [fetch("rarepon.json").then(res => res.json()),
            fetch(`../material/material-${region}.json`).then(res => res.json())]
        )

    // ------ Size Info
    //All original coord data are on pixel coord from this image size - even if the image size changed, this shouldn't be changed as long as the position data don't changed
    let imageOrigin = [1920, 1080];
    let sizeInPixel = 150;
    let halfSizeInPercent = [50 * sizeInPixel/imageOrigin[0], 50 * sizeInPixel/imageOrigin[1]];
    let sizeInPercent = [(halfSizeInPercent[0] * 2) + "%", (halfSizeInPercent[1] * 2) + "%"];
    
    //BY PERCENT
    function getRelativeCoord(x, y) {
        return { x: 100 * x/imageOrigin[0], y:100 * y/imageOrigin[1]};
    }

    //------------ Class
    let classes = data.Class;
    let classIcon = document.querySelector(".rarepon-class");
    let classLabel = document.querySelector(".rarepon-class-name span");
    let currentClass;
    let currentClassData;
    let classListElement = null;
    setClass("Yaripon");
    classIcon.addEventListener("click", () => openModal(0, 120, 600, -1,
        (function(){
            if(classListElement === null){
                classListElement = document.createElement("div");
                classListElement.classList.add("class-modal-container");
                classListFrag = document.createDocumentFragment();
                for(let className of Object.keys(data.Class)){
                    let container = document.createElement("a");
                    let img = document.createElement("img");
                    img.src = `./class/${className}.png`;
                    img.alt = `[${className} Image]`;
                    let label = document.createElement("p");

                    label.textContent = className;

                    container.href = "#";
                    container.addEventListener("click", function(){ setClass(className); closeModal();})
                    container.classList.add("class-style");
                    container.classList.add("class-style-"+className.toLowerCase());
                    container.appendChild(img);
                    container.appendChild(label);

                    classListFrag.appendChild(container);
                }
                classListElement.appendChild(classListFrag);
            }
            return classListElement;
        })()
        , "class-modal"));

    function setClass(className) {
        classIcon.style.backgroundImage = `url('./class/${className}.png')`;
        classLabel.textContent = className;
        currentClass = className;
        currentClassData = classes[currentClass];
    }

    //-------------------- Rarepons
    let rarepons = data.Rarepon;
    let imageWrapper = document.querySelector(".rarepon-wrapper");
    let rareponTemplate = await fetch("./template.html").then(res => res.text()).then(res => (new DOMParser()).parseFromString(res, 'text/html').body.firstElementChild);

    for(var rarepon of Object.keys(rarepons)){
        initializeCoordMap(rarepon);
    }
    function initializeCoordMap(rarepon){
        let rareponInfo = rarepons[rarepon];
        let dimensions = getRelativeCoord(rareponInfo.Position[0], rareponInfo.Position[1]);
        let a = document.createElement("a");
        a.href = "#";
        a.title = rarepon;
        a.style.left = (dimensions.x - halfSizeInPercent[0]) + "%";
        a.style.top= (dimensions.y - halfSizeInPercent[1]) + "%";
        a.style.width = sizeInPercent[0];
        a.style.height = sizeInPercent[1];
        a.classList.add("rarepon-link");

        a.onclick = () => openModal(0, 0, -1, -1, fillRareponTemplateData());
        
        let label = document.createElement("p");
        label.textContent = rarepon;
        a.appendChild(label);
        
        imageWrapper.appendChild(a);
        
        function fillRareponTemplateData(){
            let template = rareponTemplate.cloneNode(true);
            let rareponResultData = getLevelMaterial(rarepon);
            let currentRareponData = rareponResultData[0];
            let rememberedElements = new Map();
            let allInfoMeta = Object.keys(rareponResultData[0]);
           
           template.querySelector(".rarepon-modal-title").textContent = rarepon;

            for(let materialNumber = 1;materialNumber < 5;materialNumber++) {
                let matNameIndex = "Material"+(materialNumber);
                let matGroup = currentClassData[matNameIndex];
                let matLevel = rarepons[rarepon].Material[matNameIndex];
                let matName = materialData[matGroup].value[matLevel-1];

                initAndFillInfoLine(template.querySelector("#material-"+matNameIndex), matName, currentRareponData[matNameIndex], matNameIndex, { group: matGroup, level: matLevel });
            }
            initAndFillInfoLine(template.querySelector("#material-KaChing"), "Ka-Ching", currentRareponData.KaChing, "KaChing");
            let scale = template.querySelector("#scale");
            let levelStatus = template.querySelector("#level");
            scale.addEventListener("change", onRangeChanged)
            template.querySelector(".close-button").onclick = closeModal;

            return template;

            //example - materialInfoLine: (Element), label: "Stone", val: 8, key: Material1, materalStatus: { group: "Metal", level: 1 }
            //materialStatus is null for Ka-Ching
            function initAndFillInfoLine(materialInfoLine, label, val, key, materialStatus = null){
                if(materialStatus !== null) {
                    materialInfoLine.href = `../material/index.html?region=${region}&material=${materialStatus.group}`;
                    materialInfoLine.target = "_blank";
                    materialInfoLine.title = `Level ${materialStatus.level} material : Click to see boss farming info`;
                    materialInfoLine.classList.add("material-type"+materialStatus.level);
                }

                materialInfoLine.querySelector(".rarepon-material-label").textContent = label;
                rememberedElements.set(key, materialInfoLine.querySelector(".rarepon-material-value"));
               fillInfoLine(key, val);
            }
            function fillInfoLine(indexName, val){
                rememberedElements.get(indexName).textContent = val;
            }

            function onRangeChanged() {
                let val = scale.value;
                levelStatus.textContent = val;
                let currentRareponData = rareponResultData[val-1];
                for(let info of allInfoMeta) {
                    fillInfoLine(info, currentRareponData[info]);
                }
            }
        }
    }
    function getLevelMaterial(rarepon) {
        let rareponData = rarepons[rarepon];
        let rareponMaterialData = rarepons[rarepon].Material;
        let rareponKaChing = rareponData.KaChing;
        let materialAmountData = new Array(10);
        for(let i = 0; i < 10; i++)
        {
            let level = i + 1;
            //rarepon level : i
            //material level: rareponMaterialData.MaterialX
            let amountData = {
                "KaChing": level * currentClassData.KaChing * rareponKaChing,
                "Material1": calculateAmount(level, rareponMaterialData.Material1),
                "Material2": calculateAmount(level, rareponMaterialData.Material2),
                "Material3": calculateAmount(level, rareponMaterialData.Material3, 2),
                "Material4": calculateAmount(level, rareponMaterialData.Material4, 5)
            };
            materialAmountData[i] = amountData;
        }
        return materialAmountData;

        //startLevel starts from 0, not 1 
        function calculateAmount(rareponLevel, materialLevel, startLevel = 0) {
            let res = Math.ceil((rareponLevel - startLevel)/materialLevel);
            return (res < 0)?0:res;
        }
        
    }

    //----------- FONT RESIZER --------------//
    let textElementsToResize = [classLabel];
    resizeTexts();
    window.addEventListener("resize",resizeTexts);
    function resizeTexts(){
        for(var textElem of textElementsToResize) {
            let h = textElem.parentElement.clientHeight;
            textElem.style.fontSize = (h * 0.8)+"px";
        }
    }
    
    //------- Modal ----------------//
    let isModalOpen = false;
    let allRootButtons = null;
    function openModal(left, top, width, height, content, className) {
        if(isModalOpen) closeModal();
        let background = document.createElement("div");
        background.classList.add("modal-background");
        background.addEventListener("click", closeModal);
        isModalOpen = true;

        let modal = document.createElement("div");
        let relativePosition = getRelativeCoord(left, top);
        let relativeSize = getRelativeCoord(width, height);
        modal.classList.add("modal");
        modal.style.left = relativePosition.x + "%";
        modal.style.top = relativePosition.y + "%";
        if(width >= 0) modal.style.width = relativeSize.x + "%";
        if(height >= 0) modal.style.height = relativeSize.y + "%";
        imageWrapper.appendChild(modal);

        modal.appendChild(content);
        //Do not select with tab
        if(allRootButtons === null){
            allRootButtons = [...document.querySelectorAll(".rarepon-wrapper > a")];
        }
        for(var btn of allRootButtons){
            btn.removeAttribute("href");
        }

        if(className) {
            modal.classList.add(className);
        }
        imageWrapper.appendChild(background);
    }
    function closeModal() {
        if(isModalOpen === false) return;
        imageWrapper.removeChild(document.querySelector(".modal-background"));
        imageWrapper.removeChild(document.querySelector(".modal"));
        imageWrapper.classList.remove("root-nav-disabled");

        for(var btn of allRootButtons){
            btn.href = "#";
        }
        isModalOpen = false;
    }
    document.addEventListener("keyup",(k)=>{
        if(k.key === "Esc" || k.key === "Escape") {
            closeModal();
        }
    })
});