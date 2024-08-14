import { Transaccion } from "./Transaccion.js";

export class LibroMayor {
  constructor() {
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

    this.transacciones.forEach(({ tipo, monto }) => {
      if (tipo === 1) {
        totalEntradas += monto;
      } else {
        totalSalidas += monto;
      }
    });

    return { totalEntradas, totalSalidas };
  }

  obtenerSaldo() {
    const { totalEntradas, totalSalidas } = this.obtenerTotales();
    return totalEntradas - totalSalidas;
  }

  guardarTransacciones() {
    localStorage.setItem(
      "transacciones",
      JSON.stringify(
        this.transacciones.map(
          ({ tipo, monto, descripcion, categoria, fecha }) => ({
            tipo,
            monto,
            descripcion,
            categoria,
            fecha: fecha ? fecha.toISOString() : new Date().toISOString(), // Manejo de fecha
          })
        )
      )
    );
  }

  cargarTransacciones() {
    const transacciones = JSON.parse(localStorage.getItem("transacciones"));
    if (transacciones) {
      return transacciones.map((transaccion) => {
        const obj = Object.assign(new Transaccion(), transaccion);
        obj.fecha = new Date(transaccion.fecha);
        return obj;
      });
    }
    return [];
  }
}
