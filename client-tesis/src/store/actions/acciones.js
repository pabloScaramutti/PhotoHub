import login from "./login";
import logout from "./logout";

const AccionesNombres = {
  Login: "login",
  Logout: "logout"
};

const AccionesFunciones = {
  [AccionesNombres.Login]: login,
  [AccionesNombres.Logout]: logout
};

export { AccionesNombres, AccionesFunciones };
