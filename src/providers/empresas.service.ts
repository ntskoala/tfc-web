import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


import { Empresa } from '../models/empresa';
import { Usuario } from '../models/usuario';

@Injectable()
export class EmpresasService {
  // variables
  idioma: string = 'cat';
  seleccionada: number = 0;
  administrador: boolean = false;
  empresaActiva: number =0;
  exportar: boolean;
  //fichas_maquinaria: boolean;
//  empresa: Empresa;

  // fuente del observable
  private empresaSeleccionadaFuente = new Subject<Empresa>();
  private nuevaEmpresaFuente = new Subject<Empresa>();
  opcionesFuente = new Subject<boolean>();
  //usuarioactivo = new Subject<Usuario>();
 public usuarioactivo:Usuario;

  // streaming del observable
  empresaSeleccionada = this.empresaSeleccionadaFuente.asObservable();
  nuevaEmpresa = this.nuevaEmpresaFuente.asObservable();
  //exportar_informes = this.exportar_informesFuente.asObservable();

  seleccionarEmpresa(empresa: Empresa) {
      console.log("####EMPRESA SELECCIONADA:",empresa);
      this.seleccionada = empresa.id;
//      this.empresa = empresa;
      this.empresaSeleccionadaFuente.next(empresa);
  }

  empresaCreada(empresa: Empresa) {
      this.nuevaEmpresaFuente.next(empresa);
  }

setOpciones(valor: boolean){
  this.opcionesFuente.next(valor);
}

setUsuario(user: Usuario){
 // this.usuarioactivo.next(user);
  this.usuarioactivo = user;
}

check_Opcion() {
     //   return this.exportar_informes.asObservable();     
    }
}
