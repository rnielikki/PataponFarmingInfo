let tips;
let tipElement;
let commonKeys;
fetch("template/tip-template.json", {
    method:"GET",
    headers:{"Content-Type":"application/json"}
}).then(t => t.json())
.then(t=>{
    tips=t;
    commonKeys = Object.keys(tips.__common);
});

window.addEventListener("load", function(){
    tipElement = document.querySelector(".tip-data");
});
function loadTip(data){
    let tip = retrieveTip();
    if (data.Tip) {
        if(tip) tip+="<br><br>";
        tip += data.Tip;
    }
    tipElement.innerHTML = tip;
    

    function retrieveTip() {
        const type = data.Type;
        if(tips[type]){
            return replaceFrom(tips[type].Default);
        }
        else return "";
    }
    function replaceFrom(raw){
        switch(data.Type) {
            case "Attack":
                raw = raw.replaceAll("%Attack%", "<mark>"+ data["Attack Type"]?.join(", ")+"</mark>");
                raw+=data.Door?tips.Attack.Door:tips.Attack.NoDoor;
                break;
            case "Status Effect":
                raw+=tips["Status Effect"].Status[data.Status ?? "Any"];
                break;
            case "Command":
                raw = raw.replaceAll("%Command%", "<mark>"+ data.Command+"</mark>");
                break;
        }
        for(var key of commonKeys) {
            raw = raw.replaceAll(`%${key}%`, tips.__common[key]);
        }
        return raw;
    }
}