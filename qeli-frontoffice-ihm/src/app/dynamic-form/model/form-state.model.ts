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
  questionKeys: string[];

  constructor(prestation: Prestation, questionKey: string | string[]) {
    this.prestation = prestation;
    this.questionKeys = typeof questionKey === 'string' ? [questionKey as string] : questionKey;
  }
}
