"use strict";

const inputTask = document.querySelector(".input-task"),
    addButton = document.querySelector(".add-button"),
    tasksWrap = document.querySelector(".tasks-wrap"),
    deleteBtnTasks = document.querySelector(".delete-btn-tasks"),
    activeTasksWrap = document.querySelector(".active-tasks__wrap");


function createTask() {
    const text = inputTask.value; // В text содержится значение поля задач

    if (text) {
        const task = createTemplate(text);
        tasksWrap.hidden = false; // Убираем атрибут hidden
        render(task);
    }
    inputTask.value = ""; // Обнуляем поле после каждой введенной задачи
}

function createTemplate(text) {
    return `
        <div class="task task-wrap">
            <label class="check">
                <input class="check__input" type="checkbox">
                <span class="check__box"></span>
                <div class="check__text" contenteditable="false">${text}</div>
            </label>
            <div class="action-task">
            <span class="edit-text"></span>
            <span class="bin"></span>
            </div>
        </div>
    `;
}

function render(html) {
    tasksWrap.hidden = false;
    activeTasksWrap.insertAdjacentHTML("afterbegin", html); // Помещаем элемент "task" в начало activeTasksWrap
    addEventListeners();
}

function addEventListeners() {
    const activeTasks = document.querySelectorAll(".active-tasks__wrap");

    activeTasks.forEach(task => {
        const checkInput = task.querySelector(".check__input");
        const pencil = task.querySelector(".edit-text");
        const bin = task.querySelector(".bin");

        checkInput.addEventListener("change", completeTask);
        pencil.addEventListener("click", onEditTextOfTask);
        bin.addEventListener("click", deleteTask);
    });
}


function completeTask(e) {
    const tg = e.target;
    const check = tg.closest(".check");
    const checkInput = check.querySelector(".check__input");

    if (checkInput.checked) {
        check.classList.add("task_completed"); // Зачеркиваем задачу
    } else {
        check.classList.remove("task_completed"); // Убираем зачеркивание
    }
}

function onEditTextOfTask(e) {
    const tg = e.target;
    const task = tg.closest(".task");
    const textInputInCheck = task.querySelector(".check__text");
    const pencil = task.querySelector(".edit-text");

    switch (textInputInCheck.getAttribute("contenteditable")) {
        case "false":
            textInputInCheck.setAttribute("contenteditable", "true");
            setTheCursorPosition(e);
            pencil.innerText = "Save";
            pencil.classList.toggle("save-text");
            break;

        case "true":
            textInputInCheck.setAttribute("contenteditable", "false");
            pencil.innerText = "";
            pencil.classList.toggle("save-text");
            break;
    }
}

function setTheCursorPosition(e) {
    const tg = e.target;
    const task = tg.closest(".task");
    const textInputInCheck = task.querySelector(".check__text");
    const selection = window.getSelection();
    const range = document.createRange();

    range.selectNodeContents(textInputInCheck);
    selection.removeAllRanges();
    range.collapse(false);
    selection.addRange(range);
}

function deleteTask(e) {
    const tg = e.target;
    const task = tg.closest(".task");
    task.remove();

    if (!(activeTasksWrap.children.length)) {
        tasksWrap.hidden = "true"; // Добавляем атрибут "true", если нет задач
    }
}

function deleteAllTasks() {
    const allTasks = document.querySelectorAll(".task");

    allTasks.forEach(task => {
        task.remove();
    });
    tasksWrap.hidden = "true";
}


const OnEnterInput = (e) => e.code === "Enter" && createTask();

function onClickAddButton() {
    createTask();
}


inputTask.addEventListener("keyup", OnEnterInput);
addButton.addEventListener("click", onClickAddButton);
deleteBtnTasks.addEventListener("click", deleteAllTasks);