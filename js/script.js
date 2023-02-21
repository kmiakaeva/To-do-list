const newTaskField = document.querySelector('.input-task');
const addTaskButton = document.querySelector('.add-button');
const tasksWrap = document.querySelector('.tasks-wrap');
const deleteTasksButton = document.querySelector('.delete-button-tasks');
const activeTasksWrap = document.querySelector('.active-tasks__wrap');

let tasks = JSON.parse(localStorage.getItem('to-do-list')) || [];

const setTasks = () =>
  localStorage.setItem('to-do-list', JSON.stringify(tasks));

function createTemplate(id, text, value, className) {
  return `
    <div data-task-id="${id}" class="task task-wrap">
      <div class="input-task">
        <label for="${id}" class="check">
          <input
            id="${id}"
            data-checked="${value}"
            class="check__input"
            type="checkbox"
          />
          <span id="${id}" class="check__box"></span>
        </label>
        <div class="${className}" contenteditable="false">${text}</div>
      </div>
      <div class="action-task">
        <span class="edit-text"></span>
        <span class="bin"></span>
      </div>
    </div>
  `;
}

function renderAndShowTasks() {
  let template = '';

  tasks.forEach((task) => {
    if (task.checked) {
      template += createTemplate(
        task.id,
        task.description,
        task.checked,
        'text task_completed'
      );
    } else {
      template += createTemplate(
        task.id,
        task.description,
        task.checked,
        'text'
      );
    }
    activeTasksWrap.innerHTML = template;
    addEventListeners();
    tasksWrap.hidden = false;
  });
}

renderAndShowTasks();

function addEventListeners() {
  document.querySelectorAll('.task').forEach((task) => {
    const taskField = task.querySelector('.check__input');
    const pencil = task.querySelector('.edit-text');
    const bin = task.querySelector('.bin');

    taskField.addEventListener('change', changeTaskStatus);
    pencil.addEventListener('click', toggleTaskEditing);
    bin.addEventListener('click', deleteTask);
  });
}

const removeErrorMessage = () =>
  document.querySelector('.error-message')?.remove();

function createTask() {
  removeErrorMessage();

  const fieldValue = newTaskField.value.trim();
  if (!fieldValue) {
    showErrorMessage();

    return;
  }

  tasks.push({
    id: String(Date.now()),
    description: fieldValue,
    checked: false,
  });
  setTasks();

  newTaskField.value = '';
  renderAndShowTasks();
}

function showErrorMessage() {
  document
    .querySelector('.input-wrap')
    .insertAdjacentHTML(
      'afterend',
      '<div class="error-message">Please enter the task name</div>'
    );

  setTimeout(() => {
    removeErrorMessage();
  }, 4000);
}

const findTaskIndex = (task) =>
  tasks.findIndex((el) => el.id === task.dataset.taskId);

function changeTaskStatus(e) {
  const { target } = e;
  const task = target.closest('.task');
  const taskField = task.querySelector('.text');
  target.dataset.checked = !JSON.parse(target.dataset.checked); // toggle boolean value of 'data-checked' attribute

  if (target.dataset.checked === 'true') {
    tasks[findTaskIndex(task)].checked = true;
    setTasks();
    taskField.classList.add('task_completed');
  } else {
    tasks[findTaskIndex(task)].checked = false;
    setTasks();
    taskField.classList.remove('task_completed');
  }
}

function toggleTaskEditing(e) {
  const { target } = e;
  const task = target.closest('.task');
  const taskField = task.querySelector('.text');

  if (taskField.getAttribute('contenteditable') === 'false') {
    changeFieldAccessAndIcon(taskField, 'true', target, 'Save');
    setCursorPosition(taskField);
  } else {
    tasks[findTaskIndex(task)].description = taskField.innerText.trim();
    setTasks();
    changeFieldAccessAndIcon(taskField, 'false', target, '');
  }
}

function changeFieldAccessAndIcon(field, value, icon, text) {
  field.setAttribute('contenteditable', value);
  icon.innerText = text;
  icon.classList.toggle('save-text');
}

function setCursorPosition(field) {
  field.focus();
  window.getSelection().selectAllChildren(field);
  window.getSelection().collapseToEnd();
}

function deleteTask(e) {
  const task = e.target.closest('.task');
  tasks.splice(findTaskIndex(task), 1);
  setTasks();
  task.remove();

  if (!activeTasksWrap.children.length) {
    clearTasksAndHideWrap();
  }
}

function clearTasksAndHideWrap() {
  localStorage.clear();
  tasksWrap.hidden = 'true';
}

function deleteAllTasks() {
  tasks = [];
  activeTasksWrap.innerHTML = '';
  clearTasksAndHideWrap();
}

function createTaskOnEnterButton(e) {
  if (e.code === 'Enter') {
    createTask();
  }
}

const createTaskOnAddButton = () => createTask();

newTaskField.addEventListener('keyup', createTaskOnEnterButton);
addTaskButton.addEventListener('click', createTaskOnAddButton);
deleteTasksButton.addEventListener('click', deleteAllTasks);
