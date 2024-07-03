// * En este caso de entrega voy a utilizar esta función de verificar positivo para a futuro en mi App saber si el monto que indica el usuario es positivo o negativo para poder hacer las operaciones correspondientes. Los console logs luego los retiraré para dejar más limpio el código.

let montoTotal = 0;

let verificarPositivo = (numero) => {
  if (numero === 0) {
    console.log(`El número ${numero} es neutro`);
  } else if (numero > 0) {
    return (montoTotal += numero);
  } else {
    return (montoTotal -= -numero); // ! En este caso si el número es negativo lo que hago es restarle el signo - para que el monto total sea negativo.
  }
};

// * Ahora voy a generar un prompt preguntando cuántas operaciones va a realizar el usuario para saber cuántas vueltas va a dar nuestro ciclo for.

let cantidadOperaciones = Number(
  prompt("Ingrese la cantidad de operaciones que va a realizar: ")
);

// * Agrego un alert para que el usuario sepa cómo restar un monto en caso de que la operación sea así.

alert(
  `Para indicar un monto negativo debe colocar el signo - adelante del número.`
);

// * Clases y Constructores

// 1. Clase de Transacción: Representará cada entrada o salida de dinero.
// 2. Clase de Libro Mayor: Gestionará todas las transacciones y realizará cálculos como el saldo total.

// TODO Clase Transacción

class Transaccion {
  constructor(tipo, monto, descripcion) {
    this.tipo = tipo; // 'entrada' o 'salida'
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

// TODO Clase Libro Mayor

class LibroMayor {
  constructor() {
    this.transacciones = [];
  }

  agregarTransaccion(transaccion) {
    this.transacciones.push(transaccion);
  }

  obtenerSaldo() {
    return this.transacciones.reduce((saldo, transaccion) => {
      if (transaccion.tipo === "entrada") {
        return saldo + transaccion.monto;
      } else if (transaccion.tipo === "salida") {
        return saldo - transaccion.monto;
      }
    }, 0);
  }

  mostrarTransacciones() {
    this.transacciones.forEach((transaccion) => {
      console.log(transaccion.detalles());
    });
  }
}

// TODO Uso de las Clases

// Crear el libro mayor
const libroMayor = new LibroMayor();

// Solicitar y agregar múltiples transacciones basadas en la cantidad de operaciones ingresada por el usuario
for (let i = 0; i < cantidadOperaciones; i++) {
  let tipo = prompt("Ingrese el tipo de transacción (entrada o salida):");
  let monto = parseFloat(prompt("Ingrese el monto de la transacción:"));
  let descripcion = prompt("Ingrese una descripción para la transacción:");

  let nuevaTransaccion = new Transaccion(tipo, monto, descripcion);
  libroMayor.agregarTransaccion(nuevaTransaccion);

  verificarPositivo(monto);
}

// Mostrar todas las transacciones
libroMayor.mostrarTransacciones();

// Obtener y mostrar el saldo actual
console.log("Saldo Actual:", libroMayor.obtenerSaldo());
console.log(`El monto total es de: ${montoTotal}`);
