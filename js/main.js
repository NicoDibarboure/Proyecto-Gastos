import { Transaccion } from "./Transaccion.js";
import { LibroMayor } from "./LibroMayor.js";

const cantidadOperaciones = Number(
  prompt("Ingrese la cantidad de operaciones que va a realizar: ")
);

alert(
  `Para indicar una entrada, ingrese 1. Para indicar una salida, ingrese 2.\nPara indicar un monto negativo debe colocar el signo - adelante del número.`
);

const libroMayor = new LibroMayor();

for (let i = 0; i < cantidadOperaciones; i++) {
  const tipo = parseInt(
    prompt("Ingrese el tipo de transacción (1 para entrada, 2 para salida):"),
    10
  );
  if (![1, 2].includes(tipo)) {
    alert("Tipo de transacción inválido. Por favor, ingrese 1 o 2.");
    continue;
  }

  const monto = parseFloat(prompt("Ingrese el monto de la transacción:"));
  if (isNaN(monto)) {
    alert("Monto inválido. Por favor, ingrese un número.");
    continue;
  }

  const descripcion = prompt("Ingrese una descripción para la transacción:");

  const nuevaTransaccion = new Transaccion(tipo, monto, descripcion);
  libroMayor.agregarTransaccion(nuevaTransaccion);
}

libroMayor.ordenarPorFecha();
libroMayor.mostrarTransacciones();

// const totales = libroMayor.obtenerTotales();
// console.log(
//   `Total Entradas: $${totales.totalEntradas}, Total Salidas: $${totales.totalSalidas}`
// );
// console.log("Saldo Actual:", libroMayor.obtenerSaldo());

const agruparYCalcularMaximos = (transacciones) => {
  return transacciones.reduce((grupos, transaccion) => {
    const fecha = new Date(transaccion.fecha);
    const mes = `${fecha.getFullYear()}-${("0" + (fecha.getMonth() + 1)).slice(
      -2
    )}`;

    if (!grupos[mes]) {
      grupos[mes] = {
        transacciones: [],
        ingresoMax: -Infinity,
        gastoMax: -Infinity,
      };
    }

    grupos[mes].transacciones.push(transaccion);

    if (transaccion.tipo === 1 && transaccion.monto > grupos[mes].ingresoMax) {
      grupos[mes].ingresoMax = transaccion.monto;
    }

    if (transaccion.tipo === 2 && transaccion.monto > grupos[mes].gastoMax) {
      grupos[mes].gastoMax = transaccion.monto;
    }

    return grupos;
  }, {});
};

const transaccionesPorMesConMaximos = agruparYCalcularMaximos(
  libroMayor.transacciones
);

console.log(transaccionesPorMesConMaximos);

for (const mes in transaccionesPorMesConMaximos) {
  const { ingresoMax, gastoMax } = transaccionesPorMesConMaximos[mes];
  console.log(
    `Mes: ${mes}, Ingreso Máximo: $${ingresoMax}, Gasto Máximo: $${gastoMax}`
  );
}

// * Interactuando con el DOM

document
  .getElementById("formulario-gastos")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const categoria = document.getElementById("categoria").value;
    const monto = parseFloat(document.getElementById("precio").value);

    if (!categoria || isNaN(monto)) {
      alert("Por favor, ingrese una categoría y un monto válido.");
      return;
    }

    const nuevaTransaccion = new Transaccion(2, monto, categoria);
    libroMayor.agregarTransaccion(nuevaTransaccion);
    actualizarTabla();
    actualizarTotales();

    document.getElementById("categoria").value = "";
    document.getElementById("precio").value = "";
  });

function actualizarTabla() {
  const listaGastos = document.getElementById("expenses-list");
  listaGastos.innerHTML = "";

  libroMayor.transacciones.forEach((transaccion, index) => {
    const fila = document.createElement("tr");

    const celdaCategoria = document.createElement("td");
    celdaCategoria.textContent = transaccion.descripcion;

    const celdaMonto = document.createElement("td");
    celdaMonto.textContent = `$${transaccion.monto.toFixed(2)}`;

    const celdaAcciones = document.createElement("td");
    const botonEditar = document.createElement("button");
    botonEditar.textContent = "Editar";
    botonEditar.classList.add("edit-button");
    botonEditar.addEventListener("click", () => editarTransaccion(index));

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.classList.add("delete-button");
    botonEliminar.addEventListener("click", () => eliminarTransaccion(index));

    celdaAcciones.appendChild(botonEditar);
    celdaAcciones.appendChild(botonEliminar);

    fila.appendChild(celdaCategoria);
    fila.appendChild(celdaMonto);
    fila.appendChild(celdaAcciones);

    listaGastos.appendChild(fila);
  });
}

function actualizarTotales() {
  const totales = libroMayor.obtenerTotales();
  console.log(
    `Total Entradas: $${totales.totalEntradas}, Total Salidas: $${totales.totalSalidas}`
  );
  console.log("Saldo Actual:", libroMayor.obtenerSaldo());
}
function editarTransaccion(index) {
  const transaccion = libroMayor.transacciones[index];

  // Pre-rellenar el formulario con los datos de la transacción a editar
  document.getElementById("categoria").value = transaccion.descripcion;
  document.getElementById("precio").value = transaccion.monto;

  // Cambiar el texto del botón de agregar a "Actualizar"
  const botonAgregar = document.querySelector(
    '#formulario-gastos button[type="submit"]'
  );
  botonAgregar.textContent = "Actualizar";

  // Cambiar el manejador del evento submit para que actualice en lugar de agregar
  const formulario = document.getElementById("formulario-gastos");
  formulario.onsubmit = function (event) {
    event.preventDefault();

    const nuevaDescripcion = document.getElementById("categoria").value;
    const nuevoMonto = parseFloat(document.getElementById("precio").value);

    if (!nuevaDescripcion || isNaN(nuevoMonto)) {
      alert("Por favor, ingrese una categoría y un monto válido.");
      return;
    }

    // Actualizar los datos de la transacción
    transaccion.descripcion = nuevaDescripcion;
    transaccion.monto = nuevoMonto;

    // Volver el formulario a su estado inicial
    formulario.reset();
    botonAgregar.textContent = "Agregar Gasto";
    formulario.onsubmit = agregarTransaccion;

    // Actualizar la tabla y los totales
    actualizarTabla();
    actualizarTotales();
  };
}

function eliminarTransaccion(index) {
  libroMayor.eliminarTransaccion(index);
  actualizarTabla();
  actualizarTotales();
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarTabla();
  actualizarTotales();
});
