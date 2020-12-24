import { Component, OnInit } from '@angular/core';
import { GameService } from '@app/_services/game.service';
import { Game, User } from '@app/_models';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-gameview',
  templateUrl: './gameview.component.html',
  styleUrls: ['./gameview.component.less']
})
export class GameviewComponent implements OnInit {

  game: Game;
  error: String;
  user: User;

  constructor(private gameService: GameService,
              private route: ActivatedRoute,
              private router: Router,
              public authService: AuthenticationService) {
    this.game = new Game();
    this.game.gameMaster = new User();
    this.error = '';
    this.user = this.authService.userValue;
   }

  ngOnInit(): void {
    let gameId =this.route.snapshot.params['id'];
      if(gameId){
        this.gameService.getById(gameId).pipe(first()).subscribe(game => {
          //console.log(game);
          //console.log(this.user);
          this.game = game;
        },
        (err) => {
          // non-valid game-id
          this.router.navigate(['/'])
        });
      }else{
        // no id given
        this.router.navigate(['/']);
      }
  }

}
