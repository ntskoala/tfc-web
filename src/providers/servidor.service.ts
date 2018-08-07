import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { map } from 'rxjs/operators';
// import 'rxjs/add/operator/map';

@Injectable()
export class Servidor {

  constructor (private llamada: Http) {}
  
  login(url: string, param: string, payload = '') {
    param +=  "&origen=tfcweb";
    return this.llamada.post(url + param, payload)
    .pipe(map(res => JSON.parse(res.json())
    ))
  }

  getObjects(url: string, param: string) {
    let parametros = '?token=' + sessionStorage.getItem('token') + param; 
    return this.llamada.get(url + parametros)
      .pipe(map((res: Response) => JSON.parse(res.json())))
  }

  postObject(url: string, object: Object,param?: string) {
    let payload = JSON.stringify(object);        
    let parametros = '?token=' + sessionStorage.getItem('token')+param + "&origen=tfcweb";
    return this.llamada.post(url + parametros, payload)
      .pipe(map((res: Response) => JSON.parse(res.json())));
  }

  putObject(url: string, param: string, object: Object) {
    let payload = JSON.stringify(object);        
    let parametros = param + '&token=' + sessionStorage.getItem('token') + "&origen=tfcweb";
    return this.llamada.put(url + parametros, payload)
      .pipe(map((res: Response) => JSON.parse(res.json())));
  }
  
  deleteObject(url: string, param: string) {
    let parametros = param + '&token=' + sessionStorage.getItem('token') + "&origen=tfcweb";
    return this.llamada.delete(url + parametros)
      .pipe(map((res: Response) => JSON.parse(res.json())));
  }

  postLogo(url: string, files: File[], idEmpresa: string) {
    let formData: FormData = new FormData();
    let parametros = '?token=' + sessionStorage.getItem('token') + '&idempresa=' + idEmpresa + "&origen=tfcweb";
    formData.append('logo', files[0], files[0].name);
    return this.llamada.post(url + parametros, formData)
      .pipe(map((res: Response) => JSON.parse(res.json())));
  }

  postDoc(url: string, files: File[], entidad:string, idEntidad: string, idEmpresa: string, field?: string) {
    let formData: FormData = new FormData();
    let parametros = '?token=' + sessionStorage.getItem('token') + '&idEntidad=' + idEntidad +'&entidad=' + entidad+'&idEmpresa=' + idEmpresa+'&field=' + field+ "&origen=backoffice";
    formData.append('doc', files[0], files[0].name);
    return this.llamada.post(url + parametros, formData)
      .pipe(map((res: Response) => JSON.parse(res.json())));
  }
  
}
