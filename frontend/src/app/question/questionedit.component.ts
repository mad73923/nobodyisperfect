import { Component, OnInit, Input } from '@angular/core';
import { first } from 'rxjs/operators';

import { Question } from '../_models';
import { AuthenticationService, UserService } from '../_services';

@Component({
  selector: 'app-question',
  templateUrl: './questionedit.component.html'
})
export class QuestionEditComponent implements OnInit {

  creatorUsername: String;
  heading: String;

  constructor(private authenticationService: AuthenticationService,
              private userService: UserService) {
    if(!this.question){
      this.question = new Question();
      this.heading = 'New Question';
      this.authenticationService.user.subscribe(x => {
        this.question.creator = x.id;
        this.creatorUsername = x.username});
    }else{
      this.heading = 'Edit Question';
      this.userService.getUserNameById(this.question.creator).pipe(first()).subscribe(username => {
        this.creatorUsername = username;
      });
    }
  }
  
  @Input() question: Question;

  ngOnInit(): void {
  }

}
