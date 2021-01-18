import { Component, OnInit, Input } from '@angular/core';
import { Game } from '@app/_models';
import { GameService } from '@app/_services/game.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-gameranking',
  templateUrl: './gameranking.component.html',
  styleUrls: ['./gameranking.component.less']
})
export class GamerankingComponent implements OnInit {

  @Input() game: Game;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.getRanking(this.game._id).pipe(first()).subscribe(result => {
      console.log(result);
    })
  }

}
