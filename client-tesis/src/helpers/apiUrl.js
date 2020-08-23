import servidor from "@/config/servidor.json";

export default function(ruta = "") {
  return /^http:|^https:/.test(ruta)
    ? ruta
    : `${servidor.host}:${servidor.puerto}${ruta}`;
}
