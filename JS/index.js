var timeinterval;
var isReminder = false; //To track if reminder is to be displayed or not
var Task_Status = {
  To_Do: 0,
  In_Progress: 1,
  Finished: 2
};

$(window).load(function () {
  // If you click this class, hover_bkgr_fricc appears 
  $(".trigger_popup_fricc").click(function () {
    var target = $(this).data('target');
    $('#' + target).show();
  });
  // If the X is clicked, the pop-up box dissapears
  $('.popupCloseButton').click(function () {
    $(this).closest('.hover_bkgr_fricc').hide();
    var outputEl = document.getElementById("edit-tasks");
    var newForm = document.getElementById("new-form");
    outputEl.removeChild(newForm);
  });
});

//Function to store members in localStorage
document.getElementById("new-member-btn").onclick = function () {
  var member = document.getElementById("member-input").value;
  var stilling = document.getElementById("stilling-input").value;
  var memberId = parseInt(localStorage.getItem('memberId') || 1); //Get memberId from localstorage or 1 by default
  var newMember = { member, stilling, memberId };

  // Only store if there is a value
  if (member) {
    var members = JSON.parse(window.localStorage.getItem("members")) || [];
    members.push(newMember);
    window.localStorage.setItem("members", JSON.stringify(members));
    localStorage.setItem('memberId', ++memberId); //Increment taskid
    renderMembers();
    location.reload();
  }
};

//Function to set new categories. A pop up will appear asking user for new category names
// All data will be pushed to localStorage and new category names will be loaded. 
document.getElementById("set-categories-btn").onclick = function () {
  var category1 = document.getElementById("category-1-input").value;
  var category2 = document.getElementById("category-2-input").value;
  var category3 = document.getElementById("category-3-input").value;
  var pElement = document.getElementById("error1");
  var newCategories = { category1, category2, category3 };

  //If all categories are set
  if (category1 && category2 && category3) {
    var categoriesStorage = JSON.parse(window.localStorage.getItem("categories")) || [];
    categoriesStorage.push(newCategories);
    window.localStorage.setItem("categories", JSON.stringify(categoriesStorage));
    location.reload();
    renderNewCategories();
  }

  //If not all categories are set, print this message
  else {
    pElement.innerHTML = "You have to define all categories!";
  }
};

//Delete all data from localStorage if user answer is ok
document.getElementById("reset").onclick = function () {
  var answer = window.confirm("Are you sure? All your data will be deleted!");
  if (answer) {
    localStorage.clear();
    location.reload();
  }
};

//Enter click functions
$('#category-1-input').keypress(function (ev) {
  //If user pressed Enter Key then trigger Submit click
  if (ev.keyCode == 13)
    $('#set-categories-btn').click();
});
$('#category-2-input').keypress(function (ev) {
  //If user pressed Enter Key then trigger Submit click
  if (ev.keyCode == 13)
    $('#set-categories-btn').click();
});
$('#category-3-input').keypress(function (ev) {
  //If user pressed Enter Key then trigger Submit click
  if (ev.keyCode == 13)
    $('#set-categories-btn').click();
});
$(document).ready(function () {
  $('#member-input').keypress(function (ev) {
    //If user pressed Enter Key then trigger Submit click
    if (ev.keyCode == 13)
      $('#new-member-btn').click();
  });
  $('#stilling-input').keypress(function (ev) {
    //If user pressed Enter Key then trigger Submit click
    if (ev.keyCode == 13)
      $('#new-member-btn').click();
  });


  $('#set-deadline-form').on('submit', function (e) {
    e.preventDefault();
    var date = new Date($('#deadlinedate').val());
    if (isNaN(date.getDate())) {
      $('#deadlinedate ~ .error').show();
    }
    else {
      $('#deadlinedate ~ .error').hide();
      localStorage.setItem('deadLine', $('#deadlinedate').val());
      resetDeadline();
      $(this).closest('.hover_bkgr_fricc').hide();
    }
  });


  resetDeadline(); //Call reset once page is ready to initalize
  drawPieChart(); //Draw pie chart once ready
  dragDropItems(); //Attach event handlers for main containers
});

// Task code: 
function createNewElement() {
  var x2 = document.getElementById("x2");
  var x = document.getElementById("inputField");
  //Visible inputfield
  x2.style.display = "none";
  x.style.display = "block";

  // A new element is created; form 
  var txtNewInputBox = document.createElement('FORM');
  txtNewInputBox.setAttribute("onsubmit", "createNewTask(event)");
  txtNewInputBox.setAttribute("id", "x");

  // Content is added to the form
  txtNewInputBox.innerHTML = "<input type='text' id='newInputBox' class='field' placeholder='What is your new task?'><input type='submit' id='submit-btn' value='Add'>";
  // The form is made a child of the inputFeild
  document.getElementById("inputField").appendChild(txtNewInputBox);
}

// Code in case enter is pressed 
$(document).ready(function () {
  $('#newInputBox').keypress(function (ev) {
    //If user pressed Enter Key then trigger Submit click
    if (ev.keyCode == 13)
      $('#submit-btn').click();
  });
});

// Function to create a new task 
function createNewTask(event) {
  event.preventDefault();
  var x = document.getElementById("inputField");
  var task = document.getElementById("newInputBox").value;
  var members = [];
  var taskId = parseInt(localStorage.getItem('taskId') || 1); //Get taskId from localstorage or 1 by default
  var status = Task_Status.To_Do;

  // Only store task if value is set
  if (task) {
    var outputTask = JSON.parse(localStorage.getItem("outputTask")) || [];
    var product = { taskId, members, task, deadline, status };
    outputTask.push(product);
    window.localStorage.setItem("outputTask", JSON.stringify(outputTask));
    localStorage.setItem('taskId', ++taskId); //Increment taskid
    renderTasks();
    //reset form
    event.target.reset();
    location.reload();
  }
}

