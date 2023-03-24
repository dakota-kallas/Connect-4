import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game.service';
import { Game } from '../../models/game';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  game: Game | undefined;
  private gameId: string = '';
  defaultUpdated: boolean = false;
  isClickable: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gameApi: GameService,
    private userApi: UserService,
    private authApi: AuthService
  ) {}

  ngOnInit() {
    this.defaultUpdated = false;
    this.route.params.subscribe((params) => {
      this.gameId = params['gid'];
      this.gameApi.getOne(this.gameId).subscribe((game) => {
        this.game = game;
      });
    });
  }

  dropToken(column: number) {
    this.defaultUpdated = false;
    if (this.game) {
      this.gameApi.makeMove(this.game, column).subscribe((result) => {
        if (typeof result === 'object' && 'id' in result) {
          this.game = result;
          if (this.game.status != 'UNFINISHED') {
            this.isClickable = false;
          }
        }
      });
    }
  }
}
