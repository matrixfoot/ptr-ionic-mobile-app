import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { User } from '../models/user.model';
import { Deccomptabilite } from '../models/dec-comptabilite';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-impaye-byuser',
  templateUrl: './modal-impaye-byuser.component.html',
  styleUrls: ['./modal-impaye-byuser.component.scss'],
})
export class ModalImpayeByuserComponent {
  filtredusers2: User[] = [];
  @Input() users2: User[]= [];
  prenomfisc: string
  nomfisc: string
  @Input() alldsbyusernonpaye:any[]=[]
  submitting=false;
    constructor(private modalController: ModalController,private UserService: UserService,
    private router: Router,private cdr: ChangeDetectorRef,) {}
    async closecopPopup() {
      await this.modalController.dismiss(); // Set the role to 'login'
    }
    getNavigationautreds(link:any, id:any)
{
  this.router.navigate([]).then((_result:any) => {
    window.open(link + '/' + id, '_blank');
  });
 // this.router.navigate([link + '/' + id]); 
}
getNavigationdeccomptabilites(link:any, id:any){
      
  this.router.navigate([]).then((_result:any) => {
    window.open(link + '/' + id, '_blank');
  }); 
}
getNavigationdecfiscmenss(link:any, id:any){
      
  this.router.navigate([]).then((_result:any) => {
    window.open(link + '/' + id, '_blank');
  }); 
}
payinvoice(id:string,nature:string){}
click55()
{
  
}
    filterusers2(id:string)
    {

      
    }
}
