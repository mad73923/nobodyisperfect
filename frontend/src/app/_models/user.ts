import { Role } from "./role";

export class User {
    _id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role[];
    jwtToken?: string;
}
