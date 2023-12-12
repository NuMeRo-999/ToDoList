import * as echarts from 'echarts';

export default function crearGrafico(selector, tasks) {
  const container = document.querySelector(selector);
  // Dimensiones del gráfico
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Datos del gráfico
  const datos = {
    categorias: ['Tareas completas', 'Tareas sin completar'],
    valores: [
      tasks.filter(task => task.isCompleted).length,
      tasks.filter(task => task.isCompleted === false).length,
    ]
  }

  const opciones =  {
    title: {
      text: 'Gráfico de tareas',
      subtext: 'Tareas',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: [
          { value: datos.valores[0], name: datos.categorias[0] },
          { value: datos.valores[1], name: datos.categorias[1] }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            // color: ['#73c0de', '#ea7ccc']
          }
        }
      }
    ]
  }
  
  let miGrafico = echarts.init(container);
  miGrafico.resize({width, height});
  miGrafico.setOption(opciones);
 
  return miGrafico;
}