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

  getMy() {
    return this.http.get<Question[]>(`${environment.apiUrl}/question/my`);
  }

  getById(id: Number) {
    return this.http.get<Question>(`${environment.apiUrl}/question/${id}`);
  }

  addNewQuestion(question: Question) {
    return this.http.post<Question>(`${environment.apiUrl}/question/add`, question);
  }

  updateQuestion(question: Question) {
    return this.http.put<Question>(`${environment.apiUrl}/question`, question);
  }
}
