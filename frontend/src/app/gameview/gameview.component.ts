import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { GameService } from '@app/_services/game.service';
import { Game, User, Role } from '@app/_models';
import { ActivatedRoute, Router } from '@angular/router';
import { first, timeout } from 'rxjs/operators';
import { AuthenticationService } from '@app/_services';
import { GameSocketService } from '@app/_helpers/socketio';
import { Observable, Subscription, timer } from 'rxjs';
import { GamelogComponent } from './gamelog/gamelog.component';

@Component({
  selector: 'app-gameview',
  templateUrl: './gameview.component.html',
  styleUrls: ['./gameview.component.less']
})
export class GameviewComponent implements OnInit {

  @ViewChild(GamelogComponent) log: GamelogComponent;
  public game: Game;
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
    this.gameSocket.on('logUpdate', (data) => {
      this.log.newMessage(data);
    });
    this.gameSocket.on('gameUpdate', (data) => {
      this.gameService.getById(this.game._id).pipe(first()).subscribe(game =>{
        this.game = game;
      })
    });
    let gameId =this.route.snapshot.params['id'];
      if(gameId){
        this.gameService.getById(gameId).pipe(first()).subscribe(game => {
          this.game = game;
          this.gameSocket.emit('gameJoined', this.game._id.toString(), this.user.username);
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
      this.cleanupSubscriptions());
  }

  cleanupSubscriptions(): void {
    this.routerSubscription.unsubscribe();
    this.gameSocket.disconnect();
  }

  ngOnDestroy(): void {
    this.cleanupSubscriptions();
  }

  newRound() {
    this.gameService.newRound(this.game._id).pipe(first()).subscribe(data => {return}, error => this.error = error);
  }

  maySeeQuestion() {
    return this.user._id == this.game.currentRound.reader._id || this.user.role.includes(Role.Admin)
  }

}
