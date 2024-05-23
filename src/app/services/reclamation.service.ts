import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

import { Reclamation } from '../models/reclamation';
const API_URL_cloud= 'https://macompta.com.tn:3002/api/reclamations/'
const API_URL_test = 'http://localhost:3005/api/reclamations/'; 
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
@Injectable({ providedIn: 'root' })
export class ReclamationService {
  reclamationsportbanque: Reclamation[]=[];
  reclamationscomm: Reclamation[]=[];

    
    constructor(private http: HttpClient) { }
    public allreclamations: Reclamation[] = [];

    public reclamations: Reclamation[] = [];
    public reclamationsacq: Reclamation[] = [];
    public reclamationseme: Reclamation[] = [];
    public reclamationsonus: Reclamation[] = [];
    public allreclamations$ = new Subject<Reclamation[]>();

    public reclamations$ = new Subject<Reclamation[]>();
    public reclamationsportbanque$ = new Subject<Reclamation[]>();
    public reclamationscomm$ = new Subject<Reclamation[]>();

    public reclamationsacq$ = new Subject<Reclamation[]>();
    public reclamationseme$ = new Subject<Reclamation[]>();
    public reclamationsonus$ = new Subject<Reclamation[]>();

   /* public changements$ = new Subject<Reclamation["changements"]>();
    public changements: Reclamation["changements"];*/
    public statuts$ = new Subject<Reclamation["statut"]>();
    public statuts: Reclamation["statut"];
    getReclamations() {
        this.http.get(API_URL_cloud).subscribe(
          (reclamations: Reclamation[]) => {
            if (reclamations) {
              this.allreclamations = reclamations;
              this.emitReclamationsall();
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
      emitReclamationsall() {
        this.allreclamations$.next(this.allreclamations);
      }
      emitReclamations() {
        this.reclamations$.next(this.reclamations);
      }
      emitReclamationsacq() {
        this.reclamationsacq$.next(this.reclamationsacq);
      }
      emitReclamationseme() {
        this.reclamationseme$.next(this.reclamationseme);
      }
      emitReclamationsonus() {
        this.reclamationsonus$.next(this.reclamationsonus);
      }
      emitReclamationsportbanque() {
        this.reclamationsportbanque$.next(this.reclamationsportbanque);
      }
      emitReclamationscomm() {
        this.reclamationscomm$.next(this.reclamationscomm);
      }
      getReclamationdataById(id: string) {
        return new Promise((resolve, reject) => {
            this.http.get(API_URL_cloud + id).subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error); 
            }
          );
        });
      }
   /*   emitchangements() {
        this.changements$.next(this.changements);
      }*/
      emitstatuts() {
        this.statuts$.next(this.statuts);
      }
      getReclamationdataByIdsubscription(id: string) {
        this.http.get(API_URL_cloud + id).subscribe(
          (reclamation: Reclamation) => {
           /* if (reclamation.changements) {
              this.changements = reclamation.changements;
              this.emitchangements();
            }*/
            if (reclamation.statut) {
              this.statuts = reclamation.statut;
              this.emitstatuts();
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
      getReclamationacq(banque: string) {
        return new Promise((resolve, reject) => {
          this.http.get(API_URL_cloud +'acquireur/'+ banque).subscribe(
          (response: Reclamation[]) => {
            if (response) {
              this.reclamationsonus=[]
              this.reclamationsacq=[]

              //@ts-ignore
              response.map(e=>e.transactions.forEach(el=>el.ACQUIRERBANKIDENTIFICATION==el.ISSUERBANKIDENTIFICATION?
                (
                  this.reclamationsonus.push(e),
                  this.emitReclamationsonus()
                ):
                (
                  this.reclamationsacq.push(e),
                  this.emitReclamationsacq()
                )))
            }
            resolve(response);
          },
          (error) => {
            reject(error); 
          }
        );
      });
      }
      getReclamationeme(banque: string) {
        return new Promise((resolve, reject) => {
          this.http.get(API_URL_cloud +'emetteur/'+ banque).subscribe(
          (response: Reclamation[]) => {
            if (response) {
              this.reclamationseme=[]

              //@ts-ignore
              response.map(e=>e.transactions.forEach(el=>el.ACQUIRERBANKIDENTIFICATION!=el.ISSUERBANKIDENTIFICATION?
                (
                  this.reclamationseme.push(e),
                  this.emitReclamationseme()
                ):''))
            }
            resolve(response);
          },
          (error) => {
            reject(error); 
          }
        );
      });
      }
      getReclamation(userId: string) {
        return new Promise((resolve, reject) => {
          this.http.post(API_URL_cloud +'reclamation' ,{userId}).subscribe(
            (reclamations: Reclamation[]) => {
              if (reclamations) {
                this.reclamations=[]

                this.reclamations = reclamations;
                this.emitReclamations();
              }
            },
            (error) => {
              console.log(error);
            }
          );
        });
      }
      getReclamationportbanque(carte:any) {
        return new Promise((resolve, reject) => {
          this.http.post(API_URL_cloud +'multiuserrec' ,{carte}).subscribe(
            (reclamations: Reclamation[]) => {
              if (reclamations) {
                this.reclamationsportbanque = reclamations;
                this.emitReclamationsportbanque();
              }
            },
            (error) => {
              console.log(error);
            }
          );
        });
      }
      getReclamationcomm(idlist: any) {
        return new Promise((resolve, reject) => {
          this.http.post(API_URL_cloud +'commercant/',{idlist}).subscribe(
          (response: Reclamation[]) => {
            if (response) {
              this.reclamationscomm=response
              this.emitReclamationscomm()
            }
            resolve(response);
          },
          (error) => {
            reject(error); 
          }
        );
      });
      }
      create(Reclamation: Reclamation, image: File| string) {
        return new Promise((resolve, reject) => {
          let Reclamationdata: Reclamation | FormData;
          if (typeof image === 'string') {
            console.log(image)
            Reclamationdata = Reclamation;
          } else {
            Reclamationdata = new FormData();
            Reclamationdata.append('reclamation', JSON.stringify(Reclamation));
            Reclamationdata.append('image', image, Reclamation._id);
          }
          this.http.post(API_URL_cloud, Reclamationdata).subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error);
            }
          );
        }); 
      }
      modify(id: string, Reclamation: Reclamation, uploadedfiles: File[]) {
        return new Promise((resolve, reject) => {     
          let  Reclamationdata = new FormData();
            Reclamationdata.append('reclamation', JSON.stringify(Reclamation));
            
    for (var i = 0; i < uploadedfiles.length; i++) { 
                  //@ts-ignore
      Reclamationdata.append('image', uploadedfiles[i], i+Reclamation.statut[Reclamation.statut.length-1].date+Reclamation._id);
    }
          
          this.http.put(API_URL_cloud + id, Reclamationdata).subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error);
            }
          );
        });
      }
      savereclamationById(id: string, reclamation: Reclamation) {
        return new Promise((resolve, reject) => {
          
            
          
          this.http.put(API_URL_cloud+'modify/'+ id, reclamation).subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error);
            }
          );
        });
      }
      deleteReclamationdataById(id: string) {
        return new Promise((resolve, reject) => {
          this.http.delete(API_URL_cloud+ id).subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error);
            }
          );
        });
      }  
    }
