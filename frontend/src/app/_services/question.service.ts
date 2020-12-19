import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Question } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Question[]>(`${environment.apiUrl}/question`);
  }

  addNewQuestion(question: Question) {
    return this.http.post<any>(`${environment.apiUrl}/question/add`, question);
  }
}
