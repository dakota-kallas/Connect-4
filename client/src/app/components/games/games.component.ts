import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from 'src/app/models/game';
import { Metadata } from 'src/app/models/metadata';
import { AuthService } from 'src/app/services/auth.service';
import { GameService } from 'src/app/services/game.service';
import { is } from 'typescript-is';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { Theme } from 'src/app/models/theme';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css'],
  providers: [DatePipe],
})
export class GamesComponent implements OnInit {
  color: string = '#ff0000';
  playerToken: string = 'Popcorn';
  computerToken: string = 'Carl';
  games: Game[] = [];
  meta: Metadata | undefined;
  errorOccured: boolean = false;
  errorMsg: string = '';

  constructor(
    private router: Router,
    private gameApi: GameService,
    private userApi: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.errorOccured = false;
    this.getDefaults();
    this.getGames();
  }

  getGames() {
    this.authService.getAuthenticatedUser().subscribe((user) => {
      if (user && typeof user === 'object' && 'id' in user) {
        this.gameApi.getAll().subscribe((games) => {
          this.games = games;
        });
      } else {
        this.authService.logout();
      }
    });
  }

  createGame() {
    this.errorOccured = false;
    this.authService.getAuthenticatedUser().subscribe((user) => {
      if (user) {
        if (this.playerToken && this.computerToken && this.color) {
          this.gameApi
            .create(this.playerToken, this.computerToken, this.color)
            .subscribe((result) => {
              // is<Game>(result)
              if (typeof result === 'object' && 'id' in result) {
                this.games.push(result);
                this.router.navigateByUrl(`games/${result.id}`);
              } else {
                this.errorOccured = true;
                this.errorMsg = result.msg;
              }
            });
        }
      }
    });
    if (this.meta) {
      let test: Theme = this.meta.default;
      test.color = '#ffffff';
      test.playerToken = this.meta.tokens[this.meta.tokens.length - 1];
      test.computerToken = this.meta.tokens[this.meta.tokens.length - 1];
      this.userApi.update(test);
    }
  }

  getDefaults() {
    this.gameApi.getMeta().subscribe((meta) => {
      this.meta = meta;
      this.playerToken = meta.default.playerToken.name;
      this.computerToken = meta.default.computerToken.name;
      this.authService.getAuthenticatedUser().subscribe((user) => {
        if (user && typeof user === 'object' && 'id' in user) {
          this.color = user.defaults.color;
          this.playerToken = user.defaults.playerToken.name;
          this.computerToken = user.defaults.computerToken.name;
        } else {
          this.authService.logout();
        }
      });
    });
  }
}
