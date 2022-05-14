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

/* Возвращаем в функцию элемент "task" с дочерними элементами */

function createTemplate(text) {
    return `
        <div class="task task-wrap">
            <label class="check">
                <input class="check__input" type="checkbox">
                <span class="check__box"></span>
                <input class="text" value="${text}">
            </label>
            <span class="bin"></span>
        </div>
    `;
}

function render(html) {
    activeTasksWrap.insertAdjacentHTML("afterbegin", html); // Помещаем элемент "task" в начало activeTasksWrap
    addEventListeners();
}

function addEventListeners() {
    const activeTasks = document.querySelectorAll(".active-tasks__wrap");
    activeTasks.forEach(task => {
        const checkInput = task.querySelector(".check__input");
        const bin = task.querySelector(".bin");

        checkInput.addEventListener("change", completeTask);
        bin.addEventListener("click", deleteTask);
    });
}


function completeTask(e) {
    const tg = e.target;
    const check = tg.closest(".check"); // Ищем ближайший родительский элемент "check", на котором сработало событие
    const checkInput = check.querySelector(".check__input");

    if (checkInput.checked) {
        check.classList.add("text-task_completed"); // Зачеркиваем задачу
    } else {
        check.classList.remove("text-task_completed"); // Убираем зачеркивание
    }
}

function deleteTask(e) {
    const tg = e.target;
    const task = tg.closest(".task");
    task.remove();
}

function deleteAllTasks() {
    const allTasks = document.querySelectorAll(".task");
    allTasks.forEach(task => {
        task.remove();
    });
    tasksWrap.hidden = "true"; // Добавляем атрибут hidden у кнопки "Delete All"
}


const OnEnterInput = (e) => e.code === "Enter" && createTask();

function onClickAddButton() {
    createTask();
}


inputTask.addEventListener("keyup", OnEnterInput);
addButton.addEventListener("click", onClickAddButton);
deleteBtnTasks.addEventListener("click", deleteAllTasks);