import login from "./login";
import logout from "./logout";
import registro from "./registro";

const AccionesNombres = {
  Login: "login",
  Logout: "logout",
  Registro: "registo"
};

const AccionesFunciones = {
  [AccionesNombres.Login]: login,
  [AccionesNombres.Logout]: logout,
  [AccionesNombres.Registro]: registro
};

export { AccionesNombres, AccionesFunciones };
