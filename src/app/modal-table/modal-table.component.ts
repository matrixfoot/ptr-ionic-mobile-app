import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { User } from '../models/user.model';
@Component({
  selector: 'app-modal-table',
  templateUrl: './modal-table.component.html',
  styleUrls: ['./modal-table.component.scss'],
})
export class ModalTableComponent {
@Input() modalarray:User[]=[]
@Output() usernameChange: EventEmitter<string> = new EventEmitter<string>();
@Output() passwordChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(private modalController: ModalController) {}

  async closeModal(email:any,id:any) {
    await this.modalController.dismiss({
      username: email,
      password: id
    }); // Set the role to 'login'
  }
  onLogin(email:any,id:any) {
    console.log(email)
    console.log(id)
    this.usernameChange.emit(email);
    this.passwordChange.emit(id);
    this.closeModal(email,id); // Optionally close the modal after emitting the data
  }
}
