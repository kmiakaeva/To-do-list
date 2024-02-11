const CLASS_NAMES = {
  TASK_FIELD: '.task-field',
  ADD_BUTTON: '.add-button',
  TASKS_WRAP: '.tasks-wrap',
  DELETE_BUTTON_TASKS: '.delete-button',
  ACTIVE_TASKS_WRAP: '.active-tasks__wrap',
  ERROR_MESSAGE: '.error-message',
  CHECK_INPUT: '.check__input',
  EDIT_TEXT: '.edit-text',
  BIN: '.bin',
  TEXT: '.text',
};

let tasks = JSON.parse(localStorage.getItem('to-do-list')) || [];

function init() {
  const taskField = document.querySelector(CLASS_NAMES.TASK_FIELD);
  const addTaskButton = document.querySelector(CLASS_NAMES.ADD_BUTTON);
  const deleteTasksButton = document.querySelector(
    CLASS_NAMES.DELETE_BUTTON_TASKS
  );

  renderTasks();
  clearTasks();

  taskField.addEventListener(
    'keyup',
    (e) => e.code === 'Enter' && createTask()
  );
  addTaskButton.addEventListener('click', createTask);
  deleteTasksButton.addEventListener('click', deleteAllTasks);
}

function renderTasks() {
  const tasksWrap = document.querySelector(CLASS_NAMES.TASKS_WRAP);
  const activeTasksWrap = document.querySelector(CLASS_NAMES.ACTIVE_TASKS_WRAP);
  const template = tasks.map((task) => createTemplate(task)).join('');

  activeTasksWrap.innerHTML = template;
  tasksWrap.hidden = false;
  addEventListeners();
}

function createTemplate({ id, value, checked }) {
  const className = checked ? 'text task_completed' : 'text';
  return `
    <div data-task-id="${id}" class="task task-wrap">
      <div class="task-field">
        <label for="${id}" class="check">
          <input
            id="${id}"
            data-checked="${checked}"
            class="check__input"
            type="checkbox"
          />
          <span id="${id}" class="check__box"></span>
        </label>
        <div class="${className}" contenteditable="false">${value}</div>
      </div>
      <div class="action-task">
        <span class="edit-text"></span>
        <span class="bin"></span>
      </div>
    </div>
  `;
}

function addEventListeners() {
  document.querySelectorAll('.task').forEach((task) => {
    const taskField = task.querySelector(CLASS_NAMES.CHECK_INPUT);
    const pencil = task.querySelector(CLASS_NAMES.EDIT_TEXT);
    const bin = task.querySelector(CLASS_NAMES.BIN);

    taskField.addEventListener('change', changeTaskStatus);
    pencil.addEventListener('click', toggleTaskEditing);
    bin.addEventListener('click', deleteTask);
  });
}

function clearTasks() {
  const activeTasksWrap = document.querySelector(CLASS_NAMES.ACTIVE_TASKS_WRAP);
  const tasksWrap = document.querySelector(CLASS_NAMES.TASKS_WRAP);

  if (!activeTasksWrap.childElementCount) {
    tasksWrap.hidden = true;
    localStorage.clear();
  }
}

function createTask() {
  const taskField = document.querySelector(CLASS_NAMES.TASK_FIELD);
  const value = taskField.value.trim();
  removeErrorMessage();

  if (!value) {
    showErrorMessage();
  } else {
    tasks = [
      ...tasks,
      { id: String(Date.now()), value: value, checked: false },
    ];
    setTasks();
    taskField.value = '';
    renderTasks();
  }
}

function removeErrorMessage() {
  const errorMessage = document.querySelector(CLASS_NAMES.ERROR_MESSAGE);
  errorMessage?.remove();
}

function showErrorMessage() {
  const inputWrap = document.querySelector('.input-wrap');
  inputWrap.insertAdjacentHTML(
    'afterend',
    '<div class="error-message">Please enter the task name</div>'
  );

  setTimeout(removeErrorMessage, 2000);
}

function setTasks() {
  localStorage.setItem('to-do-list', JSON.stringify(tasks));
}

function changeTaskStatus(e) {
  const { target } = e;
  const task = target.closest('.task');
  const taskField = task.querySelector(CLASS_NAMES.TEXT);
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

function findTaskIndex(task) {
  return tasks.findIndex((el) => el.id === task.dataset.taskId);
}

function toggleTaskEditing(e) {
  const { target } = e;
  const task = target.closest('.task');
  const taskField = task.querySelector(CLASS_NAMES.TEXT);

  if (taskField.getAttribute('contenteditable') === 'false') {
    changeFieldAccess(taskField, 'true', target, 'Save');
    setCursorPosition(taskField);
  } else {
    tasks[findTaskIndex(task)].value = taskField.innerText.trim();
    setTasks();
    changeFieldAccess(taskField, 'false', target, '');
  }
}

function changeFieldAccess(field, value, icon, text) {
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
  task.remove();

  setTasks();
  clearTasks();
}

function deleteAllTasks() {
  const activeTasksWrap = document.querySelector(CLASS_NAMES.ACTIVE_TASKS_WRAP);
  activeTasksWrap.innerHTML = '';
  tasks = [];

  clearTasks();
}

init();
