import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { AlertController } from '@ionic/angular';
import { Deccomptabilite } from '../models/dec-comptabilite';
import { Decfiscmens } from '../models/dec-fisc-mens';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-side-menu',
  templateUrl: './app-side-menu.component.html',
  styleUrls: ['./app-side-menu.component.scss'],
})
export class AppSideMenuComponent  implements OnInit {
  public role!: string;
  isLoggedIn = false;
  username!: string;
  lastname!: string;
usertype: any;
currentuser: any;
nature!: string;
raisonsociale!: string;
user!: User;
isSection1Open = false;
isSection2Open = false;
isSection3Open = false;
allotherdsSub!: Subscription;
alldeccomptabSub!: Subscription;
dsdeccomptabilites: Deccomptabilite[]=[];
alldecfiscmensSub!: Subscription;
dsdecfiscmenss: Decfiscmens[]=[];

payedsdeccomptabilites: Deccomptabilite[]=[];
nonpayedsdeccomptabilites: Deccomptabilite[]=[];
payedsdecfiscmenss: Decfiscmens[]=[];
nonpayedsdecfiscmenss: Decfiscmens[]=[];
alldssusernonpayewindow=false;
alldssuserpayewindow=false;
alldecfiscmenss: Decfiscmens[]=[];
alldeccomptabilites: Deccomptabilite[]=[];

  constructor(private router: Router,
    private Auth: TokenStorageService,public alertController: AlertController,private menu: MenuController,
    private userservice: UserService) { }
 // Function to close the menu
 closeMenu() {
  this.menu.close('menu');
}
  ngOnInit() {
    this.isLoggedIn = !!this.Auth.getToken();
    if (this.isLoggedIn) {
      this.currentuser = this.Auth.getUser();
      this.userservice.getUserById(this.currentuser.userId).then(
        (user:any)=>{
          this.user=user
          this.role = user.role;
          this.usertype=user.usertype
          this.username = user.firstname;
          this.lastname= user.lastname;
          this.nature=user.nature
          this.raisonsociale=user.raisonsociale
        }
      )
   
    }
  }
  toggleSection1() {
    this.isSection1Open = !this.isSection1Open;
  }

  toggleSection2() {
    this.isSection2Open = !this.isSection2Open;
  }
  toggleSection3() {
    this.isSection3Open = !this.isSection3Open;
  }
  infoassiette(): void {}
  async logout(): Promise<void> {
      const alert = await this.alertController.create({
        header: 'Confirmation',
        message: 'Vous êtes sur le point de se déconnecter, voulez vous continuer?',
        buttons: [
          {
            text: 'Se Déconnecter',
            cssClass: 'secondary',
            handler: () => {
              this.Auth.signOut();
              this.reloadPage()            }
          }, {
            text: 'Annuler',
            handler: () => {
            }
          }
        ]
      });   
      await alert.present(); 
  }
  reloadPage (){
    setTimeout(() => window.location.reload(), 3000);
  }
  getalldsuser():any{}
  getalldsusernonpaye():any{}
  getalldsuserpaye():any{}
}
