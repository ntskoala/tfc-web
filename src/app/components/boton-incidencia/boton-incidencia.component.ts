import { Component, OnInit,Output, Input, EventEmitter } from '@angular/core';

import { Sync } from '../../../providers/sync';
// import { Initdb } from '../../providers/initdb';
import {EmpresasService} from '../../../providers/empresas.service';
import {Servidor} from '../../../providers/servidor.service'
import {MessageService} from 'primeng/components/common/messageservice';
// import { TranslateService } from 'ng2-translate';
import {TranslateService} from '@ngx-translate/core';
import {Calendar} from 'primeng/primeng';

import {Usuario} from '../../../models/usuario';
import {Incidencia} from '../../../models/incidencia';
import {URLS} from '../../../models/urls';
import * as moment from 'moment';


@Component({
  selector: 'app-boton-incidencia',
  templateUrl: './boton-incidencia.component.html',
  styleUrls: ['./boton-incidencia.component.css']
})
export class BotonIncidenciaComponent implements OnInit {

  @Output() nuevaIncidenciaCreada: EventEmitter<Incidencia> = new EventEmitter<Incidencia>();
  @Input() origen: any;
  @Input() tipoOrigen: any;
  public responsables: any[];
public nuevaIncidencia:boolean=false;
public newIncidencia: Incidencia = new Incidencia(null,this.empresasService.seleccionada,null,this.empresasService.usuarioactivo.id,new Date,null,null,'',null,'Incidencias',0,null,0,'','',-1);
public incidencias: Incidencia[];
public hayIncidencia:boolean=false;
public selectedDay: number;
public cols:any[];
public es:any;
public entidad:string="&entidad=incidencias";
public colorBoton:string='accent';

//public urlFoto = URLS.DOCS + this.empresasService.seleccionada + '/incidencias/';
public uploadFoto: any;
  constructor(public servidor: Servidor, public empresasService: EmpresasService,
     public translate: TranslateService, private messageService: MessageService,
     public sync: Sync) { }

  ngOnInit() {
    this.es = {
      monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
          'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      dayNames: ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'],
      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      dayNamesMin: ["Do","Lu","Ma","Mi","Ju","Vi","Sa"],
      firstDayOfWeek: 1
  }; 
  this.loadUsuarios();
  }

ngOnChanges(){
  console.log(this.origen,this.tipoOrigen)
  if (this.origen.origen){
    this.setOrigen();
    // this.newIncidencia.origen = this.origen.origen;
    // this.newIncidencia.idOrigen = this.origen.idOrigen;
    // this.newIncidencia.origenasociado = this.origen.origenasociado;
    // this.newIncidencia.idOrigenasociado = this.origen.idOrigenasociado;
  }else{
    this.newIncidencia.origen = 'Incidencias';
    this.newIncidencia.idOrigen = 0;
    this.newIncidencia.origenasociado = null;
    this.newIncidencia.idOrigenasociado = 0;
    
  }
}
getColor(){
  if (this.origen){
  switch (this.origen.hayIncidencia){
    case true:
    // return '#cccccc';  
    return 'warn';
    case false:
    return 'accent';
    // return 'red';  
    default:
    return 'accent';
  }
}
}
setOrigen(){
  // console.log('###BOTON CHANGES',this.origen,this.origen.idIncidencia > 0)
 
   if (this.origen.idIncidencia > 0){
     switch (this.origen.hayIncidencia){
     case "1":
     this.colorBoton= 'warn';
     break;
     case "-1":
     this.colorBoton = 'primary';
     break; 
     }
     this.newIncidencia.id = this.origen.idIncidencia;
     this.newIncidencia.estado = this.origen.estado;
   }
 
   if (this.origen.origen){
     this.newIncidencia.origen = this.origen.origen;
   }
   if (this.origen.origenasociado){
     this.newIncidencia.origenasociado = this.origen.origenasociado;
   }
   if (this.origen.idOrigenasociado){
     this.newIncidencia.idOrigenasociado = this.origen.idOrigenasociado;
   }
   if (this.origen.idOrigen){
     this.newIncidencia.idOrigen = this.origen.idOrigen;
   }
   if (this.origen.incidencia){
    this.newIncidencia.incidencia = this.origen.incidencia;
  }
 }

