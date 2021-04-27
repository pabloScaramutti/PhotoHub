

export function formatLat(lat) {
  return `${lat < 0
    ? (lat * -1).toString() + " S"
    : lat.toString() + " N"
    }`;
}

export function formatLng(lng) {
  return `${lng < 0
    ? (lng * -1).toString() + " W"
    : lng.toString() + " E"
    }`;
}

export function formatGPSPosition(lat, lng) {
  return `${formatLat(lat)} , ${formatLng(lng)}`;
}

export default { formatLat, formatLng, formatGPSPosition }