import { AfterViewInit, Component, ElementRef, Input, ViewChildren } from '@angular/core';
import { QuestionComponent } from '../question.component';
import { CheckboxGroupQuestion } from './checkbox-group-question.model';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { RegisterQuestionComponent } from '../question-registry';

@RegisterQuestionComponent(new CheckboxGroupQuestion().controlType)
@Component({
  selector: 'app-checkbox-group-question',
  templateUrl: './checkbox-group-question.component.html',
  styleUrls: ['./checkbox-group-question.component.scss']
})
export class CheckboxGroupQuestionComponent implements AfterViewInit, QuestionComponent<any> {
  @Input() question: CheckboxGroupQuestion;
  @Input() form: FormGroup;

  @ViewChildren('optionCheckboxes') optionCheckboxes: ElementRef<HTMLInputElement>[];

  ngAfterViewInit(): void {
    this.optionCheckboxes.forEach(checkbox => {
      if (this.formGroup.value['choices'].includes(checkbox.nativeElement.value)) {
        checkbox.nativeElement.checked = true;
      }
    });
  }

  onNoneChanged() {
    if (this.isNoneSelected) {
      this.clearChoices();
    } else {
      this.clearNoneDetail();
    }

    this.formGroup.markAsPristine();
  }

  onOptionChanged(value: string, checked: boolean) {
    if (checked) {
      this.choicesControl.push(new FormControl(value));
    } else {
      this.choicesControl.controls.forEach((ctrl: FormControl, index: number) => {
        if (ctrl.value === value) {
          this.choicesControl.removeAt(index);
        }
      });
    }

    this.formGroup.markAsDirty();
  }

  private clearChoices() {
    const choicesArray = this.choicesControl;
    while (choicesArray.length !== 0) {
      choicesArray.removeAt(0);
    }
  }

  private clearNoneDetail() {
    this.formGroup.controls['noneDetail'].setValue('');
  }

  private get formGroup() {
    return this.form.controls[this.question.key] as FormGroup;
  }

  private get choicesControl() {
    return this.formGroup.controls['choices'] as FormArray;
  }

  get isNoneSelected() {
    return !!this.formGroup.value['none'];
  }

}
