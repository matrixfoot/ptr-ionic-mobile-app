import { Component, OnInit,OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { User } from '../models/user.model';
import { ReclamationService } from '../services/reclamation.service';
import { Reclamation } from '../models/reclamation';
import { CommunService } from '../services/commun';
import Swal from 'sweetalert2';
import { TokenStorageService } from '../services/token-storage.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-detailrec',
  templateUrl: './detailrec.component.html',
  styleUrls: ['./detailrec.component.scss']
})
export class DetailrecComponent implements OnInit,OnDestroy {
  public reclamation: Reclamation;
  public imagePreview: string;
  fileUploaded = false; 
  public loading = false;
  errormsg:string;
  submitted=false
  user: User;
  informations=[]
  usertype: string;
  users: User[]=[];
  filtredusers: any[]=[];
  prenom: any;
  nom: any;
  raisonsociale: any;
  nature: any;
  usersSub: Subscription;
  public showphase=false
  public showall=false
  effectiveuser: User;
  currentuser: any;
  constructor( private route: ActivatedRoute, private router: Router,private recserv: ReclamationService, private userservice:UserService,private token: TokenStorageService,private commun: CommunService) {}
  ngOnInit() {
    this.currentuser = this.token.getUser();
  this.userservice.getUserById(this.currentuser.userId).then(
    (user: User) => {
      this.user=user
    }
  )
  this.loading = true;
  this.usersSub = this.userservice.users$.subscribe(
    (users) => {
      this.users = users;
    },
    (error) => {
      this.loading = false;
      this.errormsg=error.message;
    }
  );
  this.route.params.subscribe(
    (params) => {
      this.recserv.getReclamationdataById(params.id).then(
        (reclamation: Reclamation) => {
          this.userservice.getUserById(reclamation.userId).then(
            (user: User) => {
              this.loading = false;
              this.reclamation = reclamation;
              this.usertype=user.usertype
              this.nature=user.nature
              this.prenom=user.firstname
              this.nom=user.lastname
              this.raisonsociale=user.raisonsociale
              this.effectiveuser=user

              //@ts-ignore
    params.date!='all'?(this.informations=this.reclamation.statut.filter(e=>e.date==params.date),this.showphase=true):(this.informations=this.reclamation.statut,this.showall=true)

                /*this.statutssub = this.recserv.changements$.subscribe(
                  (changements) => {
                    this.reclamation.changements = changements;
          
                  }
                )*/
            }
          )
              
        }
      );
    }
  );
  }
  getNavigation(link){
    this.router.navigate([link]); 
  }
  filteracteur(value:string):string
{
  let view:string
  value=='Clientpor'?view='Client Porteur':
  value=='Clientcomm'?view='Client Commerçant':
  value=='Metier'?view='Métier':
  value=='Agence'?view='Agence':
  value=='comite arbitrage'?view='Comité arbitrage':''
  return view
}
filterstat(dureestatut:any):boolean
{
  //@ts-ignore
  if(this.reclamation.statut.find(e=>e.date==dureestatut&&e.item=='rejetée'&&e.role=='acquireur'||e.date==dureestatut&&e.item!='rejetée'&&e.item!='crée'&&e.item!='encours'||e.date==dureestatut&&e.etat=='Ajout note'&&e.role!='émetteur'&&e.acteur!='Clientpor'))
  {
    return true
  }
  else
  {
    return false
  }
}
filterstatcommport(dureestatut:any):boolean
{
  if(this.user.usertype=='Clientpor')
  {
    let effectiverole='émetteur'
   //@ts-ignore
    if(this.reclamation.statut.find(e=>e.date==dureestatut&&e.acteur==this.user.usertype||e.date==dureestatut&&e.role==effectiverole&&e.item!='chb émis'&&e.item!='pré-arbitrage'&&e.item!='arbitrage'||e.date==dureestatut&&this.reclamation.transactions[0].ISSUERBANKIDENTIFICATION==this.reclamation.transactions[0].ACQUIRERBANKIDENTIFICATION))
    {
      return true
    }
    else
    {
      return false
    }
  }
  else  if(this.user.usertype=='Clientcomm')
  {
    let effectiverole='acquireur'
   //@ts-ignore
   if(this.reclamation.statut.find(e=>e.date==dureestatut&&e.acteur==this.user.usertype||e.date==dureestatut&&e.role==effectiverole&&e.item!='rejetée'&&e.item!='pré-arbitrage rejetée'&&e.item!='arbitrage rejeté'||e.date==dureestatut&&this.reclamation.transactions[0].ISSUERBANKIDENTIFICATION==this.reclamation.transactions[0].ACQUIRERBANKIDENTIFICATION&&e.etat))
   {
      return true
    }
    else
    {
      return false
    }
  }
else 
{
  return false
}
}
filterarbitrage(dureestatut:any):boolean
{
  if(this.user.usertype=='comite arbitrage')
  {
    let effectiverole='émetteur'
   //@ts-ignore
    if(this.reclamation.statut.find(e=>e.date==dureestatut&&e.acteur==this.user.usertype||e.date==dureestatut&&!e.etat&&e.item!='crée'&&e.item!='rejetée'&&e.item!='encours'&&e.acteur!='Clientpor'
      //@ts-ignore
    ||e.date==dureestatut&&e.item=='rejetée'&&e.role!='émetteur'))
    {
      return true
    }
    else
    {
      return false
    }
  }
}
filtervalue(value:string):string
{
  let view:string
  value=='T'?view='TPE/ECOM':
  value=='G'?view='GAB':
  value==''||value=='O'||value=='M'?view='Manual':
  value=='R'?view='Recharge GAB':
  value=='Z'?view='Mobile':
  value=='05'?view='Achat':
  value=='06'?view='crédit':
  value=='07'?view='Cash Advance':
  value=='08'?view='Retrait':
  value=='15'?view='Impayé GAB':
  value=='17'?view='Impayé CASH ADVANCE':
  value=='18'?view='Impayé GAB':
  value=='1'?view='1st CHARGEBACK':
  value=='2'?view='2nd CHARGEBACK':
  value
  return view
}
filtermotif():string
{
  let returned:string
  let returned2:string
  let returned3:string

  //@ts-ignore
  let mot=this.reclamation.statut.find(e=>e.motif)
    //@ts-ignore
    mot?(returned=mot.motif,returned2=mot.famille,returned3=mot.groupe):returned=null
    //@ts-ignore
  return [returned,returned2,returned3]
}
opendetail(link, id,date){
      
  this.router.navigate([]).then((_result) => {
    window.open(link + '/' + id+ '/' + date, '_blank');
  });; 
}
ngOnDestroy() {
  this.usersSub?this.usersSub.unsubscribe():''
}
}

