// TaskArray which takes all input data objects 
// It will take the data from localstorage 
taskArray = JSON.parse(localStorage.getItem("taskItems")) || [];
let submitForm = document.getElementById("submitForm");
let demo = document.querySelector("ul");
let myForm = document.getElementById("myForm");
const taskName = document.getElementById("task");
const taskDescription = document.getElementById("description");
const taskDueDate = document.getElementById("dueDate");
let popup = document.getElementById('popup');
const zeroStateElement = document.getElementById('zero-state-container');
const searchResultEmptyStateElement = document.getElementById('search-result-empty');
const formDialog = document.getElementById("formDialog");

function addNewTask() {
  submitForm.style.display = 'block';
  formDialog.showModal();
}

function closeForm() {
  submitForm.style.display = 'none';
  formDialog.close();
}

// Clears input fields 
function resetForm() {
  taskName.value = " ";
  taskDescription.value = " ";
  taskDueDate.value = " ";
}

// Disabling the past dates by setting an attribute as minimum date as today
function disablePastDates() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); 
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  document.getElementById("dueDate").setAttribute("min", today);
}

// Delete the task
function deleteTodo(index) {

  let confirmDelete = confirm("Are you sure you want to delete this task?");

  if (confirmDelete) {
    taskArray.splice(index, 1);
    // change the localstorage data after deleting the task
  }
    localStorage.setItem("taskItems", JSON.stringify(taskArray)); 
    // render the task in the ui

  renderTask();
}
  
//initialise the index to -1
let editIndex = -1;

// Edit the existing task
function editTodo(index) {

  taskName.value = taskArray[index].name;
  taskDescription.value = taskArray[index].description;
  taskDueDate.value = taskArray[index].dueDate;

  editIndex = index;

  submitForm.style.display = 'block';

  localStorage.setItem("taskItems", JSON.stringify(taskArray)); // Update localStorage
  renderTask();
}

function searchFilterFunction(event) {
  const searchResultEmptyStateElement = document.getElementById('search-result-empty');
  var matchFound = false;
  let searchText = event.target.value.toLowerCase();

  if (!searchText) {
    searchResultEmptyStateElement.style.display = 'none';
  }

  let taskElementList = document.querySelector("ul");
  // li will have all the li elements inside the ul
  taskElements = taskElementList.getElementsByTagName("li");

  for (let i = 0; i < taskArray.length; i++) {
    textValue = taskArray[i].name;
    if (textValue.toLowerCase().indexOf(searchText) > -1) {
      taskElements[i].style.display = "block";
      matchFound = true;
    } else {
      taskElements[i].style.display = "none";
    }
  }

  if (!matchFound) {
    searchResultEmptyStateElement.style.display = "block";
  }
}

const date = new Date();

let selectedDate = new Date();
let year = selectedDate.getFullYear();
let month = String(selectedDate.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits
let day = String(selectedDate.getDate()).padStart(2, "0"); // Ensure 2 digits

let formattedDate = `${year}-${month}-${day}`;

function highlightOverdueDate() {
  // ["2025-04-21",] arrayOfDueDates
  const arrayOfDueDates = taskArray.map((item) => {
    return item.dueDate;
  });
  arrayOfDueDates.forEach((duedate, index) => {
    // here duedate is a string stored in an array convert to object to compare that with date object

    let dueDateObject = new Date(duedate);
    
    if (date > dueDateObject) {
      // apply style to particular li element of ul
      let taskElements = document.querySelectorAll("#demo li");

      if (taskElements[index]) {
        taskElements[index].style.backgroundColor = "lightyellow";
      }
    }
  });
}

function renderTask() {

    // clear demo ul element
  demo.innerHTML = " ";
    // loop through taskArray creating to each task
  taskArray.forEach((task, index) => {
    const tasklist = document.createElement("li");

    tasklist.innerHTML = `
                    <div id="contentOfList">
                      <strong>${task.name}</strong> <br></br>
                    Description: ${task.description} 
                    <br></br>
                    Due Date: ${task.dueDate}
                    </div>
                    <hr width="100%" size="2">

                    <div class = "block">
                    <button class="btn" style="background-color: #04AA6D;" onclick="editTodo(${index})"> <i class="fa fa-edit"></i> Edit </button>
                    <button class="btn" style="background-color: red;" onclick="deleteTodo(${index})"> <i class="fa fa-trash"></i> Delete </button>
                    <i class="fa fa-check-circle" style="font-size:30px;color:#04AA6D;" onclick="changeColor(${index})"></i>
                    </div>`;

    demo.appendChild(tasklist);

    tasklist.classList.add("task-items");

  });
  highlightOverdueDate();
}

submitForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskName = document.getElementById("task").value;
  const taskDescription = document.getElementById("description").value;
  const taskDueDate = document.getElementById("dueDate").value;
  
  const taskItems = {
    name: taskName,
    description: taskDescription,
    dueDate: taskDueDate,
  };

  if (editIndex == -1) {
    taskArray.push(taskItems);
  }
  else{
    taskArray[editIndex] = taskItems;
    editIndex = -1;
  }
  resetForm();

  const json = JSON.stringify(taskArray);

  localStorage.setItem("taskItems", JSON.stringify(taskArray));

  closeForm();
  
  renderTask();
});
renderTask();

function handleSearchZeroState() {
  const inputText = document.getElementById('inputtext').value;
  const searchResultEmptyStateElement = document.getElementById('search-result-empty');
  // if there are any elements satisfying search - show filtered list
  let isSearchHasResults = taskArray.some((task) => {
    return task.name.indexOf(inputtext) > -1;
  });

  if (!!isSearchHasResults && localStorage.getItem("taskItems") !== null) {
    document.getElementById('zero-state-container').style.display = "none";
  } else {
    document.getElementById('zero-state-container').style.display = " ";
  }
}

