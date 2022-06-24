function createAndAppend(text, elementType, parent) {
    const elem = document.createElement(elementType);
    elem.textContent = text;
    parent.appendChild(elem);
    return elem;
}
function createAndAppendList(text, target, callback) {
    const elem = createAndAppend(text, "li", target);
    elem.addEventListener("click", callback);
    return elem;
}

//----- dom loader
//----- public
async function appendDom(templateName, parent)
{
    const child = (await _loadDom(templateName)).cloneNode(true);
    parent.appendChild(child);
    return child;
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
//----- should be private
const _loadedDom = new Map();
const _domParser = new DOMParser();
async function _loadDom(templateName) {
    if(_loadedDom.has(templateName)) {
        return _loadedDom.get(templateName);
    }
    return await fetch(templateName+".html")
        .then(res => res.text())
        .then(res => {
            const htmlDom = _domParser.parseFromString(res, "text/html");
            const template = htmlDom.querySelector("#template");
            template.id = "";
            _loadedDom.set(templateName, template);
            return template;
        })
        .catch(()=>{
            console.error(`failed to load ${templateName}.html - check if the file exists`);
        });
}