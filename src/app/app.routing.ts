import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from '../pages/login/login';
// import { EmpresaComponent } from './components/empresa.component';
// import { EmpresasComponent } from './components/empresas.component';
// import { PageNotFoundComponent } from './components/404.component';

const appRoutes: Routes = [
  {path: 'home', component: AppComponent},
 //  {path: '?descripcion0=&descripcion1=&descripcion2=', component: AppComponent},
  // {path: 'empresa/:idEmpresa', component: EmpresaComponent},
  // {path: '404', component: PageNotFoundComponent},
  //{path: '**', redirectTo: 'login'}
 // {path: '**', component: AppComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
