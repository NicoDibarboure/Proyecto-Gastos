export class Transaccion {
  constructor(tipo, monto, descripcion) {
    this.tipo = tipo; // 1 para 'entrada', 2 para 'salida'
    this.monto = monto;
    this.descripcion = descripcion;
    this.fecha = new Date();
  }

  detalles() {
    const { tipo, monto, descripcion, fecha } = this;
    const tipoStr = tipo === 1 ? "entrada" : "salida";
    return `${fecha.toLocaleDateString(
      "es-ES"
    )} - ${tipoStr}: $${monto} - ${descripcion}`;
  }
}
