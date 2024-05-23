import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

import { Doc } from '../models/document.model';
const API_URL_cloud= 'https://macompta.com.tn:3002/api/documents/'
const API_URL_test = 'http://localhost:3005/api/documents/'; 
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
@Injectable({ providedIn: 'root' })
export class DocService {
    
    
    constructor(private http: HttpClient) { }
    public docs: Doc[] = [];
    public docs$ = new Subject<Doc[]>();
 

    getDocs() {
        this.http.get(API_URL_cloud).subscribe(
          (docs: Doc[]) => {
            if (docs) {
              this.docs = docs;
              this.emitDocs();
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
    
      emitDocs() {
        this.docs$.next(this.docs);
      }
      getDocdataById(id: string) {
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

      create(Doc: Doc, image: File| string) {
        return new Promise((resolve, reject) => {
          let Docdata: Doc | FormData;
          if (typeof image === 'string') {
            Docdata = Doc;
          } else {
            Docdata = new FormData();
            Docdata.append('doc', JSON.stringify(Doc));
            Docdata.append('image', image, Doc._id);
          }
          this.http.post(API_URL_cloud, Docdata).subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error);
            }
          );
        }); 
      }

      modify(id: string, Doc: Doc, file: File | string) {
        return new Promise((resolve, reject) => {
          let Docdata: Doc | FormData;
          if (typeof file === 'string') {
            //@ts-ignore
            Doc.ficheUrl = file;
            Docdata = Doc;
          } else {
            Docdata = new FormData();
            Docdata.append('doc', JSON.stringify(Doc));
            Docdata.append('image', file, Doc._id);
          }
          this.http.put(API_URL_cloud + id, Docdata).subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error);
            }
          );
        });
      }
      deleteDocdataById(id: string) {
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
