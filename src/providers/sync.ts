import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/catch';
import 'rxjs/Rx';
import {Observable} from 'rxjs';
import { map,tap } from 'rxjs/operators';
import { URLS } from '../models/urls'
import * as moment from 'moment';
import {Servidor} from './servidor.service'
import {server} from '../environments/environment';
import { EmpresasService } from './empresas.service';


@Injectable()
export class Sync {
private posturl: string;
//private storage;
public idchecklist;
//public config: Config;
 //public baseurl: string = "http://tfc.proacciona.es/api";
 //public baseurl: string = "http://tfc.ntskoala.com/api";
 public baseurl: string = URLS.BASE;
 //public idempresa= localStorage.getItem("idempresa");
 public loader:any;

  constructor(public http: Http,public servidor: Servidor,private empresasService: EmpresasService) {
    console.log('Hello Sync Provider');
  }


public getMisControles(userid, idempresa): Observable<any>
{
    console.log ('get controles...baseurl',this.baseurl);

       let miscontroles = this.http.get(`${this.baseurl}/views/getcontroles.php?idempresa=${idempresa}&_dc=1470480375978`);
        return miscontroles;
        
    }

public getMisChecklists(userid, idempresa): Observable<any>
{console.log ('get checklists...baseurl',this.baseurl);
        let miscontroles2 = this.http.get(`${this.baseurl}views/getchecklists.php?idempresa=${idempresa}&_dc=1470480375978`);
        return miscontroles2;
    }

public getMisLimpiezas(userid, idempresa): Observable<any>
{
        let mislimpiezas = this.http.get(`${this.baseurl}/views/getlimpiezas.php?idempresa=${idempresa}&_dc=1470480375978`);
        return mislimpiezas;
    }
    public getMisMaquinas(idempresa): Observable<any>
    {
            let mismaquinas = this.http.get(`${this.baseurl}/views/getmaquinas.php?idempresa=${idempresa}&_dc=1470480375978`);
            return mismaquinas;
        }
public getMisMantenimientos(userid, idempresa): Observable<any>
    {
            let mislimpiezas = this.http.get(`${this.baseurl}/views/getmantenimientos.php?idempresa=${idempresa}&WHERE_USER=${userid}&version=2&_dc=1470480375978`);
            return mislimpiezas;
        }
        public getMisCalibraciones(userid, idempresa): Observable<any>
        {
                let mislimpiezas = this.http.get(`${this.baseurl}/views/getcalibraciones.php?idempresa=${idempresa}&WHERE_USER=${userid}&version=2&_dc=1470480375978`);
                return mislimpiezas;
            }
public setGerentes(idempresa): Observable<any>
{

    
    console.log("sincro misusers, empresa:" + idempresa);
    //alert ('idempresa' + this.config.idempresa);
        let misgerentes = this.http.get(`${this.baseurl}/views/getgerentes.php?idempresa=${idempresa}&_dc=1470480375978`);
        
        return misgerentes;
    }

setResultados(resultados,table,idempresa,incidencia?):any
{
   console.log('resultados ' + table + ": " +resultados);
    this.posturl = this.baseurl+'/actions/set'+table+'.php?idempresa='+idempresa+"&userId="+this.empresasService.usuarioactivo.id+"&plataforma=tfcweb";
    console.log(this.posturl);
        let params = resultados;

       return this.http.post(this.posturl, params)
            .pipe(map (res => JSON.parse(res.json())))
            .pipe(tap((data => {console.log(data);
                        //alert("data" + data);
                        console.log("control2" + table);
                         if (data.success== "true"){
                             console.log("insert correcto ",data, table,incidencia);
                             
                             }
                         else {
                             console.log ("ERROR EN EL INSERT " + table);
                             }
                        })));
            

}

updateFechaElemento() {

}

sendMailIncidencia(nuevaIncidencia){
    console.log("sendmail start: ");
    this.loadUsuarios(nuevaIncidencia.idempresa).then(
      (respuesta)=>{
    let responsables = respuesta["data"];
    console.log("sendmail got users: ",responsables);
    // let body = "Nueva incidencia creada desde " + nuevaIncidencia.origen + "<BR>Por: " +  responsables[responsables.findIndex((responsable)=>responsable["value"] == nuevaIncidencia.responsable)]["label"]
    // body +=   "<BR>Con fecha y hora: " + moment(nuevaIncidencia.fecha).format('DD-MM-YYYY hh-mm') +  "<BR>"
    // body +=   "<BR>Nombre: " + nuevaIncidencia.incidencia +  "<BR>"
    // body +=   "Descripción: " + nuevaIncidencia.descripcion;
    // body +=   "<BR>Solución inmediata propuesta: " + nuevaIncidencia.solucion;
    // body +=   "<BR>Ir a la incidencia: " + server + "empresas/"+ nuevaIncidencia.idempresa +"/incidencias/0/" + nuevaIncidencia.id + ""
    // if (nuevaIncidencia.origen != 'incidencias')
    // body +=    "<BR>Ir al elemento " + server + "empresas/"+ nuevaIncidencia.idempresa +"/"+ nuevaIncidencia.origenasociado +"/"+ nuevaIncidencia.idOrigenasociado +"/" + nuevaIncidencia.idOrigen + ""
    
    let body =    nuevaIncidencia.incidencia +  "<BR>"
    body +=    nuevaIncidencia.descripcion +  "<BR>";
    if (nuevaIncidencia.solucion.length >0) body +=   "Solución inmediata propuesta: " + nuevaIncidencia.solucion+ "<BR>";
    //body = "Nueva incidencia creada desde " + nuevaIncidencia.origen + "<BR>Por: " +  responsables[responsables.findIndex((responsable)=>responsable["value"] == nuevaIncidencia.responsable)]["label"]
    body +=   moment(nuevaIncidencia.fecha).format('DD-MM-YYYY hh-mm a') +  "<HR>"
    body +=   "<span style='float:lelft'><a href='" + server + "empresas/"+ nuevaIncidencia.idempresa +"/incidencias/0/" + nuevaIncidencia.id + "'><img src='https://tfc.proacciona.es/assets/images/verIncidencia.png'></a></span>";
    console.log(nuevaIncidencia.origen,nuevaIncidencia.origen != 'incidencias');
    if (nuevaIncidencia.origen != 'incidencias')
    body +=    "<span style='float:right'><a href='" + server + "empresas/"+ nuevaIncidencia.idempresa +"/"+ nuevaIncidencia.origenasociado +"/"+ nuevaIncidencia.idOrigenasociado +"/" + nuevaIncidencia.idOrigen + "'><img src='https://tfc.proacciona.es/assets/images/verElemento.png'></a></span>";

    let parametros2 = "&idempresa=" + nuevaIncidencia.idempresa + "&body="+body;
        this.servidor.getObjects(URLS.ALERTES, parametros2).subscribe(
          response => {
            if (response.success && response.data) {
              console.log('email alerta enviado');
            }
        },
        error =>{
            console.log('ERROR email',error)
        }
        );
      });
  }
  loadUsuarios(idEmpresa){
    return new Promise((resolve)=>{
      console.log("get users: ");
    let responsables :any[];
    let parametros2 = "&entidad=usuarios"+'&idempresa=' + idEmpresa;
        this.servidor.getObjects(URLS.STD_ITEM, parametros2).subscribe(
          response => {
            responsables = [];
            if (response.success && response.data) {
            //  console.log(response.data)
              for (let element of response.data) {  
                responsables.push({'label':element.usuario,'value':element.id});
             }
             resolve ({"data":responsables})
            }
        });
      });
  }

}
