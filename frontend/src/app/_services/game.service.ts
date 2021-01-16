import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Game, Answer, Round } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) { }

  addNewGame(game: Game) {
    return this.http.post<Game>(`${environment.apiUrl}/game`, game);
  }

  getAll() {
    return this.http.get<Game[]>(`${environment.apiUrl}/game`);
  }

  getById(id: Number) {
    return this.http.get<Game>(`${environment.apiUrl}/game/${id}`);
  }

  update(game: Game) {
    return this.http.put<Game>(`${environment.apiUrl}/game`, game);
  }

  delete(id: Number) {
    return this.http.delete<any>(`${environment.apiUrl}/game/${id}`);
  }

  join(id: Number) {
    return this.http.put<any>(`${environment.apiUrl}/game/join/${id}`, null);
  }

  newRound(id: Number) {
    return this.http.put<any>(`${environment.apiUrl}/game/newRound/${id}`, null);
  }

  addAnswer(answer: Answer){
    return this.http.post<any>(`${environment.apiUrl}/game/answer`, answer);
  }

  getPossibleAnswers(id: Number){
    return this.http.get<any>(`${environment.apiUrl}/game/answer/possible/${id}`);
  }

  pickAnswer(roundid: Number, answerid: Number){
    let body = {roundid: roundid, answerid: answerid};
    return this.http.post<any>(`${environment.apiUrl}/game/answer/pick`, body);
  }
}
