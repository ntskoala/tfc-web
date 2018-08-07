import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import * as moment from 'moment';

import {TranslateService} from '@ngx-translate/core';
import { Servidor } from '../../providers/servidor.service';
import { EmpresasService } from '../../providers/empresas.service';
import { Sync } from '../../providers/sync'
import { PeriodosService } from '../../providers/periodos.service';
import { Control } from '../../models/control';
import { URLS } from '../../models/urls';
import {Incidencia} from '../../models/incidencia';

/*
  Generated class for the Control page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-control',
  templateUrl: './control.html',
  // providers: [SyncPage]
})
export class ControlPage implements OnInit{
  @Output() status: EventEmitter<string> = new EventEmitter<string>();
  @Input() currentControl: Control;
  public base64Image: string = '';
  public nombre: string;
  public idcontrol: number;
  public valor: number;
  public control: any;
  public desactivado: boolean;
  public fecha_prevista: Date;
  public periodicidad: any;
  public askCompletarFechas:boolean=false;
public completaFechas:boolean=false;
public numProcesados:number;
public newIncidencia: Incidencia = null;
public newIncidenciaAutomatica: Incidencia = null;
public incidencia:any;
  constructor (private translate: TranslateService, public sync: Sync, public servidor: Servidor,
    public empresasService: EmpresasService, public periodos: PeriodosService) {
    // this.control = this.navParams.get('control');
    // this.nombre = this.navParams.get('control').nombre;
    // this.idcontrol = this.navParams.get('control').id; 
    this.desactivado = false;

  }

  ngOnInit() {
    console.log('Hello Control Page');
    this.fecha_prevista = moment(this.currentControl.fecha_).toDate();
    try{
      console.log(this.currentControl.periodicidad2);
      this.periodicidad = JSON.parse(this.currentControl.periodicidad2);
    }catch(e){
      this.periodicidad = {'repeticion':'por uso'};
    }
    console.log(this.periodicidad)
    this.incidencia={'origen':'Controles','origenasociado':'Controles','idOrigenasociado':0,'idOrigen':this.currentControl.id,'hayIncidencia':false,'incidencia':'Incidencia en ' +this.currentControl.nombre}
  }
  
  checkrangoerror() {

    let fuerarango = "false";
    if (!isNaN(this.currentControl.valorminimo) && this.currentControl.valorminimo != null) {
      console.log("valor minimo",this.valor - this.currentControl.valorminimo);
      if (this.valor - this.currentControl.valorminimo < 0) {
        console.log("valor minimo",this.valor - this.currentControl.valorminimo);
        fuerarango = "valorminimo";
      }
    }
    if (!isNaN(this.currentControl.valormaximo) && this.currentControl.valormaximo != null) {
      console.log("valor maximo",typeof(this.currentControl.valormaximo-this.valor ));
      
      if (this.currentControl.valormaximo-this.valor < 0) {

        console.log("valor maximo");
        fuerarango = "valormaximo";
      }
    }
    // if (!isNaN(this.control.tolerancia) && this.control.tolerancia != null){
    //   if (this.valor >= this.control.tolerancia){
    //    console.log("valor tolerancia"); 
    //     fuerarango = "tolerancia";
    //   }  
    // }
    console.log(this.currentControl.critico, this.valor);
    if (!isNaN(this.currentControl.critico) && this.currentControl.critico != null) {
      console.log(this.currentControl.critico, this.valor);
      let res = this.currentControl.critico - this.valor;
      res < 0 ? console.log('critico' + res) : console.log('res');
      //if (this.valor > this.currentControl.critico){
      if (res < 0) {
        console.log("valor critico");
        fuerarango = "critico";
      }
    }

    if (fuerarango != "false") {
      this.creaIncidencia(fuerarango);
      //this.sendalert(fuerarango);
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
  terminar(){
    if(this.periodos.hayRetraso(this.fecha_prevista,this.periodicidad)){
        if (this.askCompletarFechas) this.askCompletarFechas =false;
        this.askCompletarFechas=true;  
      }else{ 
        this.terminar2();
      }
    }



  terminar2(completaFechas?: boolean) {
    console.log(this.valor.toString().length);
    if (!isNaN(this.valor) && (this.valor.toString().length > 0)) {
      this.desactivado = true;
      this.checkrangoerror();



      //let fecha= new Date();
      //(completaFechas)? fecha = this.fecha_prevista: fecha= new Date();
      //console.log(fecha);
      let resultados = [];
      if (this.periodicidad.repeticion !="por uso" && completaFechas){
        for(let x=0;moment(this.fecha_prevista).isBefore(moment(),'day');x++){
          resultados.push({ "idcontrol": this.currentControl.id, "resultado": this.valor, "fecha": moment(this.fecha_prevista).format('YYYY-MM-DD') + ' ' + moment().format('HH:mm'), "foto": this.base64Image, "idusuario": this.empresasService.usuarioactivo.id });
          this.fecha_prevista = moment(this.periodos.nuevaFecha(this.periodicidad, this.fecha_prevista,completaFechas)).toDate();
          console.log(this.fecha_prevista,resultados);
        }
        }else{
          let resultado = { "idcontrol": this.currentControl.id, "resultado": this.valor, "fecha": moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm'), "foto": this.base64Image, "idusuario": this.empresasService.usuarioactivo.id };
          resultados.push(resultado);          
        }

      this.sync.setResultados(JSON.stringify(resultados), "resultadoscontrol", this.currentControl.idempresa)
        .subscribe(data => {
          console.log("control3",data,this.newIncidencia);
          if (this.newIncidencia !== null) this.saveIncidencia(data.id,this.newIncidencia);
          if (this.newIncidenciaAutomatica !== null) this.saveIncidencia(data.id,this.newIncidenciaAutomatica);
          this.updateFecha();
          
        },
        error => console.log("control4" + error),
        () => console.log("fin"));
      //  this.navCtrl.pop();
      
    }
    else // NO HAY UN NUMERO EN RESULTADO
    {
      this.translate.get("alertas.errorvalor")
        .subscribe(resultado => { alert(resultado); });
      //alert(this.translate.instant("errorvalor")); 


    }
  }

  updateFecha() {

    let proxima_fecha;
    if (this.periodicidad.repeticion == "por uso") {
      proxima_fecha = moment(new Date()).format('YYYY-MM-DD');
    } else {
      proxima_fecha = moment(this.periodos.nuevaFecha(this.periodicidad, this.fecha_prevista)).format('YYYY-MM-DD');
    }

    console.log("updating fecha: ", proxima_fecha, this.fecha_prevista);


    let param = "?entidad=controles&id=" + this.currentControl.id+"&idempresa="+this.empresasService.usuarioactivo.idempresa+"&userId="+this.empresasService.usuarioactivo.id;
    let limpia = { fecha_: proxima_fecha };
    this.servidor.putObject(URLS.STD_ITEM, param, limpia).subscribe(
      (resultado) => {
        this.status.emit('Home');
      console.log(resultado)},
      (error) => console.log(error),
      () => console.log('fin updating fecha')
    );
  }

  takeFoto(foto) {
    console.log('test');
    this.base64Image = foto;

  }

  sendalert(alerta) {
    let mensaje: string;
    let subject: string;
    let error: string;
    let pie: string;
    let control, valorc, minimo, maximo, tolerancia, critico: string;

    this.translate.get("alertas." + alerta).subscribe(resultado => { mensaje = resultado });
    alert(mensaje);
    this.translate.get("email.subject").subscribe(resultado => { subject = resultado });
    this.translate.get("email.body").subscribe(resultado => { error = resultado });
    this.translate.get("email.pie").subscribe(resultado => { pie = resultado });
    this.translate.get("control").subscribe(resultado => { control = resultado });
    this.translate.get("valorc").subscribe(resultado => { valorc = resultado });
    this.translate.get("minimo").subscribe(resultado => { minimo = resultado });
    this.translate.get("maximo").subscribe(resultado => { maximo = resultado });
    this.translate.get("tolerancia").subscribe(resultado => { tolerancia = resultado });
    this.translate.get("critico").subscribe(resultado => { critico = resultado });
    let bcontrol = control + ": " + this.currentControl.nombre;
    let bvalorc = valorc + this.valor;
    let bminimo = minimo + (this.currentControl.valorminimo == null ? "" : this.currentControl.valorminimo);
    let bmaximo = maximo + (this.currentControl.valormaximo == null ? "" : this.currentControl.valormaximo);
    let btolerancia = tolerancia + (this.currentControl.tolerancia == null ? "" : this.currentControl.tolerancia);
    let bcritico = critico + (this.currentControl.critico == null ? "" : this.currentControl.critico);
    //let cabecera= '<br><img src="assets/img/logo.jpg" /><hr>';
    let parametros = bcontrol + '<br>' + bvalorc + '<br>' + bminimo + '<br>' + bmaximo + '<br>' + btolerancia + '<br>' + bcritico + '<br>';

    let body = mensaje + '<br>' + parametros + pie;


    console.log("preparando email:" + alerta);


    // let param = '&body=' + body + '&idempresa=' + this.currentControl.idempresa;
    // this.servidor.getObjects(URLS.ALERTAS, param).subscribe(
    //   response => {
    //     if (response.success == 'true') {
    //       //this.status.emit('Home');
    //       console.log('email ok');
    //     } else {
    //       // TODO: chequear si la sesión está caducada
    //       // no se envió el mail
    //       console.log('email no ok');
    //     }
    //   }
    // );
  }

  creaIncidencia(incidencia){
    console.log('crea Incidencia');
  this.newIncidenciaAutomatica =  new Incidencia(null,this.empresasService.seleccionada,'',this.empresasService.usuarioactivo.id,new Date,null,null,'',null,'Incidencias',0,null,0,null,'',-1);
  let control,valorc, minimo,maximo, tolerancia,critico : string;
  let bcontrol = control +": "+this.currentControl.nombre;
  let bvalorc = valorc + this.valor;
  let bminimo = minimo+ (this.currentControl.valorminimo ==null ? "":this.currentControl.valorminimo);
  let bmaximo = maximo+ (this.currentControl.valormaximo ==null ? "":this.currentControl.valormaximo);
  let btolerancia = tolerancia+ (this.currentControl.tolerancia ==null ? "":this.currentControl.tolerancia);
  let bcritico = critico+ (this.currentControl.critico ==null ? "":this.currentControl.critico);
  //let cabecera= '<br><img src="assets/img/logo.jpg" /><hr>';
  let descripcion = bcontrol+'\n'+ bvalorc+'\n'+ bminimo+'\n'+ bmaximo+'\n' +btolerancia+'\n'+bcritico+'\n';
    let idcontrol = this.idcontrol;
    let fecha = moment().format('YYYY-MM-DD HH:mm');
    let mensaje;
    this.translate.get("alertas."+incidencia).subscribe(resultado => { mensaje = resultado});

    this.newIncidenciaAutomatica.incidencia = 'Incidencia en ' + this.currentControl.nombre + ' valor: ' + this.valor;
    this.newIncidenciaAutomatica.fecha = new Date(Date.UTC(this.newIncidenciaAutomatica.fecha.getFullYear(), this.newIncidenciaAutomatica.fecha.getMonth(), this.newIncidenciaAutomatica.fecha.getDate(), this.newIncidenciaAutomatica.fecha.getHours(), this.newIncidenciaAutomatica.fecha.getMinutes()))
    this.newIncidenciaAutomatica.idempresa = this.empresasService.seleccionada;
    this.newIncidenciaAutomatica.responsable = this.empresasService.usuarioactivo.id;
    this.newIncidenciaAutomatica.estado = -1;
    this.newIncidenciaAutomatica.descripcion = mensaje;
    this.newIncidenciaAutomatica.origen = 'Controles';
    this.newIncidenciaAutomatica.origenasociado = 'Controles';
    this.newIncidenciaAutomatica.idOrigenasociado = 0;
    this.newIncidenciaAutomatica.foto = this.base64Image;
    console.log('fin crea Incidencia');
  }

  nuevaIncidencia(nuevaIncidenciaCreada){
    // this.newIncidencia = nuevaIncidenciaCreada;
    if(nuevaIncidenciaCreada!= null){
    this.incidencia["hayIncidencia"]= true;
    nuevaIncidenciaCreada.idOrigen=this.currentControl.id;
    nuevaIncidenciaCreada.idOrigenasociado=0;
    nuevaIncidenciaCreada.origen='Controles';
    nuevaIncidenciaCreada.origenasociado='Controles';
    this.newIncidencia = nuevaIncidenciaCreada;
    }else{
      this.incidencia["hayIncidencia"]= false;
      this.newIncidencia = nuevaIncidenciaCreada;;
    }
  }


  saveIncidencia(id,incidencia: Incidencia){

    console.log('saveIncidencia',incidencia);
    incidencia.idOrigen = id;
    let param = '&entidad=incidencias';

    this.servidor.postObject(URLS.STD_ITEM,incidencia,param).subscribe(
      (resultado)=>{
        console.log(resultado);
        incidencia.id = resultado.id;
        this.sync.sendMailIncidencia(incidencia);
      }
    );
    
}
}
