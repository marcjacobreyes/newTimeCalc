const tableBodyTrs = document.querySelectorAll(".tableBody .tr")
console.log(tableBodyTrs);

function createForm() {
    let form = document.createElement("form");
    form.innerHTML = `                   
<th>
    <input type="text" class="orange" placeholder="Enter Day" />
</th>
<td>
    <input type="time" class="blue" id="start-work" />
</td>
<td>
    <input type="time" class="green" id="start-break" />
</td>
<td>
    <input type="time" class="green" id="end-break" />
</td>
<td>
    <input type="time" class="blue" id="end-work" />
</td>
<td>
    <input class="workedHours purple" value="00:00" disabled />
</td>
<td><button class="btn" type="submit">ADD</button></td>
`;
    form.onsubmit = (e) => handleFormSubmission(e);
    return form;
}
console.log(createForm());

(async () => {
    // …
    tableBodyTrs.forEach((tr) => {
      tr.appendChild(createForm());
    });
})();

const forms=document.querySelectorAll("form");

forms.forEach((form) => 
    form.addEventListener("submit", function (e) {
        e.preventDefault();

    const day = e.target.querySelector(".orange").value;
    const startWork = e.target.querySelector("#start-work").value;
    const startBreak = e.target.querySelector("#start-break").value;
    const endBreak = e.target.querySelector("#end-break").value;
    const endWork = e.target.querySelector("#end-work").value;
    let worked = e.target.querySelector(".workedHours");
    let submitBtn = e.target.querySelector(".btn");

    // Validation
    //validateSubmission(day,startWork,endWork,submitBtn);

    //Calc the daily hours worked
    worked.value = calcDailyWorkedHours(startWork,endWork,startBreak,endBreak);
    })

);


//todo create validation function

function validateSubmission(day,startWork,endWork,submitBtn) {
    if ((day === "")||(startWork==="")||(endWork==="")) {
        alert("Complete work day, start and end work hour");
    } // end if branch
    else{
        submitBtn.classList.add("btn-green");
        submitBtn.innerHTML="&#10004";
        return true;
    } // end else branch
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
    return (hours+"").padStart(2,"0") + ":" + (mins+"").padStart(2,"0");
}



