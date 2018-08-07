import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {TranslateService} from '@ngx-translate/core';

import {Sync} from '../../providers/sync';
import {EmpresasService} from '../../providers/empresas.service';
import {Servidor} from '../../providers/servidor.service';
import { PeriodosService } from '../../providers/periodos.service';

import {Mantenimiento} from '../../models/mantenimiento';
import {mantenimientoRealizado} from '../../models/mantenimientorealizado';
import { URLS } from '../../models/urls'
import {Incidencia} from '../../models/incidencia';
import * as moment from 'moment';

@Component({
  selector: 'app-mantenimientos',
  templateUrl: './mantenimientos.component.html',
  styleUrls: ['./mantenimientos.component.css']
})
export class MantenimientosComponent implements OnInit {
  @Input() inputMantenimiento: Mantenimiento;
  @Output() status:EventEmitter<string> = new EventEmitter<string>();
 // @Output() askCompletarFechas:EventEmitter<boolean> = new EventEmitter<boolean>();
  
  public hoy: Date = new Date();
  public fecha_prevista: Date;
  public periodicidad: any;
//public rellenar :boolean;
public askCompletarFechas:boolean=false;
public completaFechas:boolean=false;
public newIncidencia: Incidencia = null;
public incidencia:any;
  constructor(  private translate: TranslateService, public sync: Sync, public empresasService: EmpresasService, 
    public servidor: Servidor, public periodos: PeriodosService) {
    }
    
  ngOnInit() {
    this.fecha_prevista = moment(this.inputMantenimiento.fecha_prevista).toDate();
    try{
     // console.log(this.inputMantenimiento.periodicidad);
      this.periodicidad = JSON.parse(this.inputMantenimiento.periodicidad);
    }catch(e){
      this.periodicidad = {'repeticion':'por uso'};
    }
    this.incidencia={'origen':'Mantenimiento','origenasociado':'mantenimiento_realizado','idOrigenasociado':this.inputMantenimiento.idMaquina,'idOrigen':null,'hayIncidencia':false,'incidencia':'Incidencia en ' +this.inputMantenimiento.nombreMantenimiento + ' de ' + this.inputMantenimiento.nombreMaquina}

  }


  cambio(evento,mantenimiento){
    mantenimiento.checked= evento.checked;
    //console.log(mantenimiento.checked,evento);
    }

