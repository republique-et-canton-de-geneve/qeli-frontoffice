import { EtatCivil } from './model/etat-civil.model';
import { ReponseBinaire, ReponseProgressive } from '../core/common/reponse.model';
import { Scolarite } from './model/scolarite.model';
import { Activite } from './model/activite.model';
import { Pays, PAYS_AELE_UE, PAYS_CONVENTIONES } from '../core/question/nationalite-question/pays.model';
import * as moment from 'moment';
import { Prestation } from '../core/common/prestation.model';
import { RequerantRefugie } from './model/requerant-refugie.model';
import { TypeEnfant } from './model/type-enfant.model';

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
  return activites.every(activite => value['activite']['choices'].includes(activite));
}

export function isRefugie(value: any) {
  return value['refugie'] === RequerantRefugie.REFUGIE;
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

export function isConjointApatride(value: any) {
  const nationalite = value['nationaliteConjoint'];
  return nationalite ? !!nationalite['apatride'] : false;
}

export function isConjointSuisse(value: any) {
  const nationalite = value['nationaliteConjoint'];
  const paysValues = nationalite['pays'] ? (nationalite['pays'] as string[]) : [];
  return paysValues ? paysValues.includes(Pays.CH) : false;
}

export function isConjointUEOrAELE(value: any) {
  const nationalite = value['nationaliteConjoint'];
  const paysValues = nationalite['pays'] ? (nationalite['pays'] as string[]) : [];
  return paysValues ? paysValues.some(pays => PAYS_AELE_UE.includes(pays)) : false;
}

export function isPaysConventione(value: any) {
  const nationalite = value['nationalite'];
  const paysValues = nationalite['pays'] ? (nationalite['pays'] as string[]) : [];
  return paysValues ? paysValues.some(pays => PAYS_CONVENTIONES.includes(pays)) : false;
}

function getDate(value: any, questionKey: string) {
  return value[questionKey] && moment(value[questionKey]['value'], 'YYYY-MM-DD');
}

export function isMineur(value: any) {
  const dateNaissance = getDate(value, 'dateNaissance');
  return dateNaissance && moment().subtract(18, 'year').endOf('day').isBefore(dateNaissance);
}

export function hasAnyEnfantOfType(value: any, types: TypeEnfant[]) {
  const enfantsACharge = value['enfantsACharge'];

  if (enfantsACharge) {
    return !enfantsACharge['none'] && Object.entries(enfantsACharge['values'])
                                            .filter(entry => types.includes(TypeEnfant[entry[0]]))
                                            .map(entry => entry[1])
                                            .some(value => value > 0);
  }

  return null;
}

export function hasEnfants(value: any) {
  const enfantsACharge = value['enfantsACharge'];
  return enfantsACharge ? !enfantsACharge['none'] : null;
}

export function hasAnyPrestations(value: any, prestations: Prestation[]) {
  return prestations.some(prestation => value['prestations']['choices'].includes(prestation));
}

export function hasPrestation(value: any, prestation: Prestation) {
  return value['prestations']['choices'].includes(prestation);
}

export function isRatioPiecesPersonnesLogementAcceptable(value: any) {
  const nbPersonnes = parseInt(value['nombreDePersonnesLogement']);
  const nbPieces = parseInt(value['nombreDePiecesLogement']);
  return !((nbPieces - nbPersonnes) > 2);
}

export function hasFortuneTropEleve(value: any) {
  return value['fortuneSuperieureA'] === ReponseBinaire.OUI;
}

export function getLimiteFortune(value: any) {
  let limite = 4000;

  if (hasConjoint(value)) {
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

export function habiteGeneveDepuis5ans(value: any) {
  const dateArriveData = value['dateArriveGeneve'];

  if (dateArriveData['shortcut'] === 'INCONNU') {
    return true;
  }

  const dateArriveGeneve = dateArriveData['shortcut'] === 'DEPUIS_NAISSANCE' ?
                           getDate(value, 'dateNaissance') :
                           getDate(value, 'dateArriveGeneve');

  return dateArriveGeneve && moment().subtract(5, 'year')
                                     .endOf('day')
                                     .isAfter(moment(dateArriveGeneve));
}
