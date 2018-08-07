import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// import {TranslateService} from 'ng2-translate';
import {TranslateService} from '@ngx-translate/core';

import {Sync} from '../../providers/sync';
import {EmpresasService} from '../../providers/empresas.service';
import {Servidor} from '../../providers/servidor.service';
import { PeriodosService } from '../../providers/periodos.service';

import {checkLimpieza} from '../../models/checklimpieza';
import {limpiezaRealizada} from '../../models/limpiezarealizada';
import { URLS } from '../../models/urls'
import {Incidencia} from '../../models/incidencia';


import * as moment from 'moment';
@Component({
  selector: 'page-check-limpieza',
  templateUrl: './check-limpieza.component.html',
  styleUrls: ['./check-limpieza.component.css']
})
export class CheckLimpiezaComponent implements OnInit {
@Output() status: EventEmitter<string>=new EventEmitter<string>();
@Input() inputCheckLimpieza: Object;
public nombreLimpieza: string;
public currentLimpiezas:checkLimpieza[]=[];

public idlimpiezazona:number;
public limpiezaRealizada: limpiezaRealizada;
public hoy: Date = new Date();
public askCompletarFechas:boolean=false;
public completaFechas:boolean=false;
public numProcesados:number;
public incidencias:Incidencia[]=[];
public incidencia:any[]=[];
  constructor(  private translate: TranslateService, public sync: Sync, public empresasService: EmpresasService, 
    public servidor: Servidor, public periodos: PeriodosService) {
      //  console.log("param",this.params.get('limpieza'));
       
      //  this.idlimpiezazona =  this.params.get('limpieza').idlimpiezazona;
      //   this.nombreLimpieza = this.params.get('limpieza').nombrelimpieza;
     
  }


     

