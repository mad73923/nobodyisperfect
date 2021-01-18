import { Component, OnInit, Input } from '@angular/core';
import { Game, User } from '@app/_models';
import { GameService } from '@app/_services/game.service';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '@app/_services/authentication.service';

@Component({
  selector: 'app-gameranking',
  templateUrl: './gameranking.component.html',
  styleUrls: ['./gameranking.component.less']
})
export class GamerankingComponent implements OnInit {

  @Input() game: Game;
  user: User;
  result: any;

  constructor(private gameService: GameService,
              private authService: AuthenticationService) {
    this.user = this.authService.userValue;
    this.result = {};
   }

  ngOnInit(): void {
    this.gameService.getRanking(this.game._id).pipe(first()).subscribe(result => {
      // sort from high to low score
      result.players.sort((a, b) => b.score - a.score);
      this.result = result;
    })
  }

}
