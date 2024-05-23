import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Reclamation } from '../models/reclamation';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from '../models/user.model';
import { TokenStorageService } from '../services/token-storage.service';
import { UserService } from '../services/user.service';
import { ReclamationService } from '../services/reclamation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommunService } from '../services/commun';
import { MotifreclamationService } from '../services/motifreclamation';
import { dataService } from '../services/data.service';
import Swal from 'sweetalert2';
import { Sort } from '../_helpers/sort';
import { datacommService } from '../services/datacomm.service';
import { Chargeback } from '../models/chargeback.model';
import { ChargebackService } from '../services/chargeback.service';
@Component({
  selector: 'app-user-board',
  templateUrl: './user-board.component.html',
  styleUrls: ['./user-board.component.scss']
})
export class UserBoardComponent implements OnInit,OnDestroy {
  @ViewChild('filePicker', { static: false }) filePicker: ElementRef<HTMLInputElement>;
  public filtredusers: User[] = [];
  prenom:string;
  nom:string
  role: string;
  isLoggedIn = false;
  private reclamationsSub: Subscription;
  public reclamation: Reclamation;
  public errormsg:string;
  public loading: boolean;
  usertype: string;
  email: string;
  userId:string;
  converteddate: Date;
  converteddate2: Date;
  public reclamations: Reclamation[] = [];
  reclamationnumber=0;
  banque: string;
  reclamationsacqSub: Subscription;
  reclamationsacq: Reclamation[]=[];
  reclamationsemeSub: Subscription;
  reclamationseme: Reclamation[]=[];
  reclamationsonus: Reclamation[]=[];
  filtreditemschecked: any[]=[];
  displaybox='none';
  public reclamationform: FormGroup; 
  submitted=false;
  transactions: any[];
  imagePreview: string;
  fileUploaded: boolean;
  motifsub: Subscription;
  motifs=[]
  familles: any[]=[];
  groupes: any=[];
  settedfamilles: any[]=[];
  settedgroupes: any=[];
  settedmotifs: any[]=[];
  showreclamationsacq=false;
  showreclamationseme=false;
  showreclamations=false;
  showreclamationsonus=false;
  cartes: any[]=[];
  user: User;
  reclamationscomite: any[]=[];
  reclamationsonusSub: Subscription;
  allreclamationsSub: Subscription;
  public option0Value:any
  public option1Value:any
  public option2Value:any
  public option3Value:any
  public option4Value:any
  public option5Value:any
  public option6Value:any
  public option7Value:any
  public option8Value:any
  public option9Value:any
  public option10Value:any
  public option11Value:any
  public option12Value:any
  public option13Value:any
  public status=[];
  uploadedfiles: any[]=[];
  showfilterbutton=true;
  showreinitbutton=false;
  showvalidationbutton: boolean;
  showform=false;
  selectedaction='';
  showmotif: boolean;
  showsearchform=true;

