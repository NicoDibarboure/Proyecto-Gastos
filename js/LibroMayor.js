import { Transaccion } from "./Transaccion.js";

export class LibroMayor {
  constructor() {
    this.transacciones = this.cargarTransacciones() || [];
  }

  agregarTransaccion(transaccion) {
    this.transacciones.push(transaccion);
    this.guardarTransacciones();
    if (typeof window.actualizarGraficoGastos === "function") {
      window.actualizarGraficoGastos();
    }
  }

  eliminarTransaccion(index) {
    if (index >= 0 && index < this.transacciones.length) {
      this.transacciones.splice(index, 1);
      this.guardarTransacciones();
      if (typeof window.actualizarGraficoGastos === "function") {
        window.actualizarGraficoGastos();
      }
    }
  }

  filtrarTransacciones(tipo) {
    return this.transacciones.filter(
      ({ tipo: transaccionTipo }) => transaccionTipo === tipo
    );
  }

  buscarTransaccion(descripcion) {
    return this.transacciones.find(({ descripcion: transaccionDescripcion }) =>
      transaccionDescripcion.includes(descripcion)
    );
  }

  obtenerSaldo() {
    return this.transacciones.reduce(
      (saldo, { tipo, monto }) => (tipo === 1 ? saldo + monto : saldo - monto),
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
      (totales, { tipo, monto }) => {
        if (tipo === 1) {
          totales.totalEntradas += monto;
        } else {
          totales.totalSalidas += monto;
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
      ({ monto: transaccionMonto }) => transaccionMonto === monto
    );
  }

  cargarTransacciones() {
    return JSON.parse(localStorage.getItem("transacciones")) || [];
  }

  guardarTransacciones() {
    localStorage.setItem("transacciones", JSON.stringify(this.transacciones));
  }
}
