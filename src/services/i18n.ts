import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

import pt from '../translations/pt.json';
import es from '../translations/es.json';

const i18n = new I18n({
  ...pt,
  ...es, 
});

i18n.defaultLocale = 'pt';

const locales = Localization.getLocales();
if (locales && locales.length > 0) {
  i18n.locale = locales[0].languageCode;
} else {
  i18n.locale = 'pt';
}

i18n.enableFallback = true;

export const t = (scope: string, options?: object) => {
  return i18n.t(scope, options);
};

export default i18n;