  constructor(private mot: MotifreclamationService,         
    private Auth: TokenStorageService,
    private recserv:ReclamationService,
    private router: Router,
    private route: ActivatedRoute,
    private UserService: UserService,
    private formBuilder: FormBuilder,private chargebackservice: ChargebackService,
    private commun: CommunService,private datacomm: datacommService,private data: dataService,

    ) { }
  ngOnInit() {
      const currentuser = this.Auth.getUser();
      this.reclamationform = this.formBuilder.group({                
        commentaire:'',
        motif: '',
        groupe: '',
        famille: '',
        file: '',
      }); 
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
      this.status=this.commun.statuts
      this.UserService.getUserById(currentuser.userId).then(
        (user:User) => {
          this.user=user
          this.usertype = user.usertype;
          this.email = user.email;
          this.userId = user._id;
          this.role=user.role;
          this.prenom=user.firstname
          this.nom=user.lastname
          this.banque=user.banque
        this.loading = true;
         //get all reclamations
         this.allreclamationsSub = this.recserv.allreclamations$.subscribe(
          (reclamations) => {
            console.log(reclamations)
            //@ts-ignore
            this.reclamationscomite=reclamations.filter(e=>e.statut.length>0).filter(el=>el.statut.find(element=>element.item=='arbitrage'))
            this.loading = false;
          },
          (error) => {
            this.loading = false;
            this.errormsg=error.message;
          }
        );  
        //get onus reclamations
        this.reclamationsonusSub = this.recserv.reclamationsonus$.subscribe(
          (reclamations) => {
            console.log(reclamations)
            this.showreclamationsonus=true
            this.reclamationsonus=reclamations
            this.loading = false;
          },
          (error) => {
            this.loading = false;
            this.errormsg=error.message;
          }
        );  
        //get eme reclamations
        this.reclamationsemeSub = this.recserv.reclamationseme$.subscribe(
          (reclamations) => {
            console.log(reclamations)
            this.showreclamationseme=true
            this.reclamationseme=reclamations
            this.loading = false;
          },
          (error) => {
            this.loading = false;
            this.errormsg=error.message;
          }
        );
        //get acq reclamations
        this.reclamationsacqSub = this.recserv.reclamationsacq$.subscribe(
          (reclamations) => {
this.reclamationsacq=[]
            console.log(reclamations)
            this.showreclamationsacq=true
            reclamations.forEach(
              e=>
              {
                if(e.statut.length>0)
                {
                  //@ts-ignore
                  if(e.statut.find(e=>e.item=='chb émis'))
                  {
this.reclamationsacq.push(e)
                  }
                }
              }
            )
           this.loading = false;
          },
          (error) => {
            this.loading = false;
            this.errormsg=error.message;
          }
        );          
        user.usertype=='Clientpor'? this.reclamationsSub = this.recserv.reclamationsportbanque$.subscribe(
          (reclamations) => {
            console.log(reclamations)
            this.reclamations = reclamations;
            this.loading = false;
          },
          (error) => {
            this.loading = false;
            this.errormsg=error.message;
          }
        ):
        user.usertype=='Clientcomm'? this.reclamationsSub = this.recserv.reclamationscomm$.subscribe(
          (reclamations) => {
            console.log(reclamations)
            reclamations.forEach(
              e=>
              {
                if(e.statut.length>0)
                {
                  //@ts-ignore
                  if(e.statut.find(e=>e.etat=='notification commerçant'))
                  {
this.reclamations.push(e)
                  }
                }
              }
            )
            this.loading = false;
          },
          (error) => {
            this.loading = false;
            this.errormsg=error.message;
          }
        ):''
        user.usertype=='Clientpor'||user.usertype=='Clientcomm'?this.showreclamations=true:''
        user.usertype=='Clientpor'?this.data.getmanyinfo(user.compte).then(
          (res:any)=>{
            console.log(res)
res.forEach(element => {
  this.cartes.push(element.carte)
});
            //this.displaysearch="block"
            this.recserv.getReclamationportbanque(this.cartes)
          }
         ).catch(() => {
          Swal.fire('numéro de compte non renseigné!')
        }):''
        user.usertype=='Clientcomm'?
this.datacomm.getmanyinfo(user.compte).then(
  (resp:any)=>
  {
this.recserv.getReclamationcomm(resp).catch(() => {
  Swal.fire('numéro de compte non renseigné!')
})
  }
)
:''
        user.usertype=='Metier'||user.usertype=='agence'?( this.recserv.getReclamationacq(this.banque),
        this.recserv.getReclamationeme(this.banque),
        this.mot.getmotifreclamationss()):''
        user.usertype=='comite arbitrage'?(this.recserv.getReclamations(),this.mot.getmotifreclamationss()):''
        this.recserv.getReclamation(this.userId);
        }
      )
  }
  get f() { return this.reclamationform.controls; }
  getNavigation(link, id){
    let allrecs=[]
    allrecs=allrecs.concat(this.reclamations,this.reclamationsacq,this.reclamationseme,this.reclamationsonus,this.reclamationscomite)
    let rec=allrecs.find(e=>e._id==id)
    let filtredstatus=rec.statut.filter(el=>!el.etat)
    let filtredetat=rec.statut.filter(el=>el.etat)
let iss=rec.transactions[0].ISSUERBANKIDENTIFICATION
let acq=rec.transactions[0].ACQUIRERBANKIDENTIFICATION
 if(this.user.usertype=='Clientpor')
    {
      if(filtredstatus.length>1)
      {
        //@ts-ignore
        if(filtredstatus[filtredstatus.length-1].item=='rejetée'&&filtredstatus[filtredstatus.length-2].item=='rejetée'||filtredstatus[filtredstatus.length-1].item=='rejetée'&&filtredstatus[filtredstatus.length-2].item=='pré-arbitrage rejetée'||filtredstatus[filtredstatus.length-1].item=='rejetée'&&filtredstatus[filtredstatus.length-2].item=='crée'
        ||filtredstatus[filtredstatus.length-1].item=='rejetée'&&filtredstatus[filtredstatus.length-2].item=='encours')
        {
          this.router.navigate([link + '/' + id]); 
        }
          //@ts-ignore
        else  if(filtredstatus[filtredstatus.length-1].item=='clôturé')
          {
            return (alert('Action impossible - réclamation clôturée')) 
          }
            //@ts-ignore
        else  if(filtredstatus[filtredstatus.length-1].item=='acceptée'||filtredstatus[filtredstatus.length-1].item=='arbitrage accepté'||filtredstatus[filtredstatus.length-1].item=='Arbitrage fav. émetteur')
        {
          return (alert('Action impossible - réclamation traitée')) 
        }
        //@ts-ignore
        else
        {
    return (alert('action non permise à ce stade'))     
        }
      }
      else
      {
        return (alert('action non permise à ce stade'))     
      }
    }
    else  if(this.user.usertype=='Clientcomm')
    {
      if(filtredetat.length>0)
      {
        console.log(filtredetat[filtredetat.length-1].etat)
        //@ts-ignore
        if(filtredetat[filtredetat.length-1].etat=='notification commerçant')
        {
          this.router.navigate([link + '/' + id]); 
        }
          //@ts-ignore
        else  if(filtredstatus[filtredstatus.length-1].item=='clôturé')
          {
            return (alert('Action impossible - réclamation clôturée')) 
          }
            //@ts-ignore
        else  if(filtredstatus[filtredstatus.length-1].item=='acceptée'||filtredstatus[filtredstatus.length-1].item=='arbitrage accepté'||filtredstatus[filtredstatus.length-1].item=='Arbitrage fav. émetteur')
        {
          return (alert('Action impossible - réclamation traitée')) 
        }
        //@ts-ignore
        else
        {
    return (alert('action non permise à ce stade'))     
        }
      }
      else
      {
        return (alert('action non permise à ce stade'))     
      }
    }
    else  if(this.user.usertype=='comite arbitrage')
    {
      if(filtredstatus.length>1)
      {
 
        //@ts-ignore
        if(filtredstatus[filtredstatus.length-1].item=='arbitrage'&&filtredstatus[filtredstatus.length-1].date+(this.motifs[0].repacquireur*24*3600*1000)<new Date().getTime()||filtredstatus[filtredstatus.length-1].item=='arbitrage rejeté')
        {
          this.router.navigate([link + '/' + id]); 
        }
          //@ts-ignore
        else  if(filtredstatus[filtredstatus.length-1].item=='arbitrage'&&filtredstatus[filtredstatus.length-1].date+(this.motifs[0].repacquireur*24*3600*1000)>new Date().getTime())
          {
            
            return (confirm('Action impossible - en attente de la réponse du commerçant, vous pouvez désormais la consulter')?
            this.router.navigate(['open-detail'+'/'+id+'/all']):'') 
          }
        //@ts-ignore
        else
        {
    return (confirm('Action non permise à ce stade, vous pouvez désormais la consulter')?
    this.router.navigate(['open-detail'+'/'+id+'/all']):'')     
        }
      }
      else
      {
        return (confirm('Action non permise à ce stade, vous pouvez désormais la consulter')?
        this.router.navigate(['open-detail'+'/'+id+'/all']):'')     
      }
    }
    else {
      if(iss!=acq)
      {
        if(this.user.banque==iss)
        {
if(filtredstatus[filtredstatus.length-1].item=='chb émis'||filtredstatus[filtredstatus.length-1].item=='pré-arbitrage'||filtredstatus[filtredstatus.length-1].item=='arbitrage')
                  {
                    confirm('action non permise à ce stade, vous pouvez désormais la consulter')?
                    this.router.navigate(['open-detail'+'/'+id+'/all']):''
                  }
else if(filtredstatus[filtredstatus.length-1].item=='arbitrage rejeté')
                {
                  confirm('réclamation en cours de traitement par le comité d\'arbitrage, vous pouvez désormais la consulter')?
                  this.router.navigate(['open-detail'+'/'+id+'/all']):''
                }

/*else if(rec.statut.length>1)
{
  if(rec.statut[rec.statut.length-2].item=='relancée'&&rec.statut[rec.statut.length-1].item=='pré-arbitrage')
                  {
                    confirm('action non permise à ce stade, vous pouvez désormais la consulter')?
                    this.router.navigate(['open-detail'+'/'+id+'/all']):''
                  }
                  else
                  {
                    this.router.navigate([link + '/' + id]); 

                  }
}*/

                  else
                  {
                    this.router.navigate([link + '/' + id]); 

                  }
        }
        else  if(this.user.banque==acq)
        {
// this.reclamationsacq=reclamations.filter(e=>e.statut.length>0).filter(e=>e.statut[e.statut.length-1].item=='chb émis'||e.statut[e.statut.length-1].item=='pré-arbitrage')
if(filtredstatus[filtredstatus.length-1].item!='chb émis'&&filtredstatus[filtredstatus.length-1].item!='pré-arbitrage'&&filtredstatus[filtredstatus.length-1].item!='arbitrage')
                  {
                    confirm('action non permise à ce stade, vous pouvez désormais la consulter')?
                    this.router.navigate(['open-detail'+'/'+id+'/all']):''
                  }
/*else if(rec.statut[rec.statut.length-1].item=='arbitrage rejeté')
                {
                  confirm('réclamation en cours de traitement par le comité d\'arbitrage, vous pouvez désormais la consulter')?
                  this.router.navigate(['open-detail'+'/'+id+'/all']):''
                }*/
/*else if(rec.statut.length>1)
{
  if(rec.statut[rec.statut.length-2].item=='relancée'&&rec.statut[rec.statut.length-1].item=='pré-arbitrage')
                  {
                    confirm('action non permise à ce stade, vous pouvez désormais la consulter')?
                    this.router.navigate(['open-detail'+'/'+id+'/all']):''
                  }
                  else
                  {
                    this.router.navigate([link + '/' + id]); 

                  }
}*/

                  else
                  {
                    this.router.navigate([link + '/' + id]); 

                  }
        }
        else{
          this.router.navigate([link + '/' + id]); 

        }
      }
      else{
        this.router.navigate([link + '/' + id]); 

      }
    }
 
  }
  verifycapabilitytodecideaction():boolean
  {
    let rec=this.filtreditemschecked[0]
    let filtredstatus=rec.statut.filter(el=>!el.etat)
let iss=rec.transactions[0].ISSUERBANKIDENTIFICATION
let acq=rec.transactions[0].ACQUIRERBANKIDENTIFICATION
    if(iss!=acq)
    {
      if(this.user.banque==iss)
      {
if(filtredstatus[filtredstatus.length-1].item=='chb émis'||filtredstatus[filtredstatus.length-1].item=='pré-arbitrage'||filtredstatus[filtredstatus.length-1].item=='arbitrage')
                {
                  return false
                }
else if(filtredstatus[filtredstatus.length-1].item=='arbitrage rejeté')
              {
                return false
              }
                else
                {
                  return true 
                }
      }
      else  if(this.user.banque==acq)
      {
// this.reclamationsacq=reclamations.filter(e=>e.statut.length>0).filter(e=>e.statut[e.statut.length-1].item=='chb émis'||e.statut[e.statut.length-1].item=='pré-arbitrage')
if(filtredstatus[filtredstatus.length-1].item!='chb émis'&&filtredstatus[filtredstatus.length-1].item!='pré-arbitrage'&&filtredstatus[filtredstatus.length-1].item!='arbitrage')
                {
                  return false
                }
                else
                {
                  return true
                }
      }
      else{
        return true
      }
    }
    else{
      return true
    }
  }
  calculatedeadline(rec:Reclamation):any
  {
    //@ts-ignore
    let allstatus=rec.statut.filter(e=>!e.etat)
   // console.log(allstatus)
   // if (allstatus.length>0)
   // {
      if(this.user.usertype!='Clientpor'&&this.user.usertype!='Clientcomm')
      {
        let currentdate=new Date().getTime()
        let remainingdays=1
let time=Date.now()
        let returneddate:any
        let datechargeback:number
        let dateprearb:number
        let datearb:number
        let daterepresentation:number
  
        //@ts-ignore
        allstatus.find(da=>da.item=='rejetée'&&da.role=='acquireur')?daterepresentation=allstatus.find(da=>da.item=='rejetée'&&da.role=='acquireur').date:daterepresentation=currentdate
       //@ts-ignore
       allstatus.find(da=>da.item=='chb émis')?datechargeback=allstatus.find(da=>da.item=='chb émis').date:datechargeback=currentdate
    //@ts-ignore
    allstatus.find(da=>da.item=='pré-arbitrage')?dateprearb=allstatus.find(da=>da.item=='pré-arbitrage').date:dateprearb=currentdate
    //@ts-ignore
    allstatus.find(da=>da.item=='arbitrage')?datearb=allstatus.find(da=>da.item=='arbitrage').date:datearb=currentdate
        //@ts-ignore
        let iss=rec.transactions[0].ISSUERBANKIDENTIFICATION
        //@ts-ignore
    let acq=rec.transactions[0].ACQUIRERBANKIDENTIFICATION
if(allstatus.length>0)
{
//@ts-ignore
if(allstatus[allstatus.length-1].item=='crée')
{
//@ts-ignore
returneddate=new Date(new Date(allstatus[allstatus.length-1].date).getTime()+this.motifs[0].creerec*24*3600*1000 )
new Date(returneddate).getTime()-time>0?remainingdays=Math.round((new Date(returneddate).getTime()-time)/(24*3600*1000)) :remainingdays=0

}
//@ts-ignore
else if(allstatus[allstatus.length-1].item=='encours')
{
//@ts-ignore
returneddate=new Date(new Date(allstatus[allstatus.length-1].date).getTime()+this.motifs[0].encoursrec*24*3600*1000 )
new Date(returneddate).getTime()-time>0?remainingdays=Math.round((new Date(returneddate).getTime()-time)/(24*3600*1000)) :remainingdays=0

}
        //@ts-ignore
        else if(allstatus[allstatus.length-1].item=='chb émis'&&rec.transactions[0].TRANSACTIONCODE=='05')
        {
          let date2=currentdate
          //@ts-ignore
          this.motifs[0].groupe.find(ele=>ele.code==allstatus[allstatus.length-1].motif.substring(0,4))?date2=this.motifs[0].groupe.find(ele=>ele.code==allstatus[allstatus.length-1].motif.substring(0,4)).delai2*24*3600*1000:date2=1
        //@ts-ignore
        returneddate=new Date(new Date(allstatus[allstatus.length-1].date).getTime()+date2)
        new Date(returneddate).getTime()-time>0?remainingdays=Math.round((new Date(returneddate).getTime()-time)/(24*3600*1000)):remainingdays=0
  
        }
            //@ts-ignore
            else if(allstatus[allstatus.length-1].item=='chb émis'&&rec.transactions[0].TRANSACTIONCODE=='06')
            {
              let date22=currentdate
              //@ts-ignore
              this.motifs[0].groupe.find(ele=>ele.code==allstatus[allstatus.length-1].motif.substring(0,4))?date22=this.motifs[0].groupe.find(ele=>ele.code==allstatus[allstatus.length-1].motif.substring(0,4)).delai2*24*3600*1000:date22=1
            //@ts-ignore
            returneddate=new Date(new Date(allstatus[allstatus.length-1].date).getTime()+date22)
            new Date(returneddate).getTime()-time>0?remainingdays=Math.round((new Date(returneddate).getTime()-time)/(24*3600*1000)):remainingdays=0
      
            }
                //@ts-ignore
        else if(allstatus[allstatus.length-1].item=='chb émis'&&rec.transactions[0].TRANSACTIONCODE=='07')
        {
          let date23=currentdate
          //@ts-ignore
          this.motifs[0].groupe.find(ele=>ele.code==allstatus[allstatus.length-1].motif.substring(0,4))?date23=this.motifs[0].groupe.find(ele=>ele.code==allstatus[allstatus.length-1].motif.substring(0,4)).delai2*24*3600*1000:date23=1
        //@ts-ignore
        returneddate=new Date(new Date(allstatus[allstatus.length-1].date).getTime()+date23)
        new Date(returneddate).getTime()-time>0?remainingdays=Math.round((new Date(returneddate).getTime()-time)/(24*3600*1000)):remainingdays=0
  
        }
                          //@ts-ignore
        else if(allstatus[allstatus.length-1].item=='chb émis'&&rec.transactions[0].TRANSACTIONCODE=='08')
                          {
                            let date24=currentdate
                            //@ts-ignore
        this.motifs[0].groupe.find(ele=>ele.code==allstatus[allstatus.length-1].motif.substring(0,4))?date24=this.motifs[0].groupe.find(ele=>ele.code==allstatus[allstatus.length-1].motif.substring(0,4)).delai2*24*3600*1000:date24=1
                          //@ts-ignore
                          returneddate=new Date(new Date(allstatus[allstatus.length-1].date).getTime()+date24)
                          new Date(returneddate).getTime()-time>0?remainingdays=Math.round((new Date(returneddate).getTime()-time)/(24*3600*1000)):remainingdays=0
                    
                          }
     
    //@ts-ignore
    else if(allstatus[allstatus.length-2].item=='chb émis'&&allstatus[allstatus.length-1].item=='rejetée')
    {
    //  let date6=currentdate
      //@ts-ignore
     // this.motifs[0].groupe.find(ele=>ele.code==allstatus[allstatus.length-2].motif.substring(0,4))?date6=this.motifs[0].groupe.find(ele=>ele.code==allstatus[allstatus.length-2].motif.substring(0,4)).delai4*24*3600*1000:date6=1
    returneddate=daterepresentation+this.motifs[0].initprearb*24*3600*1000
    new Date(returneddate).getTime()-time>0?remainingdays=Math.round((new Date(returneddate).getTime()-time)/(24*3600*1000)):remainingdays=0

    }    
    //@ts-ignore
    else if(allstatus[allstatus.length-1].item=='pré-arbitrage')
    {
     // let date7=currentdate
      //@ts-ignore
     // this.motifs[0].groupe.find(ele=>ele.code==allstatus.find(da=>da.item=='chb émis').motif.substring(0,4))?date7=this.motifs[0].groupe.find(ele=>ele.code==allstatus.find(da=>da.item=='chb émis').motif.substring(0,4)).delai5*24*3600*1000:date7=1
     returneddate=dateprearb+this.motifs[0].repprearb*24*3600*1000
     new Date(returneddate).getTime()-time>0?remainingdays=Math.round((new Date(returneddate).getTime()-time)/(24*3600*1000)):remainingdays=0

    }  
    //@ts-ignore
    else if(allstatus[allstatus.length-1].item=='pré-arbitrage rejetée')
    {
    //  let date8=currentdate
      //@ts-ignore
    //  this.motifs[0].groupe.find(ele=>ele.code==allstatus.find(da=>da.item=='chb émis').motif.substring(0,4))?date8=this.motifs[0].groupe.find(ele=>ele.code==allstatus.find(da=>da.item=='chb émis').motif.substring(0,4)).delai5*24*3600*1000:date8=1
    returneddate=dateprearb+this.motifs[0].initarb*24*3600*1000
    new Date(returneddate).getTime()-time>0?remainingdays=Math.round((new Date(returneddate).getTime()-time)/(24*3600*1000)):remainingdays=0

    }  
    //@ts-ignore
    else if(allstatus[allstatus.length-1].item=='arbitrage')
    {
     // let date9=currentdate
      //@ts-ignore
     // this.motifs[0].groupe.find(ele=>ele.code==allstatus.find(da=>da.item=='chb émis').motif.substring(0,4))?date9=this.motifs[0].groupe.find(ele=>ele.code==allstatus.find(da=>da.item=='chb émis').motif.substring(0,4)).delai5*24*3600*1000:date9=1
     returneddate=datearb+this.motifs[0].initcomite*24*3600*1000
     new Date(returneddate).getTime()-time>0?remainingdays=Math.round((new Date(returneddate).getTime()-time)/(24*3600*1000)):remainingdays=0

    } 
    else
    {
      remainingdays=null
    } 
}
else{
  console.log(allstatus)
}
    //@ts-ignore
   /* else if(allstatus[allstatus.length-1].item=='Arbitrage fav. émetteur'||allstatus[allstatus.length-1].item=='Arbitrage fav. acquéreur')
    {
      //@ts-ignore
      let date10=currentdate
        //@ts-ignore
      this.motifs[0].groupe.find(ele=>ele.code==allstatus.find(da=>da.item=='chb émis').motif.substring(0,4))?date10=this.motifs[0].groupe.find(ele=>ele.code==allstatus.find(da=>da.item=='chb émis').motif.substring(0,4)).delai3*24*3600*1000:date10=1
        returneddate=datearb+date10
        new Date(returneddate).getTime()-time>0?remainingdays=Math.trunc((new Date(returneddate).getTime()-time)/(24*3600*1000)):remainingdays=0

    }  */
    return {returneddate,remainingdays}
      } 
 /*   }
else
{
  Swal.fire({
    position: 'center',
    icon: 'error',
    title: 'vous avez des problèmes de chargement des données de quelques réclamations, veuillez actualiser la page! ',
    showConfirmButton: false,
    timer: 6000 
  });
}*/


  
  }
  showdeadline(listraclamations:Reclamation[])
  {
 
if(listraclamations==this.reclamationseme)
{
  this.reclamationseme.forEach((e,index)=>
  {
  e.deadline?e.deadline=new Date(this.calculatedeadline(e).returneddate).getTime():
  this.reclamationseme[index].deadline=new Date(this.calculatedeadline(e).returneddate).getTime()
  })
 /* const sort = new Sort();
  this.reclamationseme=this.reclamationseme.sort(sort.startSort('created','asc',''));*/
}
else if(listraclamations==this.reclamationsonus)
{
  this.reclamationsonus.forEach((e,index)=>
  {
  e.deadline?e.deadline=new Date(this.calculatedeadline(e).returneddate).getTime():
  this.reclamationsonus[index].deadline=new Date(this.calculatedeadline(e).returneddate).getTime()
  })
 /* const sort = new Sort();
  this.reclamationseme=this.reclamationseme.sort(sort.startSort('created','asc',''));*/
}
else if(listraclamations==this.reclamationsacq)
{
  this.reclamationsacq.forEach((e,index)=>
  {
  e.deadline?e.deadline=new Date(this.calculatedeadline(e).returneddate).getTime():
  this.reclamationsacq[index].deadline=new Date(this.calculatedeadline(e).returneddate).getTime()
  })
 /* const sort = new Sort();
  this.reclamationseme=this.reclamationseme.sort(sort.startSort('created','asc',''));*/
}
else if(listraclamations==this.reclamationscomite)
{
  this.reclamationscomite.forEach((e,index)=>
  {
  e.deadline?e.deadline=new Date(this.calculatedeadline(e).returneddate).getTime():
  this.reclamationscomite[index].deadline=new Date(this.calculatedeadline(e).returneddate).getTime()
  })
 /* const sort = new Sort();
  this.reclamationseme=this.reclamationseme.sort(sort.startSort('created','asc',''));*/
}
  }
  showdeadlinetd(rec:Reclamation):boolean
  {
    if(rec.statut.length>1&&this.user.usertype!='Clientpor'&&this.user.usertype!='Clientcomm')
    {
    //@ts-ignore
    let statuts=rec.statut.filter(e=>!e.etat)
    //@ts-ignore
    let state= statuts[statuts.length-1].item
    //@ts-ignore
    let state1= statuts[statuts.length-2].item

    if(state=='rejetée'&&state1=='rejetée')
    {
      return true
    }
    else if(state=='rejetée'&&state1=='pré-arbitrage rejetée')
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
  filtredreclamation(status:any):any
  {
    let filtredstatus=status.filter(e=>!e.etat)
    return filtredstatus
  }
  filtermotif(reclamation:Reclamation):string
{
  let returned:string
  //@ts-ignore
  let mot=reclamation.statut.find(e=>e.motif)
    //@ts-ignore
mot?returned=mot.motif:returned=null
  //@ts-ignore
  return returned
}
  addHours(date:Date) {
    date.setTime(date.getTime() * 60 * 60 * 1000);

    return date;
  }  
calculaterecnumber():number
{
  this.reclamationnumber=this.reclamations.length+this.reclamationsacq.length+this.reclamationseme.length+this.reclamationsonus.length+this.reclamationscomite.length
  return this.reclamationnumber
}
onTabClick(event) {
   
}
async openrecbox()
{
  let checkboxlist=[]
  this.filtreditemschecked=[]
  console.log(this.selectedaction)
  this.reclamationseme=this.reclamationseme.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
  this.reclamations=this.reclamations.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
  this.reclamationsacq=this.reclamationsacq.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
  this.reclamationsonus=this.reclamationsonus.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
  this.reclamationscomite=this.reclamationscomite.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());

  for (let i = 0; i < this.reclamations.length ; i++) 
  {
    var checkbox:any = document.getElementById('checkreclamations'+`${i}`);  
   checkbox?checkbox.checked==true? 
   (checkboxlist.push(checkbox.checked),
   this.filtreditemschecked.push(this.reclamations[i]))
   :''
   :''
  }
  for (let i = 0; i < this.reclamationsacq.length ; i++) 
  {
    var checkbox:any = document.getElementById('checkreclamationsacq'+`${i}`);  
   checkbox?checkbox.checked==true?
   (checkboxlist.push(checkbox.checked),
   this.filtreditemschecked.push(this.reclamationsacq[i]))
   :''
   :''
  }
  for (let i = 0; i < this.reclamationseme.length ; i++) 
  {
    var checkbox:any = document.getElementById('checkreclamationseme'+`${i}`);  
   checkbox?checkbox.checked==true?
   (checkboxlist.push(checkbox.checked),
   this.filtreditemschecked.push(this.reclamationseme[i]))
   :''
   :''
  }
  for (let i = 0; i < this.reclamationsonus.length ; i++) 
  {
    var checkbox:any = document.getElementById('checkreclamationsonus'+`${i}`);  
   checkbox?checkbox.checked==true?
   (checkboxlist.push(checkbox.checked),
   this.filtreditemschecked.push(this.reclamationsonus[i]))
   :''
   :''
  }
  for (let i = 0; i < this.reclamationscomite.length ; i++) 
  {
    var checkbox:any = document.getElementById('checkreclamationscomite'+`${i}`);  
   checkbox?checkbox.checked==true?
   (checkboxlist.push(checkbox.checked),
   this.filtreditemschecked.push(this.reclamationscomite[i]))
   :''
   :''
  }
  if(!this.samestate()){
    alert('vous ne pouvez pas effectuer un traitement par lot sur des réclamations qui n\'ont pas le même statut')
  }
  else if(!this.verifycapabilitytodecideaction()){
    alert('action non permise à ce stade')
  }
  else if(checkboxlist.length==0){
    alert('veuillez sélectionner au moins une réclamation')
  }
  else
  {
  this.transactions=[]
  this.filtreditemschecked.forEach(
    element => element.transactions.forEach(e=>this.transactions.push(e))
  )
  this.displaybox='block'
  }

 
}
//functions for recs treatment
samestate():boolean
{
  let allstatus=[]
  let samestate=false
  for (let i = 0; i < this.filtreditemschecked.length ; i++) 
  {
    allstatus.push(this.filtreditemschecked[i].statut[this.filtreditemschecked[i].statut.length-1].item)
  }
  allstatus= allstatus.filter((obj, index) => {
    return index === allstatus.findIndex(o => obj === o);
  });
  allstatus.length==1?samestate=true:samestate=false
  return samestate 
}
changeaction(e)
{
  this.showvalidationbutton=true
  this.showform=true
  this.selectedaction = e.target.value
  this.selectedaction=='chb émis'?this.showmotif=true:this.showmotif=false
//this.selectedaction=='notification'?(this.commvalue=true,this.showform=true):(this.commvalue=false,this.showform=false)
}
availableactions():any
{
  let actions=[]
  //@ts-ignore
  let effectivestatus= this.filtreditemschecked[0].statut.filter(e=>!e.etat)
  if(this.user.usertype!='Clientcomm'&&this.user.usertype!='Clientpor')
  {
    //@ts-ignore
    this.filtreditemschecked[0].transactions[0].ACQUIRERBANKIDENTIFICATION==this.filtreditemschecked[0].transactions[0].ISSUERBANKIDENTIFICATION
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
this.filtreditemschecked[0].transactions[0].ACQUIRERBANKIDENTIFICATION!=this.filtreditemschecked[0].transactions[0].ISSUERBANKIDENTIFICATION
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
   /* this.filtreditemschecked[0].changements=this.this.filtreditemschecked[0].changements
    this.recserv.savereclamationById(this.filtreditemschecked[0]._id, this.filtreditemschecked[0]).then(
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
onchangegroupe(value:any):any
{
  let availablesfamilles=[]
  this.familles.forEach(e=>e.groupe==value?availablesfamilles.push(e.fam):'')
  availablesfamilles= availablesfamilles.filter((obj, index) => {
    return index === availablesfamilles.findIndex(o => obj === o);
  });
return availablesfamilles
}
  async verifychb()
{
  let currentdate=new Date().getTime()
  let date2=currentdate
  //@ts-ignore
  this.motifs[0].groupe.find(ele=>ele.code==this.reclamationform.get('motif').value.substring(0,4))?date2=this.motifs[0].groupe.find(ele=>ele.code==this.reclamationform.get('motif').value.substring(0,4)).delai*24*3600*1000:date2=1
  for await (const element of this.filtreditemschecked) {
      //@ts-ignore
  if(new Date(element.transactions[0].PROCESSINGDATE).getTime()+date2<=currentdate)
  {
   alert('Délais réglementaires de '+`${this.motifs[0].groupe.find(ele=>ele.code==this.reclamationform.get('motif').value.substring(0,4)).delai} jours dépassés au niveau de la réclamation avec le code ${element.ref}${element.refprefixe}  . Action impossible.`  )
  this.reclamationform.reset()
 }
  }

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
        for await (const element of this.filtreditemschecked) {
          this.recserv.getReclamationdataById(element._id).then(
            async (reclamation: Reclamation) => {
              this.loading = true;
              this.submitted=true
            reclamation.statut=element.statut
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
etat:chosenstatut=='notification'?'notification':chosenstatut=='notifiercommercant'?'notification commerçant':'',
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
  await this.chargebackservice.create(chargeback).then(
    async (data) => {
      await this.recserv.modify(reclamation._id, reclamation, this.uploadedfiles).then(
        (data:any) => {
          this.loading = false;
          this.submitted=false
        
            this.closePopup()
this.refreshrecs()
Swal.fire({
  position: 'center',
  icon: 'success',
  title: 'réclamation(s) traitée(s) avec succès!',
  showConfirmButton: false,
  timer: 6000 
});
 //         this.getNavigation('open-detail/'+reclamation._id+'/all');
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
  await this.chargebackservice.create(chargeback).then(
    async (data) => {
      await this.recserv.modify(reclamation._id, reclamation, this.uploadedfiles).then(
        (data:any) => {
          this.loading = false;
          this.submitted=false

            this.closePopup()
            this.refreshrecs()
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'réclamation(s) traitée(s) avec succès!',
              showConfirmButton: false,
              timer: 6000 
            });
   //       this.getNavigation('open-detail/'+reclamation._id+'/all');
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
  await this.chargebackservice.create(chargeback).then(
    async (data) => {
      await this.recserv.modify(reclamation._id, reclamation, this.uploadedfiles).then(
        (data:any) => {
          this.loading = false;
          this.submitted=false
       
            this.closePopup()
            this.refreshrecs()
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'réclamation(s) traitée(s) avec succès!',
              showConfirmButton: false,
              timer: 6000 
            });
   //       this.getNavigation('open-detail/'+reclamation._id+'/all');
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
  await this.chargebackservice.create(chargeback).then(
    async (data) => {
      await this.recserv.modify(reclamation._id, reclamation, this.uploadedfiles).then(
        (data:any) => {
          this.loading = false;
          this.submitted=false
         
            this.closePopup()
            this.refreshrecs()
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'réclamation(s) traitée(s) avec succès!',
              showConfirmButton: false,
              timer: 6000 
            });
   //       this.getNavigation('open-detail/'+reclamation._id+'/all');
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
  await this.chargebackservice.create(chargeback).then(
    async (data) => {
      await this.recserv.modify(reclamation._id, reclamation, this.uploadedfiles).then(
        (data:any) => {
          this.loading = false;
          this.submitted=false
       
            this.closePopup()
            this.refreshrecs()
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'réclamation(s) traitée(s) avec succès!',
              showConfirmButton: false,
              timer: 6000 
            });
 //         this.getNavigation('open-detail/'+reclamation._id+'/all');
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
    await this.recserv.modify(reclamation._id, reclamation, this.uploadedfiles).then(
      (data:any) => {
        this.loading = false;
        this.submitted=false
        this.closePopup()
        this.refreshrecs()
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'réclamation(s) traitée(s) avec succès!',
          showConfirmButton: false,
          timer: 6000 
        });
 //       this.getNavigation('open-detail/'+reclamation._id+'/all');
       },
      (error) => {
        this.loading = false;   
      } 
    );
  } 

}
  async setstatutporteur(reclamation:Reclamation,chosenstatut?:string,time?:any)
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
await this.recserv.modify(reclamation._id, reclamation, this.uploadedfiles).then(
  (data:any) => {
    this.loading = false;
    this.submitted=false

 //   this.getNavigation('open-detail/'+reclamation._id+'/all');
  },
  (error) => {
    this.loading = false;   
  } 
);
}
  async onSubmit() {
  this.loading = true;
  this.submitted=true
  if (this.reclamationform.invalid) {
      
    return this.loading = false;
}
for await (const element of this.filtreditemschecked) {
  const reclamation = new Reclamation();
  this.commun.getcurrenttime().then(
    async (data:any) => {
      reclamation.transactions=element.transactions
      reclamation._id=element._id
      reclamation.statut=element.statut
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
          role:element.transactions[0].ISSUERBANKIDENTIFICATION==this.user.banque?'émetteur':
          //@ts-ignore
          element.transactions[0].ACQUIRERBANKIDENTIFICATION==this.user.banque?'acquireur':'autre',
        //@ts-ignore
          commentaire :this.reclamationform.get('commentaire').value,
        //@ts-ignore
          motif :this.reclamationform.get('motif').value,
        //@ts-ignore
          ficheUrl : []
        }
      )
    await this.recserv.modify(reclamation._id, reclamation, this.uploadedfiles).then(
        (data:any) => {
          this.loading = false;
          //this.recserv.getReclamationdataByIdsubscription(this.reclamation._id)
          //this.reclamationform.reset()
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
closePopup()
{
  this.displaybox = "none";
  if (this.filePicker) {
    // Access the nativeElement and reset its value
    this.filePicker.nativeElement.value = '';
  }
  this.selectedaction=''
  this.showform=false
  this.showmotif=false
  this.fileUploaded=false
  this.reclamationform.reset()
  this.uploadedfiles=[]
}
sort()
{
  this.motifs.sort()
}
filterallreclamations()
{
  this.showfilterbutton=false
  this.showreinitbutton=true
  this.showsearchform=false

  let allrecs=[]
  allrecs=allrecs.concat(this.reclamations,this.reclamationsacq,this.reclamationseme,this.reclamationsonus,this.reclamationscomite)
  console.log(allrecs)


allrecs=allrecs.filter(e=>!this.option0Value||this.option0Value==e.transactions[0].MERCHANTIDENTIFICATION)
.filter(e=>this.option1Value==e.transactions[0].ACQUIRERBANKIDENTIFICATION||!this.option1Value)
.filter(e=>this.option3Value+'   '==e.transactions[0].CARDHOLDERNUMBER||!this.option3Value)
.filter(e=>new Date(this.option2Value)<=new Date(e.transactions[0].TRANSACTIONDATE)||!this.option2Value)
.filter(e=>new Date(this.option11Value)>=new Date(e.transactions[0].TRANSACTIONDATE)||!this.option11Value)
.filter(e=>this.option5Value==e.ref+e.refprefixe||!this.option5Value)
.filter(e=>new Date(this.option6Value)<=new Date(e.created)||!this.option6Value)
.filter(e=>new Date(this.option12Value)>=new Date(e.created)||!this.option12Value)
.filter(e=>this.option7Value!='représentée'?this.option7Value==e.statut[e.statut.length-1].item||!this.option7Value:e.statut[e.statut.length-1].item=='rejetée'&&e.statut[e.statut.length-2].item=='chb émis'||!this.option7Value)
.filter(e=>new Date(this.option8Value)<=new Date(e.statut[e.statut.length-1].date)||!this.option8Value)
.filter(e=>new Date(this.option13Value)>=new Date(e.statut[e.statut.length-1].date)||!this.option13Value)
.filter(e=>e.statut.find(el=>el.motif==this.option9Value)||!this.option9Value)
.filter(e=>this.option10Value==e.userId||!this.option10Value)
console.log(allrecs)
    this.user.usertype=='Clientpor'||this.user.usertype=='Clientcomm'?this.reclamations=allrecs:''
    this.user.usertype!='Clientpor'&&this.user.usertype!='Clientcomm'&&this.user.usertype!='comite arbitrage'?(
      this.reclamationsonus=allrecs.filter(e=>e.transactions[0].ACQUIRERBANKIDENTIFICATION==e.transactions[0].ISSUERBANKIDENTIFICATION),
      this.reclamationsacq=allrecs.filter(e=>e.transactions[0].ACQUIRERBANKIDENTIFICATION==this.user.banque&&this.user.banque!=e.transactions[0].ISSUERBANKIDENTIFICATION),
      this.reclamationseme=allrecs.filter(e=>this.user.banque==e.transactions[0].ISSUERBANKIDENTIFICATION&&this.user.banque!=e.transactions[0].ACQUIRERBANKIDENTIFICATION)
    ):''
    this.user.usertype=='comite arbitrage'?this.reclamationscomite=allrecs.filter(el=>el.statut[el.statut.length-1].item=='arbitrage rejeté'):''
  }
          click1()
          {
          }
          refreshrecs()
          {
            /*this.reclamations=[]
            this.reclamationsacq=[]
            this.reclamationseme=[]
            this.reclamationsonus=[]*/
            this.showfilterbutton=true
            this.showreinitbutton=false
            this.showsearchform=true
            this.option0Value=this.option10Value=this.option11Value=this.option12Value=this.option13Value=this.option1Value
            =this.option2Value=this.option2Value=this.option3Value=this.option4Value=this.option5Value=this.option6Value=
            this.option7Value=this.option8Value=this.option9Value=undefined
            this.user.usertype=='Clientpor'?this.data.getmanyinfo(this.user.compte):
            this.user.usertype=='Metier'||this.user.usertype=='agence'?( this.recserv.getReclamationacq(this.banque),
            this.recserv.getReclamationeme(this.banque),
            this.mot.getmotifreclamationss()):''
            this.recserv.getReclamationportbanque(this.cartes)
          }
          reloadPage (){
            window.location.reload();
            }
          ngOnDestroy(){
            this.motifsub?this.motifsub.unsubscribe():'';
            this.reclamationsacqSub?this.reclamationsacqSub.unsubscribe():'';
            this.reclamationsemeSub?this.reclamationsemeSub.unsubscribe():'';
            this.reclamationsonusSub?this.reclamationsonusSub.unsubscribe():'';

            this.reclamationsSub?this.reclamationsSub.unsubscribe():'';
            }
  }
  

  
  
  
  

 


