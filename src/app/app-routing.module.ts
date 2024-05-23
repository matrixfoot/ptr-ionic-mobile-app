import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProfilComponent } from './profil/profil.component';
import { AdminBoardComponent } from './admin-board/admin-board.component';
import { UserBoardComponent } from './user-board/user-board.component';
import { SupervisorBoardComponent } from './supervisor-board/supervisor-board.component';
import { ModifyUserComponent } from './modify-user/modify-user.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ComingSoonPageComponent } from './coming-soon-page/coming-soon-page.component';

import { CompleteProfilComponent } from './complete-profil/complete-profil.component';

import { SettingsComponent } from './settings/settings.component';

import { CollabBoardComponent } from './collab-board/collab-board.component';
import { InsertCompconfFileComponent } from './insert-compconf-file/insert-compconf-file.component';
import { ViewCompconfsComponent } from './view-compconfs/view-compconfs.component';

import { CreateReclamationComponent } from './create-reclamation/create-reclamation.component';
import { AddPotifRecComponent } from './add-potif-rec/add-potif-rec.component';
import { DetailrecComponent } from './detailrec/detailrec.component';
import { DocumentAdminComponent } from './document-admin/document-admin.component';
import { ViewDocumentComponent } from './view-document/view-document.component';
import { HomePage } from './home/home.page';
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  { path: 'login', component: LoginComponent,
    
},
{ path: 'profil', component: ProfilComponent,
    
},
{ path: 'settings', component: SettingsComponent,
    
},
{ path: 'view-compconfs', component: ViewCompconfsComponent,
    
},

{ path: 'view-documents', component: DocumentAdminComponent,
    
},
{ path: 'view-documents/:id', component: ViewDocumentComponent,
    
},
{ path: 'modify-user/:id', component: ModifyUserComponent,
    
},
{ path: 'complete-profil/:id', component: CompleteProfilComponent,
    
},
    

{ path: 'view-user/:id', component: ViewUserComponent},

{ path: 'verify-email/:token', component: VerifyEmailComponent},
{ path: 'reset-password/:token', component: ResetPasswordComponent},
{ path: 'admin-board', component: AdminBoardComponent},
{ path: 'user-board', component: UserBoardComponent},
{ path: 'collab-board', component: CollabBoardComponent},

{ path: 'supervisor-board', component: SupervisorBoardComponent},

  {path: 'home', component :HomePage},
    

{ path: 'signup', component: SignupComponent,
    
},

{ path: 'login/signup', component: SignupComponent,
    
},
{ path: 'login/forgot-password', component: ForgotPasswordComponent,
    
},
{ path: 'admin-board/profil', component: ProfilComponent,
    
},
{ path: 'insert-compconf', component: InsertCompconfFileComponent,
    
},
{ path: 'create-reclamation/:id', component: CreateReclamationComponent,
    
},
{ path: 'open-detail/:id/:date', component: DetailrecComponent,
    
},
{ path: 'add-motif', component: AddPotifRecComponent,
    
},
{ path: 'coming-soon', component: ComingSoonPageComponent,
    
},
{
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
