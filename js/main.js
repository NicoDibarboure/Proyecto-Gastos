class Transaccion {
  constructor(tipo, monto, descripcion) {
    this.tipo = tipo;
    this.monto = monto;
    this.descripcion = descripcion;
  }
}

class LibroMayor {
  constructor() {
    this.transacciones = [];
  }

  agregarTransaccion(transaccion) {
    this.transacciones.push(transaccion);
  }

  eliminarTransaccion(index) {
    this.transacciones.splice(index, 1);
  }

  obtenerTotales() {
    let totalEntradas = 0;
    let totalSalidas = 0;

    this.transacciones.forEach((transaccion) => {
      if (transaccion.tipo === 1) {
        totalEntradas += transaccion.monto;
      } else {
        totalSalidas += transaccion.monto;
      }
    });

    return { totalEntradas, totalSalidas };
  }

  obtenerSaldo() {
    const { totalEntradas, totalSalidas } = this.obtenerTotales();
    return totalEntradas - totalSalidas;
  }
}

const libroMayor = new LibroMayor();

document
  .getElementById("formulario-gastos")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const categoria = document.getElementById("categoria").value.trim();
    const monto = parseFloat(document.getElementById("precio").value.trim());

    if (!categoria) {
      mostrarMensaje("Por favor, ingrese una categoría válida.", "error");
      return;
    }

    if (isNaN(monto) || monto <= 0) {
      mostrarMensaje("Por favor, ingrese un monto válido y positivo.", "error");
      return;
    }

    const tipo = document.querySelector('input[name="radio"]:checked').value;

    const nuevaTransaccion = new Transaccion(parseInt(tipo), monto, categoria);
    libroMayor.agregarTransaccion(nuevaTransaccion);
    actualizarTabla();
    actualizarTotales();

    document.getElementById("categoria").value = "";
    document.getElementById("precio").value = "";

    mostrarMensaje("Transacción añadida exitosamente", "success");
  });

function mostrarMensaje(mensaje, tipo) {
  const mensajeDiv = document.createElement("div");
  mensajeDiv.className = `mensaje ${tipo}`;
  mensajeDiv.textContent = mensaje;

  const mensajeElement = document.getElementById("mensaje");

  if (mensajeElement) {
    mensajeElement.appendChild(mensajeDiv);

    setTimeout(() => {
      mensajeDiv.remove();
    }, 3000);
  } else {
    console.error('Elemento con ID "mensaje" no encontrado.');
  }
}

function actualizarTabla() {
  const listaGastos = document.getElementById("expenses-list");
  listaGastos.innerHTML = "";

  libroMayor.transacciones.forEach((transaccion, index) => {
    const fila = document.createElement("tr");

    const celdaCategoria = document.createElement("td");
    celdaCategoria.textContent = transaccion.descripcion;

    const celdaMonto = document.createElement("td");
    celdaMonto.textContent = `$${transaccion.monto.toFixed(2)}`;

    // Aplica la clase CSS dependiendo del tipo de transacción
    if (transaccion.tipo === 2) {
      // Tipo 2 es una salida
      celdaMonto.classList.add("monto-salida");
    }

    const celdaAcciones = document.createElement("td");
    const botonEditar = document.createElement("button");
    botonEditar.classList.add("edit-button");
    botonEditar.addEventListener("click", () => editarTransaccion(index));

    const botonEliminar = document.createElement("button");
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
  const saldoActual = libroMayor.obtenerSaldo();

  const totalesElement = document.getElementById("totales");

  if (totalesElement) {
    totalesElement.textContent = `Total Entradas: $${totales.totalEntradas.toFixed(
      2
    )}, 
      Total Salidas: $${totales.totalSalidas.toFixed(2)}, 
      Saldo Actual: $${saldoActual.toFixed(2)}`;
  } else {
    console.error('Elemento con ID "totales" no encontrado.');
  }
}

function editarTransaccion(index) {
  const transaccion = libroMayor.transacciones[index];
  document.getElementById("categoria").value = transaccion.descripcion;
  document.getElementById("precio").value = transaccion.monto;
  document.querySelector(
    `input[name="radio"][value="${transaccion.tipo}"]`
  ).checked = true;

  libroMayor.eliminarTransaccion(index);
  actualizarTabla();
  actualizarTotales();
}

function eliminarTransaccion(index) {
  libroMayor.eliminarTransaccion(index);
  actualizarTabla();
  actualizarTotales();
  mostrarMensaje("Transacción eliminada exitosamente", "success");
}
