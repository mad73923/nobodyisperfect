import { Component, OnInit, Input } from '@angular/core';
import { first } from 'rxjs/operators';

import { Question } from '../_models';
import { AuthenticationService, UserService, QuestionService } from '../_services';

@Component({
  selector: 'app-question',
  templateUrl: './questionedit.component.html'
})
export class QuestionEditComponent implements OnInit {

  @Input() question: Question;
  creatorUsername: String;
  heading: String;
  isNewQuestion: Boolean;

  constructor(private authenticationService: AuthenticationService,
              private userService: UserService,
              private questionService: QuestionService) {
    if(!this.question){
      this.isNewQuestion = true;
      this.question = new Question();
      this.heading = 'New Question';
      this.authenticationService.user.subscribe(x => {
        this.question.creator = x.id;
        this.creatorUsername = x.username});
    }else{
      this.isNewQuestion = false;
      this.heading = 'Edit Question';
      this.userService.getUserNameById(this.question.creator).pipe(first()).subscribe(username => {
        this.creatorUsername = username;
      });
    }
  }

  ngOnInit(): void {
  }

  saveQuestion(): void {
    if(this.isNewQuestion){
      this.questionService.addNewQuestion(this.question).pipe(first()).subscribe(data => {console.log(data);
      this.question = data});
      this.isNewQuestion = false;
    }else{
      this.questionService.updateQuestion(this.question).pipe(first())
      .subscribe(data => {
        console.log(data);
        this.question = data;
      });
    }
  }

}
