import { Prestation } from './prestation.model';

export interface FormState {
  data: any;
  currentIndex: number;
  indexHistory: number[];
  prestationsRefusees: Refus[];
  prestationsRefuseesStack: Refus[][];
  done: boolean;
}

export class Refus {
  prestation: Prestation;
  questionKey: string;

  constructor(prestation: Prestation, questionKey: string) {
    this.prestation = prestation;
    this.questionKey = questionKey;
  }
}
