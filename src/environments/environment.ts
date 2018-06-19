// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  dynamicFormBaseDevUrl: 'http://cache.cav.local:8080/zang/app/', // 'https://smartsale.co.il/zang/app/'
  dynamicFormQuestionsUrl: '../mcall?_NS=USER&_ROUTINE=ZANGDEMO&_LABEL=FORM',
  dynamicFormValidateUrl: '../mcall?_NS=USER&_ROUTINE=ZANGDEMO&_LABEL=VALIDATE',
  dynamicFormSaveUrl: '../mcall?_NS=USER&_ROUTINE=ZANGDEMO&_LABEL=SAVE',
  dynamicGridUrl: '../mcall?_NS=USER&_ROUTINE=ZANGDEMO&_LABEL=GRID',
  dynamicGridDataUrl: '../mcall?_NS=USER&_ROUTINE=ZANGDEMO&_LABEL=GRIDDATA',
  dynaimcFormAutoCompleteUrl: '../mcall?_NS=USER&_ROUTINE=ZANGDEMO&_LABEL=AUTOCOMP'
};
