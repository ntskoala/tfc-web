import { Component, Input } from '@angular/core';

import {Control} from '../models/control';
import {ControlChecklist} from '../models/controlchecklist';
import {checkLimpieza} from '../models/checklimpieza'
import {Mantenimiento} from '../models/mantenimiento'



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  control: Control;
  checklist: ControlChecklist[];
  limpiezas: checkLimpieza[];
  mantenimiento: Mantenimiento;
  status = "Login"
  informes:boolean=false;
constructor() {

}
  // ids: number[]=[];
  // elemento:string;
  cambiaEstado(estado){
    console.log("parent", estado)
// try{
// let opciones = JSON.parse(estado);
// this.status = opciones.estado;
// this.ids = opciones.ids;
// this.elemento= opciones.elemento;
// }catch(e){
// this.status = estado;
// }
  this.status = estado;
  }

controlSeleccionado(control){
this.control= control;
console.log ("control parent", control)
}
checklistSeleccionado(checklist){
  this.checklist = checklist;
}
checkLimpiezaSeleccionado(limpiezaZona){
this.limpiezas = limpiezaZona;
}
checkMantenimientoSeleccionado(mantenimiento){
  this.mantenimiento = mantenimiento;
  }



}
