import type { DocMiniApp } from '@lark-opdev/block-docs-addon-api';
import React, { useEffect, useState } from 'react';

const defaultI18N = 'zh-CN';
export const I18NContext = React.createContext<string>(defaultI18N);

interface IProps {
  docMiniApp: DocMiniApp,
}

export const I18NProvider = (props: React.PropsWithChildren<IProps>) => {
  const [lang, setLang] = useState('');
  const { docMiniApp } = props;

  useEffect(() => {
    docMiniApp.Env.Language.getLanguage().then(lang => {
      setLang(lang);
    }).catch(e => {
      console.error('get getLanguage error', e);
      setLang(defaultI18N);
    });
  }, [docMiniApp]);

  if (!lang) {
    return null;
  }

  return (
    <I18NContext.Provider value={lang}>
      {props.children}
    </I18NContext.Provider>
  );
};