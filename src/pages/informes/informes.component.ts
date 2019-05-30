import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import {EmpresasService} from '../../providers/empresas.service'
import {Servidor} from '../../providers/servidor.service'

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css']
})
export class InformesComponent implements OnInit {
  @Output() onExit: EventEmitter<string>= new EventEmitter<string>();
  public exportar_informes: boolean =false;
  public exportando:boolean=false;
  public innerHtml='';
  public xls:boolean=false;
  public pdf: boolean;
  public html;
  public progreso:number=0;
  public speed=1200;
  public informeData;
  public informeRecibido;
  public int;
  constructor(public servidor: Servidor, public empresasService: EmpresasService) { }

  ngOnInit() {
    
  }

close(){
  this.onExit.emit('close')
}


  async downloads(){
    this.progress(10);
     //let url ='https://script.google.com/a/proacciona.es/macros/s/AKfycbzIpotMyRcSxISIMvMLWN0-boPG8drRZ9wD8IQO5eQ/dev?idEmpresa='+this.empresasService.seleccionada;
     let url ='https://script.google.com/a/proacciona.es/macros/s/AKfycbzumyP_ybsAfEC_I0xww2Pz5XPOJim-51zCoEnFBhjl/dev';
     let param = '?idempresa='+this.empresasService.seleccionada+'&download=pdf';
    this.innerHtml += 'Solicitado<br>...';
    this.servidor.getSimple(url,param).subscribe(
      async (respuesta)=>{
        console.log('########',respuesta.json());
        this.progreso=90;
        this.innerHtml += respuesta.json()["contenido"];
        let descargaUrl = respuesta.json()["url"]; 
        let descargaPdf = respuesta.json()["urlPdf"]; 
        let id = respuesta.json()["id"]; 
        let time=0;
      //if (this.pdf){
        this.innerHtml += '<br>Descarga Pdf...<br>';
        time=6000;
        let aPdf = document.createElement('a');
        this.downloadInforme(descargaPdf,aPdf,'aPdf').then(
          (valor)=>{
            setTimeout(()=>{this.deleteInformeOnDrive(url,id)},2500);
          }
        )
        this.pdf = false;
        if (!this.pdf && !this.xls) 
        setTimeout(()=>{this.onExit.emit('true')},5000);
        //}
        // if (this.xls){
        //   this.innerHtml += 'Descarga Xls...<br>';
        //   let aXls = document.createElement('a');
        //   setTimeout(async()=>{
        //   await  this.downloadInforme(descargaUrl,aXls,'aXls')
        //   this.xls = false;
        //           if (!this.pdf && !this.xls) 
        //           this.onExit.emit('true');
        //         },time)
        //       }
        

        },
        (error)=>{
          console.log('ERROR SCRIPTING ',error);
          this.innerHtml += '<br><span class="alert">Se ha producido un error inesperado, cierra esta ventana y vuelve a intentarlo más tarde</span>';
        },
        ()=>{
          this.progress(80);
        }
    )
  }
  progress(start){
    clearInterval(this.int);
    this.progreso=start;
    //for (let x=start;x<100;x++){
      this.int = setInterval(()=>{
        this.progreso+=1;
       // console.log(this.progreso,"*",this.speed);
        if (this.progreso>50 && this.progreso<80) this.speed = 2000;
        if (this.progreso>60 && this.progreso<80) this.speed = 4000;
        if (this.progreso>70 && this.progreso<80) this.speed = 5000;
        if (this.progreso>80 && this.progreso<90) this.speed = 7000;
        if (this.progreso>99 ) clearInterval(this.int)
        },this.speed)
    //}
  }

  downloadInforme(file_path,a,id){
return new Promise((resolve)=>{
    a.href = file_path;
    a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
    a.id=id;
    console.log('INI DOWNLOAD',a,file_path);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this.innerHtml += 'descargado<br>';
    clearInterval(this.int);
    this.progreso=100;
    resolve (true);
  });
  }

  deleteInformeOnDrive(url,id){
    let deleteFile={'accion':'delete','id':id}
    let param2='?accion=delete&id='+id;
    console.log('DELETING',deleteFile);
    this.servidor.getSimple(url,param2).subscribe(
      (resultado)=>{
        console.log(resultado);
      });
  }
}
