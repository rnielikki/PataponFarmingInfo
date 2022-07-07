(function () {
    let currentData = null;
    const expBase = 100000;
    const percentMultiplier = expBase / 100;
    let speedMin, speedMax;

    let [calcExp, calcSpeed, calcMonkey, calcDoi, calcCancel, resultField] = [null, null, null, null, null, null];

    window.addEventListener("skillLoaded", activateCalculator);
    function activateCalculator(e) {
        currentData = e.detail;
        calcSpeed.value = "0";

        const isCommand = currentData.Type === "Command";
        display(calcCancel, isCommand);
        display(calcDoi, isCommand || currentData.Type === "Attack");
        display(calcSpeed, !isCommand);
        loadTip(currentData);

        Calculate();
    }
    function display(element, show) {
        const elem = element.parentElement.parentElement;
        if(show){
            elem.removeAttribute("hidden");
        }
        else {
            elem.setAttribute("hidden", "");
        }
    }
    window.addEventListener("load", function () {
        const calcField = document.querySelector(".calc");
        calcExp = calcField.querySelector("#calc-exp");
        calcSpeed = calcField.querySelector("#calc-speed");
        calcMonkey = calcField.querySelector("#calc-monkey");
        calcDoi = calcField.querySelector("#calc-doi");
        calcCancel = calcField.querySelector("#calc-cancel");
        resultField = calcField.querySelector("#calc-result");

        speedMin = 0.1;
        speedMax = Math.round(calcSpeed.max);

        calcExp.addEventListener("input", Calculate);
        calcSpeed.addEventListener("input", Calculate);
        calcMonkey.addEventListener("change", Calculate);
        calcDoi.addEventListener("change", Calculate);
        calcCancel.addEventListener("change", Calculate);
    });
    function Calculate() {
        if (currentData == null) {
            resultField.textContent = "No data to calculate.";
            return;
        }
        const exp = Math.round(calcExp.value);
        if (isNaN(exp) || exp < 0 || exp > 99) {
            resultField.textContent = "Current Experience must be 0-99.";
            return;
        }
        const required = currentData.Experience;
        let requiredMin = Math.ceil((expBase - (exp + 1) * percentMultiplier) / required) + 1;
        let requiredMax = Math.ceil((expBase - exp * percentMultiplier) / required);

        if (calcMonkey.checked) {
            requiredMin *= 0.75;
            requiredMax *= 0.75;
        }

        if (currentData.Type === "Command" || currentData.Type === "Attack") {
            if (calcDoi.checked) {
                requiredMin *= 0.5;
                requiredMax *= 0.5;
            }
        }
        resultField.innerHTML = `Around <mark>${Math.round(requiredMin)} - ${Math.round(requiredMax)}</mark> times of execution required.`;

        if (currentData.Type === "Command") {
            const execSecond = calcCancel.checked ? 2.25 : 4;
            const lastOffset = calcCancel.checked ? 0.25 : 2;
            const secondResultMin = requiredMin * execSecond - lastOffset
            const secondResultMax = requiredMax * execSecond - lastOffset
            resultField.innerHTML += ` (estimated grinding time is <mark>${formatTime(secondResultMin)} - ${formatTime(secondResultMax)}</mark>)`;
            return;
        }
        const speed = calcSpeed.value;
        if (!isNaN(speed) && speed >= speedMin && speed <= speedMax) {
            const execSecond = 4 / speed;
            const secondResultMin = requiredMin * execSecond + 8; //fever enter time
            const secondResultMax = requiredMax * execSecond + 8;
            resultField.innerHTML += ` (estimated grinding time is <mark>${formatTime(secondResultMin)} - ${formatTime(secondResultMax)}</mark>)`;
        }
        function formatTime(seconds) {
            let time = "";
            var hours = Math.floor(seconds / 3600);
            if (hours > 0) time += hours.toString().padStart(2, "0") + ":";
            var minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
            var seconds = Math.round(seconds % 60).toString().padStart(2, "0");
            time += minutes + ":" + seconds;
            return time;
        }
    }
})();