import { Transaccion } from ".Transaccion.js";

export class LibroMayor {
  constructor() {
    this.transacciones = [];
  }

  agregarTransaccion(transaccion) {
    this.transacciones.push(transaccion);
  }

  eliminarTransaccion(index) {
    if (index >= 0 && index < this.transacciones.length) {
      this.transacciones.splice(index, 1);
    }
  }

  filtrarTransacciones(tipo) {
    return this.transacciones.filter(
      (transaccion) => transaccion.tipo === tipo
    );
  }

  buscarTransaccion(descripcion) {
    return this.transacciones.find((transaccion) =>
      transaccion.descripcion.includes(descripcion)
    );
  }

  obtenerSaldo() {
    return this.transacciones.reduce(
      (saldo, transaccion) =>
        transaccion.tipo === 1
          ? saldo + transaccion.monto
          : saldo - transaccion.monto,
      0
    );
  }

  mostrarTransacciones() {
    this.transacciones.forEach((transaccion) => {
      console.log(transaccion.detalles());
    });
  }

  obtenerTotales() {
    return this.transacciones.reduce(
      (totales, transaccion) => {
        if (transaccion.tipo === 1) {
          totales.totalEntradas += transaccion.monto;
        } else {
          totales.totalSalidas += transaccion.monto;
        }
        return totales;
      },
      { totalEntradas: 0, totalSalidas: 0 }
    );
  }

  ordenarPorFecha() {
    this.transacciones.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  }

  buscarPorMonto(monto) {
    return this.transacciones.filter(
      (transaccion) => transaccion.monto === monto
    );
  }
}
