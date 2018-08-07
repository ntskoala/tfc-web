import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import * as moment from 'moment';


import {Sync} from '../../providers/sync';
import {EmpresasService} from '../../providers/empresas.service';
import {PeriodosService} from '../../providers/periodos.service';
import {Servidor} from '../../providers/servidor.service';

import {ControlChecklist} from '../../models/controlchecklist';
import { Checklist } from 'models/checklist';
import { URLS } from 'models/urls';
import {Incidencia} from '../../models/incidencia';

//import { MyImages } from '../images/images';

export class Checks {
  public id: number;
  public idchecklist: number;
  public nombrechecklist: string;
  public idcontrol:number;
  public nombrecontrol:string;
  public checked:string;
  public valor:string;
  public descripcion: string;
  public foto: string;
}
/*
  Generated class for the Check page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-check',
  templateUrl: './check.html',
  styleUrls:['./check.scss'],
  //providers: [SyncPage]
})
export class CheckPage implements OnInit{
@Output() status: EventEmitter<string>=new EventEmitter<string>();
//@Input() currentChecklist: ControlChecklist[];
@Input() inputChecklist: Object;
public currentChecklist: ControlChecklist[];
public checklistcontroles: Checks[] = [];
public resultadoschecklistcontroles: any;
public checks: any;
//private storage: Storage;
public idchecklist;
public nombrechecklist: string;
public base64Image = "";
public checkvalue:string;
public selectedValue:string;
public desactivado = false;
public i:number;
public control;
public fecha_prevista: Date;
public periodicidad:any;
public numProcesados:number;
public askCompletarFechas:boolean=false;
public completaFechas:boolean=false;
public incidencias:Incidencia[]=[];
public incidencia:any[]=[];
public currentIndexIncidencia:number;
  constructor(private translate: TranslateService, public sync: Sync, public servidor: Servidor,
    public empresasService: EmpresasService, public periodos: PeriodosService) {

        // this.idchecklist =  this.params.get('checklist').idchecklist;
        // this.nombrechecklist = this.params.get('checklist').nombrechecklist;
        
  }

  ngOnInit() {
  this.currentChecklist = this.inputChecklist["controles"];
  this.nombrechecklist = this.inputChecklist["checklist"].nombrechecklist;
  this.fecha_prevista = moment(this.inputChecklist["checklist"].fecha_).toDate();
 // this.periodicidad = JSON.parse(this.inputChecklist["checklist"].periodicidad2);
  try{
    console.log(this.inputChecklist["checklist"].periodicidad2);
    this.periodicidad = JSON.parse(this.inputChecklist["checklist"].periodicidad2);
  }catch(e){
    this.periodicidad = {'repeticion':'por uso'};
  }
  let x=0;
    this.currentChecklist.forEach((item)=>{
      if (item.idchecklist == this.inputChecklist["checklist"].id){
        this.checklistcontroles.push({
                            "id": item.id,
                            "idchecklist": item.idchecklist,
                            "nombrechecklist": "",
                            "idcontrol":item.id,
                            "nombrecontrol":item.nombre,
                            "checked":"false",
                            "valor":"",
                            "descripcion":"",
                            "foto": ""
                      });   
                      this.incidencia[x]={'origen':'Checklists','origenasociado':'Checklists','idOrigenasociado':item.idchecklist,'idOrigen':item.id,'hayIncidencia':false,'incidencia':'Incidencia en ' +item.nombre+ ' de ' + this.nombrechecklist}
                      x++;
      }                    

    });
    console.log("input",this.inputChecklist);
  }

  onCompletarFechas(valor){
    if (valor === null){
      this.askCompletarFechas=false;
      console.log('onCompletarFechas',valor)
    }else{
    this.askCompletarFechas=false;
    console.log('onCompletarFechas',valor)
    this.terminar2(valor);
    }
  }
  terminar(){
    if(this.periodos.hayRetraso(this.fecha_prevista,this.periodicidad)){
        if (this.askCompletarFechas) this.askCompletarFechas =false;
        this.askCompletarFechas=true;  
      }else{ 
        this.terminar2();
      }
    }

terminar2(completaFechas?: boolean){
this.desactivado = true;
  let empresa = this.empresasService.usuarioactivo.idempresa;
  //let fecha = new Date();
  //console.log(fecha);
  let idlocal = 0;
  let resultados = [];
  //(completaFechas)? fecha = this.fecha_prevista: fecha= new Date();
  if (this.periodicidad.repeticion !="por uso" && completaFechas){
    for(let x=0;moment(this.fecha_prevista).isBefore(moment(),'day');x++){
      //resultados.push({ "idcontrol": this.currentControl.id, "resultado": this.valor, "fecha": moment(this.fecha_prevista).format('YYYY-MM-DD') + ' ' + moment().format('HH:mm'), "foto": this.base64Image, "idusuario": this.empresasService.usuarioactivo.id });
      resultados.push({ "idlocal": 0, "idchecklist": this.checklistcontroles[0].idchecklist, "fecha": moment(this.fecha_prevista).format('YYYY-MM-DD') + ' ' + moment().format('HH:mm'), "foto": this.base64Image,"idusuario":this.empresasService.usuarioactivo.id });
      this.fecha_prevista = moment(this.periodos.nuevaFecha(this.periodicidad, this.fecha_prevista,completaFechas)).toDate();
      console.log(this.fecha_prevista,resultados.slice(x,x+1));
      this.saveChecklist(resultados[x],empresa);
    }
    }else{
  let resultado = { "idlocal": 0, "idchecklist": this.checklistcontroles[0].idchecklist, "fecha": moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm'), "foto": this.base64Image,"idusuario":this.empresasService.usuarioactivo.id };
  resultados.push(resultado);
  this.saveChecklist(resultados[0],empresa);
    }
  // let idrespuesta = this.sync.setResultados(JSON.stringify(resultados), "resultadoschecklist", empresa)
  //   .subscribe(data => {
  //     this.sendChecklistControles(data.id, idlocal);
  //   });
}
saveChecklist(resultado,empresa){
  let Aresultado: any[]= [resultado];
  let idrespuesta = this.sync.setResultados(JSON.stringify(Aresultado), "resultadoschecklist", empresa)
  .subscribe(data => {
    this.sendChecklistControles(data.id, 0);
  }); 
}
sendChecklistControles(id,idlocal){

  let empresa = this.empresasService.usuarioactivo.idempresa;
  let fecha = new Date();
  let resultados = [];
  this.numProcesados = this.checklistcontroles.length;
  let indice=-1;
this.checklistcontroles.forEach(check =>{
   let resultados = [];
if (check.checked == 'valor'){
check.checked = check.valor;
}
let resultado = { "idcontrolchecklist": check.id, "idresultadochecklist": id,"resultado":check.checked,"descripcion":check.descripcion,"fotocontrol": check.foto };
resultados.push(resultado);

this.sync.setResultados(JSON.stringify(resultados),"resultadoscontroleschecklist",empresa)
.subscribe(data => {
  console.log("control3")

  let indice = this.incidencia.findIndex((incidencia)=>incidencia.idOrigen==check.id);
  console.log(this.incidencias[indice]);
  if (this.incidencias[indice] !== null && this.incidencias[indice] !== undefined) this.saveIncidencia(data.id,indice);

  this.numProcesados--;
  if (this.numProcesados==0)  this.updateFecha();
},
                               error => console.log("control4" + error),
                               () => console.log("fin"));
   });                           
//this.status.emit('Home');
}

updateFecha(){

 let proxima_fecha;
   if (this.periodicidad.repeticion == "por uso"){
     proxima_fecha = moment(new Date()).format('YYYY-MM-DD');
   }else{
     proxima_fecha = moment(this.periodos.nuevaFecha(this.periodicidad,this.fecha_prevista)).format('YYYY-MM-DD');
 }

     console.log("updating fecha: ",proxima_fecha,this.fecha_prevista);

  //         console.log("updating serer");
           let param = "?entidad=checklist&id="+this.checklistcontroles[0].idchecklist+"&idempresa="+this.empresasService.usuarioactivo.idempresa+"&userId="+this.empresasService.usuarioactivo.id;
           let limpia={fecha_:proxima_fecha};
            this.servidor.putObject(URLS.STD_ITEM,param,limpia).subscribe(
            (resultado)=>{
             this.status.emit('Home');
              console.log(resultado)}
              ,
            (error)=>console.log(error),
            ()=>console.log('fin updating fecha')
          );
}


takeFoto(foto,control ?){
  if (control){
control.foto = foto;
  }
  else{
    this.base64Image = foto;
  }

console.log(control);
let fecha = new Date();
console.log(fecha);
  }

editar(control){
        //   let prompt = this.alertCtrl.create({
        //     title: 'Descripcion',
        //     inputs: [{name: 'descripcion'}],
        //     buttons: [
        //         {text: 'Cancel'},
        //         {text: 'Add',handler: data => {control.descripcion = data.descripcion;}
        //         }]
        //     });
        // prompt.present();
}


  opciones(control) {
    console.log("check",control);
    // let actionSheet = this.actionSheetCtrl.create({
    //   title: 'Opciones',
    //   buttons: [
    //     {text: 'Editar descripción',handler: () => {this.editar(control);}},
    //     {text: 'Foto',handler: () => {this.takeFoto(control);}},
    //     {text: 'Cancel',role: 'cancel',handler: () => {console.log('Cancel clicked');}}
    //     ]
    //      });
    // actionSheet.present();
  }

changeSelected(valor,index){
  console.log(valor)
  if(valor=='incidencia')
  {
    this.currentIndexIncidencia = index;
  }
  
  this.selectedValue = this.checkvalue;
}

nuevaIncidencia(nuevaIncidenciaCreada,i){
  this.incidencias[i] = nuevaIncidenciaCreada;
  if(nuevaIncidenciaCreada!= null){
    console.log('NI != null',nuevaIncidenciaCreada,i);
  this.incidencia[i]["hayIncidencia"]= true;
  nuevaIncidenciaCreada.idOrigen=this.currentChecklist[i].id;
  nuevaIncidenciaCreada.idOrigenasociado=this.currentChecklist[i].idchecklist;
  nuevaIncidenciaCreada.origen='Checklists';
  nuevaIncidenciaCreada.origenasociado='Checklists';
 
  this.incidencias[i] = nuevaIncidenciaCreada;
  }else{
    console.log('NI == null',nuevaIncidenciaCreada,i);
    this.incidencia[i]["hayIncidencia"]= false;
    this.incidencias[i] = nuevaIncidenciaCreada;;
  }
}

saveIncidencia(id,index){
  console.log('saveIncidencia',this.incidencias,id,index);
  this.incidencias[index].idOrigen = id;
  let param = '&entidad=incidencias';

  this.servidor.postObject(URLS.STD_ITEM,this.incidencias[index],param).subscribe(
    (resultado)=>{
      console.log(resultado);
      this.incidencias[index].id = resultado.id;
      this.sync.sendMailIncidencia(this.incidencias[index]);
    }
  );
  
}

changeValor(control){
  if (control.valor === null || control.valor === null || control.valor === undefined || isNaN(control.valor)){
    this.translate.get("alertas.errorvalor")
  .subscribe(resultado => { alert(resultado);});
  }
}

cancelar(){
  console.log('cancelado');
  this.status.emit('Home');
}

}




 
  
