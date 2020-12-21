import { Component, OnInit, Input } from '@angular/core';
import { Question } from '@app/_models';

@Component({
  selector: 'app-questiontable',
  templateUrl: './questiontable.component.html',
  styleUrls: ['./questiontable.component.less']
})
export class QuestiontableComponent implements OnInit {

  @Input() questions: Question[];

  constructor() { }

  ngOnInit(): void {
  }

}
