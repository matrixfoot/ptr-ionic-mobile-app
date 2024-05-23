import { Component, OnInit,OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { User } from '../models/user.model';
import { ReclamationService } from '../services/reclamation.service';
import { Reclamation } from '../models/reclamation';
import { CommunService } from '../services/commun';
import Swal from 'sweetalert2';
import { TokenStorageService } from '../services/token-storage.service';
import { DocService } from '../services/document.service';
import { Doc } from '../models/document.model';
@Component({
  selector: 'app-document-admin',
  templateUrl: './document-admin.component.html',
  styleUrls: ['./document-admin.component.scss']
})
export class DocumentAdminComponent implements OnInit {
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
  usersSub: any;
  public showphase=false
  public showall=false
  effectiveuser: User;
  currentuser: any;
  alldocSub: any;
  documentslist: Doc[]=[];
  constructor( private route: ActivatedRoute, private router: Router,private docserv: DocService) {}
  ngOnInit() {

  this.loading = true;
  this.alldocSub = this.docserv.docs$.subscribe(
    (docs) => {
      this.loading=false
      this.documentslist = docs;
    },
    (error) => {
      this.loading = false;
      this.errormsg=error.message;
    }
  );
  this.docserv.getDocs()
  }
  getNavigation(link,id){
    this.router.navigate([link + '/' + id]); 
  }
}
