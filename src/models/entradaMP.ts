export class ProveedorLoteProducto {
    constructor(
      public id: number,
      public numlote_proveedor: string,
      public fecha_entrada: Date,
      public fecha_caducidad: Date,
      public cantidad_inicial: number,
      public tipo_medida:string,
      public cantidad_remanente:number,
      public doc: string,
      public idproducto: number,
      public idproveedor: number,
      public idempresa: number,
      public idResultadoChecklist: number,
      public albaran: string,
      public idResultadoChecklistLocal?: number
    ) {}
  }