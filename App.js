//selectors
const taskEle = document.getElementById("task"); //input task
const addTaskUl = document.getElementById("addTask"); // ul
const addBtnEle = document.getElementById("addBtn"); //Add task btn
const progressTask = document.getElementById("taskInProgress");
const reviewTask = document.getElementById("taskInReview");
const doneTask = document.getElementById("taskDone");

const section = document.querySelectorAll(".sections");

section.forEach(box => {
    box.addEventListener('dragenter', dragEnter)
    box.addEventListener('dragover', dragOver);
    box.addEventListener('dragleave', dragLeave);
    box.addEventListener('drop', drop);
});


//array of tasks
//let tasks = [];
let tasks = JSON.parse(localStorage.getItem('task')) || [];
let progress = JSON.parse(localStorage.getItem('progress')) || [];
let review = JSON.parse(localStorage.getItem('review')) || [];
let done = JSON.parse(localStorage.getItem('done')) || [];
let editedTask = -1;

const obj = { addTask: tasks, taskInProgress: progress, taskInReview: review, taskDone: done };
const objNode = { addTask: addTaskUl, taskInProgress: progressTask, taskInReview: reviewTask, taskDone: doneTask };





//first render of tasks
addTasks(addTaskUl, tasks, "task");
addTasks(progressTask, progress, "progress");
addTasks(reviewTask, review, "review");
addTasks(doneTask, done, "done");


let uniqueId = 1;
addBtnEle.addEventListener("click", (event) => {
    event.preventDefault();

    saveTasks();
    addTasks(addTaskUl, tasks, "task");
    localStorage.setItem('task', JSON.stringify(tasks));

});

function saveTasks() {
    const taskValue = taskEle.value;

    const isDuplicate = tasks.some((data) => data.value.toUpperCase() === taskValue.toUpperCase());

    const isEmpty = taskValue === '';

    if (isEmpty) {
        alert("Task is not defined!!!");
    }
    else if (isDuplicate) {
        alert("Task already exists!!!");
    }
    else {
        if (editedTask >= 0) {
            tasks = tasks.map((data, index) => ({
                ...data,
                value: index === editedTask ? taskValue : data.value,
            }));
        }
        else {
            tasks.push({
                status:"addTask",
                value: taskValue,
                description: 'xyz',
                priority: "high"
            });
        }
        taskEle.value = '';
    }
}



function addTasks(addTaskUl, tasks, key) {
    addTaskUl.innerHTML = '';

    tasks.forEach((data, index, arr) => {
        const task = createTask(data, index, arr, key, addTaskUl);

        addTaskUl.append(task);

        localStorage.setItem(key, JSON.stringify(tasks));

    });



}

function createForm({ grandParent, parent, taskNode, priorityNode, descriptionNode, nameNode, editBtnNode }, data) {

    const div1 = unitElementCreater("div", "status visibility");

    const i2 = unitElementCreater("i", "bi bi-x-circle-fill");
    i2.addEventListener("click", () => { example(div1) });

    const label2$1 = unitElementCreater("label", "label");
    label2$1.innerHTML = "Edit Task Name";
    const label2$2 = unitElementCreater("label", "label");
    label2$2.innerHTML = "Add Description";
    const label2$3 = unitElementCreater("label", "label");
    label2$3.innerHTML = "Select Priority";
    const label2$4 = unitElementCreater("label", "label");
    label2$4.innerHTML = "Select Status";


    const input2$1 = unitElementCreater("input", "form-name", { placeholder: "Edit task name..." });
    input2$1.value = nameNode.innerHTML;
    const input2$2 = unitElementCreater("input", "form-description", { placeholder: "Add Description..." });
    input2$2.value = descriptionNode.innerHTML;
    const select2$1 = unitElementCreater("select", "form-priority");
    const priorityArr = ["High", "Mid", "Low"];
    priorityArr.forEach((prio, idx, arr) => {
        const option3 = unitElementCreater("option", null, { value: prio.toLowerCase() });
        option3.innerHTML = prio;
        select2$1.append(option3);
    });
    select2$1.value = priorityNode.className.toLowerCase();
    const statusArray = ["Open", "In Progress", "In Review", "Done"];
    const select2$2 = unitElementCreater("select", "form-status");
    Object.keys(obj).forEach((key, idx, arr) => {
        const option3 = unitElementCreater("option", null, { value: key });
        option3.innerHTML = statusArray[idx];
        select2$2.append(option3);
    });
    console.log(data);
    



    const button2 = unitElementCreater("button", "edit-btn", { type: "submit" });
    button2.innerHTML = "Submit Edit";


    div1.append(i2, label2$1, input2$1, label2$2, input2$2, label2$3, select2$1, label2$4, select2$2, button2);

    button2.addEventListener("click", () => {
        const prevNodeArray = obj[data["status"]];
        const nextNodeArray = obj[select2$2.value];
        const temp = prevNodeArray[parent.id - 0];


        temp.value = nameNode.innerHTML = input2$1.value;
        temp.description = descriptionNode.innerHTML = input2$2.value;
        temp.priority = select2$1.value;
        priorityNode.innerHTML = select2$1.value+" Priority";
        priorityNode.className = select2$1.value;

        if (select2$2.value != data["status"]) {
            
            const prevNode = objNode[data["status"]];
            data["status"] = select2$2.value;
            const nextNode = objNode[select2$2.value]

            prevNode.removeChild(parent);
            prevNodeArray.splice(parent.id - 0, 1);

            nextNode.append(parent);
            nextNodeArray.push(temp);
            select2$2.value = data["status"];
            

        }
        example(div1);


        localStorage.setItem('task', JSON.stringify(tasks));
        localStorage.setItem('progress', JSON.stringify(progress));
        localStorage.setItem('review', JSON.stringify(review));
        localStorage.setItem('done', JSON.stringify(done));

        

    });



    return div1;


    
}

