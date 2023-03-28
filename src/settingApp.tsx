import { useCallback, useMemo, useEffect, useState, useContext } from 'react';
import { Button, Radio, Select, Modal, ConfigProvider } from 'antd'
import { DocMiniApp } from './utils/api';
import ContentEditor from './Component/ContentEditor/index';
import { getReadDuration } from './utils/getBlockData';
import './setting.less';
import { formatI18NText } from './utils/formatI18NText';
import { colorList, iconList } from './constants/iconAndColor';
import { PreviewEditor } from './Component/PreviewEditor';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';
import { withInlines } from './utils/withInlines';
import {  ThemeContext } from './Component/Theme';
import { getAntTheme, t } from './utils';
import { I18NContext } from './Component/I18nProvider';
import { PageMeta, UserInfo } from '@lark-opdev/block-docs-addon-api';
import { TEMPLATE_TYPE } from './constants/type';


export default () => {
  const [pageMeta, setPageMeta] = useState<PageMeta>();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [readDuration, setReadDuration] = useState<number>();
  const [templateType, setTemplateType] = useState<any>(null);
  const [iconType, setIconType] = useState<string>();
  const [colorType, setColorType] = useState<string>();
  const { Option: Option } = Select
  const [isTemplate, setIsTemplate] = useState<any>(null);
  const [value, setValue] = useState<any>(null);
  const theme = useContext(ThemeContext);
  const lang = useContext(I18NContext);

  const editor = useMemo(() => withInlines(withHistory(withReact(createEditor()))), []);
  (window as any).editor = editor;

  const editor2 = useMemo(() => withInlines(withHistory(withReact(createEditor()))), []);

  const date = new Date();
  const templateList = [
    {
      type: TEMPLATE_TYPE.templateOne,
      label: t('ViewData_Settings_templateOne_value', lang),
      templateKey: { WordCount: pageMeta?.word_count, EstRead: readDuration },
      iconType: iconList[1].type,
      colorType: colorList[3].type
    },
    {
      type: TEMPLATE_TYPE.templateTwo,
      label: t('ViewData_Settings_templateTwo_value', lang),
      templateKey: {
        Date: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
        VisitorCount: pageMeta?.uv
      },
      iconType: iconList[4].type,
      colorType: colorList[1].type
    }
  ];

  const handleCancel = useCallback(async () => {
    DocMiniApp.View.Action.hidePopup({});
  }, []);
  const handleConfirm = useCallback(() => {
    DocMiniApp.View.Action.hidePopup({ templateType, isTemplate, iconType, colorType, value, pageMeta });
  }, [templateType, isTemplate, iconType, colorType, value, pageMeta]);

  useEffect(() => {
    // 初始化数据
    (async () => {
      const initData = await DocMiniApp.Bridge.getInitData();
      const readDuration = await getReadDuration(initData.docRef, initData.meta);
      // todo聚合成一个
      setUserInfo(initData.userInfo);
      setReadDuration(readDuration);
      setPageMeta(initData.meta);
      setIconType(initData.iconType);
      setColorType(initData.colorType);
      setIsTemplate(initData.isTemplate);
      setTemplateType(initData.templateType);
      setValue(initData.value);
    })();
  }, []);

  useEffect(() => {
    if (!isTemplate) {
      return;
    }
    templateList.map(value => {
      if (value.type === templateType) {
        const newValue = formatI18NText(value.label, value.templateKey);
        editor2.children = newValue;
        setValue(newValue);
      }
    });
  }, [templateType, isTemplate]);

  const getColor = useCallback(() => {
    let iconColor = '';
    colorList.map(value => {
      if (value.type === colorType) {
        iconColor = value.iconColor;
      }
    });
    return iconColor;
  }, [colorType]);

  const getBgColor = useCallback(() => {
    let bgColor = '';
    colorList.map(value => {
      if (value.type === colorType) {
        bgColor = value.bgColor;
      }
    });
    return bgColor;
  }, [colorType]);

  if (value === null) {
    return null;
  }

  return (
    <ConfigProvider theme={{ algorithm: getAntTheme(theme) }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100vw'
        }}
      >
        <Modal
          footer={null}
          title={t('ViewData_Settings_Header', lang)}
          width={ 600 }
          bodyStyle={{ padding: 0, margin: 0 }}
          onCancel={handleCancel}
          open
        >
          <div className="setting-container">
            <div className="setting-option-container">
              <div className="setting-option">
                <Radio
                  onChange={() => {
                    setIsTemplate(true);
                  }}
                  checked={isTemplate}
                />
                <Select
                  value={templateType}
                  style={{ width: 474 }}
                  onSelect={v => {
                    if (isTemplate) {
                      templateList.map(value => {
                        if (value.type === v) {
                          setIconType(value.iconType);
                          setColorType(value.colorType);
                        }
                      });
                    }
                    setTemplateType(v);
                  }}
                  disabled={!isTemplate}
                  allowClear={false}
                >
                  <Option value={TEMPLATE_TYPE.templateOne}>
                    {t('ViewData_Settings_templateOne', lang)}
                  </Option>
                  <Option value={TEMPLATE_TYPE.templateTwo}>
                    {t('ViewData_Settings_templateTwo', lang)}
                  </Option>
                </Select>
              </div>
              <div className="setting-option">
                <Radio
                  onChange={() => {
                    setIsTemplate(false);
                  }}
                  checked={!isTemplate && isTemplate !== null}
                />
                <div
                  className="setting-self"
                  onClick={() => {
                    setIsTemplate(false);
                  }}
                >
                  {t('ViewData_Settings_Setting_self', lang)}
                </div>
              </div>
              {iconType && colorType && (
                <div 
                  className="self-setting-container"
                  style={{
                    display: !isTemplate && isTemplate !== undefined ? 'block' : 'none'
                  }}
                >
                  <ContentEditor
                    editor={editor}
                    editor2={editor2}
                    value={value}
                    setValue={setValue}
                    iconType={iconType}
                    colorType={colorType}
                    setColorType={setColorType}
                    setIconType={setIconType}
                  />
                </div>
              )}
            </div>
            <div className="preview-container">
              <div className="preview-header">{t('ViewData_Settings_Preview', lang)}</div>
              <div className="preview-content-container">
                <div
                  className="preview-content"
                  style={{ background: getBgColor(), color: 'var(--text-title)' }}
                >
                  {iconType !== 'ban' ? (
                    <div className="icon-container" style={{ color: getColor() }}>
                      <div className="icon">
                        {iconList.map(({ type, icon }) => {
                          if (type === iconType) {
                            return icon;
                          }
                        })}
                      </div>
                    </div>
                  ) : null}
                  <PreviewEditor
                    editor={editor2}
                    value={value}
                    pageMeta={pageMeta}
                    userInfo={userInfo}
                    readDuration={readDuration}
                    colorType={colorType}
                  />
                </div>
              </div>
            </div>

            <div className="footer-container">
              <Button onClick={handleCancel}>
                {t('ViewData_Settings_Cancel_Btn', lang)}
              </Button>
              <Button onClick={handleConfirm} type="primary" color="primary">
                {t('ViewData_Settings_Confirm_Btn', lang)}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  );
};
