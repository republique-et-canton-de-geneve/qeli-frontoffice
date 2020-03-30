import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateValidators } from '../../ge-forms/date.validators';
import * as moment from 'moment';
import {
  Demandeur, DemandeurSchema, EtatCivil, MembreFamille, Relation
} from '../../service/configuration/demandeur.model';

const MAX_NUMBER_OF_MEMBRES = 20;

@Component({
  selector: 'app-form-setup',
  templateUrl: './form-setup.component.html',
  styleUrls: ['./form-setup.component.scss']
})
export class FormSetupComponent {
  setupForm: FormGroup;
  numberOfMembres = 0;
  etatCivilOptions = Object.keys(EtatCivil);
  relationOptionsByMember: Relation[][] = [];

  constructor(private fb: FormBuilder) {
    this.setupForm = this.fb.group({
      prenom: new FormControl(null),
      etatCivil: new FormControl(null, Validators.required),
      dateNaissance: new FormControl(null, this.dateNaissanceValidators),
      membresFamille: this.fb.array([])
    });
  }

  get maxDateNaissance() {
    return new Date();
  }

  get minDateNaissance() {
    return moment().subtract(130, 'year').toDate();
  }

  private get dateNaissanceValidators() {
    return [
      Validators.required,
      DateValidators.date,
      DateValidators.maxDate(this.maxDateNaissance),
      DateValidators.minDate(this.minDateNaissance)
    ];
  }

  deleteMembre(index: number) {
    if (this.numberOfMembres > 0) {
      this.membresFamille.removeAt(index);
      this.numberOfMembres -= 1;
    }
  }

  onAddMembre() {
    if (this.numberOfMembres < MAX_NUMBER_OF_MEMBRES) {
      this.relationOptionsByMember[this.numberOfMembres] = this.availableRelationOptions();
      this.membresFamille.push(this.fb.group({
        prenom: new FormControl(null),
        relation: new FormControl(null, Validators.required),
        dateNaissance: new FormControl(null, this.dateNaissanceValidators)
      }));

      this.numberOfMembres += 1;
    }
  }

  get demandeur() {
    if (this.isValid) {
      return new Demandeur(this.setupForm.value as DemandeurSchema);
    }

    return null;
  }

  private availableRelationOptions() {
    const relationOptions = [Relation.ENFANT];

    if (this.isEtatCivil(EtatCivil.MARIE) &&
        !this.hasMembreFamilleWithRelation(Relation.EPOUX)) {
      relationOptions.push(Relation.EPOUX);
    }
    if (this.isEtatCivil(EtatCivil.PARTENARIAT_ENREGISTRE) &&
        !this.hasMembreFamilleWithRelation(Relation.PARTENAIRE_ENREGISTRE)) {
      relationOptions.push(Relation.PARTENAIRE_ENREGISTRE);
    }

    if (!this.isEtatCivil(EtatCivil.MARIE) &&
        !this.isEtatCivil(EtatCivil.PARTENARIAT_ENREGISTRE) &&
        !this.hasMembreFamilleWithRelation(Relation.CONCUBIN)) {
      relationOptions.push(Relation.CONCUBIN);
    }

    return relationOptions;
  }

  private isEtatCivil(etatCivil: EtatCivil) {
    return (this.setupForm.value['etatCivil'] as EtatCivil) === etatCivil
  }

  private hasMembreFamilleWithRelation(relation: Relation) {
    const membresFamille = this.setupForm.value['membresFamille'] as MembreFamille[];
    return membresFamille.some(membre => membre.relation === relation);
  }

  get membresFamille() {
    return this.setupForm.controls['membresFamille'] as FormArray;
  }

  get membresFamilleControls() {
    return (this.setupForm.controls['membresFamille'] as FormArray).controls as FormGroup[];
  }

  get isValid() {
    return this.setupForm.valid;
  }
}
