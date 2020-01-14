import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { QuestionComponent } from '../question.component';
import { DropdownQuestion } from './dropdown-question.model';
import { FormGroup } from '@angular/forms';
import { RegisterQuestionComponent } from '../question-registry';

@RegisterQuestionComponent(new DropdownQuestion().controlType)
@Component({
  selector: 'app-dropdown-question',
  templateUrl: './dropdown-question.component.html',
  styleUrls: ['./dropdown-question.component.scss']
})
export class DropdownQuestionComponent implements QuestionComponent<string[]>, AfterViewInit {
  @Input() question: DropdownQuestion;
  @Input() form: FormGroup;

  @ViewChild('dropdownInput') dropdownInput: ElementRef;

  ngAfterViewInit(): void {
    this.dropdownInput.nativeElement.focus();
  }
}
