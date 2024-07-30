import { LibroMayor } from "./LibroMayor.js";

const libroMayor = new LibroMayor();

let graficoGastos = null;

function actualizarGraficoGastos() {
  const ctx = document.getElementById("grafico-gastos").getContext("2d");
  if (!ctx) {
    console.error("El elemento del gráfico no se encuentra en el DOM.");
  }
  const categorias = [];
  const montos = [];

  libroMayor.transacciones.forEach((transaccion) => {
    const index = categorias.indexOf(transaccion.categoria);
    if (index >= 0) {
      montos[index] += transaccion.monto;
    } else {
      categorias.push(transaccion.categoria);
      montos.push(transaccion.monto);
    }
  });

  const colores = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#FF9F40",
    "#4BC0C0",
    "#9966FF",
    "#FF6384",
    "#36A2EB",
  ];

  if (graficoGastos) {
    graficoGastos.data.labels = categorias;
    graficoGastos.data.datasets[0].data = montos;
    graficoGastos.data.datasets[0].backgroundColor = colores.slice(
      0,
      categorias.length
    );
    graficoGastos.update();
  } else {
    graficoGastos = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: categorias,
        datasets: [
          {
            label: "Gastos por Categoría",
            data: montos,
            backgroundColor: colores.slice(0, categorias.length),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
}

window.actualizarGraficoGastos = actualizarGraficoGastos;

document.addEventListener("DOMContentLoaded", actualizarGraficoGastos);
