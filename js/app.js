let montoTotal = 0;

const verificarPositivo = (numero) => {
  if (numero === 0) {
    console.log(`El número ${numero} es neutro`);
  } else if (numero > 0) {
    montoTotal += numero;
  } else {
    montoTotal += numero; // Sumar directamente el número negativo
  }
};

const cantidadOperaciones = Number(
  prompt("Ingrese la cantidad de operaciones que va a realizar: ")
);

alert(
  `Para indicar un monto negativo debe colocar el signo - adelante del número.`
);

class Transaccion {
  constructor(tipo, monto, descripcion) {
    this.tipo = tipo;
    this.monto = monto;
    this.descripcion = descripcion;
    this.fecha = new Date();
  }

  detalles() {
    return `${this.fecha.toLocaleDateString()} - ${this.tipo.toLowerCase()}: $${
      this.monto
    } - ${this.descripcion}`;
  }
}

class LibroMayor {
  constructor() {
    this.transacciones = [];
  }

  agregarTransaccion(transaccion) {
    this.transacciones.push(transaccion);
  }

  obtenerSaldo() {
    return this.transacciones.reduce((saldo, transaccion) => {
      return transaccion.tipo === "entrada"
        ? saldo + transaccion.monto
        : saldo - transaccion.monto;
    }, 0);
  }

  mostrarTransacciones() {
    this.transacciones.forEach((transaccion) => {
      console.log(transaccion.detalles());
    });
  }
}

const libroMayor = new LibroMayor();

for (let i = 0; i < cantidadOperaciones; i++) {
  const tipo = prompt("Ingrese el tipo de transacción (entrada o salida):");
  const monto = parseFloat(prompt("Ingrese el monto de la transacción:"));
  const descripcion = prompt("Ingrese una descripción para la transacción:");

  const nuevaTransaccion = new Transaccion(tipo, monto, descripcion);
  libroMayor.agregarTransaccion(nuevaTransaccion);

  verificarPositivo(monto);
}

libroMayor.mostrarTransacciones();
console.log("Saldo Actual:", libroMayor.obtenerSaldo());
console.log(`El monto total es de: ${montoTotal}`);
