class Transaccion {
  constructor(tipo, monto, descripcion) {
    this.tipo = tipo;
    this.monto = monto;
    this.descripcion = descripcion;
    this.fecha = new Date();
  }
}

class LibroMayor {
  constructor() {
    // Cargo transacciones desde LocalStorage si existen
    this.transacciones = this.cargarTransacciones() || [];
  }

  agregarTransaccion(transaccion) {
    this.transacciones.push(transaccion);
    this.guardarTransacciones();
  }

  eliminarTransaccion(index) {
    this.transacciones.splice(index, 1);
    this.guardarTransacciones();
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

  guardarTransacciones() {
    localStorage.setItem("transacciones", JSON.stringify(this.transacciones));
  }

  cargarTransacciones() {
    const transacciones = JSON.parse(localStorage.getItem("transacciones"));
    if (transacciones) {
      return transacciones.map((transaccion) => {
        const obj = Object.assign(new Transaccion(), transaccion);
        obj.fecha = new Date(transaccion.fecha); // Asegúrate de que fecha sea un objeto Date
        return obj;
      });
    }
    return [];
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
    celdaMonto.textContent = `$${transaccion.monto.toLocaleString("de-DE")}`;
    if (transaccion.tipo === 2) {
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

    // Nueva celda para la fecha
    const celdaFecha = document.createElement("td");
    celdaFecha.textContent = transaccion.fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    fila.appendChild(celdaCategoria);
    fila.appendChild(celdaMonto);
    fila.appendChild(celdaAcciones);
    fila.appendChild(celdaFecha);
    listaGastos.appendChild(fila);
  });
}

// Variables para guardar el estado de orden
let ordenCategoriaAscendente = true;
let ordenMontoAscendente = true;
let ordenFechaAscendente = true;

// Función para ordenar las transacciones por un campo específico
function ordenarTransacciones(campo, ascendente) {
  libroMayor.transacciones.sort((a, b) => {
    if (campo === "categoria") {
      return ascendente
        ? a.descripcion.localeCompare(b.descripcion)
        : b.descripcion.localeCompare(a.descripcion);
    } else if (campo === "monto") {
      return ascendente ? a.monto - b.monto : b.monto - a.monto;
    } else if (campo === "fecha") {
      return ascendente
        ? new Date(a.fecha) - new Date(b.fecha)
        : new Date(b.fecha) - new Date(a.fecha);
    }
  });

  actualizarTabla();
}

// Añadir los eventos a los encabezados de la tabla
document.getElementById("sort-categoria").addEventListener("click", () => {
  ordenarTransacciones("categoria", ordenCategoriaAscendente);
  ordenCategoriaAscendente = !ordenCategoriaAscendente; // Alternar estado
});

document.getElementById("sort-monto").addEventListener("click", () => {
  ordenarTransacciones("monto", ordenMontoAscendente);
  ordenMontoAscendente = !ordenMontoAscendente; // Alternar estado
});

document.getElementById("sort-fecha").addEventListener("click", () => {
  ordenarTransacciones("fecha", ordenFechaAscendente);
  ordenFechaAscendente = !ordenFechaAscendente; // Alternar estado
});

function actualizarTotales() {
  const totales = libroMayor.obtenerTotales();
  const saldoActual = libroMayor.obtenerSaldo();

  const totalesElement = document.getElementById("totales");

  if (totalesElement) {
    totalesElement.textContent = `Total Entradas: $${totales.totalEntradas.toLocaleString(
      "de-DE"
    )}, 
      Total Salidas: $${totales.totalSalidas.toLocaleString("de-DE")}, 
      Saldo Actual: $${saldoActual.toLocaleString("de-DE")}`;
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

// Inicializo tabla y totales al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  actualizarTabla();
  actualizarTotales();
});
