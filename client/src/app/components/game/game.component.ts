import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game.service';
import { Game } from '../../models/game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  game: Game | undefined;
  private gameId: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gameApi: GameService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.gameId = params['gid'];
      this.gameApi.getOne(this.gameId).subscribe((game) => {
        this.game = game;
      });
    });
  }
}
