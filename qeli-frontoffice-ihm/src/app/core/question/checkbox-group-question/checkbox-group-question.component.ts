import { AfterViewInit, Component, ElementRef, Input, QueryList, ViewChildren } from '@angular/core';
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
export class CheckboxGroupQuestionComponent implements QuestionComponent<string[]>, AfterViewInit {
  @Input() question: CheckboxGroupQuestion;
  @Input() form: FormGroup;

  @ViewChildren('checkboxInput') checkboxInput: QueryList<ElementRef>;

  ngAfterViewInit(): void {
    this.checkboxInput.toArray()[0].nativeElement.focus();
  }
}
