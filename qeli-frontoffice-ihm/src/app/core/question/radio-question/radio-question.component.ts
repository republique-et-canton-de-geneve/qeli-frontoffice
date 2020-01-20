import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { RegisterQuestionComponent } from '../question-registry';
import { CheckboxGroupQuestion } from '../checkbox-group-question/checkbox-group-question.model';
import { FormGroup } from '@angular/forms';
import { RadioQuestion } from './radio-question.model';
import { QuestionComponent } from '../question.component';

@RegisterQuestionComponent(new RadioQuestion().controlType)
@Component({
  selector: 'app-radio-question',
  templateUrl: './radio-question.component.html',
  styleUrls: ['./radio-question.component.scss']
})
export class RadioQuestionComponent implements QuestionComponent<string[]>, AfterViewInit {
  @Input() question: CheckboxGroupQuestion;
  @Input() form: FormGroup;

  @ViewChildren('radioButtons') radioButtons: QueryList<ElementRef>;

  ngAfterViewInit(): void {
    this.radioButtons.toArray()[0].nativeElement.focus();
  }
}
