import { Injectable } from '@angular/core';
import { Constants } from '../constants/constants';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Theme } from '../models/theme';
import { Error } from '../models/error';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private URL: string = Constants.API_VERSION;
  constructor(private http: HttpClient) {}

  update(
    color: String,
    playerToken: String,
    computerToken: String
  ): Observable<Theme | Error> {
    return this.http
      .put<Theme | Error>(this.URL + '/defaults/', {
        playerToken: playerToken,
        computerToken: computerToken,
        color: color,
      })
      .pipe(
        tap((result) => {
          return of(result);
        })
      );
  }
}
