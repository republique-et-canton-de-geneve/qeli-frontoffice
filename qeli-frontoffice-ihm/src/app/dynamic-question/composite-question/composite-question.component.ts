import { Component, Input, OnInit } from '@angular/core';
import { RegisterQuestionComponent } from '../model/question-registry.model';
import { COMPOSITE_CONTROL_TYPE, CompositeAnswer, CompositeQuestion } from './composite-question.model';
import { QuestionComponent } from '../model/question.component';
import { FormGroup } from '@angular/forms';

@RegisterQuestionComponent(COMPOSITE_CONTROL_TYPE)
@Component({
  selector: 'app-composite-question',
  templateUrl: './composite-question.component.html',
  styleUrls: ['./composite-question.component.scss']
})
export class CompositeQuestionComponent implements QuestionComponent<CompositeAnswer>, OnInit {
  @Input() question: CompositeQuestion;
  @Input() form: FormGroup;
  @Input() disableFocusOnInit: boolean;

  ngOnInit(): void {
    this.updateControls();
    this.form.valueChanges.subscribe(() => this.updateControls());
  }

  private updateControls() {
    const formGroup = this.formGroup;
    this.question.items.filter(items => items.isShown).forEach(item => {
      const controls = formGroup.controls[item.question.key];
      if (!controls.enabled && item.isShown(this.form.value)) {
        controls.markAsPristine();
        controls.enable();
      } else if (!controls.disabled && !item.isShown(this.form.value)) {
        controls.disable();
      }
    });
  }

  get formGroup() {
    return this.form.controls[this.question.key] as FormGroup;
  }
}
