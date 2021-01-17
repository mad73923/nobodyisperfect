import { Component, OnInit, Input } from '@angular/core';
import { Game } from '@app/_models/game';
import { GameService } from '@app/_services/game.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-gameresult',
  templateUrl: './gameresult.component.html',
  styleUrls: ['./gameresult.component.less']
})
export class GameresultComponent implements OnInit {

  @Input() game: Game;
  gameResult: any;

  constructor(private gameService: GameService) { 
    this.gameResult = {};
  }

  ngOnInit(): void {
    this.gameService.getResult(this.game._id).pipe(first()).subscribe(result => {
      this.gameResult = result;
    })
  }

  toLetters(num) : String{
    "use strict";
    var mod = num % 26,
        pow = num / 26 | 0,
        out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
    return pow ? this.toLetters(pow) + out : out;
  }

}
