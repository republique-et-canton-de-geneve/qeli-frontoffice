import { Component, Input } from '@angular/core';
import { QuestionComponent } from '../question.component';
import { CheckboxGroupQuestion } from './checkbox-group-question.model';
import { FormGroup } from '@angular/forms';
import { RegisterQuestionComponent } from '../question-registry';

@RegisterQuestionComponent(new CheckboxGroupQuestion().controlType)
@Component({
  selector: 'app-checkbox-group-question',
  templateUrl: './checkbox-group-question.component.html',
  styleUrls: ['./checkbox-group-question.component.scss']
})
export class CheckboxGroupQuestionComponent implements QuestionComponent<any> {
  @Input() question: CheckboxGroupQuestion;
  @Input() form: FormGroup;

  get isNone() {
    return !!this.form.value[this.question.key]['none'];
  }

  onNoneChanged() {
    if (this.isNone) {
      this.optionControls.forEach(control => control.setValue(false));
    } else {
      (this.form.controls[this.question.key] as FormGroup).controls['noneDetail'].setValue('');
    }

    this.form.controls[this.question.key].markAsPristine();
  }

  get optionControls() {
    const optionControls = (this.form.controls[this.question.key] as FormGroup).controls;

    return Object.keys(optionControls)
                 .filter(key => key !== 'none' && key !== 'noneDetail')
                 .map(key => optionControls[key]);
  }
}
