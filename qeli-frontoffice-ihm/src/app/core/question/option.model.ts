export class QuestionOption {
  label: string;
  help: boolean;

  constructor(options: {
    label?: string,
    help?: boolean
  } = {}) {
    this.label = options.label;
    this.help = !!options.help;
  }

}
