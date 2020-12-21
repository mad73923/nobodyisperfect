import { Component, OnInit, Input } from '@angular/core';
import { GameService } from '@app/_services/game.service';

@Component({
  selector: 'app-gamecard',
  templateUrl: './gamecard.component.html',
  styleUrls: ['./gamecard.component.less']
})
export class GamecardComponent implements OnInit {

  @Input() game;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
  }

}
