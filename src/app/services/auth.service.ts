import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {
  }

  register(username: string, password: string) {
    return this.http.post(`${this.authUrl}/register`, {username, password});
  }

  login(username: string, password: string) {
    return this.http.post(`${this.authUrl}/login`, {username, password});
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}