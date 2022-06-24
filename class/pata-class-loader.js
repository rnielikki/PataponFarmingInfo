// You would like to say "Not Destroying ELement is more efficient" or whatever?
// I know. I DON CARE! DON DODON DODON
// Also blame Oohoroc lol
(async function () {
    const [tate, yari, yumi] = await Promise.all([
        fetch("class-tate.json").then(t => t.json()),
        fetch("class-yari.json").then(y => y.json()),
        fetch("class-yumi.json").then(y => y.json())
    ]);

    const doc = document.querySelector("#list");
    const content = document.querySelector("#content");
    const fromElement = content.querySelector(".inherit-from");
    const toElement = content.querySelector(".inherit-to");
    const titleElement = content.querySelector(".title");
    const dataElement = content.querySelector("#data");
    const skillListElement = dataElement.querySelector(".class-skill-list");
    const skillElement = dataElement.querySelector(".class-skill");

    for (let val of Object.keys(tate)) {
        createAndAppendList(val, doc, ()=>openClassData(val, tate[val]));
    }
    for (let val of Object.keys(yari)) {
        createAndAppendList(val, doc, ()=>openClassData(val, yari[val]));
    }
    for (let val of Object.keys(yumi)) {
        createAndAppendList(val, doc, ()=>openClassData(val, yumi[val]));
    }
    const allClasses = { ...tate, ...yari, ...yumi };
    let running = false;
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
            //WON'T APPLY TO OOHOROC
            //Don't load to parallel, it saves template to map
            loadSkillData(value.Skills[0]);
            skillListElement.textContent="";
            for(let i=0;i<value.Skills.length; i++) {
                const skill = value.Skills[i];
                createAndAppendList(skill.Name, skillListElement, ()=>loadSkillData(skill));
            }
        }
        finally {
            running = false;
        }
        function loadSkillData(skill){
            updateContent(skillElement, skill);
            activateCalculator(skill);
        }
    }
})();