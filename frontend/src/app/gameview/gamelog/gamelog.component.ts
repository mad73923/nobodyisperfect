import { Component, OnInit, Input } from '@angular/core';
import { GameSocketService } from '@app/_helpers/socketio';

@Component({
  selector: 'app-gamelog',
  templateUrl: './gamelog.component.html',
  styleUrls: ['./gamelog.component.less']
})
export class GamelogComponent implements OnInit {

  logText: String;
  
  
  public newMessage(message){
    // TODO add timestamp
    this.logText = this.logText.concat('\n', message);
  }

  constructor() { 
    this.logText = '';
  }

  ngOnInit(): void {

  }

}
