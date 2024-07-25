export class Transaccion {
  constructor(tipo, monto, descripcion) {
    this.tipo = tipo; // 1 para 'entrada', 2 para 'salida'
    this.monto = monto;
    this.descripcion = descripcion;
    this.fecha = new Date();
  }

  detalles() {
    const tipoStr = this.tipo === 1 ? "entrada" : "salida";
    return `${this.fecha.toLocaleDateString("es-ES")} - ${tipoStr}: $${
      this.monto
    } - ${this.descripcion}`;
  }
}
