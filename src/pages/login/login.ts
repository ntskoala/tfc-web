
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
//import {MdSnackBar} from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';

import { Servidor } from '../../providers/servidor.service';
import { EmpresasService } from '../../providers/empresas.service';
import {TranslateService} from '@ngx-translate/core';
import { URLS } from '../../models/urls';
import { Modal } from '../../models/modal';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'login',
  templateUrl: './login.html',
   styleUrls: ['./login.scss'],
})

export class LoginComponent implements OnInit {
   @Output() status: EventEmitter<string>=new EventEmitter<string>();
  usuario: Usuario = new Usuario(0,'','','','',0);
  //usuario: Object = {"user":"admin","password":"admin$2017","idioma":"es"};
  //usuario: Usuario = new Usuario(0,'demo','demo','','',0);
  // usuario: Usuario = new Usuario(0,'Ana','123','','',0);
  modal: Modal = new Modal();
public idioma: string = null;
  constructor(private servidor: Servidor, private router: Router,
    private empresasService: EmpresasService, private translate: TranslateService, public snackBar: MatSnackBar) {}

ngOnInit(){
      sessionStorage.removeItem('token')
      if (localStorage.getItem('idioma') == 'es' || localStorage.getItem('idioma') == 'cat' ){
        this.idioma = localStorage.getItem('idioma');  
        this.translate.setDefaultLang(this.idioma);
        this.translate.use(this.idioma);      
      }else{
      this.translate.setDefaultLang('cat');
      this.translate.use('cat');

      }

}

  login(_usuario) {
    //this.empresasService.idioma = _usuario.idioma;
    if (!this.idioma) this.translate.use(_usuario.idioma);
    // Parámetros
    let param = '?user=' + this.usuario.usuario + '&password=' + this.usuario.password; 
    this.servidor.login(URLS.LOGIN, param).subscribe(
      response => {
        // Limpiar form
        console.log(response)
        this.usuario.usuario = '';
        this.usuario.password= '';  
        // Si el usuario es correcto
        if (response.success == 'true') {
          // Guarda token en sessionStorage
          sessionStorage.setItem('token', response.token);
          if (this.usuario.idioma == 'es' || this.usuario.idioma == 'cat') localStorage.setItem('idioma', this.usuario.idioma);
          this.usuario.email = response.data[0].email;
          this.usuario.idempresa = response.data[0].idempresa;
          this.usuario.id = response.data[0].id;
          this.usuario.tipouser = response.data[0].tipouser;
          this.usuario.superuser = response.data[0].superuser;
          console.log (this.usuario);
          this.empresasService.setUsuario(this.usuario);
          this.empresasService.seleccionada=response.data[0].idempresa;
          this.cambiaEstado('Home');
          
              // this.router.navigate(['empresas']);
              // this.empresasService.administrador = true;
        } else {
          // TODO: chequear si la sesión está caducada
          // Usuario erróneo
          // this.modal.titulo = 'Usuario incorrecto';
          // this.modal.visible = true;
          this.snackBar.open('Login error', '',{duration: 4000,});
        }
      }
    );
  }

cambiaEstado(estado){
  console.log(estado)
this.status.emit(estado);
}

  cerrarModal() {
    this.modal.visible = false;
  }



}

