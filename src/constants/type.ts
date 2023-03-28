export type { DocMiniApp } from '@lark-opdev/block-docs-addon-api';
import { theme } from 'antd'

export enum ThemeMode {
    DARK = 'dark',
    LIGHT = 'light'
}

export const  DocToAntTheme =  {
    [ThemeMode.LIGHT]: theme.defaultAlgorithm,
    [ThemeMode.DARK]: theme.darkAlgorithm,
}

export enum DOC_DATA_TYPE {
    /** 文档字数 */
    WordCount = 'WordCount',
    /** 阅读时长 */
    EstRead = 'EstRead',
    /** 访问排序 */
    VisitorRank = 'VisitorRank',
    /** 访问人数 */
    VisitorCount = 'VisitorCount',
    /** 访客名 */
    VisitorName = 'VisitorName',
    /** 当前日期 */
    Date = 'Date'
  }

  export enum TEMPLATE_TYPE {
    templateOne = 'templateOne',
    templateTwo = 'templateTwo'
  }