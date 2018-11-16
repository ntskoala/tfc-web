import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormControl, FormGroupDirective, NgForm, Validators,ReactiveFormsModule} from '@angular/forms';
import { map } from 'rxjs/operators';

import {TranslateService} from '@ngx-translate/core';

import {Sync} from '../../providers/sync';
import {EmpresasService} from '../../providers/empresas.service';
import {Servidor} from '../../providers/servidor.service';
import { PeriodosService } from '../../providers/periodos.service';

import {Maquina} from '../../models/maquina';
import {Mantenimiento} from '../../models/mantenimiento';
import {mantenimientoRealizado} from '../../models/mantenimientorealizado';
import { URLS } from '../../models/urls'
import * as moment from 'moment';



@Component({
  selector: 'app-mcorrectivos',
  templateUrl: './mcorrectivos.component.html',
  styleUrls: ['./mcorrectivos.component.css']
})
export class McorrectivosComponent implements OnInit {
  @Output() status:EventEmitter<string> = new EventEmitter<string>();

  public insertMantenimiento: mantenimientoRealizado= new mantenimientoRealizado(null,0,null,'','',
  moment(new Date()).toDate(),moment(new Date()).toDate(),this.empresasService.usuarioactivo.id,'','','',
  "interno","correctivo",'','',this.empresasService.usuarioactivo.idempresa,0,0);
  public hoy: Date = new Date();
  public fecha_prevista: Date;
  public maquinas: Maquina[];
  public piezas: object[];
  public selectedMachine:number=null;
  public fecha: Date = new Date();
  
  public checkForm = new FormGroup({
    maquina: new FormControl('', [Validators.required]),
    pieza:new FormControl(),
    cantidadPiezas:new FormControl(0, [Validators.required,Validators.pattern('[0-9]')]),
    mantenimiento: new FormControl('', [Validators.required]),
    fecha: new FormControl('', [Validators.required]),
    tipo:new FormControl(),
    elemento:new FormControl(),
    causas:new FormControl(),
    descripcion:new FormControl(),
    responsable:new FormControl()
  });
  constructor(  private translate: TranslateService, public sync: Sync, public empresasService: EmpresasService, 
    public servidor: Servidor, public periodos: PeriodosService) {
    }

    ngOnInit() {
      this.getMaquinas();

      this.checkForm.patchValue({maquina:null,mantenimiento:'',fecha:this.fecha,tipo:'interno',elemento:'',causas:'',descripcion:'',responsable:''})
      // this.checkForm.get('fecha').valueChanges.subscribe(
      //   (valor)=>{
      //     console.log('cambio fecha',valor);
      //   }
      // );
    }
    
getMaquinas(){
  let empresa = this.empresasService.usuarioactivo.idempresa;
   this.sync.getMisMaquinas(empresa).pipe(map(res => res.json())).subscribe(
    data => {
       let resultados = JSON.parse(data);
        //    console.log('resultado check: ' + resultados.success);
        //    console.log('success check: ' +this.mischecks.data[0].nombre);
        if (resultados.success){
          this.maquinas=[];
            resultados = resultados.data;
            console.log(resultados);
            if (resultados){
            //console.log("misMantenimientos: ", resultados);       
              resultados.forEach (maquina => {
                  this.maquinas.push(new Maquina(maquina.idMaquina,
                    maquina.nombreMaquina));
              });
              }
        }
      },
    err => console.error(err),
    () => {}
    //console.log('getMantenimientos completed')
);

}
setDate(){
  console.log('fecha',this.checkForm.get('fecha').value);
}

    terminar(resultado){

    console.log(resultado);
      this.insertMantenimiento.fecha = new Date(Date.UTC(resultado.fecha.getFullYear(), resultado.fecha.getMonth(), resultado.fecha.getDate()))
    
      this.insertMantenimiento.fecha_prevista = this.insertMantenimiento.fecha;
      this.insertMantenimiento.causas = resultado.causas;
      this.insertMantenimiento.descripcion = resultado.descripcion;
      this.insertMantenimiento.elemento = resultado.elemento;
      this.insertMantenimiento.mantenimiento = resultado.mantenimiento;
      this.insertMantenimiento.tipo = resultado.tipo;
      this.insertMantenimiento.responsable = resultado.responsable;
      console.log(this.insertMantenimiento);
      
      this.insertMantenimiento.idmaquina = this.selectedMachine;
      this.insertMantenimiento.maquina = this.maquinas[this.maquinas.findIndex((maquina)=>maquina.idMaquina==this.selectedMachine)].nombreMaquina;
      this.insertMantenimiento.pieza = resultado.pieza || 0;
      this.insertMantenimiento.cantidadPiezas = resultado.cantidadPiezas || 0;
                  let param = "&entidad=mantenimientos_realizados"+"&idempresa="+this.empresasService.usuarioactivo.idempresa+"&userId="+this.empresasService.usuarioactivo.id;
                this.servidor.postObject(URLS.STD_ITEM, this.insertMantenimiento,param).subscribe(
                  response => {
                    if (response.success) {
                      console.log('Mantenimiento correctivo sended', response.id);
                     this.status.emit('Home');
                    }
                  },
                  error => console.log(error),
                  () => { });
    }

cambio(evento){
  console.log('Cambiado',evento,this.insertMantenimiento.mantenimiento);
}
  cancelar(){
    console.log('cancelado');
    this.status.emit('Home');
  }

  maquinaChanged_selectPiezas(event){
    console.log(event.value);
    let idMaquina = event.value;
                  let param = "&entidad=maquina_piezas"+"&idempresa="+this.empresasService.usuarioactivo.idempresa+"&field=idmaquina&idItem="+idMaquina;
                this.servidor.getObjects(URLS.STD_SUBITEM,param).subscribe(
                  response => {
                    if (response.success) {
                      //console.log('piezas', response.data);
                      this.piezas=[{"id":0,"nombre":'ninguna'}];
                      let resultados = response.data;
                      console.log(resultados);
                      if (resultados){
                      //console.log("misMantenimientos: ", resultados);       
                        resultados.forEach (pieza => {
                            this.piezas.push({"id":pieza.id,"nombre":pieza.nombre});
                        });
                        }
                    }
                  },
                  error => console.log(error),
                  () => { });
  }
}
