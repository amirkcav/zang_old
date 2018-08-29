import { Page } from '../dynamic-page/dynamic-page.model'

export class App {
  id: string;
  job: string;
  title: string;
  icon: string;
  pages: Page[];

  constructor(id?, job?, title?, icon?, pages?) {
    this.id = id;
    this.job = job;
    this.title = title;
    this.icon = icon;
    this.pages = new Array<Page>();
    pages.forEach(p => {
      this.pages.push(new Page(p.id, p.title, p.disabled, p.pmRows));
    });
  }
}
