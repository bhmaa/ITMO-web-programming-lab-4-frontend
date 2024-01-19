import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EMPTY, Observable, Subject, tap} from 'rxjs';
import {Hit} from '../model/hit';

@Injectable({
  providedIn: 'root',
})
export class HitsService {
  private hitsUrl = "http://localhost:8080/hits";
  private reloadRequest = new Subject<void>();

  constructor(private http: HttpClient) {
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found in localStorage');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getHits(): Observable<Hit[]> {
    try {
      const headers = this.getHeaders();
      return this.http.get<Hit[]>(`${this.hitsUrl}/all`, {headers});
    } catch (error) {
      console.error(error);
      return EMPTY;
    }
  }

  addHit(coordinates: { x: string; y: string; r: string }): Observable<any> {
    try {
      const headers = this.getHeaders();
      return this.http.post(this.hitsUrl, coordinates, {headers: headers}).pipe(
        tap(() => {
          this.reloadHits();
        })
      );
    } catch (error) {
      console.error(error);
      return EMPTY;
    }
  }

  clearHits(): Observable<any> {
    try {
      const headers = this.getHeaders();
      return this.http.delete(this.hitsUrl, {headers: headers}).pipe(
        tap(() => {
          this.reloadHits();
        })
      );
    } catch (error) {
      console.error(error);
      return EMPTY;
    }
  }

  private reloadHits() {
    this.reloadRequest.next();
  }

  get reloadRequest$(): Observable<void> {
    return this.reloadRequest.asObservable();
  }
}
