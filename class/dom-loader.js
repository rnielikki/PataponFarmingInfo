function createAndAppend(text, elementType, parent) {
    const elem = document.createElement(elementType);
    elem.textContent = text;
    parent.appendChild(elem);
    return elem;
}
function createAndAppendAList(text, target, url){
    const elem = createAndAppend("", "li", target);
    const link = createAndAppend(text, "a", elem);
    link.href = url;
    return elem;
}
function updateContent(elem, data) {
    if(elem == null){
        console.error("target element is null");
        return;
    }
    for(const key of Object.keys(data)) {
        const targetElement = elem.querySelector("."+key);
        if(targetElement == null) continue;
        const value = data[key];
        if(typeof value == 'object' && value != null)
        {
            updateContent(targetElement, value);
        }
        else targetElement.textContent = value;
    }
}
(function(){
    const isDark = window.matchMedia("(preferes-color-scheme: dark)");
    window.addEventListener("load", () => {
        document.querySelector(".theme-selector-light").addEventListener("click", ()=>setTheme(false));
        document.querySelector(".theme-selector-dark").addEventListener("click", ()=>setTheme(true));
        setTheme(isDark)
    });
    function setTheme(isDark){
        if(isDark) {
            document.body.classList.add("dark");
        }
        else {
            document.body.classList.remove("dark");
        }
    }
})();
const DialogManager = (function()
{
    const dialogMap = new Map();
    let bg;
    let current;
    window.addEventListener("load", () => {
        bg = document.querySelector("#modal-background");
        bg.addEventListener("click", closeCurrent);
    });
    function toggleOpen(id, isOpen) {
        if(!bg) return;
        let dialog;
        if(!dialogMap.has(id)) {
            dialog = document.getElementById(id);
            if(!dialog) return;
            else {
                dialogMap.set(id, dialog);
            }
        }
        else dialog = dialogMap.get(id);
        if(isOpen) {
            dialog.setAttribute("open", "true");
            bg.removeAttribute("hidden");
            current=id;
        }
        else {
            current=null;
            bg.setAttribute("hidden", "");
            dialog.removeAttribute("open");
        }
    }
    function closeCurrent() {
        if(!current) return;
        toggleOpen(current, false);
    }
    return {
        openDialog: (id) => toggleOpen(id, true),
        closeDialog: (id) => toggleOpen(id, false)
    }
})();