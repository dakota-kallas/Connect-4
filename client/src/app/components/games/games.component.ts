import { Component } from '@angular/core';
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
export class GamesComponent {
  games: Game[] = [];

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

  // createGame() {
  //   this.authService.getAuthenticatedUser().subscribe((user) => {
  //     if (user) {
  //       this.newItem.owner = user.id;
  //       this.itemApi.create(this.newItem).subscribe((item) => {
  //         this.items.push(item);
  //       });

  //       this.newItem.description = '';
  //       this.newItem.completed = false;
  //     }
  //   });
  // }

  getMeta() {
    // this.gameApi.getMeta().subscribe((meta) => {
    //   this.meta = meta;
    // });
  }
}
