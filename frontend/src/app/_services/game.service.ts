import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Game } from '@app/_models';

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
    return this.http.put<Game>(`${environment.apiUrl}/question`, game);
  }

  delete(id: Number) {
    return this.http.delete<any>(`${environment.apiUrl}/game/${id}`);
  }
}
