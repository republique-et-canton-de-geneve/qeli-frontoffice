import { QuestionOption } from '../../../dynamic-question/model/question.model';
import { Personne } from '../../configuration/demandeur.model';

export enum TypeEnfant {
  MOI          = 'MOI',
  AUTRE_PARENT = "AUTRE_PARENT",
  LES_DEUX     = "LES_DEUX",
  AUTRES       = "AUTRES"
}

const OPTIONS_SANS_AUTRES_PARENTS = [TypeEnfant.MOI, TypeEnfant.AUTRES];

function typeEnfantTopOption(typeEnfant: TypeEnfant, autreParent: Personne): QuestionOption<string> {
  return {
    value: typeEnfant,
    label: {
      key: `common.typeEnfant.${typeEnfant}`,
      parameters: typeEnfant === TypeEnfant.AUTRE_PARENT ? {prenomAutreParent: autreParent.prenom} : {}
    }
  };
}

export function typeEnfantAsOptions(autreParent: Personne): QuestionOption<string>[] {
  const options: TypeEnfant[] = autreParent ? Object.values(TypeEnfant) : OPTIONS_SANS_AUTRES_PARENTS;
  return options.map(typeEnfant => typeEnfantTopOption(typeEnfant, autreParent));
}
