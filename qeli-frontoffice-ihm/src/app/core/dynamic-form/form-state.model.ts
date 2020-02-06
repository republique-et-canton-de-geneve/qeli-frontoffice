import { Prestation } from '../common/prestation.model';

export interface FormState {
  data: any;
  indexHistory: number[];
  currentIndex: number;
  prestationsRefusees: Refus[];
  done: boolean;
}

export interface Refus {
  prestation: Prestation;
  questionKey: string;
}
