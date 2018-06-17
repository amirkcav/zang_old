import { QuestionBase } from './question-base';

export class ButtonQuestion extends QuestionBase<string> {
  controlType = 'button';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
