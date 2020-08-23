import { MutacionesNombres } from "../mutations/mutaciones";

export default ({ commit }) => {
  commit(MutacionesNombres.SetUsuario, undefined);
  localStorage.removeItem("authtoken");
};
