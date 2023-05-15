/*
Designed by Marc Jacob Reyes
05/15/2023
-- This application will track the hours and pay of the user in a html and javascript web page, it will give you the total hours worked in the biweekly
work period. Then the user will enter the hourly wage, any bonuses, and mileage driven and calculate the total pay for the period.
.51c per mile

*/ 
const tableBodyTrs = document.querySelectorAll(".tr")
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

    // Get all input elements inside the form
    const inputs = form.querySelectorAll('input');

    // Add event listener to each input element
    inputs.forEach(input => {
        input.addEventListener('change', handleFormChange);
    });

    return form;
} // end of createForm function

function handleFormChange(e) {
    console.log('handleFormChange called');
    
    const form = e.target.form;
    const startWork = form.querySelector(".start-work").value;
    const startBreak = form.querySelector(".start-break").value;
    const endBreak = form.querySelector(".end-break").value;
    const endWork = form.querySelector(".end-work").value;
    let worked = form.querySelector(".workedHours");

    console.log('startWork:', startWork);
    console.log('startBreak:', startBreak);
    console.log('endBreak:', endBreak);
    console.log('endWork:', endWork);

    // If all fields are empty, reset workedHours
    if (startWork === "" && startBreak === "" && endBreak === "" && endWork === "") {
        worked.value = "00:00";
    } else if (validateSubmission(startWork, endWork)) { // existing validation for startWork and endWork
        worked.value = calcDailyWorkedHours(startWork, endWork, startBreak, endBreak);
        calculateTotalWorkedHours();
    }
} // end of handleFormChange function

function validateSubmission(startWork, endWork) {
    if (startWork === "" || endWork === "") {
        if (document.activeElement.tagName !== 'INPUT') {
            alert("Please complete start and end work hour");
        }
        return false;
    } else {
        return true;
    }
} // end of validateSubmission function

function calcDailyWorkedHours(startWork, endWork, startBreak, endBreak) {
    console.log('calcDailyWorkedHours called');
    
    startWork = startWork.split(":");
    endWork = endWork.split(":");
  
    console.log('startWork:', startWork);
    console.log('endWork:', endWork);
  
    // Work Time
    let startWorkDate = new Date(0, 0, 0, startWork[0], startWork[1], 0);
    let endWorkDate = new Date(0, 0, 0, endWork[0], endWork[1], 0);

    // If end time is earlier than start time, assume it's the next day
    if (endWorkDate < startWorkDate) {
        endWorkDate.setDate(endWorkDate.getDate() + 1);
    }

    let diffWork = endWorkDate.getTime() - startWorkDate.getTime();
  
    let diffFinal = isNaN(diffWork) ? 0 : diffWork;
  
    if (startBreak && endBreak) {
        startBreak = startBreak.split(":");
        endBreak = endBreak.split(":");
        console.log('startBreak:', startBreak);
        console.log('endBreak:', endBreak);
        
        // Break Time
        let startBreakDate = new Date(0, 0, 0, startBreak[0], startBreak[1], 0);
        let endBreakDate = new Date(0, 0, 0, endBreak[0], endBreak[1], 0);

        // If end break time is earlier than start break time, assume it's the next day
        if (endBreakDate < startBreakDate) {
            endBreakDate.setDate(endBreakDate.getDate() + 1);
        }

        let diffBreak = endBreakDate.getTime() - startBreakDate.getTime();
  
        diffFinal -= isNaN(diffBreak) ? 0 : diffBreak;
    }

    let hours = Math.floor(diffFinal / 1000 / 60 / 60);
    diffFinal -= hours * 1000 * 60 * 60;
    const minutes = Math.floor(diffFinal / 1000 / 60);
  
    const result = (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes;
    
    console.log('result:', result);
    
    return result;
} // end of calculateDailyWorkedHours


function calculateTotalWorkedHours() {
    const allWorkedHours = document.querySelectorAll(".workedHours");

    let arrayOfWorkedHours = Array.from(allWorkedHours);
    let newWorkedHour = arrayOfWorkedHours.map((workedHour) => workedHour.value);

    let convertedHours = newWorkedHour.map(el => {
        const [hours,minutes] = el.split(":");
        return parseInt(hours) * 60 + parseInt(minutes);
    });

    let calculateTotalHoursWorked = convertedHours.reduce((partialSum, a) => parseInt(partialSum + a), 0);

    // convert the total minutes to decimal hours
    let totalDecimalHours = hoursAndMinutesToDecimal(minutesToHoursAndMinutes(calculateTotalHoursWorked));

    document.getElementById("totalWorkedHours").value = totalDecimalHours.toFixed(2); // toFixed(2) will round it to 2 decimal places
} // end of calculateTotalWorkedHours

function minutesToHoursAndMinutes(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return (hours < 10 ? '0' : '') + hours + ':' + (mins < 10 ? '0' : '') + mins;
} // end of minutesToHoursAndMinutes

// Iterate over each tr
tableBodyTrs.forEach((tr) => {
    // Create form for the tr
    const form = createForm();
    
    // Append the form to the tr
    tr.appendChild(form);
});

function calculateTotalPay() {
    const hourlyRateInput = document.getElementById('hourlyRate');
    const bonusInput = document.getElementById('bonus');
    const mileageInput = document.getElementById('mileage');
    const totalWorkedHoursInput = document.getElementById('totalWorkedHours');
    const totalPayInput = document.getElementById('totalPay');  // assume this is the id of your total pay input field

    const hourlyRate = parseFloat(hourlyRateInput.value) || 0;
    const bonus = parseFloat(bonusInput.value) || 0;
    const mileage = parseFloat(mileageInput.value) || 0;
    const totalWorkedHours = parseFloat(totalWorkedHoursInput.value) || 0;

    const costPerMile = 0.51; // adjust this to your needs

    const totalPay = (hourlyRate * totalWorkedHours) + bonus + (mileage * costPerMile);

    totalPayInput.value = totalPay.toFixed(2);  // round to 2 decimal places
} // end of calculateTotalPay function

function hoursAndMinutesToDecimal(time) {
    const [hours, minutes] = time.split(':').map(parseFloat);
    return hours + (minutes / 60.00);
} // end of hoursAndMinutesToDecimal function

const hourlyRateInput = document.getElementById('hourlyRate');
const bonusInput = document.getElementById('bonus');
const mileageInput = document.getElementById('mileage'); 
// lets the user input hourly wage, any bonuses, and mileage driven. 

hourlyRateInput.addEventListener('change', calculateTotalPay);
bonusInput.addEventListener('change', calculateTotalPay);
mileageInput.addEventListener('change', calculateTotalPay);
// allows for change event listeners on each of these inputs hourly wage, bonus, mileage and calculates the Total Pay for the biweekly period.