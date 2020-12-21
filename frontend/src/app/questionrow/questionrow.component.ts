import { Component, OnInit, Input } from '@angular/core';
import { Question, User , Role} from '@app/_models';
import { QuestionService, AuthenticationService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'tr[app-questionrow]',
  templateUrl: './questionrow.component.html',
  styleUrls: ['./questionrow.component.less']
})
export class QuestionrowComponent implements OnInit {

  constructor(private questionService: QuestionService,
    private authenticationService: AuthenticationService) { 
    this.user = authenticationService.userValue;
  }

  @Input() question: Question;
  user: User;

  ngOnInit(): void {
  }

  get isAdmin() {
    return this.user && this.user.role === Role.Admin;
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
