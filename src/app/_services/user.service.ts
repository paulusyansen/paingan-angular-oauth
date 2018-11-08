import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll<Users>(): Observable<Users> {
        return this.http.get<Users>('http://localhost:8700/uaa/users');
    }

}