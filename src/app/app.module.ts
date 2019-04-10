import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import {TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

//**********PRIME NG MODULES */
import {CalendarModule} from 'primeng/primeng';
// import {ScheduleModule} from 'primeng/primeng';
// import {DialogModule} from 'primeng/primeng';
// import {LightboxModule} from 'primeng/primeng';
// import {TreeModule,TreeNode} from 'primeng/primeng';
// import {MultiSelectModule} from 'primeng/primeng';
// import {DataTableModule,SharedModule} from 'primeng/primeng';
// import {TableModule} from 'primeng/table';
  import {DropdownModule} from 'primeng/primeng';
// import {FieldsetModule} from 'primeng/primeng';
// import {PanelModule} from 'primeng/primeng';
// import {InputTextareaModule} from 'primeng/primeng';
// import {DragDropModule} from 'primeng/primeng';
// import {AccordionModule} from 'primeng/primeng';
// import {SpinnerModule} from 'primeng/primeng';
// import {GrowlModule} from 'primeng/primeng';
import {MessageService} from 'primeng/components/common/messageservice';
// import {ChartModule} from 'primeng/chart';
//import {ChartModule} from 'primeng/primeng';


//import { MAT_DATE_LOCALE} from '@angular/material-moment-adapter';
// import { MatButtonModule,MatToolbarModule } from '@angular/material';
// import {MatSnackBarModule} from '@angular/material/snack-bar';
// import {MatExpansionModule, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
import {OverlayModule} from '@angular/cdk/overlay';
import {MatIconModule } from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  // MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTabsModule,
  MatTooltipModule,
  MatSortModule,
  MatPaginatorModule,
  MAT_DATE_LOCALE
} from '@angular/material';

import { AppComponent } from './app.component';
import { LoginComponent } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { CheckPage } from '../pages/check/check';
import { ControlPage } from '../pages/control/control';
import { MyImages } from '../pages/images/images';

import { Sync } from '../providers/sync';
import { Initdb } from '../providers/initdb';
import {Servidor } from '../providers/servidor.service';
import {EmpresasService } from '../providers/empresas.service';
import {PeriodosService } from '../providers/periodos.service';
import {routing} from './app.routing';

import { Checklist } from '../models/checklist';
import { Control } from '../models/control';
import {ControlChecklist } from '../models/controlchecklist';
import {Modal} from '../models/modal';
import {ResultadoChecklist} from '../models/resultadochecklist';
import {ResultadoControl} from '../models/resultadocontrol';
import { URLS } from '../models/urls';
import {Usuario} from '../models/usuario';
import { CheckLimpiezaComponent } from '../pages/check-limpieza/check-limpieza.component';
import { MantenimientosComponent } from '../pages/mantenimientos/mantenimientos.component';
import { CompletarFechasComponent } from './completar-fechas/completar-fechas.component';
import { McorrectivosComponent } from '../pages/mcorrectivos/mcorrectivos.component';
import { BotonIncidenciaComponent } from './components/boton-incidencia/boton-incidencia.component';
import { InformesComponent } from '../pages/informes/informes.component';

@NgModule({
  exports: [
    // CDk
    OverlayModule,
    // Material
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    
    MatNativeDateModule,
    MatSortModule,
    MatPaginatorModule
  ],
  declarations: []
})
export class PlunkerMaterialModule {}






export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
// export function createTranslateLoader(http: Http) {
//     return new TranslateStaticLoader(http, './assets/i18n', '.json');
// }


@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    LoginComponent,
    CheckPage,
    ControlPage,
    MyImages,
    CheckLimpiezaComponent,
    MantenimientosComponent,
    McorrectivosComponent,
    InformesComponent,
    CompletarFechasComponent,
    BotonIncidenciaComponent
  ],
  imports: [
    BrowserModule,
    PlunkerMaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
        //PRIMENG
        CalendarModule,
        DropdownModule,
        TranslateModule.forRoot({
          loader: {
              provide: TranslateLoader,
              useFactory: createTranslateLoader,
              deps: [HttpClient]
          }
      }),
    // TranslateModule.forRoot({
    //         provide: TranslateLoader,
    //         useFactory: (createTranslateLoader),
    //         deps: [Http]
    //     }),
    routing
  ],  
  providers: [Sync, Initdb,Servidor,EmpresasService,PeriodosService, MessageService, {provide: MAT_DATE_LOCALE, useValue: 'es-ES'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
