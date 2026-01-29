export interface UserData {
    id?: number;
    name: string;
    email: string;
    password: string;
}
export interface userLogin {
    email: string;
    password: string;
}
export interface LoginResponse {
    user: UserData,
    token: string;
}