  ngOnInit() {
  this.currentLimpiezas = this.inputCheckLimpieza["limpiezas"].filter((limpieza)=>limpieza.idLimpieza == this.inputCheckLimpieza["limpieza"].idLimpieza);
  this.nombreLimpieza = this.inputCheckLimpieza["limpieza"].nombreLimpieza;
 
    this.currentLimpiezas.forEach((limpieza)=>{
      this.incidencia.push({'origen':'Limpiezas','origenasociado':'Limpieza_realizada','idOrigenasociado':limpieza.idLimpieza,'idOrigen':limpieza.idElementoLimpieza,'hayIncidencia':false,'incidencia':'Incidencia en ' +limpieza.nombreElementoLimpieza+ ' de ' +limpieza.nombreLimpieza})

    })
    console.log("controles",this.currentLimpiezas);
  }




cambio(evento,control){
control.checked= evento.checked;
console.log(control.checked,evento);
}

terminar(){
  if(this.currentLimpiezas.some(elemento=>{
    let periodicidad = JSON.parse(elemento.periodicidad);
    return this.periodos.hayRetraso(elemento.fecha_prevista,periodicidad)
  })){
      if (this.askCompletarFechas) this.askCompletarFechas =false;
      this.askCompletarFechas=true;  
    }else{ 
      this.terminar2();
    }
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

terminar2(completaFechas?: boolean){
  let empresa = this.empresasService.usuarioactivo.idempresa;
  let fecha = new Date();
  console.log(fecha);
  let idlocal = 0;
  let resultados = [];

  // let idrespuesta = this.sync.setResultados(JSON.stringify(resultados), "resultadoschecklist", empresa)
  //   .subscribe(data => this.sendChecklistControles(data.id, idlocal));
//********************* */


  let idempresa = this.empresasService.usuarioactivo.idempresa;
  let idusuario = this.empresasService.usuarioactivo.id;
this.numProcesados = this.currentLimpiezas.filter(element=>element.checked==true).length;
console.log(this.currentLimpiezas.length,this.numProcesados);
  console.log("terminar",this.currentLimpiezas);
  this.currentLimpiezas.forEach((elemento)=>{
    console.log("terminar2",elemento);

if (elemento.checked){
  (completaFechas)? fecha = elemento.fecha_prevista: fecha= this.hoy;
            let limpieza = new limpiezaRealizada(null,elemento.idElementoLimpieza,idempresa,
              elemento.fecha_prevista,fecha,elemento.nombreLimpieza + ' ' + elemento.nombreElementoLimpieza,
              '',elemento.tipo,idusuario,elemento.responsable,elemento.idLimpieza,elemento.idsupervisor);
              this.guardarLimpiezaRealizada(elemento,limpieza,elemento.fecha_prevista,completaFechas);
            //  let param = "&entidad=limpieza_realizada";
            // this.servidor.postObject(URLS.STD_ITEM, limpieza,param).subscribe(
            //   response => {
            //     if (response.success) {
            //       console.log('limpieza realizada sended', response.id);

            //       this.updateFecha(elemento);
            //     }
            //   },
            //   error => console.log(error),
            //   () => { });
}
  });
  
}

guardarLimpiezaRealizada(elementoLimpieza: checkLimpieza ,limpiezaRealizada: limpiezaRealizada, fecha:Date,completaFechas:boolean){
  let param = "&entidad=limpieza_realizada&idempresa="+this.empresasService.usuarioactivo.idempresa+"&userId="+this.empresasService.usuarioactivo.id;
  this.servidor.postObject(URLS.STD_ITEM, limpiezaRealizada,param).subscribe(
    response => {
      if (response.success) {

        let indice = this.incidencia.findIndex((incidencia)=>incidencia.idOrigen==limpiezaRealizada.idelemento);
        if (this.incidencia[indice]["hayIncidencia"]) this.saveIncidencia(response.id,indice);
        console.log('limpieza realizada sended', response.id);

        this.updateFecha(elementoLimpieza,limpiezaRealizada,fecha,completaFechas);
      }
    },
    error => console.log(error),
    () => { });
}

updateFecha(elemento: checkLimpieza,limpiezaRealizada: limpiezaRealizada, fecha : Date,completaFechas:boolean){
    let proxima_fecha;
    if (elemento.descripcion =="por uso"){
      proxima_fecha = moment(this.periodos.nuevaFecha(JSON.parse(elemento.periodicidad),this.hoy)).format('YYYY-MM-DD');
    }else{
    proxima_fecha = moment(this.periodos.nuevaFecha(JSON.parse(elemento.periodicidad),fecha,completaFechas)).format('YYYY-MM-DD');
    }   

      console.log("updated fecha: ",proxima_fecha,elemento.fecha_prevista);
    if (moment(proxima_fecha).isAfter(moment(),'day')|| elemento.descripcion =="por uso"){
            console.log("updating serer");
             let param = "?entidad=limpieza_elemento&id="+elemento.idElementoLimpieza+"&idempresa="+this.empresasService.usuarioactivo.idempresa+"&userId="+this.empresasService.usuarioactivo.id;
             let limpia={fecha:proxima_fecha};
              this.servidor.putObject(URLS.STD_ITEM,param,limpia).subscribe(
              (resultado)=>{
                this.numProcesados--;
                if (this.numProcesados==0) this.status.emit('Home');
                console.log(resultado);
              },
              (error)=>console.log(error),
              ()=>console.log('fin updating fecha')
            );
          }else{
            console.log("sigue programando: ",proxima_fecha);
            elemento.fecha_prevista = proxima_fecha;
            limpiezaRealizada.fecha_prevista = proxima_fecha;
            limpiezaRealizada.fecha = proxima_fecha;
            this.guardarLimpiezaRealizada(elemento,limpiezaRealizada,proxima_fecha,completaFechas);
          }
}







cancelar(){
  console.log('cancelado');
  this.status.emit('Home');
}


nuevaIncidencia(nuevaIncidenciaCreada,i){
  
  if(nuevaIncidenciaCreada!= null){
    console.log('NI != null',nuevaIncidenciaCreada,i);
  this.incidencia[i]["hayIncidencia"]= true;
  nuevaIncidenciaCreada.idOrigen=this.currentLimpiezas[i].idElementoLimpieza;
  nuevaIncidenciaCreada.idOrigenasociado=this.currentLimpiezas[i].idLimpieza;
  nuevaIncidenciaCreada.origen='Limpiezas';
  nuevaIncidenciaCreada.origenasociado='limpieza_realizada';
 
  this.incidencias[i] = nuevaIncidenciaCreada;
  this.currentLimpiezas[i].checked = true;
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

}
