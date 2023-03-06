export type LocaleErrorType = 'operationNotPermitted';

export const localeErrorLanguage = <const>['pt', 'en'];

export type LocaleErrorLanguage = typeof localeErrorLanguage[number];

export const defaultLocaleErrorLanguage: LocaleErrorLanguage = 'pt';

export type LocaleErrorMessage = Record<LocaleErrorLanguage, string>;

export type LocaleErrorObject = {
  status: number;
  message: LocaleErrorMessage;
};

export const localeErrors: Record<LocaleErrorType, LocaleErrorObject> = {
  operationNotPermitted: {
    status: 403,
    message: {
      pt: 'Operação não permitida',
      en: 'Operation not permitted',
    },
  },
};
