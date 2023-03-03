import { Injectable } from '@angular/core';
import { Constants } from '../constants/constants';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User } from '../models/user';
import { Metadata } from '../models/metadata';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  URL: string = Constants.API_VERSION;

  constructor(private http: HttpClient) {}

  update(defaults: Metadata): Observable<User> {
    return this.http.put<User>(this.URL + '/defaults/', defaults);
  }
}
