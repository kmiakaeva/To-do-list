"use strict";

const inputTask = document.querySelector(".input-task"),
    addButton = document.querySelector(".add-button"),
    tasksWrap = document.querySelector(".tasks-wrap"),
    deleteBtnTasks = document.querySelector(".delete-btn-tasks"),
    activeTasksWrap = document.querySelector(".active-tasks__wrap");

/* Добавляем задачу с помощью "Enter" или при "click" на кнопке "Add" */

function createTask() {
    if (inputTask.value) {
        const task = document.createElement("div"); // Создаем блок для задач
        task.classList.add("task", "task-wrap");

        const label_task = document.createElement("label"); // Создаем label
        label_task.classList.add("check");

        const check__input = document.createElement("input"); // Создаем input
        check__input.classList.add("check__input");
        check__input.type = "checkbox"; // Добавляем аттрибут type со значением "checkbox"

        const check__box = document.createElement("span"); // Создаем span
        check__box.classList.add("check__box");

        const text_task = inputTask.value; // Объявляем переменную с полем input

        const bin_task = document.createElement("span"); // Создаем корзину
        bin_task.classList.add("bin");

        activeTasksWrap.prepend(task); // Помещаем блок в начало обертки активных задач
        task.prepend(label_task); // Вставляем label в начале родительского элемента
        label_task.prepend(check__input); // Вставляем в label input
        check__input.after(check__box); // Вставляем span после input
        check__box.after(text_task); // Вставляем задачу после span
        task.append(bin_task); // Помещаем span с корзиной в конец task

        tasksWrap.hidden = false; // Убираем атрибут hidden у обертки

        inputTask.value = ""; //Обнуляем поле input

        /* Checkbox */

        check__input.addEventListener("change", () => {
            if (check__input.checked) {
                label_task.classList.add("text-task_completed"); // Зачеркиваем задачу
                activeTasksWrap.append(task); // Ставим вниз
            } else {
                label_task.classList.remove("text-task_completed"); // Убираем зачеркивание
                activeTasksWrap.prepend(task); // Ставим наверх
            }
        });

        /* Bin */

        bin_task.addEventListener("click", () => {
            task.remove();
        });

        /* Кнопка "Delete all" */

        deleteBtnTasks.addEventListener("click", () => {
            activeTasksWrap.removeChild(task);
            tasksWrap.hidden = true;
        });
    }
}

function OnEnterInput(e) {
    if (e.code === "Enter") {
        createTask();
    }
}

function onClickAddButton() {
    createTask();
}

inputTask.addEventListener("keyup", OnEnterInput);
addButton.addEventListener("click", onClickAddButton);
deleteBtnTasks.addEventListener("click", createTask);