import { createEvents } from 'ics';

export default function generarEventoCalendario(tasks) {
  // Obtén la fecha actual
  const fechaInicio = new Date();

  // Calcula la fecha de finalización (30 días después)
  const fechaFinalizacion = new Date();
  fechaFinalizacion.setDate(fechaInicio.getDate() + 30);

  // Obtén el número de tareas sin realizar (ajusta esto según tu lógica)
  const numeroTareasSinRealizar = tasks.filter(task => !task.isCompleted).length;

  // Crea el evento de calendario
  const eventoCalendario = {
    start: [fechaInicio.getFullYear(), fechaInicio.getMonth() + 1, fechaInicio.getDate()],
    end: [fechaFinalizacion.getFullYear(), fechaFinalizacion.getMonth() + 1, fechaFinalizacion.getDate()],
    title: `Tareas Pendientes: ${numeroTareasSinRealizar}`,
    description: 'Descripción del evento de calendario',
    status: 'CONFIRMED',
  };

  // Añade el evento al array de eventos
  const eventos = [eventoCalendario];

  // Genera el archivo iCalendar
  const { error, value } = createEvents(eventos);

  if (error) {
    console.error('Error al generar el archivo iCalendar:', error);
    return;
  }

  // Crea un Blob (objeto binario) con el contenido del archivo iCalendar
  const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });

  // Crea un enlace de descarga y simula un clic en él para iniciar la descarga
  const enlaceDescarga = document.createElement('a');
  enlaceDescarga.href = window.URL.createObjectURL(blob);
  enlaceDescarga.download = 'evento_calendario.ics';
  enlaceDescarga.click();
}
