import { QuestionBase } from './question-base';

export class AutoCompleteQuestion extends QuestionBase<string> {
  controlType = 'autocomplete';

  constructor(options: {} = {}) {
    super(options);
  }
}
