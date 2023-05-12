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
    // Add event listener to the form
    form.addEventListener('input', handleFormChange);
    return form;
}

function handleFormChange(e) {
    console.log('handleFormChange called');
    
    const form = e.target.form;
    const day = form.querySelector(".orange").value;
    const startWork = form.querySelector(".start-work").value;
    const startBreak = form.querySelector(".start-break").value;
    const endBreak = form.querySelector(".end-break").value;
    const endWork = form.querySelector(".end-work").value;
    let worked = form.querySelector(".workedHours");

    console.log('day:', day);
    console.log('startWork:', startWork);
    console.log('startBreak:', startBreak);
    console.log('endBreak:', endBreak);
    console.log('endWork:', endWork);

    // Validation
    if (validateSubmission(day, startWork, endWork)) {
        worked.value = calcDailyWorkedHours(startWork, endWork, startBreak, endBreak);
        calculateTotalWorkedHours();
    } else {
        return;
    }
}


function validateSubmission(day,startWork,endWork) {
    if ((day === "")||(startWork==="")||(endWork==="")) {
        alert("Complete work day, start and end work hour");
        return false;
    } else {
        return true;
    }
}

function calcDailyWorkedHours(startWork, endWork, startBreak, endBreak) {
    console.log('calcDailyWorkedHours called');
    
    startWork = startWork.split(":");
    endWork = endWork.split(":");
    startBreak = startBreak.split(":");
    endBreak = endBreak.split(":");
  
    console.log('startWork:', startWork);
    console.log('endWork:', endWork);
    console.log('startBreak:', startBreak);
    console.log('endBreak:', endBreak);
  
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
  
    const result = (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes;
    
    console.log('result:', result);
    
    return result;
}

function calculateTotalWorkedHours() {
    const allWorkedHours = document.querySelectorAll(".workedHours");

    let arrayOfWorkedHours = Array.from(allWorkedHours);
    let newWorkedHour = arrayOfWorkedHours.map((workedHour) => workedHour.value);

    let convertedHours = newWorkedHour.map(el=>{
        const [hours,minutes] = el.split(":");
        return parseInt(hours) * 60 + parseInt(minutes);
    });

    let calculateTotalHoursWorked = convertedHours.reduce((partialSum, a) =>parseInt(partialSum + a),0);
    document.getElementById("totalWorkedHours").value = minutesToHoursAndMinutes(calculateTotalHoursWorked);
}

function minutesToHoursAndMinutes(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return (hours < 10 ? '0' : '') + hours + ':' + (mins < 10 ? '0' : '') + mins;
}

// Iterate over each tableBody section
tableBodySections.forEach((section) => {
    // Create 5 form for each tableBody section
    for (let i = 0; i < 5; i++) {
        const tr = document.createElement('div');
        tr.className = 'tr';
        const form = createForm();
        tr.appendChild(form);
        section.appendChild(tr);
    }
});