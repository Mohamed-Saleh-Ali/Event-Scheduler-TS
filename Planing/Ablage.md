  // function logOf(){
  //   loggedOf()
  //   localStorage.removeItem('e-api-token');// added clear Localstorage when Logout is clicked
  // }



  function getToken() {
  return localStorage.getItem('e-api-token')
  console.log('getToken called, token:', localStorage.getItem('e-api-token'))
}

// Decodes the JWT payload without any extra dependency.
// Token shape (per events-api): { id, email, iat, exp }
export function decodeToken(token = getToken()) {
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export function isLoggedIn() {
  const decoded = decodeToken()
  if (!decoded) return false
  // exp is in seconds, Date.now() in ms
  return decoded.exp * 1000 > Date.now()
}
