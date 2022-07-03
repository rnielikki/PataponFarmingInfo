// You would like to say "Not Destroying ELement is more efficient" or whatever?
// I know. I DON CARE! DON DODON DODON
// Also blame Oohoroc lol
(async function () {
    const [tate, yari, yumi] = await Promise.all([
        getJsonFetchPromise("data/class-tate.json"),
        getJsonFetchPromise("data/class-yari.json"),
        getJsonFetchPromise("data/class-yumi.json"),
        new Promise((res)=>window.addEventListener("load", res)) //window load
    ]);

    let allClasses = {}; //not loaded yet

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

    const onDataLoaded = new CustomEvent("dataLoaded", { detail:allClasses });
    window.dispatchEvent(onDataLoaded);
    InitHash();
    window.addEventListener("hashchange", InitHash);

    function AddToClassList(cl, title) {
        let block = createAndAppend(title+" class", "li", doc);
        let list = document.createElement("ul");
        block.appendChild(list);

        for (let val of Object.keys(cl)) {
            createAndAppendAList(val, list, "#"+val);
        }
    }
    function InitHash(){
        const retrieved = hashCutter.retrieve(window.location.hash);
        if(retrieved.class){
            openClassData(retrieved.class, allClasses[retrieved.class], retrieved.skill == undefined); //not falsy
            if(retrieved.skill) {
                loadSkillData(retrieved.skill);
            }
        }
    }    
    function openClassData(title, value, loadSkills = false) {
        if (running) return;
        running = true;
        try {
            titleElement.textContent = title;
            fromElement.textContent = "";
            toElement.textContent = "";
            if (value.From) {
                for (const cl of value.From) {
                    createAndAppendAList(cl, fromElement, "#"+cl);
                }
            }
            if (value.To) {
                for (const cl of value.To) {
                    createAndAppendAList(cl, toElement, "#"+cl);
                }
            }
            skillListElement.textContent="";
            //Don't load to parallel, it saves template to map
            if(Array.isArray(value.Skills)) {
                //No Oohoroc
                skillListElement.classList.remove("skill-list-column");
                if(loadSkills) loadSkillData(value.Skills[0]);
                for(let i=0;i<value.Skills.length; i++) {
                    const skill = value.Skills[i];
                    createAndAppendAList(skill.Name, skillListElement,`#${title}/${skill.Name}`);
                }
            }
            else {
                //Oohoroc
                let skills = value.Skills;
                skillListElement.classList.add("skill-list-column");
                let updated = !loadSkills;
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
                        createAndAppendAList(skill.Name, ul,`#${title}/${skill.Name}`);
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
    }
    function loadSkillData(skill){
        updateContent(skillElement, skill);
        const onSkillLoaded = new CustomEvent("skillLoaded", { detail:skill });
        window.dispatchEvent(onSkillLoaded);
    }        
    function getJsonFetchPromise(url) {
        return fetch(url, {
            method:"GET",
            headers:{"Content-Type":"application/json"}
        }).then(t => t.json());
    }
})();