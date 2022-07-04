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
const DialogManager = (function()
{
    const dialogMap = new Map();
    function toggleOpen(id, isOpen) {
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
        }
        else {
            dialog.removeAttribute("open");
        }
    }
    return {
        openDialog: (id) => toggleOpen(id, true),
        closeDialog: (id) => toggleOpen(id, false)
    }
})();