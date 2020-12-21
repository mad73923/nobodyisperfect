import { Component, OnInit, Input } from '@angular/core';
import { Question } from '@app/_models';

@Component({
  selector: 'tr[app-questionrow]',
  templateUrl: './questionrow.component.html',
  styleUrls: ['./questionrow.component.less']
})
export class QuestionrowComponent implements OnInit {

  constructor() { }

  @Input() question: Question;

  ngOnInit(): void {
  }

}
