import { Component, OnInit } from '@angular/core';
import { GameService } from '@app/_services/game.service';
import { Game } from '@app/_models';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-gameoverview',
  templateUrl: './gameoverview.component.html',
  styleUrls: ['./gameoverview.component.less']
})
export class GameoverviewComponent implements OnInit {

  games: Game[];

  constructor(private gameService: GameService) {
    this.games = [];
   }

  ngOnInit(): void {
    this.gameService.getAll().pipe(first()).subscribe(data => {
      this.games = data;
    });
  }

}
