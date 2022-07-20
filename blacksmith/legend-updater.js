const updater = (function () {
    const dataUpdater = new Updater();
    window.addEventListener("dataLoaded", dataUpdater.init);
    function Updater() {
        let ready = false;
        let data;
        let enchantments;
        let enchantmentElements;
        let currentGroup;

        return {
            init:init
        };
        function init(e) {
            if (this.ready) return;
            this.data = e.detail.data;
            this.enchantments = e.detail.enchantments;
            const legends = {};
            const enchantmentGroup = document.querySelector(".equipment-group-enchantment");
            const weaponGroup = document.querySelector(".equipment-group-weapon");
            const armourGroup = document.querySelector(".equipment-group-armour");
            const weaponFrag = document.createDocumentFragment();
            const armourFrag = document.createDocumentFragment();
            const encFrag = document.createDocumentFragment();
            let firstRadio = null;

            for (const eq of Object.keys(this.data)) {
                [radio, label] = getRadio(eq, "equipment", selectEquipment, null);
                const eqData = this.data[eq];
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
            this.enchantmentElements = {};
            for (const enc of Object.keys(this.enchantments)) {
                const currentEncData = this.enchantments[enc];
                const legend = document.createElement("div");

                for(const rd of Object.keys(currentEncData)) {
                    [radio, label] = getRadio(rd, "enchantment-"+enc);
                    radio.value = currentEncData[rd];
                    legend.appendChild(label);
                    if(rd === "None") radio.checked = true;
                }
                encFrag.appendChild(legend);
                this.enchantmentElements[enc] = legend;
            }
            enchantmentGroup.appendChild(encFrag);
            //--- is ready
            firstRadio.checked = true;
            selectEquipment(firstRadio.value);
            this.ready = true;
        }
        function loadEnchantment(group) {
            if(this.currentGroup === group) return;
            for(var elemName of Object.keys(this.enchantmentElements)){
                if(elemName===group){
                    this.enchantmentElements[elemName].removeAttribute("hidden");
                }
                else{
                    this.enchantmentElements[elemName].setAttribute("hidden","");
                }
            }
            this.currentGroup = group;
        }
        function selectEquipment(value) {
            const onUpdated = new CustomEvent("eqUpdated", { detail: this.data[value] });
            loadEnchantment(this.data[value].type);
            window.dispatchEvent(onUpdated);
        }
        function getRadio(name, group, onchange) {
            const eqLabel = document.createElement("label");
            const radio = document.createElement("input");
            const id = `eq-${name}`;
            radio.id = id;
            eqLabel.setAttribute("for", id);
            eqLabel.textContent = name;
            radio.type = "radio";
            radio.name = group;
            radio.value = name;
            if(onchange) {
                radio.onchange = () => onchange(radio.value);
            }
            eqLabel.prepend(radio)
            return [radio, eqLabel];
        }
    }
    return Updater;
})();