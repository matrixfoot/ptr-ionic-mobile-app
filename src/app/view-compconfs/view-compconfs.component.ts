import { Component, OnInit,OnDestroy, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { concat, Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { Decfiscmens } from '../models/dec-fisc-mens';
import { Router } from '@angular/router';
import { Compconf } from '../models/compconf.model';
import { compconfService } from '../services/compconf.service';
import { ReclamationService } from '../services/reclamation.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommunService } from '../services/commun';
import { ExcelService } from '../services/excel.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { TokenStorageService } from '../services/token-storage.service';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
import { Reclamation } from '../models/reclamation';
import { dataService } from '../services/data.service';
import { MotifreclamationService } from '../services/motifreclamation';
@Component({
  selector: 'app-view-compconfs',
  templateUrl: './view-compconfs.component.html',
  styleUrls: ['./view-compconfs.component.scss']
})
export class ViewCompconfsComponent implements OnInit,OnDestroy {
  displayStyle: string;
  settedfiltreditems: any[]=[];
  displaysearch='none';
  compconfsnormal: Compconf[]=[];
  compconfssecond: Compconf[]=[];
  compconfschargeback: Compconf[]=[];
  currentItemsToShownormal: Compconf[]=[];
  currentItemsToShowsecond: Compconf[]=[];
  currentItemsToShowchargeback: Compconf[]=[];
  optionValue='';
  option1Value='';
  option2Value='';
  option3Value=null;
  option4Value=null;
  filtredcompconfs: Compconf[]=[];
  userinfos: any[]=[];
  carte: String;
  searchlist: any[]=[];
  fileslength=0;
  filtreditemschecked: any[]=[];
  transactions: any[]=[];
  displaybox: string='none';
  public reclamationform: FormGroup; 
  submitted=false;
  imagePreview: string;
  fileUploaded: boolean;
  createdrec: any[];
  usertype: string;
  recsub: Subscription;
  reclamations: Reclamation[]=[];
  transactionsrec: any[]=[];
  user: User;
  deleting=false;
  motifsub: Subscription;
  motifs=[];
  uploadedfiles: any[]=[];
  currentUser: User;
  public loading: boolean;
  public users: User[] = [];
  public compconfs: Compconf[] = [];
  public pluscompconfs: Compconf[] = [];
  pluscompconfsSub: Subscription;

  compconfsSub: Subscription;
  showitems:false
  currentItemsToShow: any=[];
  filtreditems: any=[];
  filtredcompconfsbyportcomm: Compconf[]=[];
  constructor(private token: TokenStorageService,private formBuilder: FormBuilder,
    private UserService: UserService,
    private commun: CommunService,private com: compconfService,private mot: MotifreclamationService,
    private recserv: ReclamationService,
    private router: Router,    private data: dataService,

    private excelService:ExcelService) { }

  ngOnInit() {
    this.reclamationform = this.formBuilder.group({               
      commentaire:'',
      motif: '',
      file: '',
    });  
    this.loading=true
    this.currentUser = this.token.getUser();
    this.motifsub = this.mot.motifreclamations$.subscribe(
      (motifs) => {
this.motifs=motifs
      }
    )
    this.UserService.getUserById(this.currentUser.userId).then(
      (user:User) => {
        this.loading=false
        this.user=user
        this.usertype=user.usertype
this.carte=user.carte
        if (user.usertype=='Clientcomm'&&!user.compte&&!user.affiliation&&!user.terminal
        ||user.usertype=='Clientpor'&&!user.carte||user.usertype=='Clientpor'&&!user.compte) 
        return (Swal.fire(
user.usertype=='Clientcomm'&&!user.compte&&!user.affiliation&&!user.terminal?'veuillez renseigner votre numéro de compte ou numéro d\'affiiation ou numéro terminal':
user.usertype=='Clientpor'&&!user.carte||user.usertype=='Clientpor'&&!user.compte?'veuillez renseigner votre numéro de compte ou numéro de carte':''),
         this.router.navigate(['complete-profil/'+this.currentUser.userId]))  
         user.usertype=='Clientpor'?this.data.getmanyinfo(user.compte).then(
          (res:any[])=>{
            console.log(res)
            this.displaysearch="block"
            this.userinfos=res
this.userinfos= this.userinfos.filter((obj, index) => {
  return index === this.userinfos.findIndex(o => obj.carte === o.carte);
});
          }
         ).catch(() => {
          Swal.fire('numéro de compte non renseigné!')
        }):
        this.usertype=='Metier'||this.usertype=='agence'?
        this.displaysearch="block":''
        this.recsub = this.recserv.allreclamations$.subscribe(
          (reclamations) => {
            this.reclamations=reclamations
            this.reclamations.forEach(e=>
              {
                e.transactions.forEach(el=>this.transactionsrec.push(el))
              })
          }
        )   
     this.compconfsSub = this.com.compconfs$.subscribe(
          (compconfs) => {
            this.compconfs = compconfs;

          //  this.filtredcompconfs=this.compconfs.filter(e=>CryptoJS.AES.decrypt(e.CARDHOLDERNUMBER, '****************').toString(CryptoJS.enc.Utf8).substring(0,16)==user.carte)
            this.loading = false;
            this.compconfsnormal=this.compconfs.filter((item) => item.TRANSACTIONCODE=="08"&&item.PRESENTMENTINDICATOR!="R"
            ||item.TRANSACTIONCODE=="05"&&item.PRESENTMENTINDICATOR!="R"||item.TRANSACTIONCODE=="06"&&item.PRESENTMENTINDICATOR!="R"
            ||item.TRANSACTIONCODE=="07"&&item.PRESENTMENTINDICATOR!="R")

            this.compconfssecond=this.compconfs.filter((item) => item.TRANSACTIONCODE=="08"&&item.PRESENTMENTINDICATOR=="R"
            ||item.TRANSACTIONCODE=="05"&&item.PRESENTMENTINDICATOR=="R"||item.TRANSACTIONCODE=="06"&&item.PRESENTMENTINDICATOR=="R"
            ||item.TRANSACTIONCODE=="07"&&item.PRESENTMENTINDICATOR=="R")

            this.compconfschargeback=this.compconfs.filter((item) => item.TRANSACTIONCODE=="15"||item.TRANSACTIONCODE=="17"
            ||item.TRANSACTIONCODE=="18")

            this.currentItemsToShownormal=this.compconfsnormal.slice(0,100)
            this.currentItemsToShowsecond=this.compconfssecond.slice(0,100)
            this.currentItemsToShowchargeback=this.compconfschargeback.slice(0,100)
            this.compconfs.length>0?this.displaysearch="block":''
            console.log( this.currentItemsToShownormal.length)
            console.log( this.currentItemsToShowsecond.length)
            console.log( this.currentItemsToShowchargeback.length)

          },
          (error) => {
            this.loading = false;
          }
        );
        this.token.getToken()?this.getallcompconfs():''
        this.recserv.getReclamations()
        this.mot.getmotifreclamationss()

      }
    )
 
  }
  get f() { return this.reclamationform.controls; }
displaytran(value:string):boolean
{
let display:boolean
this.transactionsrec.find(e=>e.ACQUIRERREFERENCENUMBER==value)==undefined?display=true:display=false
return display
}
visitrec(value:string):string
{
  let link:string
  let filter=this.commun.filterByValue(this.reclamations,value)
  console.log(filter)
  filter.length>0?link=filter[0]._id:''
  console.log(link)
  return link
}
getNavigation(link, id){
  this.router.navigate([link + '/' + id]); 
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
  getallcompconfs() {  
    console.log(this.carte)
    this.usertype=='Clientcomm'||this.usertype=='Clientpor'?                                     
    this.com.getusercompconfs(this.carte).then(
      (data:any) => {
        console.log(data)
        this.buildData(this.compconfs.length)
      },
      (error) => {
        this.loading = false;    
      }
   ):''
 } 
 buildData(length: number) {
  const ITEMS_RENDERED_AT_ONCE = 5000;
  const INTERVAL_IN_MS = 1000;

  let currentIndex = 0;

  const interval = setInterval(() => {
    const nextIndex = currentIndex + ITEMS_RENDERED_AT_ONCE;
    for (let n = currentIndex; n <= nextIndex ; n++) 
    {
      if (n >= length) {
        clearInterval(interval);
        break;
      }
      this.currentItemsToShow.push(
        this.compconfs[n]
      )
    }
    currentIndex += ITEMS_RENDERED_AT_ONCE;
  }, INTERVAL_IN_MS)
}
onPageChange($event) {
  this.filtredcompconfsbyportcomm.length>0?
  this.currentItemsToShownormal =  this.filtredcompconfsbyportcomm.slice($event.pageIndex*$event.pageSize, $event.pageIndex*$event.pageSize + $event.pageSize)
  :this.currentItemsToShownormal =  this.compconfsnormal.slice($event.pageIndex*$event.pageSize, $event.pageIndex*$event.pageSize + $event.pageSize)
 /* this.currentItemsToShowsecond =  this.compconfssecond.slice($event.pageIndex*$event.pageSize, $event.pageIndex*$event.pageSize + $event.pageSize);
  this.currentItemsToShowchargeback =  this.compconfschargeback.slice($event.pageIndex*$event.pageSize, $event.pageIndex*$event.pageSize + $event.pageSize);*/

}
avance()
{
  let rech=document.getElementById("recherche")
  this.optionValue==''?
  rech.style.display=='none':
  this.optionValue=''
}

filtercompconf()
{
 
/*  let filtredbyid=[]
  let filtredbycarte=[]
  let filtredbyinf=[]
  let filtredbysup=[]
  let filtredbyboth=[]
  let filtredbyvalue=[]
  this.filtreditems=[]
if(this.usertype=='Clientcomm'||this.usertype=='Clientpor'||this.compconfs.length>0)
{
  this.displayStyle = "block"; 
  this.optionValue!=''?filtredbyvalue=this.commun.filterByValue(this.compconfs,this.optionValue):filtredbyvalue=[]
  this.option1Value!=''?filtredbyid=this.commun.filterByValue(this.compconfs,this.option1Value):filtredbyid=[]
  this.option2Value!=''?this.compconfs.forEach((element)=> 
  {
   
    if(element.CARDHOLDERNUMBER.substring(0,16)==this.option2Value)
    {
      console.log(element)
      filtredbycarte.push(element)
    }
  }
  ):filtredbycarte=[] 
  this.option3Value&&!this.option4Value?
  filtredbyinf=this.compconfs.filter((element)=> element.TRANSACTIONDATE >= this.option3Value):filtredbyinf=[]
  this.option4Value&&!this.option3Value?
  filtredbysup=this.compconfs.filter((element)=> element.TRANSACTIONDATE <= this.option4Value):filtredbysup=[]
  this.option3Value&&this.option4Value?
  filtredbyboth=this.compconfs.filter((element)=> element.TRANSACTIONDATE >= this.option3Value&&
  element.TRANSACTIONDATE <= this.option4Value):filtredbyboth=[]
  this.filtreditems=this.filtreditems.concat(filtredbyid,filtredbycarte,filtredbyinf,filtredbysup,filtredbyboth,filtredbyvalue)
    this.settedfiltreditems= this.filtreditems.filter((obj, index) => {
      return index === this.filtreditems.findIndex(o => obj === o);
    });
}*/
  if(!this.option3Value)
  {
    alert('veuillez indiquer une date de début')
  }
 
  else if(this.usertype=='Clientcomm'||this.usertype=='Clientpor')
  {
   /* if(!this.option2Value)
  {
    alert('veuillez renseinger un numéro de carte!')
  }
 else if(!this.userinfos.find(e=>e.carte==this.option2Value))
  {
    alert('veuillez renseinger un numéro de carte valide!')
  }*/
    this.option4Value?
        (this.currentItemsToShownormal=this.compconfs.filter((item) =>new Date(this.option3Value)<=new Date(item.TRANSACTIONDATE)&&
        new Date(this.option4Value)>=new Date(item.TRANSACTIONDATE)),
        this.filtredcompconfsbyportcomm=this.currentItemsToShownormal
          ,this.buildData(this.currentItemsToShownormal.length))
   :
   (this.currentItemsToShownormal=this.compconfs.filter((item) =>new Date(this.option3Value)<=new Date(item.TRANSACTIONDATE)),
   this.filtredcompconfsbyportcomm=this.currentItemsToShownormal
          ,this.buildData(this.currentItemsToShownormal.length))
  
    
  }
  else{
    this.compconfs=[]
    this.loading=true
    this.option4Value?this.com.getbankcompconfs(this.option3Value,this.option4Value,this.user.banque,this.option2Value,this.option1Value,this.optionValue).then(
      (data:any) => {
        this.loading=false
        console.log(data)
        this.buildData(this.compconfs.length)
      },
      (error) => {
        this.loading = false;    
      }
    ):
    this.com.getbankcompconfs(this.option3Value,new Date(),this.user.banque,this.option2Value,this.option1Value,this.optionValue).then(
      (data:any) => {
        this.loading=false
        console.log(data)
        this.buildData(this.compconfs.length)
      },
      (error) => {
        this.loading = false;    
      }
    )
  }


}
closePopup()
{
  this.displayStyle = "none";
}

search()
{
this.loading=true
let checkboxlist=[]
this.searchlist=[]
this.filtredcompconfsbyportcomm=[]
for (let i = 0; i < this.userinfos.length ; i++) 
{
  var checkbox:any = document.getElementById('checkuserinfo'+`${i}`);  
 checkbox?checkbox.checked==true?
 (checkboxlist.push(checkbox.checked),
 this.searchlist.push(this.userinfos[i].carte))
 :''
 :''
}
//console.log(this.searchlist.length)
  this.com.getuserpluscompconfs( this.searchlist).then(
    (data:any) => {
      this.loading=false
      this.buildData(this.compconfs.length)
    },
    (error) => {
      this.loading = false;    
    }
 );

}
verifydeadline(date:any,i:any)
{
  let currentdate=new Date().getTime()
  let date1=this.motifs[0].initrec*24*3600*1000
  var checkbox:any = document.getElementById('checktransactioninfo'+`${i}`);  

  console.log(new Date(date).getTime()+date1)
  console.log(date1/(24*3600*1000))
   if(new Date(date).getTime()+date1<=currentdate)
   {
    this.user.usertype=='Clientpor'||this.user.usertype=='Clientcomm'?
    alert('Cher utilisateur, Votre demande de réclamation ne peut pas être traitée, car vous avez dépassé la limite autorisée de '+`${this.motifs[0].initrec} jours. Cette mesure garantit un usage équitable de nos services et optimise notre capacité à répondre efficacement à toutes les demandes.Pour toute question, merci de nous contacter à [adresse e-mail]` ):
    alert('Délais réglementaires dépassés de '+`${this.motifs[0].initrec} jours.Action impossible.` )
checkbox.checked=false
   }
  
}
  async createtransaction()
{
  let checkboxlist=[]
  this.filtreditemschecked=[]
  this.createdrec=[]
  for (let i = 0; i < this.currentItemsToShownormal.length ; i++) 
  {

    var checkbox:any = document.getElementById('checktransactioninfo'+`${i}`);  
   checkbox?checkbox.checked==true?
   (checkboxlist.push(checkbox.checked),
   this.filtreditemschecked.push(this.currentItemsToShownormal[i]))
   :''
   :''
  }
  for (let i = 0; i < this.currentItemsToShowchargeback.length ; i++) 
  {
    var checkbox:any = document.getElementById('checksecondtransactioninfo'+`${i}`);  
   checkbox?checkbox.checked==true?
   (checkboxlist.push(checkbox.checked),
   this.filtreditemschecked.push(this.currentItemsToShowchargeback[i]))
   :''
   :''
  }
  for (let i = 0; i < this.currentItemsToShowsecond.length ; i++) 
  {
    var checkbox:any = document.getElementById('checkthirdtransactioninfo'+`${i}`);  
   checkbox?checkbox.checked==true?
   (checkboxlist.push(checkbox.checked),
   this.filtreditemschecked.push(this.currentItemsToShowsecond[i]))
   :''
   :''
  }
  if(checkboxlist.length>0)
  {
    for await (const element of this.filtreditemschecked) {
      const reclamation:Reclamation = new Reclamation()
        reclamation.transactions=[]
        //@ts-ignore
        reclamation.transactions.push(element)
        reclamation.userId=this.currentUser.userId
       await this.recserv.create(reclamation,'').then(
          (data:any) => {
            this.token.saved=true;
            this.loading = false;
            this.createdrec.push(data.data)
          },
          (error) => {
            this.loading = false;
            
          }
        )
    };
  this.transactions=[]
  this.filtreditemschecked.forEach(e=>this.transactions.push(e))
  
  this.displaybox='block'
    /*Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'réclamation créé avec succès! un email vous a été envoyer pour confirmer la création de votre réclamation. vous pouvez désormais modifier/compléter votre réclamation à travers votre tableau de bord',
      showConfirmButton: false,
      timer: 6000 
    });
    this.router.navigate(['user-board'])*/
  }
  else{
    alert('veuillez sélectionner au moins une transaction')
  }
}
  async create()
{
  let checkboxlist=[]
  this.filtreditemschecked=[]
  this.createdrec=[]

  for (let i = 0; i < this.filtreditems.length ; i++) 
  {
    var checkbox:any = document.getElementById('check'+`${i}`);  
   checkbox?checkbox.checked==true?
   (checkboxlist.push(checkbox.checked),
   this.filtreditemschecked.push(this.filtreditems[i]))
   :''
   :''
  }
  if(checkboxlist.length>0)
  {
    for await (const element of this.filtreditemschecked) {
      const reclamation:Reclamation = new Reclamation()
        reclamation.transactions=[]
        //@ts-ignore
        reclamation.transactions.push(element)
        reclamation.userId=this.currentUser.userId
     await  this.recserv.create(reclamation,'').then(
        (data:any) => {
          this.loading = false;
          this.createdrec.push(data.data)
        },
        (error) => {
          this.loading = false;
          
        }
      )
        
     
    };
  this.transactions=[]
  this.filtreditemschecked.forEach(e=>this.transactions.push(e))

  this.displaybox='block'
    /*Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'réclamation créé avec succès! un email vous a été envoyer pour confirmer la création de votre réclamation. vous pouvez désormais modifier/compléter votre réclamation à travers votre tableau de bord',
      showConfirmButton: false,
      timer: 6000 
    });
    this.router.navigate(['user-board'])*/
  }
  else{
    alert('veuillez sélectionner au moins une transaction')
  }
}
async onSubmit() {
  this.loading = true;
  this.submitted=true
/*  if (this.reclamationform.invalid) {  
    return this.loading = false;
}*/
this.commun.getcurrenttime().then(
  async (time:any) => {
    for await (const element of this.createdrec) {
      const reclamation = new Reclamation();
      this.commun.getcurrenttime().then(
        async (data:any) => {
          reclamation.transactions=element.transactions
          reclamation._id=element._id

           //@ts-ignore
           element.statut.push({
          //@ts-ignore
            etat:'',
          //@ts-ignore
            acteur:this.currentUser.usertype,
            //@ts-ignore
            role:element.transactions[0].ISSUERBANKIDENTIFICATION==this.currentUser.banque?'émetteur':
            //@ts-ignore
            element.transactions[0].ACQUIRERBANKIDENTIFICATION==this.currentUser.banque?'acquireur':'autre',
          //@ts-ignore
            commentaire :this.reclamationform.get('commentaire').value,
          //@ts-ignore
            motif :this.reclamationform.get('motif').value,
          //@ts-ignore
            ficheUrl : []  ,
            //@ts-ignore
  item:'crée',
            //@ts-ignore
  date: time,
})
reclamation.statut=element.statut
     await  this.recserv.modify(reclamation._id, reclamation, this.uploadedfiles).then(
            (data:any) => {
              this.loading = false;
              //this.recserv.getReclamationdataByIdsubscription(this.reclamation._id)
              this.reclamationform.reset()
             // this.router.navigate(['user-board']);
            },
            (error) => {
              this.loading = false;   
            } 
          );
        }
      )
    };
    this.closePopup()
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'réclamation créé avec succès! un email vous a été envoyer pour confirmer la création de votre réclamation. vous pouvez désormais modifier/compléter votre réclamation à travers votre tableau de bord',
      showConfirmButton: false,
      timer: 6000 
    });
    this.router.navigate(['user-board'])
  }
)

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
  async closePopupenr()
{
  this.deleting=true
  for await (const element of this.createdrec) {
    this.recserv.deleteReclamationdataById(element._id).then(
          (data:any) => {
            this.deleting = false;
          },
          (error) => {
            this.deleting = false;   
          } 
        );

  };
  this.displaybox = "none";
}
closePopupbox()
{
  this.displayStyle='none'
}
resetsearch()
{
  this.compconfs=[]
  this.buildData(this.compconfs.length)
}
sort()
{

}
ngOnDestroy(){
  this.compconfsSub?this.compconfsSub.unsubscribe():'';
  this.recsub?this.recsub.unsubscribe():'';
  }
}
