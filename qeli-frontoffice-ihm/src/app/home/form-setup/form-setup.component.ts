import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateValidators } from '../../ge-forms/date.validators';
import * as moment from 'moment';
import {
  Demandeur, DemandeurSchema, EtatCivil, MembreFamilleSchema, Relation
} from '../../service/configuration/demandeur.model';
import { I18nString } from '../../core/i18n/i18nstring.model';
import { TranslateService } from '@ngx-translate/core';

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
  errorLabels: { [key: string]: I18nString } = {};

  constructor(private fb: FormBuilder,
              private translateService: TranslateService) {
    this.setupForm = this.fb.group({
      id: new FormControl(0),
      prenom: new FormControl(null, this.uniquePrenomValidator.bind(this)),
      etatCivil: new FormControl(null, Validators.required),
      dateNaissance: new FormControl(null, this.dateNaissanceValidators),
      membresFamille: this.fb.array([])
    });

    this.errorLabels = {
      uniquePrenom: {key: 'home.setup.errors.uniquePrenom'},
      required: {key: 'home.setup.errors.required'},
      maxDate: {key: 'home.setup.errors.maxDate'},
      minDate: {key: 'home.setup.errors.minDate'},
      invalidDate: {key: 'home.setup.errors.invalidDate'}
    };
  }

  private uniquePrenomValidator(control: AbstractControl) {
    if (control && control.value) {
      const prenomControls: FormControl[] = [this.setupForm.controls['prenom'] as FormControl].concat(
        this.membresFamilleControls.map(membreFamilleControl => membreFamilleControl.controls['prenom'] as FormControl)
      );
      const prenoms = prenomControls.filter(
        prenomControl => prenomControl.parent.value['id'] !== control.parent.value['id']
      ).map(prenomControl => prenomControl.value);

      return prenoms.includes(control.value) ? {'uniquePrenom': true} : null;
    }

    return null;
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
        id: new FormControl(this.numberOfMembres + 1),
        prenom: new FormControl(null, this.uniquePrenomValidator.bind(this)),
        relation: new FormControl(null, Validators.required),
        dateNaissance: new FormControl(null, this.dateNaissanceValidators)
      }));

      this.numberOfMembres += 1;
    }
  }

  getDefaultPrenomByMembre(membre: MembreFamilleSchema) {
    const membreIndex = this.membresFamilleControls.map(control => control.value as MembreFamilleSchema).filter(
      other => {
        return other.id < membre.id && other.relation === membre.relation;
      }
    ).length + 1;
    return this.translateService.instant(
      `home.setup.membre.prenom.placeholder.${membre.relation || 'DEFAULT'}`,
      {index: membreIndex}
    )
  }

  get demandeur() {
    if (this.isValid) {
      const demandeurOptions = this.setupForm.value as DemandeurSchema;
      demandeurOptions.prenom = demandeurOptions.prenom || 'Demandeur';
      demandeurOptions.membresFamille.forEach((membre, index) => {
        membre.prenom = membre.prenom || this.getDefaultPrenomByMembre(membre)
      });
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
    const membresFamille = this.setupForm.value['membresFamille'] as MembreFamilleSchema[];
    return membresFamille.some(membre => membre.relation === relation);
  }

  get membresFamille() {
    return this.setupForm.controls['membresFamille'] as FormArray;
  }

  get membresFamilleControls() {
    return this.membresFamille.controls as FormGroup[];
  }

  get isValid() {
    return this.setupForm.valid;
  }
}
