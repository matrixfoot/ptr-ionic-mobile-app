
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { HttpErrorInterceptor } from './interceptors/error-interceptor';
import { ExcelService } from './services/excel.service';
import { CanDeactivateGuard } from './services/auth-guard.service';
import { RemoveCommaPipe } from './pipes/pipe-number';
//@ts-ignore
import { BnNgIdleService } from 'bn-ng-idle'; // import bn-ng-idle service
import { AppSideMenuComponent } from './app-side-menu/app-side-menu.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ModalTableComponent } from './modal-table/modal-table.component';
import { ModalImpayeByuserComponent } from './modal-impaye-byuser/modal-impaye-byuser.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FooterComponent } from './footer/footer.component';
import { HomePage } from './home/home.page';
import {CustomDatePipe} from './_helpers/custom.datepipe'
import { ProfilComponent } from './profil/profil.component';
import { AdminBoardComponent } from './admin-board/admin-board.component';
import { UserBoardComponent } from './user-board/user-board.component';
//import { SupervisorBoardComponent } from './supervisor-board/supervisor-board.component';
import { ModifyUserComponent } from './modify-user/modify-user.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ComingSoonPageComponent } from './coming-soon-page/coming-soon-page.component';
//import { ModifyCondidateComponent } from './modify-condidate/modify-condidate.component';
//import { DeclareFiscalityComponent } from './declare-fiscality/declare-fiscality.component';
//import { ModifyContactreqComponent } from './modify-contactreq/modify-contactreq.component';
import { CompleteProfilComponent } from './complete-profil/complete-profil.component';
//import { AddEventComponent } from './calendar-fiscality/add-event/add-event.component';
//import { ModifyEventComponent } from './modify-event/modify-event.component';
import { SettingsComponent } from './settings/settings.component';
//import { DeclareComptabiliteComponent } from './declare-comptabilite/declare-comptabilite.component';
//import { ModifyDecFiscMensComponent } from './modify-dec-fisc-mens/modify-dec-fisc-mens.component';
//import { CreateReportComponent } from './create-report/create-report.component';
//import { ModifyCarouselComponent } from './modify-carousel/modify-carousel.component';
//import { ModifyDeccomptabiliteComponent } from './modify-deccomptabilite/modify-deccomptabilite.component';
import { CollabBoardComponent } from './collab-board/collab-board.component';
@NgModule({
  declarations: [AppComponent,
HeaderComponent,
AppSideMenuComponent,
ModalTableComponent,
LoginComponent,
SignupComponent,
FooterComponent,
HomePage,
ProfilComponent,
ModalImpayeByuserComponent,
AdminBoardComponent,
UserBoardComponent,
ModifyUserComponent,
CustomDatePipe,
ViewUserComponent,
RemoveCommaPipe,
VerifyEmailComponent,
ForgotPasswordComponent,
ResetPasswordComponent,
ComingSoonPageComponent,

CompleteProfilComponent,

SettingsComponent,

CollabBoardComponent,],
imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
  HttpClientModule,CommonModule,FormsModule,ReactiveFormsModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  MatPaginatorModule,
  ScrollingModule,
  // Import CommonModule here
    // Import HttpClientModule here
],
schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptor,
    multi: true
  },ExcelService,CanDeactivateGuard,RemoveCommaPipe,BnNgIdleService,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],

  bootstrap: [AppComponent],
})
export class AppModule {}
