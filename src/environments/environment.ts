// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  dynamicFormBaseDevUrl: 'http://cache.cav.local:8080/zang/app/',
  dynamicFormQuestionsUrl: '../mcall?_NS=USER&_ROUTINE=ZANGDEMO&_LABEL=FORM',
  dynamicFormValidateUrl: '../mcall?_NS=USER&_ROUTINE=ZANGDEMO&_LABEL=VALIDATE',
  dynamicFormSaveUrl: '../mcall?_NS=USER&_ROUTINE=ZANGDEMO&_LABEL=SAVE'
};
