(async function(){
    const [typeData] = await Promise.all([
        getJsonFetchPromise("./item-type.json"),
        new Promise((res)=>window.addEventListener("load", res)) //window load
    ]);
    const equipments = typeData.equipments;
    const names = typeData.names;
    const resultFields = [...document.querySelectorAll(".requirement-label")].sort(l => Number(l.dataset.array));
    //dom---
    const classGroup = document.querySelector(".class-group");
    const frag = document.createDocumentFragment();
    let firstRadio = null;
    for(const eq of Object.keys(equipments)) {
        const eqType = equipments[eq];
        const field = document.createElement("fieldset");
        const legend = document.createElement("legend");
        legend.textContent = eq;
        field.appendChild(legend);
        for(const eqName of Object.keys(eqType)) {
            const eqLabel = document.createElement("label");
            const radio = document.createElement("input");
            const id = `eq-${eqName}`;
            radio.id = id;
            eqLabel.setAttribute("for", id);
            eqLabel.textContent = eqName;
            radio.type="radio";
            radio.name = "equipment";
            radio.value = eqType[eqName];
            radio.onchange = ()=>selectEquipment(radio.value);
            field.appendChild(radio);
            field.appendChild(eqLabel);
            if(firstRadio === null) firstRadio = radio;
        }
        frag.appendChild(field);
    }
    classGroup.appendChild(frag);
    firstRadio.checked = true;
    selectEquipment(firstRadio.value)
    function selectEquipment(value) {
        for(let i=0;i<resultFields.length;i++) {
            resultFields[i].textContent = names[value][i];
        }
    }
})();