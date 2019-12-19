export class QuestionBase<T> {
  defaultValue: T;
  key: string;
  // TODO Add validators other than `required`.
  // TODO Add isDisplayed method that takes the current model as param.
  required: boolean;
  help: boolean;
  controlType: string;

  constructor(options: {
    defaultValue?: T,
    key?: string,
    required?: boolean,
    help?: boolean,
    controlType?: string
  } = {}) {
    this.defaultValue = options.defaultValue;
    this.key = options.key;
    this.required = !!options.required;
    this.help = !!options.help;
    this.controlType = options.controlType;
  }
}
