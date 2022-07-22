const updater = (function () {
    const dataUpdater = new Updater();
    window.addEventListener("dataLoaded", dataUpdater.init);
    function Updater() {
        let ready = false;
        let data;
        let enchantments;
        let enchantmentElements;
        let currentGroup;
        
        let currentEncMultiplier;
        let currentData = null;

        return {
            init:init
        };
        function init(e) {
            if (ready) return;
            data = e.detail.data;
            enchantments = e.detail.enchantments;
            const legends = {};
            const enchantmentGroup = document.querySelector(".equipment-group-enchantment");
            const weaponGroup = document.querySelector(".equipment-group-weapon");
            const armourGroup = document.querySelector(".equipment-group-armour");
            const weaponFrag = document.createDocumentFragment();
            const armourFrag = document.createDocumentFragment();
            const encFrag = document.createDocumentFragment();
            let firstRadio = null;

            for (const eq of Object.keys(data)) {
                [radio, label] = getRadio(eq, "equipment", selectEquipment, null);
                const eqData = data[eq];
                switch (eqData.type) {
                    case "Weapon":
                        if (!legends[eqData.class]) {
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
                if (firstRadio === null) firstRadio = radio;
            }
            weaponGroup.appendChild(weaponFrag);
            armourGroup.appendChild(armourFrag);
            //------------------ enchantment
            currentEncMultiplier = {
                "Weapon": 1,
                "Armour": 1
            };
            enchantmentElements = {};
            for (const enc of Object.keys(enchantments)) {
                const currentEncData = enchantments[enc];
                const legend = document.createElement("div");

                for (const rd of Object.keys(currentEncData)) {
                    [radio, label] = getRadio(rd, "enchantment-"+enc, selectEnchantment);
                    radio.value = currentEncData[rd];
                    legend.appendChild(label);
                    if(rd === "None") radio.checked = true;
                }
                encFrag.appendChild(legend);
                enchantmentElements[enc] = legend;
            }
            enchantmentGroup.appendChild(encFrag);
            //--- is ready
            firstRadio.checked = true;
            selectEquipment(firstRadio.value);
            ready = true;
        }
        function loadEnchantment(group) {
            if(currentGroup === group) return;
            for(var elemName of Object.keys(enchantmentElements)){
                if(elemName===group){
                    enchantmentElements[elemName].removeAttribute("hidden");
                }
                else{
                    enchantmentElements[elemName].setAttribute("hidden","");
                }
            }
            currentGroup = group;
        }
        function selectEnchantment(value) {
            currentEncMultiplier[currentData.type] = value;
            sendEvent();
        }
        function selectEquipment(value) {
            currentData = data[value];
            loadEnchantment(currentData.type);
            sendEvent();
        }
        function sendEvent(){
            const onUpdated = new CustomEvent("eqUpdated", { detail: {
                    data: currentData,
                    enchantment: currentEncMultiplier[currentData.type]
                }
            });
            window.dispatchEvent(onUpdated);
        }
        function getRadio(name, group, onchange) {
            const eqLabel = document.createElement("label");
            const radio = document.createElement("input");
            const span = document.createElement("span");
            const id = `eq-${group}-${name}`;
            radio.id = id;
            eqLabel.setAttribute("for", id);
            span.textContent = name;
            radio.type = "radio";
            radio.name = group;
            radio.value = name;
            if(onchange) {
                radio.onchange = () => onchange(radio.value);
            }
            eqLabel.appendChild(radio);
            eqLabel.appendChild(span);
            return [radio, eqLabel];
        }
    }
    return Updater;
})();