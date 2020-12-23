import { Component, OnInit, Input } from '@angular/core';
import { GameService } from '@app/_services/game.service';
import { Game, User } from '@app/_models';
import { AuthenticationService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-gamecard',
  templateUrl: './gamecard.component.html',
  styleUrls: ['./gamecard.component.less']
})
export class GamecardComponent implements OnInit {

  @Input() game: Game;
  user: User;

  constructor(private gameService: GameService,
              private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.authService.user.pipe(first()).subscribe(
      x => this.user = x);
  }

  joinGame() {
    this.gameService.join(this.game._id).pipe(first()).subscribe(
      data => console.log(data)
    );
  }

  isPlayerRegistered() : Boolean{
    return this.game.players.includes(this.user);
  }
}
