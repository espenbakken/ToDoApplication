function dragDropMembers() {
    const memberItem = document.querySelectorAll('.members');

    for (let i = 0; i < memberItem.length; i++) {
        const member = memberItem[i];
        member.addEventListener('dragstart', function () {
            memberId = $(event.target).data('memberid');//Get data-memberId attribute set while rendering
            event.dataTransfer.setData("memberId", memberId); //Set the event data so that it can be read on drop
            setTimeout(function () {
            }, 0);
        });
        member.addEventListener('dragend', function () {
            setTimeout(function () {
            }, 0);
        });
    }
}
/* Attach drag events when ever a task is rendered*/
function attachTaskEvents() {
    const taskItems = document.querySelectorAll('.task');
    
    for (let j = 0; j < taskItems.length; j++) {
        const listMembers = taskItems[j];
        
        listMembers.addEventListener('dragstart', function (event) {
            //Get task id of the task being dragged
            var taskId = $(event.target).find('div[data-taskid]').data('taskid');
            //Pass it to the drop event
            event.dataTransfer.setData("TaskId", taskId);
            setTimeout(function () {
            }, 0);
        });

        listMembers.addEventListener('dragover', function (e) {
            e.preventDefault();
        });
        listMembers.addEventListener('dragenter', function (e) {
            e.preventDefault();
        });
        listMembers.addEventListener('drop', function (e) {
            e.preventDefault();
            memberId = event.dataTransfer.getData("memberId"); //Read member id from event - passed in ondragstart
            console.log(memberId);
            let taskElement = $(this); //Dropped on which task element
            let taskId = taskElement.find('div[data-taskid]').data('taskid'); //Get the task id of element
            if (taskId !== undefined && memberId !== "") {
                assignMemberToTask(memberId, taskId); //Assign the member to task
                renderTasks(); //Render the tasks again
            }
        });

    }
}

function dragDropItems() {
    const taskFields = document.querySelectorAll('.taskField');
    for (let j = 0; j < taskFields.length; j++) {
        const list = taskFields[j];
        list.addEventListener('dragover', function (e) {
            e.preventDefault();
        });
        list.addEventListener('dragenter', function (e) {
            e.preventDefault();
        });
        list.addEventListener('drop', function (e) {
            e.preventDefault();
            //On drop, find the closest container of the drop area
            var parent = $(this).closest('.container');
            var parentId = parent.attr('id'); //This will give to-do,in-progress or finished based on drop area
            var taskId = e.dataTransfer.getData("TaskId"); //Get the task id from dropevent, which we set on drag start
            if (taskId !== "" && parentId) {
                //Based on the drop location, change the status of task
                switch (parentId) {
                    case 'to-do':
                        setTaskStatus(Task_Status.To_Do, taskId);
                        console.log("test");
                        break;
                    case 'in-progress':
                        setTaskStatus(Task_Status.In_Progress, taskId);
                        break;
                    case 'finished':
                        setTaskStatus(Task_Status.Finished, taskId);
                        break;
                    default:
                        break;
                }
                //Re render tasks
                renderTasks();
                //Diagram
                drawPieChart();
            }
        });
    }
}

function setTaskStatus(status, taskId) {
    //Read data from storage
    var tasks = JSON.parse(window.localStorage.getItem("outputTask")) || [];
    var taskIndex = tasks.findIndex((x) => x.taskId == taskId); //Find the task object with task id
    if (taskId && taskIndex >= 0) {
        var task = tasks[taskIndex];
        task.status = status; //Set task status
        window.localStorage.setItem("outputTask", JSON.stringify(tasks)); //Update localstorage
        location.reload();
    }
}
function assignMemberToTask(memberId, taskId) {
    //Read data from storage
    var tasks = JSON.parse(window.localStorage.getItem("outputTask")) || [];
    var taskIndex = tasks.findIndex((x) => x.taskId == taskId); //Find the task object with task id
    if (taskId && taskIndex >= 0) {
        var task = tasks[taskIndex];
        if (task.members) {
            //If task already has some members
            //Check if the member is already added to avoid duplicate
            if (task.members.indexOf(memberId) == -1) {
                task.members.push(memberId); //Add member to existing list of members of task
                location.reload();
            }
        }
        else {
            //If no members are present for the task
            task.members = [memberId]; //Add a new array with member id 
        }

        window.localStorage.setItem("outputTask", JSON.stringify(tasks)); //Update localstorage
    }
}