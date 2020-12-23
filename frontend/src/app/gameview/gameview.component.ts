import { Component, OnInit } from '@angular/core';
import { GameService } from '@app/_services/game.service';
import { Game } from '@app/_models';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-gameview',
  templateUrl: './gameview.component.html',
  styleUrls: ['./gameview.component.less']
})
export class GameviewComponent implements OnInit {

  game: Game;

  constructor(private gameService: GameService,
              private route: ActivatedRoute,
              private router: Router) {
    this.game = new Game();
   }

  ngOnInit(): void {
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
  }

}
