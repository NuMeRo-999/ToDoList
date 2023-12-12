// Que le pase como parametro el texto que quiero mostrar y como segundo el elemento del dom en donde lo quiero mostrar de tal forma cuando inserte una tarea cuyo nombre exista mostrará un error debajo del input cuya duración sea de 3s

export default function mostrarError(msg, selector) {

  const el = document.querySelector(selector);

  const errorContainer = document.createElement('div');
  errorContainer.className = 'error-container';

  const errorContainerIcon = document.createElement('i');
  errorContainerIcon.className = 'fa-solid fa-circle-xmark';

  const errorContainerText = document.createElement('span');
  errorContainerText.textContent = 'ERROR: '+msg;

  errorContainer.appendChild(errorContainerIcon);
  errorContainer.appendChild(errorContainerText);
  el.appendChild(errorContainer);

  setTimeout(() => {
    errorContainer.style.display = 'none';
  }, 3000);
}