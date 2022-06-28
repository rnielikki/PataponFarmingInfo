// You would like to say "Not Destroying ELement is more efficient" or whatever?
// I know. I DON CARE! DON DODON DODON
// Also blame Oohoroc lol
let allClasses = {}; //not loaded yet
let currentSkillData = null;
(async function () {
    const [tate, yari, yumi] = await Promise.all([
        getJsonFetchPromise("data/class-tate.json"),
        getJsonFetchPromise("data/class-yari.json"),
        getJsonFetchPromise("data/class-yumi.json")
    ]);

    const doc = document.querySelector("#list");
    const content = document.querySelector("#content");
    const fromElement = content.querySelector(".inherit-from");
    const toElement = content.querySelector(".inherit-to");
    const titleElement = content.querySelector(".title");
    const dataElement = content.querySelector("#data");
    const skillListElement = dataElement.querySelector(".class-skill-list");
    const skillElement = dataElement.querySelector(".class-skill");

    let isReady = false;

    AddToClassList(tate, "Shield");
    AddToClassList(yari, "Spear");
    AddToClassList(yumi, "Archer");
    allClasses = { ...tate, ...yari, ...yumi };
    let running = false;
    
    
    function AddToClassList(cl, title) {
        let block = createAndAppend(title+" class", "li", doc);
        let list = document.createElement("ul");
        block.appendChild(list);

        for (let val of Object.keys(cl)) {
            createAndAppendList(val, list, ()=>openClassData(val, cl[val]));
        }

    }
    
    function openClassData(title, value) {
        if (running) return;
        running = true;
        try {
            titleElement.textContent = title;
            fromElement.textContent = "";
            toElement.textContent = "";
            if (value.From) {
                for (const cl of value.From) {
                    createAndAppendList(cl, fromElement, ()=>openClassData(cl, allClasses[cl]));
                }
            }
            if (value.To) {
                for (const cl of value.To) {
                    createAndAppendList(cl, toElement, ()=>openClassData(cl, allClasses[cl]));
                }
            }
            skillListElement.textContent="";
            //Don't load to parallel, it saves template to map
            if(Array.isArray(value.Skills)) {
                //No Oohoroc
                skillListElement.classList.remove("skill-list-column");
                loadSkillData(value.Skills[0]);
                for(let i=0;i<value.Skills.length; i++) {
                    const skill = value.Skills[i];
                    createAndAppendList(skill.Name, skillListElement, ()=>loadSkillData(skill));
                }
            }
            else {
                //Oohoroc
                let skills = value.Skills;
                skillListElement.classList.add("skill-list-column");
                let updated = false;
                for(const groupKey of Object.keys(skills))
                {
                    const skillData = skills[groupKey];
                    const li = createAndAppend("", "li", skillListElement);
                    const ul = createAndAppend("", "ul", li);
                    ul.classList.add("skill-list-group");
                    ul.ariaLabel = groupKey;
                    for(let i=0;i<skillData.length; i++) {
                        const skill = skillData[i];
                        if(!updated){
                            loadSkillData(skill);
                            updated = true;
                        }
                        createAndAppendList(skill.Name, ul, ()=>loadSkillData(skill));
                    }
                }
            }
            if(!isReady){
                content.style.display = "block";
                isReady = true;
            }
        }
        finally {
            running = false;
        }
        function loadSkillData(skill){
            updateContent(skillElement, skill);
            activateCalculator(skill);
            currentSkillData = skill;
        }        
    }
    function getJsonFetchPromise(url) {
        return fetch(url, {
            method:"GET",
            headers:{"Content-Type":"application/json"}
        }).then(t => t.json());
    }
})();