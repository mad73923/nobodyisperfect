import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: number) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    getUserNameById(id: number) {
        return this.http.get<String>(`${environment.apiUrl}/users/username/${id}`);
    }

    addNewUser(newUser: User){
        return this.http.post<any>(`${environment.apiUrl}/users/add`, newUser);
    }
}
