import { Injectable } from '@angular/core';
import { Constants } from '../constants/constants';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { User } from '../models/user';
import { Theme } from '../models/theme';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private URL: string = Constants.API_VERSION;
  constructor(private http: HttpClient) {}

  update(defaults: Theme): Observable<User> {
    console.log(`ATTEMPTING DEFAULTS: [${JSON.stringify(defaults)}]`);
    return this.http
      .put<User>(this.URL + '/defaults/', defaults, { withCredentials: true })
      .pipe(
        tap((user) => {
          console.log(`${user}`);
          this.returnUser(user);
        }),
        catchError((error) => {
          console.error('ERROR:', error);
          return throwError(error);
        })
      );
  }

  returnUser(user: User): Observable<User> {
    return of(user);
  }
}
