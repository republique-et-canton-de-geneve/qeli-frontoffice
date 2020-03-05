import { EtatCivil } from './model/etat-civil.model';
import { ReponseBinaire, ReponseProgressive } from '../core/common/reponse.model';
import { Scolarite } from './model/scolarite.model';
import { TypeRevenus } from './model/revenus.model';
import { Pays, PAYS_AELE_UE, PAYS_CONVENTIONES } from '../core/question/nationalite-question/pays.model';
import * as moment from 'moment';
import { Prestation } from '../core/common/prestation.model';
import { RequerantRefugie } from './model/requerant-refugie.model';
import { TypeEnfant } from './model/type-enfant.model';

export function hasConjoint(value: any) {
  return value['etatCivil'] === EtatCivil.MARIE ||
         value['etatCivil'] === EtatCivil.PARTENARIAT_ENREGISTRE;
}

export function isConcubinageAutreParent(value: any) {
  return value['concubinageAutreParent'] === ReponseBinaire.OUI;
}

export function hasPermisBEtudes(value: any) {
  return value['permisBEtudes'] === ReponseProgressive.OUI;
}

export function isFonctionnaireInternational(value: any) {
  return value['fonctionnaireInternational'] === ReponseProgressive.OUI;
}

export function aucuneScolarite(value: any) {
  return value['scolarite'] === Scolarite.AUCUNE ||
         value['scolarite'] === Scolarite.INCONNU;
}

export function hasAnyRevenus(value: any, revenus: TypeRevenus[], which: string = 'revenus') {
  return revenus.some(item => value[which]['choices'].includes(item));
}

export function hasAnyAVSOrAIRevenus(value: any, which: string = 'revenus') {
  return hasAnyRevenus(value, [
    TypeRevenus.AVS_RETRAITE,
    TypeRevenus.AVS_ENFANT,
    TypeRevenus.AVS_VEUF,
    TypeRevenus.AI_INVALIDITE,
    TypeRevenus.AI_ENFANT
  ], which);
}

export function isRefugieOrRequerantAsile(value: any) {
  return value['refugie'] === RequerantRefugie.REFUGIE ||
         value['refugie'] === RequerantRefugie.REQUERANT_ASILE;
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

export function getNbrEnfantsACharge(value: any, types: TypeEnfant[]) {
  if (hasEnfants(value)) {
    const enfantsACharge = value['enfantsACharge'];

    return Object.entries(enfantsACharge['values'])
                 .filter(entry => types.includes(TypeEnfant[entry[0]]))
                 .map(entry => entry[1] as number)
                 .reduce((current, total) => current + total, 0);
  }

  return 0;
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
  const nbrEnfantsACharge = getNbrEnfantsACharge(value, Object.values(TypeEnfant));
  const limiteFortune = 4000 + (nbrEnfantsACharge * 2000) + (hasConjoint(value) ? 4000 : 0);

  return Math.min(limiteFortune, 10000);
}

export function habiteGeneveDepuis5ans(value: any) {
  const dateArriveData = value['dateArriveeGeneve'];

  if (dateArriveData['shortcut'] === 'INCONNU') {
    return true;
  }

  const dateArriveeGeneve = dateArriveData['shortcut'] === 'DEPUIS_NAISSANCE' ?
                            getDate(value, 'dateNaissance') :
                            getDate(value, 'dateArriveeGeneve');

  return dateArriveeGeneve && moment().subtract(5, 'year')
                                      .endOf('day')
                                      .isAfter(moment(dateArriveeGeneve));
}
