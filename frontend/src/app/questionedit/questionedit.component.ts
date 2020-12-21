import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { Question } from '../_models';
import { AuthenticationService, UserService, QuestionService } from '../_services';

@Component({
  selector: 'app-question',
  templateUrl: './questionedit.component.html'
})
export class QuestionEditComponent implements OnInit {

  question: Question;
  creatorUsername: String;
  heading: String;
  isNewQuestion: Boolean;
  error: String;
  changesSaved: Boolean;
  loading: Boolean;

  constructor(private authenticationService: AuthenticationService,
              private userService: UserService,
              private questionService: QuestionService,
              private route: ActivatedRoute) {
    this.question = new Question();
    this.changesSaved = false;
    this.loading = false;
    this.route.queryParams.pipe(first()).subscribe(param => {
      if(param.id){
        // edit question
        this.isNewQuestion = false;
        this.heading = 'Edit Question';
        this.questionService.getById(param.id).pipe(first()).subscribe(data => {
          this.question = data;
          this.userService.getUserNameById(this.question.creator).pipe(first()).subscribe(username => {
            this.creatorUsername = username;
          });
        }, 
        err => {
          this.error = err;
          this.createNewQuestion();
        });
      }else{
        // new question
        this.createNewQuestion();
      }
    });
  }

  createNewQuestion() : void {
    this.isNewQuestion = true;
    this.question = new Question();
    this.heading = 'New Question';
    this.authenticationService.user.pipe(first()).subscribe(x => {
      this.question.creator = x.id;
      this.creatorUsername = x.username});
  }

  ngOnInit(): void {
  }

  saveQuestion(): void {
    this.loading = true;
    this.changesSaved = false;
    if(this.isNewQuestion){
      this.questionService.addNewQuestion(this.question).pipe(first()).subscribe(data => {
        this.question = data
        this.isNewQuestion = false;
        this.heading = 'Edit Question';
        this.error = '';
        this.changesSaved = true;
        this.loading = false;
      }, 
      err => {
        this.onSavingError(err);
      });
    }else{
      this.questionService.updateQuestion(this.question).pipe(first())
      .subscribe(data => {
          this.question = data;
          this.error = '';
          this.changesSaved = true;
          this.loading = false;
      }, 
      err => {
        this.onSavingError(err);
      });
    }
  }

  onSavingError(err: String): void {
    this.error = err;
    this.loading = false;
  }
}
