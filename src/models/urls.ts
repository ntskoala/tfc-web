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
  STD_ITEM: base + 'std_item.php',
  STD_SUBITEM: base + 'std_subitem.php',


  UPLOAD_LOGO: base + 'logoempresa.php',
  FOTOS: server +'controles/',
  LOGOS: server + 'logos/',
  DOCS: server + 'docs/',
  UPLOAD_DOCS: base + 'uploads.php'

}
