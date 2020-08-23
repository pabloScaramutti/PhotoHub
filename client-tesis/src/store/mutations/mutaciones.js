import setUsuario from "./setUsuario";
//import logout from './logout';

const MutacionesNombres = {
  SetUsuario: "setUsuario"
  //Logout: 'logout'
};

const MutacionesFunciones = {
  [MutacionesNombres.SetUsuario]: setUsuario
  //[AccionNombres.Logout]: logout
};

export { MutacionesNombres, MutacionesFunciones };
