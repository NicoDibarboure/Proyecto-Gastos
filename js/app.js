// Solicito al usuario la cantidad de operaciones a realizar
const cantidadOperaciones = Number(
  prompt("Ingrese la cantidad de operaciones que va a realizar: ")
);

// Instrucciones para el usuario
alert(
  `Para indicar una entrada, ingrese 1.\nPara indicar una salida, ingrese 2.\nPara indicar un monto negativo debe colocar el signo - adelante del número.`
);

// Clase para representar una transacción
class Transaccion {
  constructor(tipo, monto, descripcion) {
    this.tipo = tipo; // 1 para 'entrada', 2 para 'salida'
    this.monto = monto;
    this.descripcion = descripcion;
    this.fecha = new Date(); // Fecha de la transacción
  }

  // Método para obtener los detalles de la transacción
  detalles() {
    const tipoStr = this.tipo === 1 ? "entrada" : "salida";
    return `${this.fecha.toLocaleDateString()} - ${tipoStr}: $${this.monto} - ${
      this.descripcion
    }`;
  }
}

// Clase para gestionar el libro mayor de transacciones
class LibroMayor {
  constructor() {
    this.transacciones = [];
  }

  // Agrega una nueva transacción
  agregarTransaccion(transaccion) {
    this.transacciones.push(transaccion);
  }

  // Elimina una transacción por índice
  eliminarTransaccion(index) {
    if (index >= 0 && index < this.transacciones.length) {
      this.transacciones.splice(index, 1);
    }
  }

  // Filtra las transacciones por tipo (1 para entrada, 2 para salida)
  filtrarTransacciones(tipo) {
    return this.transacciones.filter(
      (transaccion) => transaccion.tipo === tipo
    );
  }

  // Busca una transacción por descripción
  buscarTransaccion(descripcion) {
    return this.transacciones.find((transaccion) =>
      transaccion.descripcion.includes(descripcion)
    );
  }

  // Calcula el saldo total
  obtenerSaldo() {
    return this.transacciones.reduce((saldo, transaccion) => {
      return transaccion.tipo === 1
        ? saldo + transaccion.monto
        : saldo - transaccion.monto;
    }, 0);
  }

  // Muestra todas las transacciones en consola
  mostrarTransacciones() {
    this.transacciones.forEach((transaccion) => {
      console.log(transaccion.detalles());
    });
  }

  // Obtiene los totales de entradas y salidas
  obtenerTotales() {
    let totalEntradas = this.transacciones
      .filter((t) => t.tipo === 1)
      .reduce((acc, t) => acc + t.monto, 0);
    let totalSalidas = this.transacciones
      .filter((t) => t.tipo === 2)
      .reduce((acc, t) => acc + t.monto, 0);
    return { totalEntradas, totalSalidas };
  }

  // Ordena las transacciones por fecha
  ordenarPorFecha() {
    this.transacciones.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  }

  // Busca transacciones por monto exacto
  buscarPorMonto(monto) {
    return this.transacciones.filter(
      (transaccion) => transaccion.monto === monto
    );
  }
}

// Crear una instancia de LibroMayor
const libroMayor = new LibroMayor();

// Validar cantidad de operaciones ingresadas
if (isNaN(cantidadOperaciones) || cantidadOperaciones <= 0) {
  alert(
    "Cantidad de operaciones inválida. Por favor, ingrese un número positivo."
  );
} else {
  // Solicitar al usuario los detalles de cada operación
  for (let i = 0; i < cantidadOperaciones; i++) {
    const tipo = parseInt(
      prompt("Ingrese el tipo de transacción (1 para entrada, 2 para salida):"),
      10
    );
    if (tipo !== 1 && tipo !== 2) {
      alert("Tipo de transacción inválido. Por favor, ingrese 1 o 2.");
      i--; // Volver a pedir los datos de esta operación
      continue;
    }

    const monto = parseFloat(prompt("Ingrese el monto de la transacción:"));
    if (isNaN(monto)) {
      alert("Monto inválido. Por favor, ingrese un número.");
      i--; // Volver a pedir los datos de esta operación
      continue;
    }

    const descripcion = prompt("Ingrese una descripción para la transacción:");
    if (!descripcion || descripcion.trim() === "") {
      alert("Descripción inválida. Por favor, ingrese una descripción.");
      i--; // Volver a pedir los datos de esta operación
      continue;
    }

    // Crear una nueva transacción y agregarla al libro mayor
    const nuevaTransaccion = new Transaccion(tipo, monto, descripcion);
    libroMayor.agregarTransaccion(nuevaTransaccion);
  }

  // Ordenar transacciones por fecha y mostrarlas en consola
  libroMayor.ordenarPorFecha();
  libroMayor.mostrarTransacciones();

  // Mostrar totales y saldo actual
  const totales = libroMayor.obtenerTotales();
  console.log(
    `Total Entradas: $${totales.totalEntradas}, Total Salidas: $${totales.totalSalidas}`
  );
  console.log("Saldo Actual:", libroMayor.obtenerSaldo());

  // Agrupar y calcular máximos de transacciones por mes
  function agruparYCalcularMaximos(transacciones) {
    return transacciones.reduce((grupos, transaccion) => {
      // Obtengo el año y el mes de la transacción
      const fecha = new Date(transaccion.fecha);
      const mes = `${fecha.getFullYear()}-${(
        "0" +
        (fecha.getMonth() + 1)
      ).slice(-2)}`;

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
      if (
        transaccion.tipo === 1 &&
        transaccion.monto > grupos[mes].ingresoMax
      ) {
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

  // Accedemos a los ingresos y gastos más altos de un mes específico
  for (const mes in transaccionesPorMesConMaximos) {
    const { ingresoMax, gastoMax } = transaccionesPorMesConMaximos[mes];
    console.log(
      `Mes: ${mes}, Ingreso Máximo: $${ingresoMax}, Gasto Máximo: $${gastoMax}`
    );
  }

  // Muestro al final el objeto con los grupos y los máximos
  console.log(transaccionesPorMesConMaximos);
}
