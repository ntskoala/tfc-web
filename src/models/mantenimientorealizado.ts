export class mantenimientoRealizado {
    constructor(
    public id: number,
    public idmantenimiento: number,
    public idmaquina: number,
    public maquina: string,
    public mantenimiento: string,
    public fecha_prevista:Date,
    public fecha:Date,
    public idusuario:number,
    public responsable: string,
    public descripcion: string,
    public elemento:string,
    public tipo: string,
    public tipo2: string,
    public causas: string,
    public tipo_evento: string,
    public idempresa: number
    
    ){}
  }