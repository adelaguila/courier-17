import { Role } from "./role";

export class User{
    idUser: number;
    username: string;
    name: string;
    telefono?: string;
    avatar?: string;
    password?: string;
    enabled?: boolean;
    roles?: Role[];
    rolesCreate?: number[];
}
