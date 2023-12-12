/**
 * @author: Pedro Vílchez Peña
 */
// ------ IMPORTS -----
import { v4 as uuidv4 } from 'uuid';
import autoAnimate from 'https://cdn.jsdelivr.net/npm/@formkit/auto-animate';
import crearGrafico from './components/grafico';
import mostrarError from './components/error';
import generarEventoCalendario from './components/ics';
import generatePdf from './components/pdfTaskCreator';

// ------ VARIABLES GLOBALES ------
const mostrarGraficoBtn = document.querySelector(".mostrar-grafico-link");
const newTaskInput = document.querySelector("#new-task-input");
const addTaskBtn = document.querySelector(".add-task-btn");
const tasksListUl = document.querySelector(".tasks-list-ul");
const inputTextSearch = document.querySelector('.search-input');
const generarEventoCalendarioBtn = document.querySelector('.generar-evento-calendario-link');

// Animaciones auto-animate
autoAnimate(tasksListUl);

// ------ ESTADO DE LA APLICACIÓN ------

const tasks = [];

// App es el objeto que almacena el estado de mi aplicación.
// const app = {
//   tasks: tasks,
//   newTaskInput: newTaskInput,
//   tasksListUl: tasksListUl
// }
// Si se llaman igual se hace así
const app = {
  tasks,
  newTaskInput,
  tasksListUl,
}

// Función para crear una tarea.
function createNewTask(title, isCompleted= false) {
  return {
    id: uuidv4().toString(),
    title,
    isCompleted,
  };
}

// Función que añade un elemento <li> al <ul> generando un hijo nuevo
function addTaskToList(task, tasksListUl) {
  // Aquí mando a llamar a la función que cree la taarea en HTML
  const taskElement = createTaskElement(task);

  tasksListUl.appendChild(taskElement);

  saveTaskToLocalStorage(app.tasks);

  new Sortable(tasksListUl, {
    animation: 150,
    handle: '.drag-handle', // Agrega un mango para permitir el arrastre
    // onEnd: () => {
    //   // Actualiza el orden de las tareas en app.tasks después de que el usuario ha reorganizado la lista
    //   const newOrder = Array.from(tasksListUl.children).map((taskElement) => {
    //     const taskId = taskElement.getAttribute('data-id');
    //     return app.tasks.find((task) => task.id === taskId);
    //   });

    //   saveTaskOrderToLocalStorage(newOrder);
    // },
  });
}

// function saveTaskOrderToLocalStorage(newOrder) {
//   localStorage.setItem('taskOrder', JSON.stringify(newOrder));
// }

function addTask() {
  const newTaskTitle = app.newTaskInput.value;

  // if (newTaskInput) {
  if (newTaskTitle.length !== 0) {
    if( existTask() ){
      const newTask = createNewTask(newTaskTitle);
      app.tasks.push(newTask);
      addTaskToList(newTask, app.tasksListUl);
      saveTaskToLocalStorage(app.tasks);
    }else{
      mostrarError('Tarea existente', '.form-container');
    }
    app.newTaskInput.value = "";
  }
}

