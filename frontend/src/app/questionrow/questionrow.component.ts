import { Component, OnInit, Input } from '@angular/core';
import { Question, User , Role} from '@app/_models';
import { QuestionService, AuthenticationService } from '@app/_services';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'tr[app-questionrow]',
  templateUrl: './questionrow.component.html',
  styleUrls: ['./questionrow.component.less']
})
export class QuestionrowComponent implements OnInit {

  constructor(private questionService: QuestionService,
    private authService: AuthenticationService,
    private router: Router) { 
  }

  @Input() question: Question;

  ngOnInit(): void {
  }

  editQuestion() {
    this.router.navigate(['/editquestion'], {queryParams: {id: this.question._id}});
  }

  setAccepted(accepted: Boolean): void {
    let oldvalue : Boolean = this.question.accepted;
    this.question.accepted = accepted;
    this.questionService.updateQuestion(this.question).pipe(first()).subscribe(
      data => {
        this.question = data
      ,
      err => {
        console.log(err);
        this.question.accepted = oldvalue
      }
      });
  }

}
