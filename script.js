// TaskArray which takes all input data objects 
// It will take the data from localstorage 
taskArray = JSON.parse(localStorage.getItem("taskItems")) || [];
let submitForm = document.getElementById("submitForm");
let openTasksContainer = document.getElementById("open-tasks");
let inProgressTasksContainer = document.getElementById("inprogress-tasks");
let completedTasksContainer = document.getElementById("completed-tasks");
let myForm = document.getElementById("myForm");
const taskName = document.getElementById("task");
const taskDescription = document.getElementById("description");
const taskDueDate = document.getElementById("dueDate");
const statusDropdown = document.getElementById("statusdropdown");
const zeroStateElement = document.getElementById("zero-state-container");
const searchResultEmptyStateElement = document.getElementById("search-result-empty");
const formDialog = document.getElementById("formDialog");

function handleZeroState() {
  const zeroStateElement = document.getElementById('zero-state-container');
  const taskItems = JSON.parse(localStorage.getItem("taskItems"));
   
  if (taskItems == null || taskArray.length == 0 ) {
    document.getElementById('zero-state-container').style.display = "";
  } else {
    document.getElementById('zero-state-container').style.display = "none";
  }
}

handleZeroState();

function addNewTask() {
  document.getElementById("formheader").innerText = "Add new task";
  submitForm.style.display = 'block';
  resetForm();
  formDialog.showModal();
}

function closeForm() {
  submitForm.style.display = 'none';
  formDialog.close();
}

function resetForm() {
  taskName.value = "";
  taskDescription.value = "";
  taskDueDate.value = "";
  statusDropdown.value = "Open";
}

function deleteTodo(index) {
  if (confirm("Are you sure you want to delete this task?")) {
    taskArray.splice(index, 1);
    localStorage.setItem("taskItems", JSON.stringify(taskArray));
    handleZeroState();
    renderTask();
  }
}

let editIndex = -1;

function editTodo(index) {
  document.getElementById('formheader').innerText = "Edit task";
  submitForm.style.display = 'block';
  formDialog.showModal();
  
  taskName.value = taskArray[index].name;
  taskDescription.value = taskArray[index].description;
  taskDueDate.value = taskArray[index].dueDate;
  statusDropdown.value = taskArray[index].status;
  
  editIndex = index;
}

function searchFilterFunction(event) {
  const searchResultEmptyStateElement = document.getElementById('search-result-empty');
  let matchFound = false;
  let searchText = event.target.value.toLowerCase();

  if (!searchText) {
    searchResultEmptyStateElement.style.display = 'none';
  }

  let taskElements = document.querySelectorAll("#open-tasks li, #inprogress-tasks li, #completed-tasks li");
  taskElements.forEach((taskElement) => {
    let textValue = taskElement.querySelector('.task-header').textContent.toLowerCase();
    if (textValue.includes(searchText)) {
      taskElement.style.display = "block";
      matchFound = true;
    } else {
      taskElement.style.display = "none";
    }
  });

  if (!matchFound) {
    searchResultEmptyStateElement.style.display = "block";
  }
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


function renderTask() {
  openTasksContainer.innerHTML = "";
  inProgressTasksContainer.innerHTML = "";
  completedTasksContainer.innerHTML = "";
  
  taskArray.forEach((task, index) => {
    const tasklist = document.createElement("li");
    tasklist.innerHTML = `
      <div class="contentOfList">
        <div class="task-header"><strong>${task.name}</strong></div>
        <p>Description: ${task.description}</p>
        <p>Due Date: ${task.dueDate}</p>
      </div>
     
      <div class="block">
        <button class="btn" style="background-color: #377fcc;" onclick="editTodo(${index})"> <i class="fa fa-edit"></i>&nbsp; Edit </button>
        <button class="btn" style="background-color: grey;" onclick="deleteTodo(${index})"> <i class="fa fa-trash"></i>&nbsp; Delete </button>
      </div>`;
    
    if (task.status === "Open") {
      openTasksContainer.appendChild(tasklist);
    } else if (task.status === "In Progress") {
      inProgressTasksContainer.appendChild(tasklist);
    } else if (task.status === "Completed") {
      completedTasksContainer.appendChild(tasklist);
    }

    tasklist.classList.add("task-list");
  });
  
  
}

submitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskItems = {
    name: taskName.value,
    description: taskDescription.value,
    dueDate: taskDueDate.value,
    status: statusDropdown.value
  };

  console.log(taskItems);
  
  if (editIndex === -1) {
    taskArray.push(taskItems);
  } else {
    taskArray[editIndex] = taskItems;
    editIndex = -1;
  }

  console.log(taskArray)
  
  resetForm();
  localStorage.setItem("taskItems", JSON.stringify(taskArray));
  closeForm();
  renderTask();
  handleZeroState();
});

renderTask();
