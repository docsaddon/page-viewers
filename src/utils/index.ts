import type { DocMiniApp } from '@lark-opdev/block-docs-addon-api';
import { ThemeMode, DocToAntTheme } from '../constants/type';
import I18N_TEXT from '../../i18n';

function eleSetTheme(theme: ThemeMode, ele: HTMLElement = document.documentElement, ): void {
    ele.dataset.theme = theme;
}

export const initTheme = async (docMiniApp: DocMiniApp) => {
    const isDarkMode = await docMiniApp.Env.DarkMode.getIsDarkMode();
    const theme = isDarkMode ? ThemeMode.DARK : ThemeMode.LIGHT;
    eleSetTheme(theme);

    docMiniApp.Env.DarkMode.onDarkModeChange((isDarkMode: boolean) => {
        const theme = isDarkMode ? ThemeMode.DARK : ThemeMode.LIGHT;
        eleSetTheme(theme);   
    });
}

export const getAntTheme = (docTheme: ThemeMode) => {
    return DocToAntTheme[docTheme];
}

const i18nSource: Record<string, any> = I18N_TEXT;
export const t = (key: string, lang: string) => {
    const defaultLang = 'zh-CN';
    if (!i18nSource[lang]) {
        return i18nSource[defaultLang][key];
    }
    return i18nSource[lang][key];
}