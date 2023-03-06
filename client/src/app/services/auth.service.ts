import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
import { Constants } from '../constants/constants';
import { User } from '../models/user';
import { Error } from '../models/error';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  private URL: string = Constants.API_VERSION;
  private user?: User = undefined;
  public userSubject: BehaviorSubject<User | undefined> = new BehaviorSubject<
    User | undefined
  >(undefined);

  constructor(private http: HttpClient) {
    this.ngOnInit();
  }

  ngOnInit() {
    this.getAuthenticatedUser().subscribe();
  }

  isAuthenticated() {
    return this.user != undefined;
  }

  setUser(user: User | undefined): void {
    this.user = user;
    if (this.user) {
      window.localStorage.setItem('user', JSON.stringify(user));
    } else {
      window.localStorage.removeItem('user');
    }
    this.userSubject.next(user);
  }

  fetchUser(): Observable<User | Error> {
    return this.http.get<User>(this.URL + '/who/').pipe(
      tap((user) => {
        if (typeof user === 'object' && 'id' in user) {
          this.setUser(user);
        } else {
          this.returnError(user);
        }
      })
    );
  }

  returnError(error: Error): Observable<Error> {
    return of(error);
  }

  getAuthenticatedUser(): Observable<User | Error> {
    let txt = window.localStorage.getItem('user');
    if (txt) {
      let user: User = JSON.parse(txt as string) as User;
      this.setUser(user);
      return of(user);
    } else {
      return this.fetchUser();
    }
  }

  login(username: string, password: string): Observable<User | Error> {
    const API = this.URL + '/login';
    const formData = new HttpParams()
      .set('email', username)
      .set('password', password);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    return this.http
      .post<User | Error>(API, formData, { headers: headers })
      .pipe<User | Error>(
        tap((u) => {
          if (typeof u === 'object' && 'msg' in u) {
            this.getError(u);
          } else {
            this.setUser(u);
          }
        })
      );
  }

  getError(error: Error): Error {
    return error;
  }

  logout() {
    const API = this.URL + '/logout';
    return this.http
      .post<User>(API, {})
      .pipe(tap(() => this.setUser(undefined)));
  }
}
