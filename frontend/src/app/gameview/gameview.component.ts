import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { GameService } from '@app/_services/game.service';
import { Game, User, Role, Answer } from '@app/_models';
import { ActivatedRoute, Router } from '@angular/router';
import { first, timeout } from 'rxjs/operators';
import { AuthenticationService } from '@app/_services';
import { GameSocketService } from '@app/_helpers/socketio';
import { Observable, Subscription, timer } from 'rxjs';
import { GamelogComponent } from './gamelog/gamelog.component';
import { error } from 'protractor';
import { async } from '@angular/core/testing';

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
  answerText: String;
  routerSubscription: Subscription;
  hasHandedInAnswer: Boolean;

  constructor(private gameService: GameService,
              private route: ActivatedRoute,
              private router: Router,
              public authService: AuthenticationService,
              private gameSocket: GameSocketService) {
    this.game = new Game();
    this.game.gameMaster = new User();
    this.error = '';
    this.user = this.authService.userValue;
    this.answerText = '';
    this.hasHandedInAnswer = false;
  }

  ngOnInit(): void {
    this.gameSocket.connect();
    this.gameSocket.on('logUpdate', (data) => {
      this.log.newMessage(data);
    });
    this.gameSocket.on('gameUpdate', (data) => {
      this.gameService.getById(this.game._id).pipe(first()).subscribe(game =>{
        this.game = game;
        this.updateHandedIn();
      })
    });
    let gameId =this.route.snapshot.params['id'];
      if(gameId){
        this.gameService.getById(gameId).pipe(first()).subscribe(game => {
          this.game = game;
          this.updateHandedIn();
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
    return this.user._id == this.game.currentRound.reader._id || this.user.role.includes(Role.Admin) || this.user._id == this.game.gameMaster._id;
  }

  updateGame(){
    this.gameService.getById(this.game._id).pipe(first()).subscribe(game =>{
      this.game = game;
      this.updateHandedIn();
    });
  }

  updateHandedIn(){
    this.hasHandedInAnswer = false;
    if(this.game.currentState == 'ReadQuestion')
    {
      this.game.currentRound.answers.map(answer =>
        {if(answer.creator._id == this.user._id){
          this.hasHandedInAnswer = true;
        }});
    }
  }

  sendAnswer() {
    let answer = new Answer();
    answer.creator = this.user;
    answer.text = this.answerText;
    answer.fromQuestion = this.game.currentRound.currentQuestion,
    answer.game = this.game;
    this.gameService.addAnswer(answer).pipe(first()).subscribe(data =>
      {
        this.hasHandedInAnswer = true;
        // update happens via socketio
        //this.updateGame();
      }
      , error => this.error = error);
  }

}
