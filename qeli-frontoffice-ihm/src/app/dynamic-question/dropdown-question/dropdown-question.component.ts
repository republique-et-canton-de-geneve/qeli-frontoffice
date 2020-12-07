import { Component, Input } from '@angular/core';
import { QuestionComponent } from '../model/question.component';
import { DROPDOWN_CONTROL_TYPE, DropdownQuestion } from './dropdown-question.model';
import { FormGroup } from '@angular/forms';
import { RegisterQuestionComponent } from '../model/question-registry.model';
import { OptionAnswer } from '../model/answer.model';

@RegisterQuestionComponent(DROPDOWN_CONTROL_TYPE)
@Component({
  selector: 'app-dropdown-question',
  templateUrl: './dropdown-question.component.html',
  styleUrls: ['./dropdown-question.component.scss']
})
export class DropdownQuestionComponent implements QuestionComponent<OptionAnswer<string>> {
  @Input() question: DropdownQuestion;
  @Input() form: FormGroup;
  @Input() disableFocusOnInit: boolean;

  onMainOptionChanged() {
    if (this.isInconnuSelected) {
      this.dropdownControl.setValue(null);
    }

    this.formGroup.markAsPristine();
  }

  get formGroup() {
    return this.form.controls[this.question.key] as FormGroup;
  }

  get dropdownControl() {
    return this.formGroup.controls['value'];
  }

  get isValid() {
    return this.form.controls[this.question.key].pristine ||
           this.form.controls[this.question.key].valid;
  }

  get isInconnuSelected() {
    return this.formGroup.value['hasSome'] !== 'OUI';
  }
}
