import { EtatCivil } from '../core/common/etat-civil.model';
import { ReponseProgressive } from '../core/common/reponse.model';
import { Scolarite } from '../core/common/scolarite.model';
import { Activite } from '../core/common/activite.model';
import { Pays, PAYS_AELE_UE, PAYS_CONVENTIONES } from '../core/common/pays.model';
import * as moment from 'moment';
import { Prestation } from '../core/common/prestation.model';

export function hasConjoint(value: any) {
  return value['etatCivil'] === EtatCivil.MARIE ||
         value['etatCivil'] === EtatCivil.PARTENARIAT_ENREGISTRE;
}

export function hasPermisBEtudes(value: any) {
  return value['permisBEtudes'] === ReponseProgressive.OUI;
}

export function isFonctionnaireInternational(value: any) {
  return value['fonctionnaireInternational'] === ReponseProgressive.OUI;
}

export function aucuneScolarite(value: any) {
  return value['scolarite'] === Scolarite.AUCUNE;
}

export function hasActivites(value: any, activites: Activite[]) {
  return !Object.entries(value['activite'])
                .filter(entry => activites.includes(Activite[entry[0]]))
                .map(entry => entry[1])
                .includes(false);
}

export function isRefugie(value: any) {
  return value['refugie'] === ReponseProgressive.OUI;
}

export function isApatride(value: any) {
  const nationalite = value['nationalite'];
  return nationalite ? !!nationalite['apatride'] : false;
}

export function isSuisse(value: any) {
  const nationalite = value['nationalite'];
  const paysValues = nationalite['pays'] ? (nationalite['pays'] as string[]) : [];
  return paysValues ? paysValues.includes(Pays.CH) : false;
}

export function isUEOrAELE(value: any) {
  const nationalite = value['nationalite'];
  const paysValues = nationalite['pays'] ? (nationalite['pays'] as string[]) : [];
  return paysValues ? paysValues.some(pays => PAYS_AELE_UE.includes(pays)) : false;
}

export function isPaysConventione(value: any) {
  const nationalite = value['nationalite'];
  const paysValues = nationalite['pays'] ? (nationalite['pays'] as string[]) : [];
  return paysValues ? paysValues.some(pays => PAYS_CONVENTIONES.includes(pays)) : false;
}

export function isPaysNonConventione(value: any) {
  const nationalite = value['nationalite'];
  const paysValues = nationalite['pays'] ? (nationalite['pays'] as string[]) : [];
  return paysValues ? paysValues.some(pays =>
    (Object.values(Pays).includes(pays) && !PAYS_AELE_UE.includes(pays))) : false;
}

export function isMineur(value: any) {
  const dateNaissance = value['dateNaissance'] && moment(value['dateNaissance'], 'YYYY-MM-DD');
  return dateNaissance && moment().subtract(18, 'year').endOf('day').isBefore(dateNaissance);
}

export function hasPrestations(value: any, prestations: Prestation[]) {
  return !Object.entries(value['prestations'])
                .filter(entry => prestations.includes(Prestation[entry[0]]))
                .map(entry => entry[1])
                .includes(false);
}

export function isRatioPiecesPersonnesLogementAcceptable(value: any) {
  const nbPersonnes = parseInt(value['nombreDePersonnesLogement']);
  const nbPieces = parseInt(value['nombreDePiecesLogement']);
  return !((nbPieces - nbPersonnes) > 2);
}

export function notHasFortuneTropEleve(value: any) {
  return value['fortuneSuperieureA'] === ReponseProgressive.NON;
}

export function getLimiteFortune(value: any) {
  let limite = 4000;
  if ([EtatCivil.MARIE, EtatCivil.PARTENARIAT_ENREGISTRE].includes(value['etatCivil'])) {
    limite = 8000;
  }
  if (value['enfantsACharge'] && value['enfantsACharge'] > 0) {
    limite += value['enfantsACharge'] * 2000;
  }
  if (limite > 10000) {
    limite = 10000;
  }

  return limite;
}
