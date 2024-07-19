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
  if (tipo !== 1 && tipo !== 2) {
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

const totales = libroMayor.obtenerTotales();
console.log(
  `Total Entradas: $${totales.totalEntradas}, Total Salidas: $${totales.totalSalidas}`
);
console.log("Saldo Actual:", libroMayor.obtenerSaldo());

function agruparYCalcularMaximos(transacciones) {
  return transacciones.reduce((grupos, transaccion) => {
    // Obtengo el año y el mes de la transacción
    const fecha = new Date(transaccion.fecha);
    const mes = `${fecha.getFullYear()}-${("0" + (fecha.getMonth() + 1)).slice(
      -2
    )}`;

    // Si el grupo para el mes no existe, lo creo
    if (!grupos[mes]) {
      grupos[mes] = {
        transacciones: [],
        ingresoMax: -Infinity,
        gastoMax: -Infinity,
      };
    }

    // Añado la transacción al grupo correspondiente
    grupos[mes].transacciones.push(transaccion);

    // Actualizo el ingreso máximo si es una entrada (tipo 1)
    if (transaccion.tipo === 1 && transaccion.monto > grupos[mes].ingresoMax) {
      grupos[mes].ingresoMax = transaccion.monto;
    }

    // Actualizo el gasto máximo si es una salida (tipo 2)
    if (transaccion.tipo === 2 && transaccion.monto > grupos[mes].gastoMax) {
      grupos[mes].gastoMax = transaccion.monto;
    }

    return grupos;
  }, {});
}

// Uso la función con el conjunto de transacciones
const transaccionesPorMesConMaximos = agruparYCalcularMaximos(
  libroMayor.transacciones
);

console.log(transaccionesPorMesConMaximos);

// Accedemos a los ingresos y gastos más altos de un mes específico
for (const mes in transaccionesPorMesConMaximos) {
  const { ingresoMax, gastoMax } = transaccionesPorMesConMaximos[mes];
  console.log(
    `Mes: ${mes}, Ingreso Máximo: $${ingresoMax}, Gasto Máximo: $${gastoMax}`
  );
}