// Creación de los elementos HTML de la tarea
function createTaskElement(task) {
  const taskElement = document.createElement('li');
  taskElement.draggable = true;
  taskElement.className = 'item';
  
  const taskCheckBox = document.createElement('input');
  taskCheckBox.type = 'checkbox';
  taskCheckBox.checked = task.isCompleted;
  
  const taskTitle = document.createElement('p');
  taskTitle.textContent = task.title;
  taskTitle.classList.toggle("completed", task.isCompleted);
  taskTitle.style.width = '70%';
  taskTitle.style.cursor = 'text';

  const dragHandle = document.createElement('div');
  dragHandle.className = 'drag-handle';
  dragHandle.textContent = '☰';
  dragHandle.style.cursor = 'grab';
  
  const taskDeleteBtn = document.createElement('button');
  taskDeleteBtn.textContent = "Eliminar Tarea";
  taskDeleteBtn.className = 'delete-button';

  const printTaskBtn = document.createElement('button');
  printTaskBtn.innerHTML = '<i class="fa-solid fa-print"></i>';
  
  // const increasePositionTask = document.createElement('div');
  // increasePositionTask.className = 'increasePositionTask';
  // increasePositionTask.textContent = '🔺';
  
  // const decreasePositionTask = document.createElement('div');
  // decreasePositionTask.className = 'decreasePositionTask';
  // decreasePositionTask.textContent = '🔻';
  
  // const increasePositionTaskHandler = () => {
  //   const taskIndex = app.tasks.indexOf(task);
  //   if (taskIndex > -1) {
  //     if (taskIndex === task.length) {
  //       increasePositionTask.removeEventListener('click', increasePositionTaskHandler);
  //       increasePositionTask.className = 'disableIncreasePositionTask';
  //     }else{
  //       changeArrayPosition(tasks, taskIndex, taskIndex+1);
  //     }
      
  //     saveTaskToLocalStorage(app.tasks);
  //   }
  // };

  // const decreasePositionTaskHandler = () => {
  //   const taskIndex = app.tasks.indexOf(task);
  //   if (taskIndex > -1) {
  //     if (taskIndex === task.length) {
  //       increasePositionTask.removeEventListener('click', increasePositionTaskHandler);
  //       increasePositionTask.className = 'disableDecreasePositionTask';
  //     }else{
  //       changeArrayPosition(tasks, taskIndex, taskIndex-1);
  //     }
      
  //     saveTaskToLocalStorage(app.tasks);
  //   }
  // };
  
  // increasePositionTask.addEventListener('click', increasePositionTaskHandler);
  // decreasePositionTask.addEventListener('click', decreasePositionTaskHandler);
  
  const inputTaskText = document.createElement('input');

  taskTitle.addEventListener('dblclick', () => {
    inputTaskText.value = taskTitle.textContent;
    taskElement.replaceChild(inputTaskText, taskTitle);
  
    // Al presionar Enter, guardamos el cambio y volvemos a mostrar el texto
    inputTaskText.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const taskIndex = app.tasks.indexOf(task);
        if (taskIndex > -1) {
          app.tasks[taskIndex].title = inputTaskText.value;
          saveTaskToLocalStorage(app.tasks);
          renderTasks(app.tasks);

          // Reemplazamos el input con el título
          if (taskElement.contains(inputTaskText)) {
            taskElement.replaceChild(taskTitle, inputTaskText);
          }
        }
      }
    });

    // document.addEventListener('click', (e) => {
    //   // Verificamos si el clic fue fuera del inputTaskText
    //   if (e.target !== inputTaskText && !inputTaskText.contains(e.target)) {
    //     const taskIndex = app.tasks.indexOf(task);
    //     if (taskIndex > -1) {
    //       app.tasks[taskIndex].title = inputTaskText.value;
    //       saveTaskToLocalStorage(app.tasks);
    //       renderTasks(app.tasks);

    //       // Verificamos que el inputTaskText sea un hijo directo de taskElement antes de reemplazarlo
    //       if (taskElement.contains(inputTaskText)) {
    //         taskElement.replaceChild(taskTitle, inputTaskText);
    //       }
    //     }
    //   }
    // });
  });

  inputTaskText.addEventListener('keydown', e => {
    if (e.key === "Enter") {
      taskTitle.textContent = inputTaskText.value;
      taskElement.replaceChild(taskTitle, inputTaskText);
    }
  });
  
  taskDeleteBtn.addEventListener('click', () => {
    const taskIndex = app.tasks.indexOf(task);
    if (taskIndex > -1) {
      app.tasks.splice(taskIndex, 1)
      saveTaskToLocalStorage(app.tasks);
      loadTasksFromLocalStorage();
    }
  });
  
  taskCheckBox.addEventListener('change', () => {
    task.isCompleted ? task.isCompleted = false : task.isCompleted = true;
    taskTitle.classList.toggle("completed", task.isCompleted);
    saveTaskToLocalStorage(app.tasks);
    crearGrafico('.grafico-container', app.tasks);
    // console.log(app.tasks);
  });


  printTaskBtn.addEventListener('click', () => generatePdf(task));
  

  taskElement.appendChild(dragHandle);
  taskElement.appendChild(taskCheckBox);
  taskElement.appendChild(taskTitle);
  taskElement.appendChild(printTaskBtn);
  taskElement.appendChild(taskDeleteBtn);

  return taskElement;
}

