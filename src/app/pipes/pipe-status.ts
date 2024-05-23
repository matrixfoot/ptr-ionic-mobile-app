import { Pipe, PipeTransform } from '@angular/core';
import { Reclamation } from '../models/reclamation';
import { User } from '../models/user.model';

@Pipe({
  name: 'changestatus'
})
export class changestatusPipe implements PipeTransform {

  transform(stat: string,reclamation:Reclamation,user:User,stat1:string,stat2:string): string {

    let returnedstat:string
    let acq=false
    let eme=false
    //@ts-ignore
  user.usertype!='Clientpor'&&user.usertype!='Clientcomm'&&reclamation.transactions[0].ISSUERBANKIDENTIFICATION==reclamation.transactions[0].ACQUIRERBANKIDENTIFICATION?eme=acq=true:''
  //@ts-ignore
  user.usertype!='Clientpor'&&user.usertype!='Clientcomm'&&reclamation.transactions[0].ISSUERBANKIDENTIFICATION==user.banque&&reclamation.transactions[0].ACQUIRERBANKIDENTIFICATION!=user.banque?(eme=true,acq=false):''
  //@ts-ignore
  user.usertype!='Clientpor'&&user.usertype!='Clientcomm'&&reclamation.transactions[0].ISSUERBANKIDENTIFICATION!=user.banque&&reclamation.transactions[0].ACQUIRERBANKIDENTIFICATION==user.banque?(acq=true,eme=false):''
  //console.log(eme,acq,stat1,stat2)
  //comité arbitrage
  user.usertype=='comite arbitrage'?returnedstat=stat:
    
    //statuts commerçant
    user.usertype=='Clientcomm'?
    stat=='crée'?returnedstat='créée':
    stat=='rejetée'&&stat1=='crée'?returnedstat='rejetée':
    stat=='rejetée'&&stat1=='encours'?returnedstat='rejetée':
    stat=='rejetée'&&!stat1?returnedstat='rejetée':
    stat=='clôturé'?returnedstat='clôturé':
    //@ts-ignore
    stat=='encours'&&reclamation.transactions[0].ISSUERBANKIDENTIFICATION==reclamation.transactions[0].ACQUIRERBANKIDENTIFICATION?returnedstat='chargeback':
    stat=='encours'?returnedstat='en cours':
    stat=='chb émis'?returnedstat='chb reçu':
    stat=='acceptée'&&stat1=='chb émis'?returnedstat='chb accepté':
    stat=='rejetée'&&stat1=='chb émis'?returnedstat='Représentée':
    stat=='rejetée'&&stat1=='rejetée'?returnedstat='rejetée':
  stat=='relancée'&&stat1=='rejetée'?returnedstat='Représentée':
 // stat=='clôturé'&&stat1=='relancée'&&stat2=='rejetée'?returnedstat='Représentée':
  stat=='pré-arbitrage'?returnedstat='pré-arbitrage reçu':
  stat=='acceptée'&&stat1=='pré-arbitrage'?returnedstat='pré-arbitrage accepté':
  stat=='pré-arbitrage rejetée'?returnedstat='pré-arbitrage rejeté':
  stat=='relancée'&&stat1=='pré-arbitrage rejetée'?returnedstat='pré-arbitrage rejeté':
  stat=='rejetée'&&stat1=='pré-arbitrage rejetée'?returnedstat='notification rejet pré-arb':
  //stat=='clôturé'&&stat1=='pré-arbitrage rejetée'?returnedstat='pré-arbitrage rejeté':
  stat=='arbitrage'?returnedstat='arbitrage reçu':
  stat=='arbitrage accepté'?returnedstat='arbitrage accepté':
  stat=='arbitrage rejeté'?returnedstat='arbitrage rejeté':
  stat=='Arbitrage Fav. acquéreur'?returnedstat='arbitrage gagné':
  stat=='Arbitrage fav. émetteur'?returnedstat='arbitrage perdu':
    'autre'
    :
  //statuts porteur
    user.usertype=='Clientpor'?
    stat=='crée'?returnedstat='créée':
    stat=='rejetée'&&stat1=='chb émis'?returnedstat='en cours':
    stat=='rejetée'&&stat1=='rejetée'?returnedstat='rejetée':
    stat=='rejetée'?returnedstat='rejetée':
    stat=='encours'?returnedstat='en cours':
    stat=='chb émis'?returnedstat='en cours':
    stat=='acceptée'?returnedstat='acceptée':
    stat=='clôturé'?returnedstat='clôturé':
    stat=='relancée'?returnedstat='relancée':
    stat=='pré-arbitrage'?returnedstat='en cours':
    stat=='pré-arbitrage rejetée'?returnedstat='en cours':
    stat=='arbitrage'?returnedstat='en cours':
    stat=='arbitrage rejeté'?returnedstat='rejetée':
    stat=='arbitrage accepté'?returnedstat='acceptée':

    stat=='Arbitrage fav. émetteur'?returnedstat='acceptée':
    stat=='Arbitrage Fav. acquéreur'?returnedstat='rejetée':
    'autre'
    :
    //statuts émetteur
    eme==acq?
    stat=='crée'?returnedstat='créée':
    stat=='encours'?returnedstat='en cours':
    stat=='acceptée'?returnedstat='acceptée':
    stat=='rejetée'?returnedstat='rejetée':
    stat=='clôturé'?returnedstat='clôturé':

  'autre'
    :
    //statuts émetteur
    eme?
    stat=='crée'?returnedstat='créée':
    stat=='rejetée'&&!stat1?returnedstat='rejetée':
    stat=='rejetée'&&stat1=='encours'?returnedstat='rejetée':
    stat=='rejetée'&&stat1=='crée'?returnedstat='rejetée':
    stat=='rejetée'?returnedstat='rejetée':
    stat=='encours'?returnedstat='en cours':
    stat=='chb émis'?returnedstat='chb émis':
    stat=='acceptée'&&stat1=='chb émis'?returnedstat='chb accepté':
    stat=='rejetée'&&stat1=='chb émis'?returnedstat='Représentée':
      stat=='rejetée'&&stat1=='rejetée'?returnedstat='rejetée':
  stat=='relancée'&&stat1=='rejetée'?returnedstat='relancée':
  //stat=='relancée'&&stat1=='relancée'?returnedstat='relancée':
  //stat=='clôturé'&&stat1=='relancée'&&stat2=='rejetée'?returnedstat='clôturé':
  stat=='clôturé'?returnedstat='clôturé':
  stat=='pré-arbitrage'?returnedstat='pré-arbitrage émis':
  stat=='acceptée'&&stat1=='pré-arbitrage'?returnedstat='pré-arbitrage accepté':
  stat=='pré-arbitrage rejetée'?returnedstat='pré-arbitrage rejeté':
  stat=='rejetée'&&stat1=='pré-arbitrage rejetée'?returnedstat='notification rejet pré-arb':
  stat=='relancée'&&stat1=='pré-arbitrage rejetée'?returnedstat='relancée':
  stat=='arbitrage'?returnedstat='arbitrage émis':
  stat=='arbitrage accepté'?returnedstat='arbitrage accepté':
  stat=='arbitrage rejeté'?returnedstat='arbitrage rejeté':
  stat=='Arbitrage fav. émetteur'?returnedstat='arbitrage gagné':
  stat=='Arbitrage Fav. acquéreur'?returnedstat='arbitrage perdu':

  'autre'
    :
    //statuts acquéreur
    acq?
    stat=='crée'?returnedstat='créée':
    stat=='rejetée'&&stat1=='crée'?returnedstat='rejetée':
    stat=='rejetée'&&stat1=='encours'?returnedstat='rejetée':
    stat=='rejetée'&&!stat1?returnedstat='rejetée':
    stat=='clôturé'?returnedstat='clôturé':
    stat=='encours'?returnedstat='en cours':
    stat=='chb émis'?returnedstat='chb reçu':
    stat=='acceptée'&&stat1=='chb émis'?returnedstat='chb accepté':
    stat=='rejetée'&&stat1=='chb émis'?returnedstat='Représentée':
    stat=='rejetée'&&stat1=='rejetée'?returnedstat='rejetée':
  stat=='relancée'&&stat1=='rejetée'?returnedstat='Représentée':
 // stat=='clôturé'&&stat1=='relancée'&&stat2=='rejetée'?returnedstat='Représentée':
  stat=='pré-arbitrage'?returnedstat='pré-arbitrage reçu':
  stat=='acceptée'&&stat1=='pré-arbitrage'?returnedstat='pré-arbitrage accepté':
  stat=='pré-arbitrage rejetée'?returnedstat='pré-arbitrage rejeté':
  stat=='relancée'&&stat1=='pré-arbitrage rejetée'?returnedstat='pré-arbitrage rejeté':
  stat=='rejetée'&&stat1=='pré-arbitrage rejetée'?returnedstat='notification rejet pré-arb':
  //stat=='clôturé'&&stat1=='pré-arbitrage rejetée'?returnedstat='pré-arbitrage rejeté':
  stat=='arbitrage'?returnedstat='arbitrage reçu':
  stat=='arbitrage accepté'?returnedstat='arbitrage accepté':
  stat=='arbitrage rejeté'?returnedstat='arbitrage rejeté':
  stat=='Arbitrage Fav. acquéreur'?returnedstat='arbitrage gagné':
  stat=='Arbitrage fav. émetteur'?returnedstat='arbitrage perdu':

  'autre'
  :'autre fois'
  console.log(returnedstat)
    return returnedstat
  }
}