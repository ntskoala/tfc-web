import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
//import 'rxjs/add/operator/map';
//import { SQLite } from 'ionic-native';
import { Sync } from '../providers/sync';


/*
  Generated class for the Initdb provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Initdb {
public users: any;
public gerentes: any;
//private storage;
public logged: number;
//public db: SQLite;

  constructor(public http: Http, public sync: Sync) {
    console.log('Hello Initdb Provider');
  }




  sincronizate(){
     
      console.log("llamada sincronizando");

        //GERENTES
        // this.sync.setGerentes().subscribe(
        //     data => {
        //        this.gerentes = JSON.parse(data.json());
        //         if (this.gerentes.success){
        //             this.gerentes = this.gerentes.data;
        //             let array = [];
        //             this.gerentes.forEach (gerente => {
        //                     console.log(gerente.email);
        //                     array.push(gerente.email);
        //                     });
        //                 localStorage.setItem("email",array.toString());
        //                 }
        // },
        //     err => console.error(err),
        //     () => console.log('getGerentes completed')
        // );  
  }






}