    terminar(){
     // console.log(this.periodos.hayRetraso(this.inputMantenimiento.fecha_prevista,this.periodicidad))
      if(this.periodos.hayRetraso(this.inputMantenimiento.fecha_prevista,this.periodicidad)){
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
  // completarFechas(evento){
  //   this.completaFechas = evento.checked;
      
  // }

    terminar2(completaFechas?: Boolean){
      let empresa = this.empresasService.usuarioactivo.idempresa;
      let fecha = new Date();
      console.log(completaFechas);
      let idlocal = 0;
      let resultados = [];
    (completaFechas)? fecha = this.inputMantenimiento.fecha_prevista: fecha= this.hoy;
      // let idrespuesta = this.sync.setResultados(JSON.stringify(resultados), "resultadoschecklist", empresa)
      //   .subscribe(data => this.sendChecklistControles(data.id, idlocal));
    //********************* */
    
    
      let idempresa = this.empresasService.usuarioactivo.idempresa;
      let idusuario = this.empresasService.usuarioactivo.id;
    
      console.log("guardar",this.inputMantenimiento.fecha_prevista,fecha);
    
    if (this.inputMantenimiento.checked){
    
                let mantenimiento = new mantenimientoRealizado(null,this.inputMantenimiento.idMantenimiento,this.inputMantenimiento.idMaquina
                  ,this.inputMantenimiento.nombreMaquina,this.inputMantenimiento.nombreMantenimiento,this.inputMantenimiento.fecha_prevista,
                  fecha,this.empresasService.usuarioactivo.id,this.inputMantenimiento.responsable,this.inputMantenimiento.descripcion
                  ,'',this.inputMantenimiento.tipo,'preventivo','',this.inputMantenimiento.tipoMantenimiento,this.empresasService.usuarioactivo.idempresa);
                 let param = "&entidad=mantenimientos_realizados"+"&idempresa="+this.empresasService.usuarioactivo.idempresa+"&userId="+this.empresasService.usuarioactivo.id;
                this.servidor.postObject(URLS.STD_ITEM, mantenimiento,param).subscribe(
                  response => {
                    if (response.success) {
                     // console.log('limpieza realizada sended', response.id);
                     if (this.newIncidencia !== null) this.saveIncidencia(response.id);
                      this.updateFecha(this.inputMantenimiento.fecha_prevista,completaFechas);
                    }
                  },
                  error => console.log(error),
                  () => { });
    
    
    
    
    }
      //let respuesta = {'estado':'Home','ids':[this.inputMantenimiento.id],'elemento':'Mantenimiento'};
      //
      //this.status.emit(JSON.stringify(respuesta));
    }
    
    updateFecha(fecha,completaFechas){
        let proxima_fecha;
        if (moment(fecha).isValid()){
          proxima_fecha = moment(this.periodos.nuevaFecha(this.periodicidad,fecha,completaFechas)).format('YYYY-MM-DD');
        }else{
          alert('Mal formato en la fecha ' + fecha + ' se calculará a partir de hoy ' +this.hoy);
          proxima_fecha = moment(this.periodos.nuevaFecha(this.periodicidad,this.hoy)).format('YYYY-MM-DD');
        }    
        //console.log("updating fecha",proxima_fecha);
        if (moment(proxima_fecha).isAfter(moment(),'day')){
          let entidad;
                if (this.inputMantenimiento.tipoMantenimiento == 'mantenimiento'){
                  entidad = 'maquina_mantenimiento';
                }else{
                  entidad = 'maquina_calibraciones';
                }
                let param = "?entidad="+entidad+"&id="+this.inputMantenimiento.idMantenimiento+"&idempresa="+this.empresasService.usuarioactivo.idempresa+"&userId="+this.empresasService.usuarioactivo.id;
                
                 let mantenimiento={fecha:proxima_fecha};
                  this.servidor.putObject(URLS.STD_ITEM,param,mantenimiento).subscribe(
                  (resultado)=>{
                    this.status.emit('Home');
                  },//console.log(resultado),
                  (error)=>{},//console.log(error),
                  ()=>{},//console.log('fin updating fecha')
                );
              }else{

                console.log("sigue programando: ",proxima_fecha);
                this.inputMantenimiento.fecha_prevista = proxima_fecha;
                this.terminar2(true);
              }
    }
    
    cancelar(){
      console.log('cancelado');
      this.status.emit('Home');
    }

    nuevaIncidencia(nuevaIncidenciaCreada){
      // this.newIncidencia = nuevaIncidenciaCreada;
      if(nuevaIncidenciaCreada!= null){
        this.incidencia["hayIncidencia"]= true;
        nuevaIncidenciaCreada.idOrigen=this.inputMantenimiento.idMantenimiento;
        nuevaIncidenciaCreada.idOrigenasociado=this.inputMantenimiento.idMaquina;
        nuevaIncidenciaCreada.origen='Mantenimientos';
        nuevaIncidenciaCreada.origenasociado='mantenimientos_realizados';
        this.newIncidencia = nuevaIncidenciaCreada;
        }else{
          this.incidencia["hayIncidencia"]= false;
          this.newIncidencia = nuevaIncidenciaCreada;;
        }
    }

    saveIncidencia(id){
      console.log('saveIncidencia');
      this.newIncidencia.idOrigen = id;
      let param = '&entidad=incidencias';
  
      this.servidor.postObject(URLS.STD_ITEM,this.newIncidencia,param).subscribe(
        (resultado)=>{
          console.log(resultado);
          this.newIncidencia.id = resultado.id;
          this.sync.sendMailIncidencia(this.newIncidencia);
        }
      );
      
  }
}
