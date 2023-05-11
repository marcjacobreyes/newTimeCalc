const tableBodyTrs = document.querySelectorAll(".tableBody .tr")
console.log(tableBodyTrs);

function createForm() {
    let form = document.createElement("form");
    form.innerHTML = `
        <th>
            <input type="text" class="orange" placeholder="Enter Day" />
        </th>
        <td>
            <input type="time" class="blue start-work" />
        </td>
        <td>
            <input type="time" class="green start-break" />
        </td>
        <td>
            <input type="time" class="green end-break" />
        </td>
        <td>
            <input type="time" class="blue end-work" />
        </td>
        <td>
            <input class="workedHours purple" value="00:00" disabled />
        </td>
    `;
    form.onchange = (e) => handleFormChange(e);  // Note this change
    return form;
}

console.log(createForm());

const tableBodies = document.querySelectorAll(".tableBody");
tableBodies.forEach((tableBody) => {
    const trs = tableBody.querySelectorAll(".tr");
    trs.forEach((tr) => {
        const form = createForm();
        tr.appendChild(form);
        form.onsubmit = (e) => handleFormSubmission(e);
    });
});

const forms=document.querySelectorAll("form");
// console.log(forms);

function handleFormChange(e) {
    const form = e.target.form;
    const day = form.querySelector(".orange").value;
    const startWork = form.querySelector(".start-work").value;
    const startBreak = form.querySelector(".start-break").value;
    const endBreak = form.querySelector(".end-break").value;
    const endWork = form.querySelector(".end-work").value;
    let worked = form.querySelector(".workedHours");

    // Validation
    if (validateSubmission(day, startWork, endWork)) {
        worked.value = calcDailyWorkedHours(startWork, endWork, startBreak, endBreak);
        calculateTotalWorkedHours();
    } else {
        return;
    }
}


//todo create validation function

function validateSubmission(day,startWork,endWork) {
    if ((day === "")||(startWork==="")||(endWork==="")) {
        alert("Complete work day, start and end work hour");
        return false;
    } else {
        return true;
    }
}




//todo create function calcDailyHours
function calcDailyWorkedHours(startWork, endWork, startBreak, endBreak) {
    startWork = startWork.split(":");
    endWork = endWork.split(":");
    startBreak = startBreak.split(":");
    endBreak = endBreak.split(":");
  
    // Work Time
    const startWorkDate = new Date(0, 0, 0, startWork[0], startWork[1], 0);
    const endWorkDate = new Date(0, 0, 0, endWork[0], endWork[1], 0);
    const diffWork = endWorkDate.getTime() - startWorkDate.getTime();
  
    // Break Time
    const startBreakDate = new Date(0, 0, 0, startBreak[0], startBreak[1], 0);
    const endBreakDate = new Date(0, 0, 0, endBreak[0], endBreak[1], 0);
    const diffBreak = endBreakDate.getTime() - startBreakDate.getTime();
  
    let diffFinal = (isNaN(diffWork) ? 0 : diffWork) - (isNaN(diffBreak) ? 0 : diffBreak);
  
    let hours = Math.floor(diffFinal / 1000 / 60 / 60);
    diffFinal -= hours * 1000 * 60 * 60;
    const minutes = Math.floor(diffFinal / 1000 / 60);
  
    return (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes;
}//end of calcDailyWorkedHours

function calculateTotalWorkedHours() {
    const allWorkedHours = document.querySelectorAll(".workedHours");
    console.log(allWorkedHours);

    let arrayOfWorkedHours = Array.form(allWorkedHours);
    console.log(arrayOfWorkedHours);
    let newWorkedHour = arrayOfWorkedHours.map((workedHour) => workedHour.value);
    console.log(newWorkedHours);
    let arr = [];
    arr.push(newWorkedHours);
    console.log(arr);

    let convertedHours = newWorkedHours.map(el=>{
        const [hours,minutes] = el.split(":");
        return parseInt(hours) * 60 + parseInt(minutes);
    });
    console.log(convertedHours);

    let calculateTotalHoursWorked = convertedHours.reduce((partialSum, a) =>parseInt(partialSum + a),0);
    document.getElementById("totalWorkedHours").value = minutesToHoursAndMinutes(calculateTotalHoursWorked);
}

function minutesToHoursAndMinutes(minutes)  {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return (hours+"").padStart(2,"0")+":"+(mins+"").padStart(2,"0");
} // this is the end of the minutesToHoursAndMinutes