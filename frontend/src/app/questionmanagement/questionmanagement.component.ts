import { Component, OnInit } from '@angular/core';
import { Question } from '@app/_models';
import { QuestionService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-questionmanagement',
  templateUrl: './questionmanagement.component.html'
})
export class QuestionmanagementComponent implements OnInit {

  constructor(private questionService: QuestionService) { }

  myQuestions: Question[];

  ngOnInit(): void {
    this.questionService.getMy().pipe(first()).subscribe(x => {
      this.myQuestions = x
    });
  }

}