function createTask(data, idx, array, key, parent) {

    console.log(array);

    const div1 = unitElementCreater("div", "newTask drag", { id: idx, draggable: "true" });
    const h2$1 = unitElementCreater("h5", data.priority);
    h2$1.innerHTML = data.priority+" Priority";
    const h2$2 = unitElementCreater("h4", null);
    h2$2.innerHTML = data.value;
    const p2 = unitElementCreater("p", "description");
    const span3 = unitElementCreater("span","popuptext",{id:"myPopup"});
    span3.innerHTML = data.description;
    const i2$1 = unitElementCreater("i", "bi bi-pencil-square", { "data-action": "edit" });
    const i2$2 = unitElementCreater("i", "bi bi-trash", { "data-action": "delete" });
    const i2$3 = unitElementCreater("i", "bi bi-chat-text-fill popup", { "data-action": "description" });
    i2$3.append(span3);



    div1.append(h2$1, h2$2, p2, i2$1, i2$2,i2$3);

    


    div1.addEventListener('dragstart', dragStartHandler);
    const arg = { grandParent: parent, parent: div1, taskNode: div1, priorityNode: h2$1, descriptionNode: span3, nameNode: h2$2, editBtnNode: i2$1 };
    const form = createForm(arg, data);
    div1.append(form);

    i2$1.addEventListener("click", () => {       
       example(form);
    });

    i2$2.addEventListener("click", () => {
        div1.parentNode.removeChild(div1);
        array.splice(idx, 1);
        localStorage.setItem(key, JSON.stringify(array));

    });

    i2$3.addEventListener("click",()=>{
        span3.classList.toggle("show");
    });





    return div1;


    
}




/* createTask({value:"xyz"},5); */

function unitElementCreater(tag, className, attr = {}) {
    const ele = document.createElement(tag);
    className && (ele.className = className);
    for (const key in attr) {
        ele.setAttribute(key, attr[key]);
    }
    return ele;

}

//description box
function example(el) {
    el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}



let draggable = "";

function dragStartHandler(e) {
    draggable = e.target;
    /* e.dataTransfer.setData('text/plain', e.target.id); */

}


/* drop targets */



function dragEnter(e) {
    e.preventDefault();

}

function dragOver(e) {
    e.preventDefault();

}

function dragLeave(e) {

}

function drop(e) {
    
    let target = e.target;

    let statusSelector = draggable.querySelector(".form-status");


    const draggableParentnode = draggable.parentNode;


    if (target.classList.contains("bar")) {
        target.appendChild(draggable);
        obj[draggableParentnode.id][draggable.id]['status'] = target.id
        console.log();
        obj[draggableParentnode.id][draggable.id] && obj[target.id].push(obj[draggableParentnode.id][draggable.id]);
        obj[draggableParentnode.id].splice(draggable.id - 0, 1);

        statusSelector.value = target.id;

    } else {
        while (!target.classList.contains("drag")) {
            target = target.parentNode;

        }
        target.parentNode.insertBefore(draggable, target);
        obj[draggableParentnode.id][draggable.id]['status'] = target.parentNode.id
        obj[draggableParentnode.id][draggable.id] && obj[target.parentNode.id].push(obj[draggableParentnode.id][draggable.id]);
        obj[draggableParentnode.id].splice(draggable.id - 0, 1);

        statusSelector.value = target.parentNode.id;

    }

    



    localStorage.setItem('task', JSON.stringify(tasks));
    localStorage.setItem('progress', JSON.stringify(progress));
    localStorage.setItem('review', JSON.stringify(review));
    localStorage.setItem('done', JSON.stringify(done));

    // display the draggable element
    /* draggable.classList.remove('hide'); */
}