// function changeArrayPosition(tasksArray, index, newIndex) {
//   if (index < 0 || newIndex < 0 || index >= tasksArray.length || newIndex >= tasksArray.length) {
//     // Verificar si los índices son válidos
//     console.log("Índices no válidos");
//     return;
//   }

//   const elemento = tasksArray.splice(index, 1)[0]; // Elimina el elemento en la posición actual y lo almacena
//   tasksArray.splice(newIndex, 0, elemento); // Inserta el elemento en la nueva posición

//   return tasksArray;
// }

function existTask() {
  if (localStorage.getItem('tasks')) {
    return !app.tasks.some(task => task.title === app.newTaskInput.value);
  }

  return true; // Si no hay tareas almacenadas, la tarea no existe
}

function saveTaskToLocalStorage(tasksArray) {
  localStorage.setItem('tasks', JSON.stringify(tasksArray));
}

function renderTasks(tasksArray) {
  app.tasksListUl.innerHTML = '';

  for (const task of tasksArray) {
    addTaskToList(task, app.tasksListUl);
  }
}

function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    app.tasks = JSON.parse(storedTasks);
    renderTasks(app.tasks);
  } else {
    saveTaskToLocalStorage(app.tasks);
  }
}

// ------ EVENTOS ------
generarEventoCalendarioBtn.addEventListener('click', () => generarEventoCalendario(app.tasks));

addTaskBtn.addEventListener('click', () => {
  console.log('hola');
});

app.newTaskInput.addEventListener('keydown', (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addTask();
  }
});

mostrarGraficoBtn.addEventListener('click', e => {
  e.preventDefault();
  crearGrafico('.grafico-container', app.tasks);
});

function busqueda(inputTextSearch) {
  inputTextSearch.addEventListener('keydown', e => {
    if (e.key === "Enter") {
  
      const searchTerm = inputTextSearch.value.trim().toLowerCase();
      const busqueda = app.tasks.filter(task => task.title.toLowerCase().includes(inputTextSearch.value.toLowerCase()))
  
      if(searchTerm === "") {
        renderTasks(app.tasks);  
      }else if(busqueda.length === 0) {
        renderTasks([]);
      }else{
        renderTasks(busqueda);
      }
  
      // inputTextSearch.value = "";
    }
  });
}

busqueda(inputTextSearch)

function init() {
  loadTasksFromLocalStorage();
}

// ------ INICIO DE LA APLICACIÓN ------
document.addEventListener("DOMContentLoaded", init);


// Para casa: 
//// 1. Realizar un método llamado saveTaskToLocalStorage que almacene en el LS el uuid, nombre de la tarea y true o false.
//// 2. Realizar un método llamado loadTasksFromLocalStorage que cargue del LS las tareas y las pinte.

//// Doble click sobre el title de la tarea me lanzará un prompt con el contenido de esa tarea pudiendo modificar solo el texto

// Añadir un btn al lado que me imprima en un pdf los siguiente datos: el id de la tarea, el texto de la tarea, si está completada o no, fecha actual en la que se imprime una tarea. 
// Utilizando Blob descargar el pdf a nuestro ordenador con el nombre: las 4 primeras letras del texto de la tarea_dia_mes_año.pdf

//// Pulsando el botón de la lupa e introduciendo cualquier texto a traves del evento enter me filtra las tareas las tareas cuyo texto tenga lo que hayamos buscado

// Btn al lado de mostrar gráfico llamado generarEventoCalendario tipo ics que al pulsarlo genere un evento del calendario que cuya fecha de inicio sea la fecha actual y cuya fecha de finalización sean 30 dias después y cuyo contenido sea el numero de tareas que tengo sin realizar
