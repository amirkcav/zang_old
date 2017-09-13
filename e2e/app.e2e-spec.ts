import { DynamicFormPage } from './app.po';

describe('dynamic-form App', () => {
  let page: DynamicFormPage;

  beforeEach(() => {
    page = new DynamicFormPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
