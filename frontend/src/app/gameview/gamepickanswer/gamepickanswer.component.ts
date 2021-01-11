import { Component, OnInit, Input } from '@angular/core';
import { GameService } from '@app/_services/game.service';
import { Game } from '@app/_models/game';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '@app/_services/authentication.service';
import { User, Role } from '@app/_models';

@Component({
  selector: 'app-gamepickanswer',
  templateUrl: './gamepickanswer.component.html',
  styleUrls: ['./gamepickanswer.component.less']
})
export class GamepickanswerComponent implements OnInit {


  possibleAnswers: Array<any>;
  @Input() game: Game;
  user: User;

  constructor(private gameService: GameService,
    public authService: AuthenticationService) { 
    this.user = this.authService.userValue;
    this.possibleAnswers = [];
  }

  ngOnInit(): void {
    this.gameService.getPossibleAnswers(this.game.currentRound._id).pipe(first()).subscribe(answers => {
      this.possibleAnswers = answers;
    });
  }

  toLetters(num) : String{
    "use strict";
    var mod = num % 26,
        pow = num / 26 | 0,
        out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
    return pow ? this.toLetters(pow) + out : out;
  }

  isReaderOrGamemasterOrAdmin(): Boolean{
    return this.game.currentRound.reader._id == this.user._id || this.user.role.includes(Role.Admin) || this.game.gameMaster._id == this.user._id;
  }

}
