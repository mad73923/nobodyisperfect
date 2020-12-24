import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from '@app/_services/game.service';
import { Game, User } from '@app/_models';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '@app/_services';
import { GameSocketService } from '@app/_helpers/socketio';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-gameview',
  templateUrl: './gameview.component.html',
  styleUrls: ['./gameview.component.less']
})
export class GameviewComponent implements OnInit {

  game: Game;
  error: String;
  user: User;
  routerSubscription: Subscription;

  constructor(private gameService: GameService,
              private route: ActivatedRoute,
              private router: Router,
              public authService: AuthenticationService,
              private gameSocket: GameSocketService) {
    this.game = new Game();
    this.game.gameMaster = new User();
    this.error = '';
    this.user = this.authService.userValue;
   }

  ngOnInit(): void {
    this.gameSocket.connect();
    let gameId =this.route.snapshot.params['id'];
      if(gameId){
        this.gameService.getById(gameId).pipe(first()).subscribe(game => {
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
    this.routerSubscription = this.router.events.subscribe(event => 
      this.gameSocket.disconnect());
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
    this.gameSocket.disconnect();
  }

}
