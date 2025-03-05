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


function addNewTask(){
  submitForm.style.display = 'block';
}
function closeForm(){
  submitForm.style.display = 'none';
}
// Clears input fields 
function resetForm() {
  taskName.value = "";
  taskDescription.value = "";
  taskDueDate.value = "";
}

// Delete the task
function deleteTodo(index) {
  taskArray.splice(index, 1);
  // chanage the localstorage data after deleting the task
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

function searchFilterFunction(event){
  console.log('event: ', event);
  let searchText = event.target.value.toLowerCase();
  let taskElementList = document.querySelector("ul");
  // li will have all the li elements inside the ul
  taskElements = taskElementList.getElementsByTagName("li");
  console.log("li elements:",taskElements)
  for ( let i = 0; i < taskArray.length; i++){
    textValue = taskArray[i].name;
    if (textValue.toLowerCase().indexOf(searchText) > -1) {
      taskElements[i].style.display = "";
    } else {
      taskElements[i].style.display = "none";
      // taskElements[i].setAttribute("style", "display: none;");
    }
  }

}

// Change the colour of the task if clicked on the compelted toggle box

function changeColor(index) {
  let taskElements = document.querySelectorAll("#demo li");
  if (taskElements[index].style.backgroundColor === "white") {
    taskElements[index].style.backgroundColor = "lightgreen";
  } else {
    taskElements[index].style.backgroundColor = "white";
  }
}

const date = new Date();

let selectedDate = new Date();
let year = selectedDate.getFullYear();
let month = String(selectedDate.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits
let day = String(selectedDate.getDate()).padStart(2, "0"); // Ensure 2 digits

let formattedDate = `${year}-${month}-${day}`;

function getDate() {
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
    // loop throgh taskArray creating to each task
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
                    <button class="btn"  onclick="editTodo(${index})"> <i class="fa fa-edit"></i> Edit </button>
                    <button class="btn" onclick="deleteTodo(${index})"> <i class="fa fa-trash"></i> Delete </button>
                    <i class="fa fa-check-circle" style="font-size:30px;color:red" onclick="changeColor(${index})"></i>
                    </div>`;

    demo.appendChild(tasklist);

    tasklist.id = "taskList";
  });
  getDate();
}

submitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskName = document.getElementById("task").value;
  const taskDescription = document.getElementById("description").value;
  const taskDueDate = document.getElementById("dueDate").value;
  e.preventDefault();
  const taskItems = {
    name: taskName,
    description: taskDescription,
    dueDate: taskDueDate,
  };

  if(editIndex == -1){
    taskArray.push(taskItems);
  }
  else{
    taskArray[editIndex] = taskItems;
    editIndex = -1;
  }
  resetForm();

  const json = JSON.stringify(taskArray);

  localStorage.setItem("taskItems", JSON.stringify(taskArray));

  renderTask();
});
renderTask();
