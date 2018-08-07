import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
//import { Subscription } from 'rxjs/Subscription';
import {MatExpansionModule, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
import { map } from 'rxjs/operators';
// import {LoginComponent} from '../login/login';
// import {ControlesPage} from '../controles/controles';
// import {Empresa} from '../empresa/empresa';
// import {ChecklistPage} from '../checklist/checklist';
import { Sync } from '../../providers/sync';
// import { Initdb } from '../../providers/initdb';
import {EmpresasService} from '../../providers/empresas.service'

import {Usuario} from '../../models/usuario';
import {Control} from '../../models/control';
import {Checklist} from '../../models/checklist';
import {checkLimpieza} from '../../models/checklimpieza';
import {Mantenimiento} from '../../models/mantenimiento';
import {ControlChecklist} from '../../models/controlchecklist';
import * as moment from 'moment';


@Component({
  selector: 'page-home',
  templateUrl: './home.html'
})
export class HomePage implements OnInit {
// @Input() elemento: string;
// @Input() ids:number[];
@Output() status: EventEmitter<string>=new EventEmitter<string>();
@Output() controlSeleccionado: EventEmitter<Control>=new EventEmitter<Control>();
//@Output() checklistSeleccionado: EventEmitter<ControlChecklist[]>=new EventEmitter<ControlChecklist[]>();
@Output() checklistSeleccionado: EventEmitter<Object>=new EventEmitter<Object>();
@Output() checkLimpiezaSeleccionado: EventEmitter<Object>=new EventEmitter<Object>();
@Output() checkMantenimientoSeleccionado: EventEmitter<Object>=new EventEmitter<Object>();
@Output()  checkMantenimientoCorrectivo: EventEmitter<string>=new EventEmitter<string>();

miscontroles: Control[]=[];
mischecks: Checklist[]=[];
mischeckslimpiezas: checkLimpieza[]=[];
mantenimientos: Mantenimiento[]=[];
calibraciones: Mantenimiento[]=[];
checklist: Checklist;
controleschecklist: ControlChecklist[]=[];
limpieza: checkLimpieza;
mantenimientoPreventivo: Mantenimiento;
controlesLimpiezas: checkLimpieza[]=[];
public logoempresa;
empresa;
hoy: Date = new Date();
  constructor(private sync: Sync, private empresasService: EmpresasService) {

}


ngOnInit(){
  //console.log('HOME');
  // this.subscription = this.empresasService.usuarioactivo.subscribe(
  //    // usuario => this.empresas.push(empresa)
  //   );
  if (this.empresasService.usuarioactivo){
 this.refreshlogo();
 this.sincronizate();
  }else{
    //console.log('No USER');
    this.cambiaEstado('Login');
  }

}


refreshlogo(){
  //this.empresa = parseInt(localStorage.getItem("idempresa"));
this.logoempresa = "https://tfc.proacciona.es/logos/"+this.empresasService.usuarioactivo.idempresa+"/logo.jpg";
}
sincronizate(){
  //console.log("sincronizando...");
 //CONTROLES
   //CONTROLES
   // DESCARGA CONTROLES ENTONCES BORRA LOS LOCALES, LUEGO INSERTA LOS DESCARGADOS EN LOCAL.
            let empresa = this.empresasService.usuarioactivo.idempresa;
            let usuario = this.empresasService.usuarioactivo.id;
            let tipouser = this.empresasService.usuarioactivo.tipouser;
            let superuser = this.empresasService.usuarioactivo.superuser;
            this.sync.getMisControles(usuario,empresa).subscribe(
            data => {
              console.log(data);
              let resultado = JSON.parse(data.json());
             // console.log('resultado' + resultado.success);
             // console.log('success: ' +resultado.data[0].nombre);
              if (resultado.success){
              //test
               resultado = resultado.data;
               if (resultado){
               resultado.forEach (control => {
                 if (control.idusuario == usuario && (moment(control.fecha_).isSameOrBefore(moment(),'day') || this.checkPeriodo(control.periodicidad2) == 'por uso')){
                  let isBD = moment(new Date(control.fecha_)).isBefore(moment(), 'day');
                  this.miscontroles.push(new Control(control.id,control.nombre,control.pla,control.valorminimo,
                  control.valormaximo,control.objetivo,control.tolerancia,control.critico,control.periodicidad,
                  control.tipoperiodo,control.idempresa,control.periodicidad2,control.fecha_,control.orden,isBD,
                this.checkPeriodo(control.periodicidad2)));
                 }
              });
               }
              }
            },
            err => console.error(err),
            () => {}
            //console.log('getControles completed')

        );  

        //CONTROLES
        //CONTROLES
 //CHECKLISTS
   //CHECKLISTS
   // DESCARGA CHECKLISTS ENTONCES BORRA LOS LOCALES, LUEGO INSERTA LOS DESCARGADOS EN LOCAL.

            this.sync.getMisChecklists(usuario,empresa).pipe(map(res => res.json())).subscribe(
            data => {
              console.log(data)
               let resultados = JSON.parse(data);
                 //   console.log('resultado check: ' + resultados.success);
                //    console.log('success check: ' +this.mischecks.data[0].nombre);
                if (resultados.success){
                
                    resultados = resultados.data;
                    if (resultados){
                    console.log("mischecklists: ", resultados);       

                      resultados.forEach (checklist => {
                        if (checklist.idusuario == usuario && (moment(checklist.fecha_).isSameOrBefore(moment(),'day')  || this.checkPeriodo(checklist.periodicidad2) == 'por uso')){
                          let isBD = moment(new Date(checklist.fecha_)).isBefore(moment(), 'day');
                          this.checklist = new Checklist(checklist.idchecklist,checklist.idempresa,
                            checklist.nombrechecklist,checklist.periodicidad,checklist.tipoperiodo,
                            checklist.migrado,checklist.periodicidad2,checklist.fecha_,checklist.orden,isBD,
                          this.checkPeriodo(checklist.periodicidad2));
                          if (this.noEsta(this.mischecks,this.checklist)){
                          this.mischecks.push(this.checklist);
                          }
                          this.controleschecklist.push(new ControlChecklist(checklist.id,checklist.idchecklist,
                            checklist.nombre,checklist.migrado,checklist.orden));
                      }
                      });
                      }
                  }
              },
            err => console.error('ERROR GETTING CHECKLISTS',err),
            () => {}
            //console.log('getChecklists completed')
        );  

        //CHECKLISTS
        //CHECKLISTS

 //LIMPIEZAS
   //LIMPIEZAS
   // DESCARGA LIMPIEZAS ENTONCES BORRA LOS LOCALES, LUEGO INSERTA LOS DESCARGADOS EN LOCAL.
            
             this.sync.getMisLimpiezas(usuario,empresa).pipe(map(res => res.json())).subscribe(
            data => {
               let resultados = JSON.parse(data);
                 //   console.log('resultado check: ' + resultados.success);
                //    console.log('success check: ' +this.mischecks.data[0].nombre);
                if (resultados.success){
                
                    resultados = resultados.data;
                    if (resultados){
                    //console.log("mislimpiezas: ", resultados);       

                      resultados.forEach (limpieza => {
                        if (limpieza.idusuario == usuario &&  moment(limpieza.fecha).isSameOrBefore(moment(),'day')){
                        let isbeforedate = moment(limpieza.fecha).isBefore(this.hoy,'day');
                        let repeticion = ''
                        if (limpieza.periodicidad){
                        repeticion = this.checkPeriodo(limpieza.periodicidad);
                        }
                          this.limpieza = new checkLimpieza(limpieza.id,limpieza.idlimpiezazona,
                            limpieza.nombrelimpieza,limpieza.id,limpieza.nombre,limpieza.fecha,limpieza.tipo,
                            limpieza.periodicidad,limpieza.productos,limpieza.protocolo,false,limpieza.idusuario,
                            limpieza.responsable,repeticion,isbeforedate,limpieza.supervisor);
                          if (this.noEstaLimpieza(this.mischeckslimpiezas,this.limpieza)){
                          this.mischeckslimpiezas.push(this.limpieza);
                          }
                          this.controlesLimpiezas.push(this.limpieza);
                      }
                      });
                    }
                  }
              },
            err => console.error(err),
            () => {}
            //console.log('getLimpiezas completed')
        );
        //LIMPIEZAS
        //LIMPIEZAS


 //MANTENIMIENTOS
   //MANTENIMIENTOS            
   this.sync.getMisMantenimientos(usuario,empresa).pipe(map(res => res.json())).subscribe(
    data => {
       let resultados = JSON.parse(data);
        //    console.log('resultado check: ' + resultados.success);
        //    console.log('success check: ' +this.mischecks.data[0].nombre);
        if (resultados.success){
        
            resultados = resultados.data;
            if (resultados){
            //console.log("misMantenimientos: ", resultados);       

              resultados.forEach (mantenimiento => {
                if ( moment(mantenimiento.fecha).isSameOrBefore(moment(),'day') && (tipouser == 'Mantenimiento' || superuser == 1)){
                let isbeforedate = moment(mantenimiento.fecha).isBefore(this.hoy,'day');
                let repeticion = ''
                if (mantenimiento.periodicidad){
                repeticion = this.checkPeriodo(mantenimiento.periodicidad);
                }
                  this.mantenimientos.push(new Mantenimiento(mantenimiento.id,mantenimiento.idMaquina,
                    mantenimiento.nombreMaquina,mantenimiento.id,mantenimiento.nombre,mantenimiento.fecha,mantenimiento.tipo,
                    mantenimiento.periodicidad,false,mantenimiento.idusuario,
                    mantenimiento.responsable,mantenimiento.descripcion,isbeforedate,'mantenimiento'));
              }
              });
            }else{
              
            }
          }
      },
    err => console.error(err),
    () => {}
    //console.log('getMantenimientos completed')
);
//MANTENIMIENTOS
//MANTENIMIENTOS

 //CALIBRACIONES
   //CALIBRACIONES            
   this.sync.getMisCalibraciones(usuario,empresa).pipe(map(res => res.json())).subscribe(
    data => {
       let resultados = JSON.parse(data);
        //    console.log('resultado check: ' + resultados.success);
        //    console.log('success check: ' +this.mischecks.data[0].nombre);
        if (resultados.success){
        
            resultados = resultados.data;
            if (resultados){
            //console.log("misMantenimientos: ", resultados);       

              resultados.forEach (mantenimiento => {
                if ( moment(mantenimiento.fecha).isSameOrBefore(moment(),'day')  && (tipouser == 'Mantenimiento' || superuser == 1)){
                let isbeforedate = moment(mantenimiento.fecha).isBefore(this.hoy,'day');
                let repeticion = ''
                if (mantenimiento.periodicidad){
                repeticion = this.checkPeriodo(mantenimiento.periodicidad);
                }
                  this.calibraciones.push(new Mantenimiento(mantenimiento.id,mantenimiento.idMaquina,
                    mantenimiento.nombreMaquina,mantenimiento.id,mantenimiento.nombre,mantenimiento.fecha,mantenimiento.tipo,
                    mantenimiento.periodicidad,false,mantenimiento.idusuario,
                    mantenimiento.responsable,mantenimiento.descripcion,isbeforedate,'calibracion'));
              }
              });
            }
          }
      },
    err => console.error(err),
    () => {}
    //console.log('getMantenimientos completed')
);
//CALIBRACIONES
//CALIBRACIONES
}

//                         let isbeforedate = moment(data.rows.item(index).fecha).isBefore(this.hoy,'day');
//                         let repeticion = this.checkPeriodo(data.rows.item(index).periodicidad);
// //id , idlimpiezazona ,idusuario , nombrelimpieza , idelemento , nombreelementol , fecha , tipo , periodicidad , productos , protocolo
//                         this.checkLimpiezas.push(new checkLimpieza(data.rows.item(index).id,data.rows.item(index).idlimpiezazona,data.rows.item(index).nombrelimpieza,data.rows.item(index).idelemento,
//                         data.rows.item(index).nombreelementol,data.rows.item(index).fecha,data.rows.item(index).tipo,data.rows.item(index).periodicidad,data.rows.item(index).productos,data.rows.item(index).protocolo,false,data.rows.item(index).idusuario,data.rows.item(index).responsable,repeticion,isbeforedate));


checkPeriodo(periodicidad):string{
let repeticion;
try{
repeticion = JSON.parse(periodicidad)
return repeticion.repeticion;
}catch(e){
  return "por uso";
}

}

noEsta(checklist:Checklist[],item:Checklist){
  let resultado = true;
  checklist.forEach((check)=>{
    if (check.id == item.id) resultado = false;
  });
  return resultado;
}

noEstaLimpieza(limpiezas:checkLimpieza[],item:checkLimpieza){
  let resultado = true;
  limpiezas.forEach((check)=>{
    if (check.idLimpieza == item.idLimpieza) resultado = false;
  });
  return resultado;
}
cambiaEstado(estado){
  //console.log(estado)
this.status.emit(estado);
}

goControl(control){
  this.cambiaEstado("Control")
  this.controlSeleccionado.emit(control);
//console.log(control);
}
goChecklists(checklist){
    this.cambiaEstado("Checklist")
  this.checklistSeleccionado.emit({"controles":this.controleschecklist,"checklist":checklist});
  //console.log(checklist)
}
goChecklimpieza(limpieza: checkLimpieza){
    this.cambiaEstado("Checklimpieza")
  this.checkLimpiezaSeleccionado.emit({"limpiezas":this.controlesLimpiezas,"limpieza":limpieza});
  //console.log(checklist)
}
goCheckMantenimiento(mantenimiento: Mantenimiento){
  this.cambiaEstado("CheckMantenimiento")
this.checkMantenimientoSeleccionado.emit(mantenimiento);
//console.log(checklist)
}
goCheckMCorrectivo(){
  this.cambiaEstado("CheckMCorrectivo")
  this.checkMantenimientoCorrectivo.emit('');
}
}
