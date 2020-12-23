import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AdminComponent } from './admin';
import { LoginComponent } from './login';
import { QuestionmanagementComponent } from './questionmanagement';
import { QuestionEditComponent } from './questionedit';
import { AuthGuard } from './_helpers';
import { Role } from './_models';
import { GameviewComponent } from './gameview/gameview.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'questions',
        canActivate: [AuthGuard],
        component: QuestionmanagementComponent
    },
    {
        path: 'editquestion',
        canActivate: [AuthGuard],
        component: QuestionEditComponent
    },
    {
        path: 'game/:id',
        canActivate: [AuthGuard],
        component: GameviewComponent
    },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
