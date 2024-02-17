type Task = {
  id: string;
  value: string;
  checked: boolean;
};

type ChangeEvent = Event & { target: HTMLInputElement };

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
  INPUT_WRAP: '.input-wrap',
  TASK: '.task',
};

let tasks: Task[] = JSON.parse(localStorage.getItem('to-do-list') || '[]');

function init(): void {
  const taskField: HTMLInputElement | null = document.querySelector(
    CLASS_NAMES.TASK_FIELD
  );
  const addTaskButton: HTMLButtonElement | null = document.querySelector(
    CLASS_NAMES.ADD_BUTTON
  );
  const deleteTasksButton: HTMLButtonElement | null = document.querySelector(
    CLASS_NAMES.DELETE_BUTTON_TASKS
  );

  renderTasks();
  clearTasks();

  taskField?.addEventListener(
    'keyup',
    (e: KeyboardEvent) => e.code === 'Enter' && createTask()
  );
  deleteTasksButton?.addEventListener('click', deleteAllTasks);
  addTaskButton?.addEventListener('click', createTask);
}

function renderTasks() {
  const tasksWrap: HTMLElement | null = document.querySelector(
    CLASS_NAMES.TASKS_WRAP
  );
  const activeTasksWrap: HTMLElement | null = document.querySelector(
    CLASS_NAMES.ACTIVE_TASKS_WRAP
  );
  const template = tasks.map((task: Task) => createTemplate(task)).join('');

  if (activeTasksWrap) activeTasksWrap.innerHTML = template;
  if (tasksWrap) tasksWrap.hidden = false;
  addEventListeners();
}

function createTemplate({ id, value, checked }: Task): string {
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

function addEventListeners(): void {
  document.querySelectorAll('.task').forEach((task) => {
    const taskField: HTMLInputElement | null = task.querySelector(
      CLASS_NAMES.CHECK_INPUT
    );
    const pencil: HTMLSpanElement | null = task.querySelector(
      CLASS_NAMES.EDIT_TEXT
    );
    const bin: HTMLSpanElement | null = task.querySelector(CLASS_NAMES.BIN);

    taskField?.addEventListener('change', (e: Event) =>
      changeTaskStatus(e as ChangeEvent)
    );
    pencil?.addEventListener('click', (e) => toggleTaskEditing(e));
    bin?.addEventListener('click', (e) => deleteTask(e));
  });
}

function clearTasks(): void {
  const activeTasksWrap: HTMLElement | null = document.querySelector(
    CLASS_NAMES.ACTIVE_TASKS_WRAP
  );
  const tasksWrap: HTMLElement | null = document.querySelector(
    CLASS_NAMES.TASKS_WRAP
  );

  if (!activeTasksWrap?.childElementCount) {
    if (tasksWrap) tasksWrap.hidden = true;
    localStorage.clear();
  }
}

function createTask(): void {
  const taskField: HTMLInputElement | null = document.querySelector(
    CLASS_NAMES.TASK_FIELD
  );
  const value = taskField?.value.trim();
  removeErrorMessage();

  if (!value) {
    showErrorMessage();
  } else {
    tasks = [
      ...tasks,
      { id: String(Date.now()), value: value, checked: false },
    ];
    setTasks();

    if (taskField) taskField.value = '';
    renderTasks();
  }
}

function removeErrorMessage(): void {
  const errorMessage: HTMLElement | null = document.querySelector(
    CLASS_NAMES.ERROR_MESSAGE
  );
  errorMessage?.remove();
}

function showErrorMessage(): void {
  const inputWrap: HTMLElement | null = document.querySelector(
    CLASS_NAMES.INPUT_WRAP
  );
  inputWrap?.insertAdjacentHTML(
    'afterend',
    '<div class="error-message">Please enter the task name</div>'
  );
  setTimeout(removeErrorMessage, 2000);
}

function setTasks(): void {
  try {
    localStorage.setItem('to-do-list', JSON.stringify(tasks));
  } catch (error) {
    console.error('An error occurred while saving tasks:', error);
  }
}

function changeTaskStatus(e: ChangeEvent): void {
  const target = e.target;
  const task: HTMLElement | null = target.closest('.task');
  const taskField: HTMLElement | null =
    task?.querySelector(CLASS_NAMES.TEXT) ?? null;

  const isChecked = target.dataset.checked === 'true';
  target.dataset.checked = String(!isChecked);

  if (task) {
    const index = findTaskIndex(task);
    tasks[index].checked = !isChecked;
    setTasks();

    if (taskField) {
      if (!isChecked) {
        taskField.classList.add('task_completed');
      } else {
        taskField.classList.remove('task_completed');
      }
    }
  }
}

function findTaskIndex(task: HTMLElement): number {
  return tasks.findIndex((el) => el.id === task.dataset.taskId);
}

function toggleTaskEditing(e: MouseEvent): void {
  const target = e.target as HTMLSpanElement;
  const task: HTMLElement | null = target.closest('.task');
  const taskField: HTMLElement | null =
    task?.querySelector(CLASS_NAMES.TEXT) ?? null;

  if (taskField?.getAttribute('contenteditable') === 'false') {
    changeFieldAccess(taskField, 'true', target, 'Save');
    setCursorPosition(taskField);
  } else if (task && taskField?.getAttribute('contenteditable') === 'true') {
    tasks[findTaskIndex(task)].value = taskField.innerText.trim();
    setTasks();
    changeFieldAccess(taskField, 'false', target, '');
  }
}

function changeFieldAccess(
  taskField: HTMLElement,
  value: string,
  icon: HTMLSpanElement,
  text: string
): void {
  taskField.setAttribute('contenteditable', value);
  icon.innerText = text;
  icon.classList.toggle('save-text');
}

function setCursorPosition(taskField: HTMLElement): void {
  taskField.focus();
  const selection = window.getSelection();
  selection?.selectAllChildren(taskField);
  selection?.collapseToEnd();
}

function deleteTask(e: MouseEvent): void {
  const target = e.target as HTMLSpanElement;
  const task: HTMLElement | null = target.closest(CLASS_NAMES.TASK);
  if (task) {
    tasks.splice(findTaskIndex(task), 1);
    task.remove();
  }

  setTasks();
  clearTasks();
}

function deleteAllTasks(): void {
  const activeTasksWrap: HTMLElement | null = document.querySelector(
    CLASS_NAMES.ACTIVE_TASKS_WRAP
  );
  if (activeTasksWrap) {
    activeTasksWrap.innerHTML = '';
  }
  tasks = [];

  clearTasks();
}

init();
