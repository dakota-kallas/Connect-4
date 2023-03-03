import { Component, OnInit, Input } from '@angular/core';
import { Game } from 'src/app/models/game';
import { Metadata } from 'src/app/models/metadata';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css'],
})
export class GamesComponent implements OnInit {
  color: string = '#ff0000';
  playerToken: string = 'Popcorn';
  computerToken: string = 'Carl';
  games: Game[] = [];
  meta: Metadata | undefined;

  constructor(private gameApi: GameService, private authService: AuthService) {}

  ngOnInit() {
    this.getMeta();
    this.getGames();
  }

  getGames() {
    this.authService.getAuthenticatedUser().subscribe((user) => {
      if (user) {
        this.gameApi.getAll().subscribe((games) => {
          this.games = games;
        });
      }
    });
  }

  // TODO: FINISH THIS METHOD
  createGame() {
    this.authService.getAuthenticatedUser().subscribe((user) => {
      if (user) {
        console.log(
          `${this.playerToken} : ${this.computerToken} : ${this.color}`
        );
        if (this.playerToken && this.computerToken && this.color) {
          this.gameApi
            .create(this.playerToken, this.computerToken, this.color)
            .subscribe((game) => {
              this.games.push(game);
            });
        }
      }
    });
  }

  getMeta() {
    this.gameApi.getMeta().subscribe((meta) => {
      this.meta = meta;
    });
  }
}
