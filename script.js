/*
Designed by Marc Jacob Reyes
05/15/2023
-- This application will track the hours and pay of the user in a html and javascript web page, it will give you the total hours worked in the biweekly
work period. Then the user will enter the hourly wage, any bonuses, and mileage driven and calculate the total pay for the period.
.51c per mile

*/ 
const tableBodyTrs = document.querySelectorAll(".tr")
console.log(tableBodyTrs);

/* 
1. We create a function called createForm
2. We create a form element using document.createElement
3. We add HTML content inside the form variable
4. We get all input elements inside the form using querySelectorAll
5. We add event listener to each input element using forEach
6. We return the form element */
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


/* 
1. We are using event delegation to listen for change events on the form. 
This means that we are listening for changes on the form, but we are not actually 
listening for changes on the form. Instead, we are listening for changes on the parent element 
(the form), and we are waiting for the event to bubble up to the form. This is a very common technique in JavaScript, 
and it is often used when you have a lot of elements that you need to listen to, and you don’t want to write a lot of event
 listeners on each of those elements. */
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

/* 
1. Start and end work hour should not be empty. If one of them is empty, then a pop-up alert will be displayed. The alert will not be displayed if the user is inputting the hour. This is achieved by checking if the active element is input or not.
2. If the user has completed start and end work hour, then the function will return true.
3. If the user has not completed start and end work hour, then the function will return false. */
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

/* 
1. First, we split the startWork and endWork into an array of hours and minutes.
2. Then we create a new Date object with the hours and minutes from the array.
3. We do the same for the break time.
4. We subtract the break time from the work time.
5. We calculate the hours and minutes of the remaining time.
6. We return the result. */
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

/* 
1. First, we grab all the elements with class name "workedHours" and save them in a variable called allWorkedHours.
2. Then, we convert the allWorkedHours variable from a NodeList into an array of elements.
3. We use the map method to iterate over each element of the array and extract the value of each element and save it in a new array called newWorkedHour.
4. Now that we have an array of strings, each string containing the hours and minutes worked in the format "HH:MM", we can convert the strings into hours and minutes by using the map method again.
5. The map method will iterate over each element of the array, split the string "HH:MM" into an array with two elements, one for hours and one for minutes, and then return a new array with the hours and minutes converted into numbers.
6. We now have an array with the hours and minutes worked in numbers, so we can convert the minutes into hours by using the reduce method.
7. The reduce method will iterate over each element of the array and add the numbers together.
8. Now we have the total minutes worked, so we can convert the minutes to decimal hours by using the minutesToHoursAndMinutes function.
9. The minutesToHoursAndMinutes function will convert the minutes to hours and minutes and return a string in the format "HH:MM".
10. Finally, we can convert the string "HH:MM" to decimal hours by using the hoursAndMinutesToDecimal function.
11. The hoursAndMinutesToDecimal function will convert the string "HH:MM" into a decimal number and return a string in the format "HH.HH".
12. We can now use the toFixed method to round the decimal number to 2 decimal places and return a string in the format "HH.HH".
13. Finally, we can assign the result of the hoursAndMinutesToDecimal function to the value attribute of the totalWorkedHours input element. */
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

/* 
1. First we need to get the hours and minutes from the total minutes.
2. We will use the Math.floor() function to get the hours from the total minutes.
3. We will use the % operator to get the remainder of the minutes after dividing by 60.
4. We will use the ternary operator to check if the hours and minutes are below 10 then we will add
a 0 in front of it.
5. Finally we will return the result as a string. */
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

/* 1. We get all the input elements by their id
    2. We get their values, and conver them to numbers
    3. We calculate the total pay
    4. We round the total pay to 2 decimal places. */
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



/* 1. The function named hoursAndMinutesToDecimal has one parameter named time. It is a string of the time in 24-hour format. 
2. The function returns the hours and minutes converted into a decimal number. 
3. The function begins by splitting the time string into an array of two strings using the split() method. The split() method takes a delimiter as an argument and returns an array of strings. 
4. The delimiter is a colon character. The colon character is a special character in JavaScript. It is used in object literals, ternary operators, and ES6 destructuring. 
*/ 
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