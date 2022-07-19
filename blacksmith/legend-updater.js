(function () {
    window.addEventListener("dataLoaded", function (e) {
        const data = e.detail;
        const weaponGroup = document.querySelector(".equipment-group-weapon");
        const armourGroup = document.querySelector(".equipment-group-armour");
        const legends = {};
        const weaponFrag = document.createDocumentFragment();
        const armourFrag = document.createDocumentFragment();
        let firstRadio = null;

        for (const eq of Object.keys(data)) {
            [radio, label] = getRadio(eq);
            const eqData = data[eq];
            switch(eqData.type){
                case "Weapon":
                    if(!legends[eqData.class]) {
                        const fieldset = document.createElement("fieldset");
                        const legend = document.createElement("legend");
                        legend.textContent = eqData.class;
                        fieldset.appendChild(legend);
                        legends[eqData.class] = fieldset;
                        weaponFrag.appendChild(fieldset);
                    }
                    legends[eqData.class].appendChild(label);
                    break;
                case "Armour":
                    armourFrag.appendChild(label);
                    break;
                default:
                    continue;
            }
            if(firstRadio===null) firstRadio = radio;
        }
        firstRadio.checked = true;
        weaponGroup.appendChild(weaponFrag);
        armourGroup.appendChild(armourFrag);
        selectEquipment(firstRadio.value);
        
        function selectEquipment(value) {
            const onUpdated = new CustomEvent("eqUpdated", { detail:data[value] });
            window.dispatchEvent(onUpdated);
        }
        function getRadio(name) {
            const eqLabel = document.createElement("label");
            const radio = document.createElement("input");
            const id = `eq-${name}`;
            radio.id = id;
            eqLabel.setAttribute("for", id);
            eqLabel.textContent = name;
            radio.type = "radio";
            radio.name = "equipment";
            radio.value = name;
            radio.onchange = ()=>selectEquipment(radio.value);
            eqLabel.prepend(radio)
            return [radio, eqLabel];
        }
    });
})()