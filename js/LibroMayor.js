import { Transaccion } from "./Transaccion.js";

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
    return this.transacciones.reduce((saldo, transaccion) => {
      return transaccion.tipo === 1
        ? saldo + transaccion.monto
        : saldo - transaccion.monto;
    }, 0);
  }

  mostrarTransacciones() {
    this.transacciones.forEach((transaccion) => {
      console.log(transaccion.detalles());
    });
  }

  obtenerTotales() {
    let totalEntradas = this.transacciones
      .filter((t) => t.tipo === 1)
      .reduce((acc, t) => acc + t.monto, 0);
    let totalSalidas = this.transacciones
      .filter((t) => t.tipo === 2)
      .reduce((acc, t) => acc + t.monto, 0);
    return { totalEntradas, totalSalidas };
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
