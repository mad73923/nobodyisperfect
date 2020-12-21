﻿import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import { User, Role } from './_models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    user: User;

    constructor(private authService: AuthenticationService) {
        this.authService.user.subscribe(x => this.user = x);
    }

    get isAdmin() {
        return this.user && this.user.role.includes(Role.Admin);
    }

    logout() {
        this.authService.logout();
    }
}
