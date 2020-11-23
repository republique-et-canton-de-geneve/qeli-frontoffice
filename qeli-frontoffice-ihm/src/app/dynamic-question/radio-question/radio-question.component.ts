import { Component, Input } from '@angular/core';
import { RegisterQuestionComponent } from '../model/question-registry.model';
import { FormGroup } from '@angular/forms';
import { RADIO_CONTROL_TYPE, RadioQuestion } from './radio-question.model';
import { QuestionComponent } from '../model/question.component';
import { OptionAnswer } from '../model/answer.model';

@RegisterQuestionComponent(RADIO_CONTROL_TYPE)
@Component({
  selector: 'app-radio-question',
  templateUrl: './radio-question.component.html',
  styleUrls: ['./radio-question.component.scss']
})
export class RadioQuestionComponent implements QuestionComponent<OptionAnswer<string>> {
  @Input() question: RadioQuestion;
  @Input() form: FormGroup;
  @Input() disableFocusOnInit: boolean;

  get isValid() {
    return this.form.controls[this.question.key].pristine ||
           this.form.controls[this.question.key].valid;
  }
}
