import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Game } from '../models/game';
import { Constants } from '../constants/constants';
import { Metadata } from '../models/metadata';
import { Error } from '../models/error';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private URL: string = Constants.API_VERSION;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Game[]> {
    return this.http.get<Game[]>(this.URL + '/');
  }

  getOne(gameId: string): Observable<Game> {
    return this.http.get<Game>(this.URL + '/gids/' + gameId);
  }

  getMeta(): Observable<Metadata> {
    return this.http.get<Metadata>(this.URL + '/meta/');
  }

  makeMove(game: Game, move: number): Observable<Game | Error> {
    return this.http
      .post<Game>(`${this.URL}/gids/${game.id}?move=${move}`, game)
      .pipe(
        catchError((error) => {
          if (error.status === 400) {
            let result: Error = { msg: error.error };
            return of(result);
          } else {
            let result: Error = { msg: 'Something went wrong, try again.' };
            return of(result);
          }
        })
      );
  }

  create(
    playerToken: string,
    computerToken: string,
    color: string
  ): Observable<Game | Error> {
    const body = { playerToken, computerToken };
    return this.http.post<Game | Error>(
      `${this.URL}/?color=${color.replace('#', '')}`,
      body
    );
  }
}
