import { Injectable } from '@angular/core';
import { Constants } from '../constants/constants';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Theme } from '../models/theme';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private URL: string = Constants.API_VERSION;
  constructor(private http: HttpClient) {}

  update(defaults: Theme): Observable<Theme> {
    return this.http.put<Theme>(this.URL + '/defaults/', defaults).pipe(
      tap((user) => {
        this.returnTheme(user);
      })
    );
  }

  returnTheme(theme: Theme): Observable<Theme> {
    return of(theme);
  }
}
