export class limpiezaRealizada {
  constructor(
  public id: number,
  public idelemento: number,
  public idempresa: number,
  public fecha_prevista:Date,
  public fecha:Date,
  public nombre:string,
  public descripcion: string,
  public tipo: string,
  public idusuario: number,
  public responsable: string,
  public idlimpiezazona:number,
  public idsupervisor: number
  ){}
}