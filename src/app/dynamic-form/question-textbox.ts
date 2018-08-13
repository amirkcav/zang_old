import { QuestionBase } from './question-base';

export class TextboxQuestion extends QuestionBase<string> {
  controlType = 'textbox';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
    if (this.type === 'number') {
      if (this.value.toString().trim().length === 0) {
        this.value = null;
      }
    }
  }
}
