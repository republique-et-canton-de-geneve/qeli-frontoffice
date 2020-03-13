import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { QuestionComponent } from '../question.component';
import { TauxQuestion } from './taux-question.model';
import { FormGroup } from '@angular/forms';
import { RegisterQuestionComponent } from '../question-registry';

@RegisterQuestionComponent(new TauxQuestion().controlType)
@Component({
  selector: 'app-text-question',
  templateUrl: './taux-question.component.html',
  styleUrls: ['./taux-question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TauxQuestionComponent implements QuestionComponent<number> {
  @Input() question: TauxQuestion;
  @Input() form: FormGroup;

  options = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];

  isNumber(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;

    if (event.key === ',' && target.value.includes(',')) {
      return false;
    }

    return /[\d,]/.test(event.key);
  }

  onOtherChanged() {
    console.log(!!this.isOtherSelected);
    this.formGroup.controls['taux'].setValue(null);
  }

  get isOtherSelected() {
    return !!this.formGroup.value['other'];
  }

  private get formGroup() {
    return this.form.controls[this.question.key] as FormGroup;
  }
}

