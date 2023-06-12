export function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

import jwt_decode from 'jwt-decode'

// Función para obtener los datos del usuario logueado a partir del token JWT
export function getUserFromToken() {
  try {
    const token = getCookie('token');
    
    if (token) {
        const user = jwt_decode(token);
        return user; // El objeto decodificado contiene los datos del usuario logueado
    }
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
}
