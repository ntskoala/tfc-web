export class Mantenimiento {
    constructor(
    public id: number,
    public idMaquina: number,
    public nombreMaquina: string,
    public idMantenimiento:number,
    public nombreMantenimiento:string,
    public fecha_prevista: Date,
    public tipo: string,
    public periodicidad: string,
    public checked:boolean,
    public idusuario: number,
    public responsable:string,
    public descripcion: string,
    public isbeforedate?: boolean,
    public tipoMantenimiento?: string
    ){}
  }