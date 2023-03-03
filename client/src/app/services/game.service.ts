import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../models/game';
import { Constants } from '../constants/constants';
import { Metadata } from '../models/metadata';
import { Token } from '../models/token';

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

  makeMove(game: Game, move: number): Observable<Game> {
    return this.http.post<Game>(`${this.URL}/${game.id}?move=${move}`, game);
  }

  // TODO: FIX THIS ENDPOINT CALL
  create(
    playerToken: string,
    computerToken: string,
    color: string
  ): Observable<Game> {
    const body = { playerToken, computerToken };
    return this.http.post<Game>(
      `${this.URL}/?color=${color.replace('#', '')}`,
      body
    );
  }
}
