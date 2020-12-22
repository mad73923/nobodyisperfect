import { Component } from '@angular/core';
import { first } from 'rxjs/operators';

import { User, Game } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
import { GameService } from '@app/_services/game.service';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    loading = false;
    user: User;
    userFromApi: User;

    newGame: Game;

    saveSucces: Boolean;

    constructor(
        private userService: UserService,
        public authService: AuthenticationService,
        private gameService: GameService
    ) {
        this.user = this.authService.userValue;
        this.newGame = new Game();
        this.saveSucces = false;
    }

    ngOnInit() {
        this.loading = true;
        this.userService.getById(this.user.id).pipe(first()).subscribe(user => {
            this.loading = false;
            this.userFromApi = user;
        });
    }

    createNewGame() {
        this.gameService.addNewGame(this.newGame).pipe(first()).subscribe(game => {
            this.newGame.name = '';
            this.saveSucces = true;
            setTimeout(() => this.saveSucces = false, 2000);
        },
        err => {
        });
    }
}