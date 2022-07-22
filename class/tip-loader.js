const TipLoader = (function () {
    let tips;
    let tipElement;
    let commonKeys;
    let expandImg;
    fetch("template/tip-template.json", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    }).then(t => t.json())
        .then(t => {
            tips = t;
            commonKeys = Object.keys(tips.__common);
        });

    window.addEventListener("load", function () {
        tipElement = document.querySelector(".tip-data");
        expandImg = document.querySelector(".image-expand");
        expandImg.onclick = ()=>DialogManager.closeDialog("image-expand-modal");
    });
    return {
        loadTip:loadTip
    };
    function loadTip(data) {
        tipElement.textContent ="";
        const tip = retrieveTip();
        const addTip = (txt)=> {
            const tipContent0 = document.createElement("p");
            tipContent0.innerHTML = txt;
            tipElement.appendChild(tipContent0);
        }
        addTip(tip);
        if (data.Image) {
            const a = document.createElement("a");
            a.href = "javascript:void(0)";
            const img = new Image();
            img.src = `tips/${data.Image}`;
            expandImg.src = img.src;
            img.alt = data.Image;

            a.title="Click to expand";
            a.onclick = ()=>DialogManager.openDialog("image-expand-modal");
            a.appendChild(img);
            tipElement.appendChild(a);
        }
        if (data.Tip) {
            addTip(data.Tip);
        }

        function retrieveTip() {
            const type = data.Type;
            if (tips[type]) {
                return replaceFrom(tips[type].Default);
            }
            else return "";
        }
        function replaceFrom(raw) {
            switch (data.Type) {
                case "Attack":
                    const attackType = data["Attack Type"];
                    raw = raw.replaceAll("%Attack%", "<mark>" + attackType?.join(", ") + "</mark>");
                    raw += data.Execution ? tips.Attack.Constant : tips.Attack.Speed;
                    raw += data.Door ? tips.Attack.Door : tips.Attack.NoDoor;
                    if(attackType.indexOf("Attack") > -1 && attackType.indexOf("Defend") > -1
                    && !data.Stempede) {
                        raw += tips["Attack"]["Defend"];
                    }
                    break;
                case "Status Effect":
                    raw += tips["Status Effect"].Status[data.Status ?? "Any"];
                    break;
                case "Command":
                    raw = raw.replaceAll("%Command%", "<mark>" + data.Command + "</mark>");
                    break;
            }
            for (var key of commonKeys) {
                if(key === "VS" && data.VS === false) {
                    raw = raw.replaceAll("%VS%", "");
                }
                raw = raw
                .replaceAll(`%${key}%`, tips.__common[key])
                .replaceAll("\n","<br>");
            }
            return raw;
        }
    }
})();