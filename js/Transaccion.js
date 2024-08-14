export class Transaccion {
  constructor(tipo, monto, descripcion) {
    this.tipo = tipo;
    this.monto = monto;
    this.descripcion = descripcion;
    this.fecha = new Date().toISOString();
  }

  detalles() {
    const { tipo, monto, descripcion, fecha } = this;
    const tipoStr = tipo === 1 ? "entrada" : "salida";
    return `${fecha.toLocaleDateString(
      "es-ES"
    )} - ${tipoStr}: $${monto} - ${descripcion}`;
  }
}
