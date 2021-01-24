import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SocketIoModule } from 'ngx-socket-io';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { JwtInterceptor, ErrorInterceptor, appInitializer } from './_helpers';
import { AuthenticationService } from './_services';
import { HomeComponent } from './home';
import { AdminComponent } from './admin';
import { LoginComponent } from './login';
import { AddnewuserComponent } from './addnewuser/addnewuser.component';
import { QuestionEditComponent } from './questionedit';
import { QuestionmanagementComponent } from './questionmanagement';
import { QuestiontableComponent } from './questiontable/questiontable.component';
import { QuestionrowComponent } from './questiontable/questionrow/questionrow.component';
import { GameoverviewComponent } from './gameoverview/gameoverview.component';
import { GamecardComponent } from './gameoverview/gamecard/gamecard.component';
import { GameviewComponent } from './gameview/gameview.component';
import { GameSocketService } from './_helpers/socketio';
import { GamelogComponent } from './gameview/gamelog/gamelog.component';
import { GamepickanswerComponent } from './gameview/gamepickanswer/gamepickanswer.component';
import { GameresultComponent } from './gameview/gameresult/gameresult.component';
import { GamerankingComponent } from './gameview/gameranking/gameranking.component';
@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        SocketIoModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        AdminComponent,
        LoginComponent,
        AddnewuserComponent ,
        QuestionEditComponent ,
        QuestionmanagementComponent ,
        QuestiontableComponent,
        QuestionrowComponent,
        GameoverviewComponent ,
        GamecardComponent ,
        GameviewComponent ,
        GamelogComponent ,
        GamepickanswerComponent,
        GameresultComponent,
        GamerankingComponent],
    providers: [
        { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AuthenticationService] },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        GameSocketService
        // provider used to create fake backend
        //fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
