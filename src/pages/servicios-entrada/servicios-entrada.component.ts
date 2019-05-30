import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {FormGroup, FormControl, FormGroupDirective, NgForm, Validators,ReactiveFormsModule} from '@angular/forms';
import * as moment from 'moment';
import {EmpresasService} from '../../providers/empresas.service'
import {ProveedorLoteProducto} from '../../models/entradaMP';
import {TranslateService} from '@ngx-translate/core';
import { Servidor } from '../../providers/servidor.service';
import { URLS, dropDownMedidas } from '../../models/urls';

@Component({
  selector: 'app-servicios-entrada',
  templateUrl: './servicios-entrada.component.html',
  styleUrls: ['./servicios-entrada.component.css']
})
export class ServiciosEntradaComponent implements OnInit {
  @Output() status:EventEmitter<string> = new EventEmitter<string>();
  @Output() checklistSeleccionado: EventEmitter<Object>=new EventEmitter<Object>();
  public nuevaEntradaMP:ProveedorLoteProducto=new ProveedorLoteProducto(null,'',new Date(),new Date(),null,'',0,'',0,0,this.empresasService.seleccionada,null,null);
  public productos: any[]=[];
  public proveedores: any[]=[];
  public idProveedorActual:number;
  public idProductoActual:number;
  public medidas: object[]=dropDownMedidas;
  public hayTrigger:boolean=false;
  public nextOption:boolean=false;
  public albaran:string='';
  public checkForm = new FormGroup({
    albaran: new FormControl('', [Validators.required]),
    numlote_proveedor: new FormControl('', [Validators.required]),
    idproveedor: new FormControl('', [Validators.required]),
    idproducto:new FormControl(),
    cantidad_inicial:new FormControl(null, Validators.required),
    fecha_caducidad: new FormControl('', [Validators.required]),
    tipo_medida:new FormControl('', [Validators.required])
  });
  constructor(
    private translate: TranslateService, 
    // public sync: Sync, 
    public servidor: Servidor,
    public empresasService: EmpresasService
  ) { }

  ngOnInit() {
    this.hayTriggerServiciosEntrada();
    this.getProveedores();

  }





  getProveedores(){
    let parametros = '&idempresa=' + this.empresasService.seleccionada+"&entidad=proveedores"; 
    this.servidor.getObjects(URLS.STD_ITEM, parametros).subscribe(
      response => {
        let valores = '';
        this.proveedores=[];
        //this.proveedores.push({"id":0,"nombre":"selecciona"});
        if (response.success && response.data) {
          for (let element of response.data) { 
              this.proveedores.push({"id":element.id,"nombre":element.nombre}); 
         }
  }
},
    error=>console.log(error),
    ()=>{}
    ); 
  }

  getProductos(idProveedor){
    console.log(idProveedor)
    this.productos=[{"id":0,"nombre":'Selecciona'}];
    let param = "&entidad=proveedores_productos"+"&field=idproveedor&idItem="+idProveedor;
    this.servidor.getObjects(URLS.STD_SUBITEM, param).subscribe(
      response => {
        //this.proveedores.push({"id":0,"nombre":"selecciona"});
        if (response.success && response.data) {
          for (let element of response.data) { 
              this.productos.push({"id":element.id,"nombre":element.nombre});
         }
  }
},
    error=>console.log(error),
    ()=>{}
    );    

  }

  hayTriggerServiciosEntrada(){
    //let where= encodeURI("entidadOrigen=\'proveedores_entradas_producto\' AND entidadDestino=\'checklist\'");
      let parametros = '&idempresa=' + this.empresasService.seleccionada+"&entidad=triggers";
        this.servidor.getObjects(URLS.STD_ITEM, parametros).subscribe(
          response => {
            console.log(response);
            if (response.success == 'true' && response.data) {
              console.log(response.data,response.data.length)
  
              for (let element of response.data) {
                if (element.entidadOrigen == 'proveedores_entradas_producto' && element.entidadDestino=='checklist'){
                  this.hayTrigger=true;
                  localStorage.setItem('triggerEntradasMP',element.idDestino);
                }
                }
            }
        },
    error =>{
        console.debug(error);
        console.log('hay Trigger servicios entrada' + error);
        },
        ()=>{});
  }


  terminar(resultado){
    this.albaran=resultado.albaran;
    console.log(resultado);
      this.nuevaEntradaMP.fecha_entrada = moment().toDate();
      this.nuevaEntradaMP.fecha_caducidad = new Date(Date.UTC(resultado.fecha_caducidad.getFullYear(), resultado.fecha_caducidad.getMonth(), resultado.fecha_caducidad.getDate()))
      this.nuevaEntradaMP.numlote_proveedor = resultado.numlote_proveedor;
      this.nuevaEntradaMP.albaran = resultado.albaran;
      this.nuevaEntradaMP.idproveedor = resultado.idproveedor;
      this.nuevaEntradaMP.idproducto = resultado.idproducto;
      this.nuevaEntradaMP.tipo_medida = resultado.tipo_medida;
      this.nuevaEntradaMP.cantidad_inicial = resultado.cantidad_inicial;
      this.nuevaEntradaMP.cantidad_remanente = resultado.cantidad_inicial;
      console.log(this.nuevaEntradaMP);
      
                let param = "&entidad=proveedores_entradas_producto"+"&idempresa="+this.empresasService.usuarioactivo.idempresa+"&userId="+this.empresasService.usuarioactivo.id;
                // this.servidor.postObject(URLS.STD_ITEM, this.nuevaEntradaMP,param).subscribe(
                //   response => {
                //     if (response.success) {
                //       console.log('Materia prima sended', response.id);
                //      //this.status.emit('Home');
                      this.next();
                //     }
                //   },
                //   error => console.log(error),
                //   () => { });
    }

    next(){
      console.log('Ask next MP || Checklist || fin');
      this.nextOption = true;
    }
    doNext(opcion){
      this.nextOption=false;
      switch(opcion){
        case "nueva":
        this.nuevaEntradaMP=new ProveedorLoteProducto(null,'',new Date(),new Date(),null,'',0,'',0,0,this.empresasService.seleccionada,null,null);
        this.checkForm.reset({'albaran':this.albaran});
        break;
        case "check":
        //this.checklistSeleccionado.emit({"controles":this.controleschecklist,"checklist":checklist});
        this.checklistSeleccionado.emit({'idchecklist':localStorage.getItem('triggerEntradasMP'),'lote':this.nuevaEntradaMP,'albaran':this.nuevaEntradaMP.albaran});
        this.status.emit('Checklist');
        break;
        case "fin":
        this.status.emit('Home');
        break;
      }

    }

    cancelar(){
      this.status.emit('Home');
    }
}
