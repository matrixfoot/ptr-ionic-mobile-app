import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';
import { Carouselmodel } from '../models/settings';
import { CarouselService } from '../services/settings';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { read, utils } from "xlsx"
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { compconfService } from '../services/compconf.service';
import { User } from '../models/user.model';
import { Compconf } from '../models/compconf.model';
import { CommunService } from '../services/commun';
import { HabilitationService } from '../services/habilitation.service';
import { Habilitation } from '../models/habilitation.model';
import { dataService } from '../services/data.service';
import { Data } from '../models/data.model';
import { Doc } from '../models/document.model';
import { ChargebackService } from '../services/chargeback.service';
import { Chargeback } from '../models/chargeback.model';
import { DocService } from '../services/document.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  currentUser: any;
   loading=false;
  public carousels: Carouselmodel[] = [];
  private carouselsSub: Subscription;
  carouselform: FormGroup;
  smsform: FormGroup;

  public imagePreview: string;
  fileUploaded = false;
  file: any;
  uploadEvent: any;
  arrayBuffer: string | ArrayBuffer;
  exceljsondata: Event[];
  exceljsondata2: User[];
  tarifform: FormGroup;
  public ammounts: FormArray;
  public type: any[]=["Tarif de base","Tarif spécial"];
  nature: any[];
  natureactivite: any[];
  activite: any[];
  sousactivite: any[];
  regimeimpot: any[];
  actualites: Carouselmodel[];
  tarifs: Carouselmodel[];
  compconfsSub: Subscription;
  habilitationSub: Subscription;
  habilitations: Habilitation[];
loadingdata=false
  compconfs: Compconf[];
  habilitationform: any;
  user: User;
  submitted=false;
  exceldata: Data[]=[];
  documentfile: any;
  comm: string;
  title: string;
  constructor(private token: TokenStorageService,private carousel:CarouselService,private hab:HabilitationService,private compconfservice: compconfService,private userservice: UserService,
   private formBuilder: FormBuilder,private commun: CommunService,private data: dataService,private docadmin: DocService,private chargebackservice: ChargebackService,
    private router: Router,) {
      this.habilitationform = this.formBuilder.group({
        ammounts: this.formBuilder.array([ this.createammount() ])
     });
     }

  ngOnInit() {
    this.currentUser = this.token.getUser();
    this.nature=this.commun.nature
    this.natureactivite=this.commun.natureactivite
    this.activite=this.commun.activites
    this.sousactivite=this.commun.sousactivites
    this.regimeimpot=this.commun.regimeimpot
    this.userservice.getUserById(this.currentUser.userId).then(
      (user: User) => {
        this.user = user;
        this.habilitationSub = this.hab.habilitations$.subscribe(
          (habilitations) => {
            this.habilitations = habilitations;
            this.loading = false;
            this.habilitationform = new FormGroup({          
              ammounts: new FormArray(this.habilitations.map(item => {
                const group = this.createammount();
                //@ts-ignore
                console.log(item)
                group.patchValue(item);
                return group;
              }))
            });
          },
          (error) => {
            this.loading = false;     
          }
        );
        
          this.hab.gethabilitationss();
      }
    )
  
     /* this.compconfsSub = this.compconfservice.compconfs$.subscribe(
        (compconfs) => {
          this.compconfs = compconfs;
          console.log(this.compconfs)
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          
        }
      );
      
        this.compconfservice.getcompconfs();*/
    

   /* this.carouselform = this.formBuilder.group({
      titre: [''],
      rang: [''],
      commentaire: [''],
      description: [''],
      
      image: [null]
      
    });
    this.smsform = this.formBuilder.group({
    
      description: [''],
  
    });*/
  }
  createammount(): FormGroup {
    return this.formBuilder.group({
      id:  [ {value:'', disabled: true},Validators.required],
      intitule: '',
    });
  }
  get ammountControls() {
    return this.habilitationform.get('ammounts')['controls'];
  }
  addammount(){
    this.ammounts = this.habilitationform.get('ammounts') as FormArray;
    this.submitted=true
    const i=this.ammounts.length
    this.ammounts.push(this.createammount());  
   i>0?   this.ammounts.at(i).patchValue({
        id:+(this.ammounts.getRawValue()[i-1].id)+1,
       }):
       this.ammounts.at(i).patchValue({
        id:'1',
       })
      }  
      removeammount(i: number) {
        this.ammounts = this.habilitationform.get('ammounts') as FormArray;
        this.ammounts.removeAt(i);
      }      
  
  setThreeNumberDecimal($event) {
    $event.target.value = $event.target.value ? $event.target.value : 0;
    $event.target.value = parseFloat($event.target.value).toFixed(3);
  }
  sort()
  {
    this.nature.sort()
    this.natureactivite.sort()
    this.activite.sort()
    this.sousactivite.sort()
    this.regimeimpot.sort()
  }
  savehabilitation() {
  this.loading = true;
  let ammounts= this.habilitationform.get('ammounts') as FormArray;
  if(ammounts.value.length>0)
  {
    for (var i = 0; i < ammounts.value.length; ++i)
    {
      let id=ammounts.getRawValue()[i].id
      let intitule=ammounts.getRawValue()[i].intitule
      let idhabilitation:any
      this.habilitations.find(e=>e.id==id)?idhabilitation=this.habilitations.find(e=>e.id==id)._id:''
      let habilitation=this.habilitations.find(e=>e.id==id)
      let newhabilitation=new Habilitation()
      newhabilitation.id=id
      newhabilitation.intitule=intitule
      newhabilitation.userId=this.user._id
      idhabilitation?
  
    this.hab.modifyhabilitationreqById(idhabilitation, habilitation).then(  
    () => {
      this.loading = false;
      Swal.fire({
        title: 'habilitation modifiée avec succès!',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      }).then((result) => {
        this.loading = false;
        
      }
      ) 
    },
    (error) => {
      this.loading = false
      return  Swal.fire({
        title: 'un problème est survenu avec id n°'+`${id}` !,
        icon: 'error',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      })
    }
  ):
 
  this.hab.createwithoutfile(newhabilitation).then(  
    () => {
      this.loading = false;
      Swal.fire({
        title: 'habilitation crée avec succès!',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      }).then((result) => {
        this.loading = false;   
      }
      ) 
    },
    (error) => {
      this.loading = false
      return  Swal.fire({
        title: 'un problème est survenu avec id n°'+`${id}` !,
        icon: 'error',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      })
    }
  )
  } 
  }
else{
  this.loading=false
  Swal.fire({
    title: 'vous n\'avez rien ajouté!',
    icon: 'info',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  })
}
  }

  
  getNavigation(link, id){
      
    this.carousel.getCarouseldataById(id);
    this.router.navigate([link + '/' + id]); 
  }

 onDelete(id) {
    this.loading = true;    
    this.hab.getHabilitationreqById(id).then(
          (data:any) => {
            this.loading = false;
            Swal.fire({
              title: 'Veuillez confirmer la suppression!',             
              icon: 'info',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Confirmer',
              
            }).then((result) => {
              if (result.value) {
                this.hab.deletehabilitationById(id);
                this.reloadPage()
              }
  
            }).catch(() => {
              Swal.fire('opération non aboutie!');
            });
    
        
          }
          
        );
      
  }

