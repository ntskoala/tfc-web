//let server = 'https://tfc.proacciona.es/'; //prod
//let server = 'http://tfc.ntskoala.com/';//DESARROLLO
import {server} from '../environments/environment';
let base = server + 'api/';

export const URLS = {
  BASE: base,
  LOGIN: base + 'actions/login.php',
  EMPRESAS: base + 'empresas.php',
  OPCIONES: base + 'opciones.php',
  OPCIONES_EMPRESA: base + 'opcionesempresa.php',
  USUARIOS: base + 'usuarios.php',
  CONTROLES: base + 'controles.php',
  CHECKLISTS: base + 'checklist.php',
  CONTROLCHECKLISTS: base + 'controlchecklist.php',
  PERMISSION_USER_CONTROL: base + 'permissionusercontrol.php',
  PERMISSION_USER_CHECKLIST: base + 'permissionuserchecklist.php',
  RESULTADOS_CONTROL: base + 'resultadoscontrol.php',
  RESULTADOS_CHECKLIST: base + 'resultadoschecklist.php',
  PERIODICIDAD_CONTROL: base + 'periodicidadcontrol.php',
  PERIODICIDAD_CHECKLIST: base + 'periodicidadchecklist.php',
  ALERTAS: base + 'alertes.php',//email automático de valores de control superados
  ALERTES: base + 'alertes.php',//email automático de incidencias
  PIEZAS: base + 'piezas.php',
  STD_ITEM: base + 'std_item.php',
  STD_SUBITEM: base + 'std_subitem.php',


  UPLOAD_LOGO: base + 'logoempresa.php',
  FOTOS: server +'controles/',
  LOGOS: server + 'logos/',
  DOCS: server + 'docs/',
  UPLOAD_DOCS: base + 'uploads.php'

}


let medidas;
if (localStorage.getItem("idioma")=='es'){
medidas = [{'label':'Kg.','value':'Kg.'},{'label':'g.','value':'g.'},{'label':'l.','value':'l.'},{'label':'ml.','value':'ml.'},{'label':'unidades','value':'unidades'}];
}
if (localStorage.getItem("idioma")=='cat'){
medidas = [{'label':'Kg.','value':'Kg.'},{'label':'g.','value':'g.'},{'label':'l.','value':'l.'},{'label':'ml.','value':'ml.'},{'label':'unitats','value':'unidades'}];
}
export const dropDownMedidas=medidas;
