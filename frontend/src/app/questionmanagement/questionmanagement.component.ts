import { Component, OnInit } from '@angular/core';
import { Question, User, Role } from '@app/_models';
import { QuestionService, AuthenticationService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-questionmanagement',
  templateUrl: './questionmanagement.component.html'
})
export class QuestionmanagementComponent implements OnInit {

  myQuestions: Question[];
  allQuestions: Question[];
  user: User;

  constructor(private questionService: QuestionService,
    private authenticationService: AuthenticationService) { 
      this.user = authenticationService.userValue;
    }

  get isAdmin() {
      return this.user && this.user.role === Role.Admin;
  }

  ngOnInit(): void {
    this.questionService.getMy().pipe(first()).subscribe(x => {
      this.myQuestions = x
    });
    if(this.isAdmin){
      this.questionService.getAll().pipe(first()).subscribe(x => {
        this.allQuestions = x});
    }
  }

}
