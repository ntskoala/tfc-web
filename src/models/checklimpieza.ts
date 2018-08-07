export class checkLimpieza {
  constructor(
  public id: number,
  public idLimpieza: number,
  public nombreLimpieza: string,
  public idElementoLimpieza:number,
  public nombreElementoLimpieza:string,
  public fecha_prevista: Date,
  public tipo: string,
  public periodicidad: string,
  public productos: string,
  public protocolo: string,
  public  checked:boolean,
  public idusuario: number,
  public responsable:string,
  public descripcion: string,
  public isbeforedate?: boolean,
  public idsupervisor?:number
  ){}
}

