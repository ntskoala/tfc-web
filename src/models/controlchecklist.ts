export class ControlChecklist{
  constructor(
    public id: number,
    public idchecklist: number,
    public nombre: string,
    public migrado?: number,
    public orden?: number
  ){}
}
