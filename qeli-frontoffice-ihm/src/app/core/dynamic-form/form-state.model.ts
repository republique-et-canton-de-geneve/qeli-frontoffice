import { Prestation } from '../common/prestation.model';

export interface FormState {
  data: any;
  currentIndex: number;
  indexHistory: number[];
  prestationsRefusees: Refus[];
  prestationsRefuseesStack: Refus[][];
  done: boolean;
}

export interface Refus {
  prestation: Prestation;
  questionKey: string;
}
