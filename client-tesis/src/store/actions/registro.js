import { MutacionesNombres } from "../mutations/mutaciones";

export default ({ state, commit }, cuenta) => {
  return new Promise((resolve, reject) => {
    state.request
      .post("/auth/local/register", {
        username: cuenta.username,
        email: cuenta.mail,
        password: cuenta.password
      })
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
