const HOST = "localhost"
export const CONTEXT_PATH = import.meta.env.VITE_API_URL ? "" : "/"
export const BACKEND_PORT = "8041"
export const HOST_URL = import.meta.env.VITE_API_URL || ("http://" + HOST + ":" + BACKEND_PORT)
//export const SOCKET_URL = "http://" + HOST + ":8090"
export const PATH_PREFIX = "/"
export const STATIC_PATH = "/static/"
