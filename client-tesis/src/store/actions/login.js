import { MutacionesNombres } from "../mutations/mutaciones";

export default ({ state, commit }, parametros) => {
  return new Promise((resolve, reject) => {
    state.request
      .post("/auth/local", parametros)
      .then(response => {
        commit(MutacionesNombres.SetUsuario, response.data.user);
        localStorage.setItem("authtoken", response.data.jwt);
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};