myFunction2() {
  var checkbox:any = document.getElementById("myCheck2");
  var text2 = document.getElementById("bodycontainer2");
  if (checkbox.checked == true){
    text2.style.display = "block";
  } else {
    Swal.fire({
      title: 'Vous êtes sur le point de réinitialiser tous les donnés relatifs au formulaire d\'ajout d\'utilisateurs, voulez vous continuer?',
      
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Réinitialiser',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.value) {
        
        text2.style.display = "none";
      }
      else{
        checkbox.checked = true
        text2.style.display = "block";

      }
    }).catch(() => {
      Swal.fire('opération non aboutie!');
    });
  }
}
myFunction3() {
  var checkbox:any = document.getElementById("myCheck3");
  var text2 = document.getElementById("bodycontainer3");
  if (checkbox.checked == true){
    text2.style.display = "block";
  } else {
    Swal.fire({
      title: 'Vous êtes sur le point de réinitialiser tous les donnés relatifs au formulaire d\'ajout des habilitations, voulez vous continuer?',
      
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Réinitialiser',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.value) {
        
        this.carouselform.reset();
        text2.style.display = "none";
      }
      else{
        checkbox.checked = true
        text2.style.display = "block";

      }
    }).catch(() => {
      Swal.fire('opération non aboutie!');
    });
  }
}
myFunction4() {
  var checkbox:any = document.getElementById("myCheck4");
  var text2 = document.getElementById("bodycontainer4");
  if (checkbox.checked == true){
    text2.style.display = "block";
  } else {
    Swal.fire({
      title: 'Vous êtes sur le point de réinitialiser tous les donnés relatifs au formulaire d\'ajout des documents, voulez vous continuer?',
      
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Réinitialiser',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.value) {  
        text2.style.display = "none";
      }
      else{
        checkbox.checked = true
        text2.style.display = "block";
      }
    }).catch(() => {
      Swal.fire('opération non aboutie!');
    });
  }
}
onFileChange(event) {
  if (event.target.files.length > 0) {
    this.file = event.target.files[0];
    this.uploadEvent = event;
  }
  let fileReader = new FileReader();
  fileReader.onload = (e) => {
    this.arrayBuffer = fileReader.result;
    //@ts-ignore
    var data = new Uint8Array(this.arrayBuffer);
    var arr = new Array();
    for (var i = 0; i != data.length; ++i)
      arr[i] = String.fromCharCode(data[i]);
    var bstr = arr.join("");
    var workbook = read(bstr, {
      type: "binary"
    });
    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];
    this.exceljsondata2 = utils.sheet_to_json(worksheet, {
      raw: true,
      defval: "",
    });
    console.log(this.exceljsondata2)
  };
  fileReader.readAsArrayBuffer(this.file);
}
afficher()
{
  this.loading = true;
  console.log(this.exceljsondata)
  this.userservice.addusers(this.exceljsondata2).then(
    (data:any) => {
      this.loading = false;
console.log(this.exceljsondata2)        
Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'utilisateurs ajoutées avec succès!',
        showConfirmButton: false,
        timer: 6000 
      });
          this.reloadPage();
    },
    (error) => {
      this.loading = false;
      
    }
  );
}
onImagePick(event: Event) {
  const file = (event.target as HTMLInputElement).files[0];
  console.log(file);
  this.documentfile=file;
  const reader = new FileReader();
  reader.onload = () => {
    if (this.documentfile.valid) {
      this.imagePreview = reader.result as string;
    } else {
      this.imagePreview = null;
    }
  };
  reader.readAsDataURL(file);
}
afficher4()
{
  this.loadingdata = true;
const newdoc= new Doc() 
newdoc.commentaire=this.comm
newdoc.titre=this.title
newdoc.ficheurl=''
  this.docadmin.create(newdoc,this.documentfile||'').then(
    (data:any) => {
      this.loadingdata = false;
Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'document ajouté avec succès!',
        showConfirmButton: false,
        timer: 6000 
      });
          this.reloadPage();
    },
    (error) => {
      this.loading = false;
      
    }
  );
}
afficher2()
{
  this.loadingdata = true;
  console.log(this.exceldata)
  this.data.createdata(this.exceldata).then(
    (data:any) => {
      this.loadingdata = false;
Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'compconfs ajoutées avec succès!',
        showConfirmButton: false,
        timer: 6000 
      });
          this.reloadPage();
    },
    (error) => {
      this.loading = false;
      
    }
  );
}
deleteall() {
  /*this.compconfservice.deletecompconfs().then(
    (data: any) => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'toutes les compconfs sont suuprimés avec succès!',
        showConfirmButton: false,
        timer: 6000 
      });
      this.reloadPage()
    });*/
}
generatechargeback()
{
  //@ts-ignore
this.chargebackservice.getchargebacks().then(
  (chargebacks:Chargeback[])=>
  {
    let extractedchargebacks=[]
    chargebacks.forEach((element)=>{
      extractedchargebacks.push(
element.MERCHANTIDENTIFICATION+
element.BATCHIDENTIFICATION+
element.INVOICENUMBER+
element.CARDHOLDERNUMBER+
element.MERCHANTSECTOR+
element.CHANNELTRANSACTIONID+
element.OPERATIONCODE+
element.TRANSACTIONCODE+
element.TRANSACTIONAMOUNT+
element.CARDEXPIRYDATE+
new Date(element.PROCESSINGDATE).getFullYear().toString().substring(2)+(new Date(element.PROCESSINGDATE).getMonth() + 1).toString().padStart(2, "0")+new Date(element.PROCESSINGDATE).getDate().toString().padStart(2, "0")+
new Date(element.TRANSACTIONDATE).getFullYear().toString().substring(2)+(new Date(element.TRANSACTIONDATE).getMonth() + 1).toString().padStart(2, "0")+new Date(element.TRANSACTIONDATE).getDate().toString().padStart(2, "0")+
element.AUTHORIZATIONCODE+
element.REMITTANCEDATE+
element.MERCHANTCATEGORIECODE+
element.FILLER+
element.ACQUIRERBANKIDENTIFICATION+
element.LOCALCARDSYSTEMNETWORK+
element.ISSUERBANKIDENTIFICATION+
element.ACQUIRERREFERENCENUMBER+
element.TRANSACTIONORDERUSAGECODE+
element.CHARGEBACKREASONCODE+
element.CHARGEBACKTRANSACTIONCYCLE+
element.MESSAGE+
element.SETTLEMENTAMOUNT+
element.TRANSACTIONTIME+
element.FILLERCHARGEBACK
      )
    }
    )
  //  console.log(extractedchargebacks.join('\n'))
var sJson = extractedchargebacks.join('\n');
var element = document.createElement('a');
element.setAttribute('href', "data:text/plain;charset=UTF-8," + encodeURIComponent(sJson));
element.setAttribute('download','chargeback du '+`${new Date()}.txt`);
element.style.display = 'none';
document.body.appendChild(element);
element.click(); // simulate click
document.body.removeChild(element)
  }
)
}

reloadPage(): void {
  
  setTimeout(() => window.location.reload(), 3000);
  
}
}