loadUsuarios(){
  let params = this.empresasService.seleccionada;
  let parametros2 = "&entidad=usuarios"+'&idempresa=' + params;
      this.servidor.getObjects(URLS.STD_ITEM, parametros2).subscribe(
        response => {
          this.responsables = [];
          if (response.success && response.data) {
          //  console.log(response.data)
            for (let element of response.data) {  
              this.responsables.push({'label':element.usuario,'value':element.id});
           }
          }
      });
}


  newItem() {
    this.newIncidencia.fecha = new Date(Date.UTC(this.newIncidencia.fecha.getFullYear(), this.newIncidencia.fecha.getMonth(), this.newIncidencia.fecha.getDate(), this.newIncidencia.fecha.getHours(), this.newIncidencia.fecha.getMinutes()))
    this.newIncidencia.idempresa = this.empresasService.seleccionada;
    this.newIncidencia.responsable = this.empresasService.usuarioactivo.id;
    this.nuevaIncidenciaCreada.emit(this.newIncidencia);
    this.hayIncidencia = true;
    this.nuevaIncidencia=false;
    // this.setIncidencia();
      // this.addItem(this.newIncidencia).then(
      //   (valor)=>{      
      //     console.log(valor);
      //     this.nuevaIncidenciaCreada.emit(this.newIncidencia);
      //     this.setIncidencia();
      //     }
      // );
  }

  //  addItem(incidencia: Incidencia){
  //   return new Promise((resolve,reject)=>{
  //   let param = this.entidad;
  //   this.servidor.postObject(URLS.STD_ITEM, incidencia,param).subscribe(
  //     response => {
  //       if (response.success) {
  //         this.newIncidencia.id = response.id;
  //         if (this.newIncidencia.foto && this.uploadFoto) this.uploadImg(this.uploadFoto,response.id,'foto');
  //         this.sync.sendMailIncidencia(this.newIncidencia);
  //         resolve(true);
  //       }
  //   },
  //   error =>{
  //     console.log(error);
  //     resolve(true);
  //   },
  //   () =>  {}
  //   );
  // });
  // }


setIncidencia(){
  console.log('hayIncidencia',this.origen.hayIncidencia)
  if(this.origen.hayIncidencia){
    this.nuevaIncidenciaCreada.emit(null);
    this.nuevaIncidencia=false;
  }else{
    this.hayIncidencia = true;
  this.nuevaIncidencia = ! this.nuevaIncidencia;
   }
}


setImg(event){
  this.uploadFoto = event;
  var target = event.target || event.srcElement; //if target isn't there then take srcElement
  let files = target.files;
  this.newIncidencia.foto = files[0].name;
  console.log(this.newIncidencia.foto);
}

uploadImg(event, idItem,tipo) {
  console.log(event, idItem,tipo)
  var target = event.target || event.srcElement; //if target isn't there then take srcElement
  let files = target.files;
  //let files = event.srcElement.files;
  let idEmpresa = this.empresasService.seleccionada.toString();
  this.servidor.postDoc(URLS.UPLOAD_DOCS, files,'incidencias',idItem, this.empresasService.seleccionada.toString(),tipo).subscribe(
    response => {
      console.log('doc subido correctamente',files[0].name);
      this.newIncidencia.foto = files[0].name;
      // this.url[i]= URLS.DOCS + this.empresasService.seleccionada + '/incidencias/' +  idItem +'_'+files[0].name;
      // let activa = this.empresas.find(emp => emp.id == this.empresasService.seleccionada);
      // activa.logo = '1';
    }
  )
}



okDate(cal:Calendar){
  cal.overlayVisible = false;
}

itemDateEdited(fecha: any,evento:any) {
  console.log(evento);
  this.selectedDay= new Date(fecha).getDate();
}


}
