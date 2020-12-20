import { Component, OnInit, Input } from '@angular/core';

import { Question } from '../_models';
import { AuthenticationService } from '../_services';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.less']
})
export class QuestionComponent implements OnInit {

  creatorUsername: String;

  constructor(private authenticationService: AuthenticationService) {
    if(!this.question){
      this.question = new Question();
      this.authenticationService.user.subscribe(x => {
        this.question.creator = x.id.toString();
        this.creatorUsername = x.username});
      this.edit = true;
    }
  }
  
  @Input() question: Question;
  @Input() edit: Boolean;

  ngOnInit(): void {
  }

}
