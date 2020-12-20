import { Component, OnInit, Input } from '@angular/core';

import { Question } from '../_models';
import { AuthenticationService } from '../_services';

@Component({
  selector: 'app-question',
  templateUrl: './questionedit.component.html'
})
export class QuestionEditComponent implements OnInit {

  creatorUsername: String;
  heading: String;

  constructor(private authenticationService: AuthenticationService) {
    if(!this.question){
      this.question = new Question();
      this.heading = 'New Question';
      this.authenticationService.user.subscribe(x => {
        this.question.creator = x.id.toString();
        this.creatorUsername = x.username});
    }else{
      this.heading = 'Edit Question';
    }
  }
  
  @Input() question: Question;

  ngOnInit(): void {
  }

}