//Function to delete tasks. 
//Finds index in localStorage for marked task and removes it from array.
function deleteTask(taskId) {
  var currentValue = JSON.parse(localStorage.getItem("outputTask"));
  var indexToRemove = currentValue.findIndex((x) => x.taskId == taskId);
  currentValue.splice(indexToRemove, 1);
  localStorage.setItem("outputTask", JSON.stringify(currentValue));
  location.reload();
}

//Function to edit tasks
function editTask(taskId) {
  //Get item from localStorage
  var currentTask = JSON.parse(localStorage.getItem("outputTask"));
  var outputEl = document.getElementById("edit-tasks");
  //Finds correct index to edit
  var indexToEdit = currentTask.findIndex((x) => x.taskId == taskId);
  var attribute = "updateTask(" + taskId + ")";
  var newForm = document.createElement("FORM");
  //Onsubmit, load updateTask(taskId) function
  newForm.setAttribute('onsubmit', attribute);
  newForm.setAttribute('id', 'new-form');
  newForm.innerHTML = "<input type='text' name='task' id='task-input' value='" + currentTask[indexToEdit].task + "'><br>" +
    "<input type='submit' id='update-task-btn' value='Save task'>";
  outputEl.appendChild(newForm);

}
//Function to update localStorage
function updateTask(taskId) {
  var currentTask = JSON.parse(localStorage.getItem("outputTask"));
  //Gets new value from userinput
  var newTask = document.getElementById("task-input").value;
  var indexToEdit = currentTask.findIndex((x) => x.taskId == taskId);
  //Changes value for task and sends it back to localStorage as string
  currentTask[indexToEdit].task = newTask;
  localStorage.setItem("outputTask", JSON.stringify(currentTask));
  //Removes form to prevent double forms
  outputEl.removeChild(newForm);
}

var deadline = 'May 27 2020 24:00:00';

function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

function initializeClock(id, endtime) {
  var clock = document.getElementById(id);
  var daysSpan = clock.querySelector('.days');
  var hoursSpan = clock.querySelector('.hours');
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    var t = getTimeRemaining(endtime);

    daysSpan.innerHTML = t.days;
    //If days is less than zero and reminder was not set to true
    //We are going to show reminder for first time
    if (t.days <= 0 && isReminder != true) {
      showDeadlineReminder();
      isReminder = true; //Set the reminder to true. All to-do/in-progress will be moved
      renderTasks(); //Re render tasks
    }
    //If days is greater than 0, and we have set a reminder previously
    //Remove it
    else if (t.days > 0 && isReminder == true) {
      removeDeadlineReminder();
      isReminder = false; //Set the reminder to false. All to-do/in-progress will not be moved
      renderTasks(); //Re render tasks
    }
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  if (timeinterval) { clearInterval(timeinterval); }
  timeinterval = setInterval(updateClock, 1000);
}

function resetDeadline() {
  var date = localStorage.getItem('deadLine');
  var deadline;
  if (date !== null) {
    //If we have a date set, use it as deadline
    deadline = new Date(date);
  }
  else {
    //No date saved, setting Today + 15 days as default
    deadline = new Date(Date.parse(new Date()) + 15 * 24 * 60 * 60 * 1000);
  }
  initializeClock('clockdiv', deadline);
}

function showDeadlineReminder() {
  if ($('#deadline-reminder').length)
    return; //Deadline reminder is already there
  var reminder = 'NOTE: Time is running out. Please complete your tasks!';
  var reminderHTML = '<div class="reminder" id="deadline-reminder">' + reminder + '</div>';
  $('#reminders').find('.message-container').append(reminderHTML);
}

function removeDeadlineReminder() {
  $('#deadline-reminder').remove();
}

function drawPieChart() {
  var ctx = document.getElementById('chart-canvas');
  var outputTask = JSON.parse(window.localStorage.getItem("outputTask")) || [];
  var categoriesStorage = JSON.parse(window.localStorage.getItem("categories")) || [];
  data = {
    datasets: [{
      backgroundColor: ["rgb(241, 149, 243)", "rgb(107, 199, 230)", "rgb(46, 207, 46)"],
      data: [
        outputTask.filter((x) => { return x.status == Task_Status.To_Do; }).length,
        outputTask.filter((x) => { return x.status == Task_Status.In_Progress; }).length,
        outputTask.filter((x) => { return x.status == Task_Status.Finished; }).length,
      ]
    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: [
      'To Do',
      'In Progress',
      'Finished'
    ]
  };


  var taskPieChart = new Chart(ctx, {
    type: 'pie',
    data: data,
    options: {
      legend: {
        labels: {
          fontColor: "white"
        }
      },
      maintainAspectRatio: false,//Should be false for proper resizing
      responsive: true,//Should be true
      aspectRatio: 1 //For square aspect ratio
    }
  });

  //Checks if categories is defined in localStorage 
  // Assign new categories to the chart
  for (i = 0; i < categoriesStorage.length; i++) {
    if (categoriesStorage) {
      taskPieChart.data.labels = [
        categoriesStorage[i].category1,
        categoriesStorage[i].category2,
        categoriesStorage[i].category3
      ];
      taskPieChart.update();
    }
    else {
      taskPieChart.data.labels = [
        'To Do',
        'In Progress',
        'Finished'
      ];
    }
  }
}