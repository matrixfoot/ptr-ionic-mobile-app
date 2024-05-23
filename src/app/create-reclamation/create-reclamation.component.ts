import { Component, OnInit,OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import { Subscription } from 'rxjs';
import { MustMatch } from '../_helpers/must-match.validator';
import { ReclamationService } from '../services/reclamation.service';
import { Reclamation } from '../models/reclamation';
import { CommunService } from '../services/commun';
import Swal from 'sweetalert2';
import { MotifreclamationService } from '../services/motifreclamation';
import { Chargeback } from '../models/chargeback.model';
import { ChargebackService } from '../services/chargeback.service';
@Component({
  selector: 'app-create-reclamation',
  templateUrl: './create-reclamation.component.html',
  styleUrls: ['./create-reclamation.component.scss']
})
export class CreateReclamationComponent implements OnInit,OnDestroy {

  public reclamationform: FormGroup; 
  public currentuser: User;
  public reclamation: Reclamation;
  public imagePreview: string;
  fileUploaded = false; 
  private usersSub: Subscription;
  public loading = false;
  errormsg:string;
  submitted=false
  user: User;
  changementssub: Subscription;
  motifsub: Subscription;
  motifs=[]
  familles: any[]=[];
  groupes: any=[];
  settedfamilles: any[]=[];
  settedgroupes: any=[];
  settedmotifs: any[]=[];
  usertype: string;
  statutssub: Subscription;
  users: User[]=[];
  filtredusers: any[]=[];
  prenom: any;
  nom: any;
  raisonsociale: any;
  nature: any;
  showform=false;
  selectedaction: any;
  showvalidationbutton=false;
  commvalue=false;
  showmotif=false;
  effectiveuser: User;
  uploadedfiles: any[]=[];
  constructor(private formBuilder: FormBuilder,private token: TokenStorageService,
    private userservice: UserService,private mot: MotifreclamationService,
    private route: ActivatedRoute,
    private router: Router,
    private recserv: ReclamationService,
    private auth: AuthService,
    private commun: CommunService,private chargebackservice: ChargebackService,
    private tokenStorage: TokenStorageService,) {}


 ngOnInit() {
  this.loading = true;
  this.currentuser = this.token.getUser();
  this.userservice.getUserById(this.currentuser.userId).then(
    (user: User) => {
      this.user=user
      user.usertype=='Metier'||user.usertype=='agence'?this.userservice.getAll():''
    }
  )
  this.usersSub = this.userservice.users$.subscribe(
    (users) => {
      this.users = users;
    },
    (error) => {
      this.loading = false;
      this.errormsg=error.message;
    }
  );
  this.motifsub = this.mot.motifreclamations$.subscribe(
    (motifs) => {
      this.motifs = motifs;
      motifs.forEach(e=>e.groupe.forEach(el=>(this.familles.push(
      //@ts-ignore
       {
      //@ts-ignore
groupe:el.groupe,
     //@ts-ignore
fam:el.famille
       } ),
     //@ts-ignore
       this.groupes.push(el.groupe)
      //@ts-ignore
      ,this.motifs.push({id:el.code,intitule:el.motif,fam:el.famille}))))
     /* this.settedfamilles= this.familles.filter((obj, index) => {
        return index === this.familles.findIndex(o => obj === o);
      });
      this.settedfamilles=this.settedfamilles.sort()*/
      this.settedgroupes= this.groupes.filter((obj, index) => {
        return index === this.groupes.findIndex(o => obj === o);
      });
   //   this.settedgroupes=this.settedgroupes.sort() 
      this.settedgroupes=this.settedgroupes.filter(e=>e!='tout type')
     /* this.settedmotifs= this.motifs.filter((obj, index) => {
        return index === this.motifs.findIndex(o => obj.id === o.id);
      });
      this.settedmotifs=this.settedmotifs.sort()*/
    }
  )
  this.route.params.subscribe(
    (params) => {
    
      this.recserv.getReclamationdataById(params.id).then(
        (reclamation: Reclamation) => {
          this.userservice.getUserById(reclamation.userId).then(
            (user: User) => {
              this.loading = false;
              this.reclamation = reclamation;
              this.effectiveuser=user
              this.usertype=user.usertype
              console.log(this.reclamation.statut) 
    
                this.reclamationform = this.formBuilder.group({                
                  commentaire:'',
                  motif: '',
                  groupe: '',
                  famille: '',
                  file: '',
                });  
                /*this.statutssub = this.recserv.changements$.subscribe(
                  (changements) => {
                    this.reclamation.changements = changements;
          
                  }
                )*/
                this.statutssub = this.recserv.statuts$.subscribe(
                  (statuts) => {
                    this.reclamation.statut = statuts;
          
                  }
                )
            }
          )
              
        }
      );
    }
  );
  this.mot.getmotifreclamationss()

}
get f() { return this.reclamationform.controls; }
onchangegroupe(value:any):any
{
  let availablesfamilles=[]
  this.familles.forEach(e=>e.groupe==value?availablesfamilles.push(e.fam):'')
  availablesfamilles= availablesfamilles.filter((obj, index) => {
    return index === availablesfamilles.findIndex(o => obj === o);
  });
return availablesfamilles
}
onchangefamille(value:any):any
{
  let availablesmotifs=[]
  this.motifs.forEach(e=>e.fam==value?availablesmotifs.push({id:e.id,intitule:e.intitule}):'')
  availablesmotifs= availablesmotifs.filter((obj, index) => {
    return index === availablesmotifs.findIndex(o => obj === o);
  });
return availablesmotifs
}
filtermotif():string
{
  let returned:string
  let returned2:string
  let returned3:string

  //@ts-ignore
  let mot=this.reclamation.statut.find(e=>e.motif)
  //console.log(mot)
    //@ts-ignore
    mot?(returned=mot.motif,returned2=mot.famille,returned3=mot.groupe):returned=null
    //@ts-ignore
  return [returned,returned2,returned3]
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

onImagePick(event: Event) {
  this.uploadedfiles=[]
  for (var i = 0; i < (event.target as HTMLInputElement).files.length; i++) {
   // this.reclamationform.get('file').patchValue(file);
   // this.reclamationform.get('file').updateValueAndValidity();
   const file = (event.target as HTMLInputElement).files[i];
   this.uploadedfiles.push(file)
   const reader = new FileReader();
   reader.onload = () => {
     if (this.uploadedfiles.length>0) {
       this.imagePreview = reader.result as string;
       this.fileUploaded = true;
     } else {
       this.imagePreview = null;
     }
   };
   reader.readAsDataURL(file);
   
  }

}
/*removeammount(id:number)
{
    //@ts-ignore  
 this.reclamation.changements=this.reclamation.changements.filter(
  //@ts-ignore  
    e=>e.id!=id
  ) 
}*/
removestat(date:number)
{
  const reclamation=this.reclamation
     //@ts-ignore  
 this.reclamation.statut=this.reclamation.statut.filter(
  //@ts-ignore  
    e=>e.date!=date
  ) 
  reclamation.statut=this.reclamation.statut
  this.recserv.savereclamationById(reclamation._id, reclamation).then(
    (data:any) => {
      console.log(data)
      this.loading = false;
      this.reloadPage()
    },
    (error) => {
      this.loading = false;   
    } 
  );
}
onSubmit() {
  this.loading = true;
  this.submitted=true
 /* if (this.reclamationform.invalid) {
      
    return this.loading = false;
}*/
  const reclamation = new Reclamation();
  this.commun.getcurrenttime().then(
    async (data:any) => {
      reclamation.transactions=this.reclamation.transactions
      reclamation._id=this.reclamation._id
      reclamation.statut=this.reclamation.statut
      reclamation.statut.push(
        //@ts-ignore
        {
        //@ts-ignore
          item:reclamation.statut[reclamation.statut.length-1].item,
        //@ts-ignore
          etat:'en instance',
        //@ts-ignore
          date:data,
        //@ts-ignore
          acteur:this.user.usertype,
            //@ts-ignore
          role:reclamation.transactions[0].ISSUERBANKIDENTIFICATION==this.user.banque?'émetteur':
            //@ts-ignore
          reclamation.transactions[0].ACQUIRERBANKIDENTIFICATION==this.user.banque?'acquireur':'autre',
        //@ts-ignore
          commentaire :this.reclamationform.get('commentaire').value,
        //@ts-ignore
          motif :this.reclamationform.get('motif').value,
           //@ts-ignore
           famille :this.reclamationform.get('famille').value,
            //@ts-ignore
          groupe :this.reclamationform.get('groupe').value,
        //@ts-ignore
          ficheUrl : []
        }
      )
      this.recserv.modify(reclamation._id, reclamation, this.uploadedfiles).then(
        (data:any) => {
          this.loading = false;
          this.submitted=false
          this.getNavigation('open-detail/'+reclamation._id+'/all');
        },
        (error) => {
          this.loading = false;   
        } 
      );
    }
  )
}
availableactions():any
{
  let actions=[]
  //@ts-ignore
  let effectivestatus= this.reclamation.statut.filter(e=>!e.etat)
  if(this.user.usertype!='Clientcomm'&&this.user.usertype!='Clientpor')
  {
    //@ts-ignore
    this.reclamation.transactions[0].ACQUIRERBANKIDENTIFICATION==this.reclamation.transactions[0].ISSUERBANKIDENTIFICATION
    ?
    //@ts-ignore
    effectivestatus[effectivestatus.length-1].item=='crée'?
    actions.push('encours','acceptée','rejetée'):
//@ts-ignore
effectivestatus[effectivestatus.length-1].item=='rejetée'||effectivestatus[effectivestatus.length-1].item=='acceptée'?
actions.push():
//@ts-ignore
effectivestatus[effectivestatus.length-1].item=='encours'?
actions.push('acceptée','rejetée'):
actions.push()
    :

    //@ts-ignore
this.reclamation.transactions[0].ACQUIRERBANKIDENTIFICATION!=this.reclamation.transactions[0].ISSUERBANKIDENTIFICATION
?

//@ts-ignore
effectivestatus[effectivestatus.length-1].item=='crée'||effectivestatus[effectivestatus.length-1].item=='relancée'&&effectivestatus[effectivestatus.length-2].item=='rejetée'&&effectivestatus[effectivestatus.length-3].item=='crée'?
actions.push('encours','rejetée'):
//@ts-ignore
effectivestatus[effectivestatus.length-1].item=='encours'?
actions.push('chb émis','rejetée'):

//@ts-ignore
effectivestatus[effectivestatus.length-1].item=='chb émis'?
actions.push('acceptée','rejetée'):
//@ts-ignore
effectivestatus[effectivestatus.length-1].item=='rejetée'&&effectivestatus[effectivestatus.length-2].item=='chb émis'?
actions.push('pré-arbitrage','rejetée'):
//@ts-ignore
effectivestatus[effectivestatus.length-1].item=='relancée'&&effectivestatus[effectivestatus.length-2].item=='rejetée'&&effectivestatus[effectivestatus.length-3].item=='rejetée'?
actions.push('pré-arbitrage','clôturé'):
//@ts-ignore
effectivestatus[effectivestatus.length-1].item=='pré-arbitrage'?
actions.push('pré-arbitrage rejetée','acceptée'):
//@ts-ignore
effectivestatus[effectivestatus.length-1].item=='pré-arbitrage rejetée'?
actions.push('rejetée','arbitrage'):
//@ts-ignore
effectivestatus[effectivestatus.length-1].item=='relancée'&&effectivestatus[effectivestatus.length-2].item=='rejetée'?
actions.push('clôturé','arbitrage'):

//@ts-ignore
effectivestatus[effectivestatus.length-1].item=='arbitrage'?
actions.push('arbitrage rejeté','arbitrage accepté'):
//@ts-ignore
effectivestatus[effectivestatus.length-1].item=='arbitrage rejeté'?
actions.push('Arbitrage fav. émetteur','Arbitrage Fav. acquéreur'):
(actions.push(),this.loading=false)
:(actions.push(),this.loading=false)
    /* await Swal.fire({
      title: 'Veuillez choisir entre les alternatives suivantes!',
      input: 'select',
      inputLabel: 'Statut',
      inputValue: '',
      inputPlaceholder: "Selectionner un statut",
      returnInputValueOnDeny: true,
      icon: 'info',
      showCloseButton:true,
    //  html: `<button type="button" class="swal2-input" (click)="reloadPage()">reload </button>`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#555',
      confirmButtonText: 'valider',
      cancelButtonText: 'Annuler',
      denyButtonText: 'rejeter',
      inputOptions: {
          encours: "encours",
          acceptée: "acceptée",
         /* CHBemis: "chb émis",
          Repersentée: "repersentée",
          Relancée: "relancée",
          Prearb: "pre-arb",
          Prearbrejetée: "pre-arb rejetée",
          arbitrage: "arbitrage",
          arbitragefavemetteur: "Arbitrage fav. émetteur",
          ArbitrageFavacquéreur: "Arbitrage Fav. acquéreur",*/
      }
  else
  {
    //@ts-ignore
    effectivestatus[effectivestatus.length-1].item=='rejetée'&&effectivestatus[effectivestatus.length-2].item=='rejetée'?
    actions.push('relancée'):
    //@ts-ignore
    effectivestatus[effectivestatus.length-1].item=='rejetée'&&effectivestatus[effectivestatus.length-2].item=='pré-arbitrage rejetée'?
    actions.push('relancée'):
    //@ts-ignore
    effectivestatus[effectivestatus.length-1].item=='rejetée'&&effectivestatus[effectivestatus.length-2].item=='crée'?
    actions.push('relancée'):
    //@ts-ignore
    effectivestatus[effectivestatus.length-1].item=='rejetée'&&effectivestatus[effectivestatus.length-2].item=='encours'?
    actions.push('relancée'):
    (actions.push(),this.loading=false)
   /* this.reclamation.changements=this.this.reclamation.changements
    this.recserv.savereclamationById(this.reclamation._id, this.reclamation).then(
      (data:any) => {
        console.log(data)
        this.loading = false;
       this.reloadPage();
      },
      (error) => {
        this.loading = false;   
      } 
    );*/
  }
  return actions
}
changeaction(e)
{
  this.showvalidationbutton=true
  this.showform=true
  this.selectedaction = e.target.value
  this.selectedaction=='chb émis'?this.showmotif=true:this.showmotif=false
//this.selectedaction=='notification'?(this.commvalue=true,this.showform=true):(this.commvalue=false,this.showform=false)
}
verifychb()
{
  let currentdate=new Date().getTime()
  let date2=currentdate
  console.log(this.motifs[0].groupe.find(ele=>ele.code==this.reclamationform.get('motif').value.substring(0,4)).delai)
  //@ts-ignore
  this.motifs[0].groupe.find(ele=>ele.code==this.reclamationform.get('motif').value.substring(0,4))?date2=this.motifs[0].groupe.find(ele=>ele.code==this.reclamationform.get('motif').value.substring(0,4)).delai*24*3600*1000:date2=1
  //@ts-ignore
  if(new Date(this.reclamation.transactions[0].PROCESSINGDATE).getTime()+date2<=currentdate)
   {
    alert('Délais réglementaires de '+`${this.motifs[0].groupe.find(ele=>ele.code==this.reclamationform.get('motif').value.substring(0,4)).delai} jours dépassés. Action impossible.`  )
   this.reclamationform.reset()
  }
}

/*changecheckbox()
{
 this.commvalue?this.showform=true:(this.showform=false,this.reclamationform.reset())
}*/
onSend(user:User) {
  let docoblig:any
  //@ts-ignore
this.motifs[0].groupe.find(ele=>ele.code==this.reclamationform.get('motif').value.substring(0,4))?docoblig=this.motifs[0].groupe.find(ele=>ele.code==this.reclamationform.get('motif').value.substring(0,4)).contientfichier:docoblig='Non'

if (!this.reclamationform.get('motif').value&&this.showmotif)
{
   return (this.loading = false,this.submitted=false,alert('veuillez indiquer le motif de chargeback'));
}
else if (this.uploadedfiles.length==0&&docoblig=='Oui'&&this.selectedaction=='chb émis')
{
   return (this.loading = false,this.submitted=false,alert('le rattachement d\'un document est obligatoire'));
}
else 
{
  this.commun.getcurrenttime().then(
    async (time:any) => {
        this.recserv.getReclamationdataById(this.reclamation._id).then(
          async (reclamation: Reclamation) => {
            this.loading = true;
            this.submitted=true
           /* if (this.reclamationform.get('commentaire').value!=null) {  
              return    (Swal.fire({
                title: 'veuillez ajouter votre commentaire avant de valider!',
                icon: 'error',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
              }),
              this.loading = false)   
          }*/
          reclamation.statut=this.reclamation.statut
          if(user.usertype!='Clientcomm'&&user.usertype!='Clientpor')
      {
this.setstatutmetier(reclamation,this.selectedaction,time)
      }
      else
      {
this.setstatutporteur(reclamation,this.selectedaction,time) 
      }
          }
        )
    }
  )
}
}
async setstatutmetier(reclamation?:Reclamation,chosenstatut?:any,time?:any)
{
  //@ts-ignore
  let effectivestatus= reclamation.statut.filter(e=>!e.etat)
  console.log(effectivestatus)
              //@ts-ignore
              reclamation.statut.push({
                //@ts-ignore
      item: chosenstatut!='notification'&&chosenstatut!='notifiercommercant'?chosenstatut:effectivestatus[effectivestatus.length-1].item,
                //@ts-ignore
      date: time,
       //@ts-ignore
etat:chosenstatut=='notification'?'Ajout note':chosenstatut=='notifiercommercant'?'notification commerçant':'',
     //@ts-ignore
       acteur:this.user.usertype,
         //@ts-ignore
       role:reclamation.transactions[0].ISSUERBANKIDENTIFICATION==this.user.banque?'émetteur':
         //@ts-ignore
       reclamation.transactions[0].ACQUIRERBANKIDENTIFICATION==this.user.banque?'acquireur':'autre',
     //@ts-ignore
       commentaire :this.reclamationform.get('commentaire').value,
     //@ts-ignore
       motif :this.reclamationform.get('motif').value,
        //@ts-ignore
        famille :this.reclamationform.get('famille').value,
        //@ts-ignore
      groupe :this.reclamationform.get('groupe').value,
     //@ts-ignore
       ficheUrl : []
     })
    /* result.value?reclamation.changements.push(
       //@ts-ignore
       {
                 //@ts-ignore
         id:reclamation.changements.length==0?1:
                   //@ts-ignore
         reclamation.changements[reclamation.changements.length-1].id+1,
         //@ts-ignore
       //  commentaire :result.value,
                 //@ts-ignore
         date:time,
                 //@ts-ignore
         acteur:this.user.usertype,
       }
     ):''*/
     if(chosenstatut=='chb émis')
{
  const chargeback:Chargeback= new Chargeback()
  //@ts-ignore
  chargeback.MERCHANTIDENTIFICATION=reclamation.transactions[0].MERCHANTIDENTIFICATION
    //@ts-ignore
  chargeback.BATCHIDENTIFICATION=reclamation.transactions[0].BATCHIDENTIFICATION
    //@ts-ignore
  chargeback.INVOICENUMBER=reclamation.transactions[0].INVOICENUMBER
    //@ts-ignore
  chargeback.CARDHOLDERNUMBER=reclamation.transactions[0].CARDHOLDERNUMBER
    //@ts-ignore
  chargeback.MERCHANTSECTOR=reclamation.transactions[0].MERCHANTSECTOR
    //@ts-ignore
  chargeback.CHANNELTRANSACTIONID=reclamation.transactions[0].CHANNELTRANSACTIONID
    //@ts-ignore
  chargeback.OPERATIONCODE=reclamation.transactions[0].OPERATIONCODE
    //@ts-ignore
chargeback.TRANSACTIONCODE=reclamation.transactions[0].TRANSACTIONCODE=='05'?'15':reclamation.transactions[0].TRANSACTIONCODE=='07'?'17':reclamation.transactions[0].TRANSACTIONCODE=='08'?'18':'  '
    //@ts-ignore
  chargeback.TRANSACTIONAMOUNT=reclamation.transactions[0].TRANSACTIONAMOUNT
    //@ts-ignore
  chargeback.CARDEXPIRYDATE=reclamation.transactions[0].CARDEXPIRYDATE
    //@ts-ignore
  chargeback.PROCESSINGDATE=reclamation.transactions[0].PROCESSINGDATE
    //@ts-ignore
  chargeback.TRANSACTIONDATE=reclamation.transactions[0].TRANSACTIONDATE
    //@ts-ignore
  chargeback.AUTHORIZATIONCODE=reclamation.transactions[0].AUTHORIZATIONCODE
    //@ts-ignore
  chargeback.REMITTANCEDATE=reclamation.transactions[0].REMITTANCEDATE
    //@ts-ignore
  chargeback.MERCHANTCATEGORIECODE=reclamation.transactions[0].MERCHANTCATEGORIECODE
    //@ts-ignore
  chargeback.FILLER=reclamation.transactions[0].FILLER
    //@ts-ignore
  chargeback.ACQUIRERBANKIDENTIFICATION=reclamation.transactions[0].ACQUIRERBANKIDENTIFICATION
    //@ts-ignore
  chargeback.LOCALCARDSYSTEMNETWORK=reclamation.transactions[0].LOCALCARDSYSTEMNETWORK
    //@ts-ignore
  chargeback.ISSUERBANKIDENTIFICATION=reclamation.transactions[0].ISSUERBANKIDENTIFICATION
    //@ts-ignore
  chargeback.ACQUIRERREFERENCENUMBER=reclamation.transactions[0].ACQUIRERREFERENCENUMBER
  //@ts-ignore
  chargeback.TRANSACTIONORDERUSAGECODE=reclamation.transactions[0].TRANSACTIONORDERUSAGECODE
    //@ts-ignore
  chargeback.CHARGEBACKREASONCODE=this.reclamationform.get('motif').value.substring(0,2)
    //@ts-ignore
  chargeback.CHARGEBACKTRANSACTIONCYCLE='1'
    //@ts-ignore
  chargeback.MESSAGE=this.reclamationform.get('motif').value.substring(3,22)
    //@ts-ignore
  chargeback.SETTLEMENTAMOUNT=reclamation.transactions[0].SETTLEMENTAMOUNT
    //@ts-ignore
  chargeback.TRANSACTIONTIME=reclamation.transactions[0].TRANSACTIONTIME
    //@ts-ignore
  chargeback.FILLERCHARGEBACK=reclamation.transactions[0].FILLER
  this.chargebackservice.create(chargeback).then(
    (data) => {
      this.recserv.modify(reclamation._id, reclamation, this.uploadedfiles).then(
        (data:any) => {
          this.loading = false;
          this.submitted=false
          this.getNavigation('open-detail/'+reclamation._id+'/all');
         },
        (error) => {
          this.loading = false;   
        } 
      );
    }
  ).catch(
    ()=>{this.loading=false}
  )
}
//@ts-ignore
else  if(chosenstatut=='rejetée'&&reclamation.role=='acquireur')
{
  const chargeback:Chargeback= new Chargeback()
  //@ts-ignore
  chargeback.MERCHANTIDENTIFICATION=reclamation.transactions[0].MERCHANTIDENTIFICATION
    //@ts-ignore
  chargeback.BATCHIDENTIFICATION=reclamation.transactions[0].BATCHIDENTIFICATION
    //@ts-ignore
  chargeback.INVOICENUMBER=reclamation.transactions[0].INVOICENUMBER
    //@ts-ignore
  chargeback.CARDHOLDERNUMBER=reclamation.transactions[0].CARDHOLDERNUMBER
    //@ts-ignore
  chargeback.MERCHANTSECTOR=reclamation.transactions[0].MERCHANTSECTOR
    //@ts-ignore
  chargeback.CHANNELTRANSACTIONID=reclamation.transactions[0].CHANNELTRANSACTIONID
    //@ts-ignore
  chargeback.OPERATIONCODE=reclamation.transactions[0].OPERATIONCODE
    //@ts-ignore
chargeback.TRANSACTIONCODE=reclamation.transactions[0].TRANSACTIONCODE=='05'?'15':reclamation.transactions[0].TRANSACTIONCODE=='07'?'17':reclamation.transactions[0].TRANSACTIONCODE=='08'?'18':'  '
    //@ts-ignore
  chargeback.TRANSACTIONAMOUNT=reclamation.transactions[0].TRANSACTIONAMOUNT
    //@ts-ignore
  chargeback.CARDEXPIRYDATE=reclamation.transactions[0].CARDEXPIRYDATE
    //@ts-ignore
  chargeback.PROCESSINGDATE=reclamation.transactions[0].PROCESSINGDATE
    //@ts-ignore
  chargeback.TRANSACTIONDATE=reclamation.transactions[0].TRANSACTIONDATE
    //@ts-ignore
  chargeback.AUTHORIZATIONCODE=reclamation.transactions[0].AUTHORIZATIONCODE
    //@ts-ignore
  chargeback.REMITTANCEDATE=reclamation.transactions[0].REMITTANCEDATE
    //@ts-ignore
  chargeback.MERCHANTCATEGORIECODE=reclamation.transactions[0].MERCHANTCATEGORIECODE
    //@ts-ignore
  chargeback.FILLER=reclamation.transactions[0].FILLER
    //@ts-ignore
  chargeback.ACQUIRERBANKIDENTIFICATION=reclamation.transactions[0].ACQUIRERBANKIDENTIFICATION
    //@ts-ignore
  chargeback.LOCALCARDSYSTEMNETWORK=reclamation.transactions[0].LOCALCARDSYSTEMNETWORK
    //@ts-ignore
  chargeback.ISSUERBANKIDENTIFICATION=reclamation.transactions[0].ISSUERBANKIDENTIFICATION
    //@ts-ignore
  chargeback.ACQUIRERREFERENCENUMBER=reclamation.transactions[0].ACQUIRERREFERENCENUMBER
  //@ts-ignore
  chargeback.TRANSACTIONORDERUSAGECODE=reclamation.transactions[0].TRANSACTIONORDERUSAGECODE
    //@ts-ignore
  chargeback.CHARGEBACKREASONCODE=this.reclamationform.get('motif').value.substring(0,2)
    //@ts-ignore
  chargeback.CHARGEBACKTRANSACTIONCYCLE='1'
    //@ts-ignore
  chargeback.MESSAGE=this.reclamationform.get('motif').value.substring(3,22)
    //@ts-ignore
  chargeback.SETTLEMENTAMOUNT=reclamation.transactions[0].SETTLEMENTAMOUNT
    //@ts-ignore
  chargeback.TRANSACTIONTIME=reclamation.transactions[0].TRANSACTIONTIME
    //@ts-ignore
  chargeback.FILLERCHARGEBACK=reclamation.transactions[0].FILLER
  this.chargebackservice.create(chargeback).then(
    (data) => {
      this.recserv.modify(reclamation._id, reclamation, this.uploadedfiles).then(
        (data:any) => {
          this.loading = false;
          this.submitted=false
          this.getNavigation('open-detail/'+reclamation._id+'/all');
         },
        (error) => {
          this.loading = false;   
        } 
      );
    }
  ).catch(
    ()=>{this.loading=false}
  )
}
//@ts-ignore
else if(chosenstatut=='acceptée'&&effectivestatus[effectivestatus.length-1].item=='pré-arbitrage')
{
  const chargeback:Chargeback= new Chargeback()
  //@ts-ignore
  chargeback.MERCHANTIDENTIFICATION=reclamation.transactions[0].MERCHANTIDENTIFICATION
    //@ts-ignore
  chargeback.BATCHIDENTIFICATION=reclamation.transactions[0].BATCHIDENTIFICATION
    //@ts-ignore
  chargeback.INVOICENUMBER=reclamation.transactions[0].INVOICENUMBER
    //@ts-ignore
  chargeback.CARDHOLDERNUMBER=reclamation.transactions[0].CARDHOLDERNUMBER
    //@ts-ignore
  chargeback.MERCHANTSECTOR=reclamation.transactions[0].MERCHANTSECTOR
    //@ts-ignore
  chargeback.CHANNELTRANSACTIONID=reclamation.transactions[0].CHANNELTRANSACTIONID
    //@ts-ignore
  chargeback.OPERATIONCODE='C'
    //@ts-ignore
chargeback.TRANSACTIONCODE=reclamation.transactions[0].TRANSACTIONCODE=='05'?'15':reclamation.transactions[0].TRANSACTIONCODE=='07'?'17':reclamation.transactions[0].TRANSACTIONCODE=='08'?'18':'  '
    //@ts-ignore
  chargeback.TRANSACTIONAMOUNT=reclamation.transactions[0].TRANSACTIONAMOUNT
    //@ts-ignore
  chargeback.CARDEXPIRYDATE=reclamation.transactions[0].CARDEXPIRYDATE
    //@ts-ignore
  chargeback.PROCESSINGDATE=reclamation.transactions[0].PROCESSINGDATE
    //@ts-ignore
  chargeback.TRANSACTIONDATE=reclamation.transactions[0].TRANSACTIONDATE
    //@ts-ignore
  chargeback.AUTHORIZATIONCODE=reclamation.transactions[0].AUTHORIZATIONCODE
    //@ts-ignore
  chargeback.REMITTANCEDATE=reclamation.transactions[0].REMITTANCEDATE
    //@ts-ignore
  chargeback.MERCHANTCATEGORIECODE=reclamation.transactions[0].MERCHANTCATEGORIECODE
    //@ts-ignore
  chargeback.FILLER=reclamation.transactions[0].FILLER
    //@ts-ignore
  chargeback.ACQUIRERBANKIDENTIFICATION=reclamation.transactions[0].ACQUIRERBANKIDENTIFICATION
    //@ts-ignore
  chargeback.LOCALCARDSYSTEMNETWORK=reclamation.transactions[0].LOCALCARDSYSTEMNETWORK
    //@ts-ignore
  chargeback.ISSUERBANKIDENTIFICATION=reclamation.transactions[0].ISSUERBANKIDENTIFICATION
    //@ts-ignore
  chargeback.ACQUIRERREFERENCENUMBER=reclamation.transactions[0].ACQUIRERREFERENCENUMBER
  //@ts-ignore
  chargeback.TRANSACTIONORDERUSAGECODE=reclamation.transactions[0].TRANSACTIONORDERUSAGECODE
    //@ts-ignore
  chargeback.CHARGEBACKREASONCODE=this.reclamationform.get('motif').value.substring(0,2)
    //@ts-ignore
  chargeback.CHARGEBACKTRANSACTIONCYCLE='1'
    //@ts-ignore
  chargeback.MESSAGE='1pre-arb accepte'
    //@ts-ignore
  chargeback.SETTLEMENTAMOUNT=reclamation.transactions[0].SETTLEMENTAMOUNT
    //@ts-ignore
  chargeback.TRANSACTIONTIME=reclamation.transactions[0].TRANSACTIONTIME
    //@ts-ignore
  chargeback.FILLERCHARGEBACK=reclamation.transactions[0].FILLER
  this.chargebackservice.create(chargeback).then(
    (data) => {
      this.recserv.modify(reclamation._id, reclamation, this.uploadedfiles).then(
        (data:any) => {
          this.loading = false;
          this.submitted=false
          this.getNavigation('open-detail/'+reclamation._id+'/all');
         },
        (error) => {
          this.loading = false;   
        } 
      );
    }
  ).catch(
    ()=>{this.loading=false}
  )
}
else if(chosenstatut=='arbitrage accepté')
{
  const chargeback:Chargeback= new Chargeback()
  //@ts-ignore
  chargeback.MERCHANTIDENTIFICATION=reclamation.transactions[0].MERCHANTIDENTIFICATION
    //@ts-ignore
  chargeback.BATCHIDENTIFICATION=reclamation.transactions[0].BATCHIDENTIFICATION
    //@ts-ignore
  chargeback.INVOICENUMBER=reclamation.transactions[0].INVOICENUMBER
    //@ts-ignore
  chargeback.CARDHOLDERNUMBER=reclamation.transactions[0].CARDHOLDERNUMBER
    //@ts-ignore
  chargeback.MERCHANTSECTOR=reclamation.transactions[0].MERCHANTSECTOR
    //@ts-ignore
  chargeback.CHANNELTRANSACTIONID=reclamation.transactions[0].CHANNELTRANSACTIONID
    //@ts-ignore
  chargeback.OPERATIONCODE='C'
    //@ts-ignore
chargeback.TRANSACTIONCODE=reclamation.transactions[0].TRANSACTIONCODE=='05'?'15':reclamation.transactions[0].TRANSACTIONCODE=='07'?'17':reclamation.transactions[0].TRANSACTIONCODE=='08'?'18':'  '
    //@ts-ignore
  chargeback.TRANSACTIONAMOUNT=reclamation.transactions[0].TRANSACTIONAMOUNT
    //@ts-ignore
  chargeback.CARDEXPIRYDATE=reclamation.transactions[0].CARDEXPIRYDATE
    //@ts-ignore
  chargeback.PROCESSINGDATE=reclamation.transactions[0].PROCESSINGDATE
    //@ts-ignore
  chargeback.TRANSACTIONDATE=reclamation.transactions[0].TRANSACTIONDATE
    //@ts-ignore
  chargeback.AUTHORIZATIONCODE=reclamation.transactions[0].AUTHORIZATIONCODE
    //@ts-ignore
  chargeback.REMITTANCEDATE=reclamation.transactions[0].REMITTANCEDATE
    //@ts-ignore
  chargeback.MERCHANTCATEGORIECODE=reclamation.transactions[0].MERCHANTCATEGORIECODE
    //@ts-ignore
  chargeback.FILLER=reclamation.transactions[0].FILLER
    //@ts-ignore
  chargeback.ACQUIRERBANKIDENTIFICATION=reclamation.transactions[0].ACQUIRERBANKIDENTIFICATION
    //@ts-ignore
  chargeback.LOCALCARDSYSTEMNETWORK=reclamation.transactions[0].LOCALCARDSYSTEMNETWORK
    //@ts-ignore
  chargeback.ISSUERBANKIDENTIFICATION=reclamation.transactions[0].ISSUERBANKIDENTIFICATION
    //@ts-ignore
  chargeback.ACQUIRERREFERENCENUMBER=reclamation.transactions[0].ACQUIRERREFERENCENUMBER
  //@ts-ignore
  chargeback.TRANSACTIONORDERUSAGECODE=reclamation.transactions[0].TRANSACTIONORDERUSAGECODE
    //@ts-ignore
  chargeback.CHARGEBACKREASONCODE=this.reclamationform.get('motif').value.substring(0,2)
    //@ts-ignore
  chargeback.CHARGEBACKTRANSACTIONCYCLE='1'
    //@ts-ignore
  chargeback.MESSAGE='2arbitrage accepte'
    //@ts-ignore
  chargeback.SETTLEMENTAMOUNT=reclamation.transactions[0].SETTLEMENTAMOUNT
    //@ts-ignore
  chargeback.TRANSACTIONTIME=reclamation.transactions[0].TRANSACTIONTIME
    //@ts-ignore
  chargeback.FILLERCHARGEBACK=reclamation.transactions[0].FILLER
  this.chargebackservice.create(chargeback).then(
    (data) => {
      this.recserv.modify(reclamation._id, reclamation, this.uploadedfiles).then(
        (data:any) => {
          this.loading = false;
          this.submitted=false
          this.getNavigation('open-detail/'+reclamation._id+'/all');
         },
        (error) => {
          this.loading = false;   
        } 
      );
    }
  ).catch(
    ()=>{this.loading=false}
  )
}
else if(chosenstatut=='Arbitrage fav. émetteur')
{
  const chargeback:Chargeback= new Chargeback()
  //@ts-ignore
  chargeback.MERCHANTIDENTIFICATION=reclamation.transactions[0].MERCHANTIDENTIFICATION
    //@ts-ignore
  chargeback.BATCHIDENTIFICATION=reclamation.transactions[0].BATCHIDENTIFICATION
    //@ts-ignore
  chargeback.INVOICENUMBER=reclamation.transactions[0].INVOICENUMBER
    //@ts-ignore
  chargeback.CARDHOLDERNUMBER=reclamation.transactions[0].CARDHOLDERNUMBER
    //@ts-ignore
  chargeback.MERCHANTSECTOR=reclamation.transactions[0].MERCHANTSECTOR
    //@ts-ignore
  chargeback.CHANNELTRANSACTIONID=reclamation.transactions[0].CHANNELTRANSACTIONID
    //@ts-ignore
  chargeback.OPERATIONCODE='C'
    //@ts-ignore
chargeback.TRANSACTIONCODE=reclamation.transactions[0].TRANSACTIONCODE=='05'?'15':reclamation.transactions[0].TRANSACTIONCODE=='07'?'17':reclamation.transactions[0].TRANSACTIONCODE=='08'?'18':'  '
    //@ts-ignore
  chargeback.TRANSACTIONAMOUNT=reclamation.transactions[0].TRANSACTIONAMOUNT
    //@ts-ignore
  chargeback.CARDEXPIRYDATE=reclamation.transactions[0].CARDEXPIRYDATE
    //@ts-ignore
  chargeback.PROCESSINGDATE=reclamation.transactions[0].PROCESSINGDATE
    //@ts-ignore
  chargeback.TRANSACTIONDATE=reclamation.transactions[0].TRANSACTIONDATE
    //@ts-ignore
  chargeback.AUTHORIZATIONCODE=reclamation.transactions[0].AUTHORIZATIONCODE
    //@ts-ignore
  chargeback.REMITTANCEDATE=reclamation.transactions[0].REMITTANCEDATE
    //@ts-ignore
  chargeback.MERCHANTCATEGORIECODE=reclamation.transactions[0].MERCHANTCATEGORIECODE
    //@ts-ignore
  chargeback.FILLER=reclamation.transactions[0].FILLER
    //@ts-ignore
  chargeback.ACQUIRERBANKIDENTIFICATION=reclamation.transactions[0].ACQUIRERBANKIDENTIFICATION
    //@ts-ignore
  chargeback.LOCALCARDSYSTEMNETWORK=reclamation.transactions[0].LOCALCARDSYSTEMNETWORK
    //@ts-ignore
  chargeback.ISSUERBANKIDENTIFICATION=reclamation.transactions[0].ISSUERBANKIDENTIFICATION
    //@ts-ignore
  chargeback.ACQUIRERREFERENCENUMBER=reclamation.transactions[0].ACQUIRERREFERENCENUMBER
  //@ts-ignore
  chargeback.TRANSACTIONORDERUSAGECODE=reclamation.transactions[0].TRANSACTIONORDERUSAGECODE
    //@ts-ignore
  chargeback.CHARGEBACKREASONCODE=this.reclamationform.get('motif').value.substring(0,2)
    //@ts-ignore
  chargeback.CHARGEBACKTRANSACTIONCYCLE='1'
    //@ts-ignore
  chargeback.MESSAGE='3arbitrage fav Emetteur'
    //@ts-ignore
  chargeback.SETTLEMENTAMOUNT=reclamation.transactions[0].SETTLEMENTAMOUNT
    //@ts-ignore
  chargeback.TRANSACTIONTIME=reclamation.transactions[0].TRANSACTIONTIME
    //@ts-ignore
  chargeback.FILLERCHARGEBACK=reclamation.transactions[0].FILLER
  this.chargebackservice.create(chargeback).then(
    (data) => {
      this.recserv.modify(reclamation._id, reclamation, this.uploadedfiles).then(
        (data:any) => {
          this.loading = false;
          this.submitted=false
          this.getNavigation('open-detail/'+reclamation._id+'/all');
         },
        (error) => {
          this.loading = false;   
        } 
      );
    }
  ).catch(
    ()=>{this.loading=false}
  )
}
  else 
  {
    this.recserv.modify(reclamation._id, reclamation, this.uploadedfiles).then(
      (data:any) => {
        this.loading = false;
        this.submitted=false
        this.getNavigation('open-detail/'+reclamation._id+'/all');
       },
      (error) => {
        this.loading = false;   
      } 
    );
  } 

}
setstatutporteur(reclamation:Reclamation,chosenstatut?:string,time?:any)
{
    //@ts-ignore
    let effectivestatus= reclamation.statut.filter(e=>!e.etat)
         //@ts-ignore
         reclamation.statut.push({
          //@ts-ignore
          item: chosenstatut!='réponse'?chosenstatut:effectivestatus[effectivestatus.length-1].item,
          //@ts-ignore
date: time,
 //@ts-ignore
etat:chosenstatut=='réponse'?'réponse commerçant':'',
//@ts-ignore
 acteur:this.user.usertype,
//@ts-ignore
 commentaire :this.reclamationform.get('commentaire').value,
//@ts-ignore
 motif :this.reclamationform.get('motif').value,
  //@ts-ignore
  famille :this.reclamationform.get('famille').value,
  //@ts-ignore
groupe :this.reclamationform.get('groupe').value,
//@ts-ignore
 ficheUrl : []
})
this.recserv.modify(reclamation._id, reclamation, this.uploadedfiles).then(
  (data:any) => {
    this.loading = false;
    this.submitted=false
    this.getNavigation('open-detail/'+reclamation._id+'/all');
  },
  (error) => {
    this.loading = false;   
  } 
);
}

sort()
{
  this.motifs.sort()
}
getNavigation(link){
  this.router.navigate([link]); 
}
filterusers(id:string)
{
  this.filtredusers=this.commun.filterByValue(this.users,id)
  if(this.filtredusers.length>0)
  {
    this.prenom=this.filtredusers[0].firstname
    this.nom=this.filtredusers[0].lastname
    this.nature=this.filtredusers[0].nature
  }
  else
  {
    this.prenom='utilisateur supprimé'
    this.nom='utilisateur supprimé'
  }
}
opendetail(link, id,date){
      
  this.router.navigate([]).then((_result) => {
    window.open(link + '/' + id+ '/' + date, '_blank');
  });; 
}
ngOnDestroy(){
  this.changementssub?this.changementssub.unsubscribe():'';
  this.motifsub?this.motifsub.unsubscribe():'';
}
reloadPage (){
window.location.reload();
}
}
