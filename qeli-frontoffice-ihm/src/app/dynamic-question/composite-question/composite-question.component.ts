import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RegisterQuestionComponent } from '../model/question-registry.model';
import { COMPOSITE_CONTROL_TYPE, CompositeAnswer, CompositeQuestion } from './composite-question.model';
import { QuestionComponent } from '../model/question.component';
import { FormGroup } from '@angular/forms';

@RegisterQuestionComponent(COMPOSITE_CONTROL_TYPE)
@Component({
  selector: 'app-composite-question',
  templateUrl: './composite-question.component.html',
  styleUrls: ['./composite-question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompositeQuestionComponent implements QuestionComponent<CompositeAnswer> {
  @Input() question: CompositeQuestion;
  @Input() form: FormGroup;

  constructor() {
  }

  get formGroup() {
    return this.form.controls[this.question.key] as FormGroup;
  }
}
