//Function for rendering of tasks 
function renderTasks() {
    var outputTask = JSON.parse(window.localStorage.getItem("outputTask")) || [];
    //Define containers
    var todoContainer = $("#to-do .taskField");
    var inProgressContainer = $('#in-progress .taskField');
    var finishedContainer = $('#finished .taskField');
    var reminderContainer = $('#reminders .taskField');
    var members = JSON.parse(localStorage.getItem("members")) || []; //Get list of members
    //Clear container contents
    todoContainer.html('');
    inProgressContainer.html('');
    finishedContainer.html('');
    reminderContainer.html('');
    for (var product of outputTask) {
        var productTwo = document.createElement("div");
        productTwo.setAttribute('class', 'task');
        // Added draggable 
        productTwo.setAttribute('draggable', true);

        var { id, task, member, position } = product;
        //Create html for members
        var membersHTMLElement = document.createElement('DIV');
        membersHTMLElement.setAttribute('class', 'member-container');
        var membersTxt = [];
        for (const memberId of product.members) {
            let member = members.find((x) => { return x.memberId == memberId; }); //Find the member object with memberid
            if (member) {
                membersTxt.push(member.member); //member.member has the members name
            }
        }
        membersString = (membersTxt.length) ? '(' + membersTxt.join(', ') + ')' : '';
        // The task itself and the dropdown menu
        productTwo.innerHTML =
            "<div id='task" + product.taskId + "' data-taskid='" + product.taskId + "'>" +
                "<p>" + product.task + membersString + "</p>" +
                "<ul>" +
                    "<li><img id='pencil-img' src='images/pencil.png' alt='task-options. Pencil'>" +
                        "<ul class='dropdown-menu'>" +
                            "<li><a onclick='deleteTask(" + product.taskId + ")'><i class='fas fa-trash'></i> Delete task</a></li>" +
                            "<li><a class='trigger_popup_fricc' onclick='editTask(" + product.taskId + ")' data-target='edit-task'><i class='fas fa-edit'></i> Edit task</a></li>" +
                        "</ul>" +
                    "</li>" +
                "</ul>" +
            "</div>";
        productTwo.appendChild(membersHTMLElement);
        switch (product.status) {
            //Push the task to corresponding containers
            case Task_Status.To_Do:
                if (isReminder == true) {
                    //If reminder is true, then append it in reminder box
                    reminderContainer.append(productTwo);
                }
                else {
                    //Dedaline is not close, so append in todo container
                    todoContainer.append(productTwo);
                }
                break;
            case Task_Status.In_Progress:
                if (isReminder == true) {
                    //If reminder is true, then append it in reminder box
                    reminderContainer.append(productTwo);
                }
                else {
                    //Dedaline is not close, so append in in-progess container
                    inProgressContainer.append(productTwo);
                }
                break;
            case Task_Status.Finished:
                finishedContainer.append(productTwo);
                break;
            default:
                //No status found on task. This is unlikely if localstorage was cleared
                console.log("test");
                todoContainer.append(productTwo);
                break;
        }
    }
    attachTaskEvents(); //To attach events to task elements created
}

//Function for rendering of members
function renderMembers() {
    // Get localStorage parsed 
    var storage = JSON.parse(localStorage.getItem("members")) || [];
    //Find div to print members
    var outputDiv = document.getElementById("members-output");

    // For-loop to generate new h5 tags with members
    for (var newMember of storage) {
        var { member, stilling } = newMember;
        //Creates new element for each member and set it as draggable
        var newH5 = document.createElement("h5");
        newH5.setAttribute('class', 'members');
        newH5.setAttribute('draggable', true);
        newH5.innerHTML += "<i class='fas fa-user'></i> " + newMember.member;
        newH5.setAttribute('data-memberid', newMember.memberId);
        outputDiv.appendChild(newH5);

        //If role is set, make it visible
        if (newMember.stilling) {
            newH5.setAttribute('data-title', newMember.stilling);
        }
        // if not, tell user to set a role
        else {
            newH5.setAttribute('data-title', 'You have to set a role for this member');
        }
    }
    dragDropMembers(); //Attach event handlers for the members created
}

function renderNewCategories() {
    var categoryNr1 = document.getElementById("todoStorage");
    var categoryNr2 = document.getElementById("inprogressStorage");
    var categoryNr3 = document.getElementById("finishedStorage");
    var categoryStorage = JSON.parse(localStorage.getItem("categories")) || [];
    var taskPieChart = document.getElementById('chart-canvas');

    for (var newCategories of categoryStorage) {
        var { category1, category2, category3 } = newCategories;
        categoryNr1.innerHTML = newCategories.category1;
        categoryNr2.innerHTML = newCategories.category2;
        categoryNr3.innerHTML = newCategories.category3;
    }
}

