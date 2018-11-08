export class Users{
    user: User[];
}

export interface User {
    id: number;
    username: string;
    password: string;
    active: number;
    firstname: string;
    lastname: string;
    roles: Role[]
}

export interface Role {
    id: number;
    role: string;
}
