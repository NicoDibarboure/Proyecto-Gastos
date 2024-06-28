// * En este caso de entrega voy a utilizar esta funcion de verificar positivo para a futuro en mi App saber si el monto que indica el usuario es positivo o negativo para poder hacer las operaciones correspondientes. Los console logs luegos los retirare para dejar mas limpio el codigo.

montoTotal = 0;

let verificarPositivo = (numero) => {
  if (numero === 0) {
    console.log(`El número ${numero} es neutro`);
  } else if (numero > 0) {
    return (montoTotal += numero);
    console.log(`El número ${numero} es positivo`); // ? Tenia un console log para saber si el numero era positivo o negativo, solo para saber que el codigo pasaba por aqui.
  } else {
    return (montoTotal -= -numero); // ! En este caso si el numero es negativo lo que hago es restarle el signo - para que el monto total sea Negativo.
    console.log(`El número ${numero} es negativo`); // ? Tenia un console log para saber si el numero era positivo o negativo, solo para saber que el codigo pasaba por aqui. Pero al tener el return antes de este console log, nunca se va a ejecutar :).
  }
};

// * Ahora voy a generar un prompt preguntando cuantas operaciones va a realizar el usuario para saber cuantas vueltas va a dar nuestro ciclo for.

let cantidadOperaciones = Number(
  prompt("Ingrese la cantidad de operaciones que va a realizar: ")
);

// * Agrego un alert para que el usuario sepa como restar un monto en caso de que la operacion sea asi.

alert(
  `Para indicar un monto negativo debe colocar el signo - adelante del número.`
);

// * Ahora voy a generar un ciclo for para que el usuario pueda ingresar la cantidad de operaciones que indico en el prompt anterior.

for (let i = 0; i < cantidadOperaciones; i++) {
  verificarPositivo(Number(prompt("Ingrese el monto de la operacion: ")));
}

console.log(`El monto total es de: ${montoTotal}`);
