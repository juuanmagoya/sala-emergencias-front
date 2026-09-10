export interface Usuario {
    id: string;
    nombre: string;
    email: string;
    rol: "admin";
}

export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    usuario: Usuario;
}