import { useEffect, useState, useCallback, useRef, useMemo, useContext } from 'react';
import {
  InteractionChangesetType,
  PageMeta,
  UserInfo
} from '@lark-opdev/block-docs-addon-api';
import { DocMiniApp } from './utils/api';
import './index.less';
import { getReadDuration } from './utils/getBlockData';
import { colorList, iconList } from './constants/iconAndColor';
import { EditOutlined } from '@ant-design/icons'
import device from "current-device";
import { useHover } from './hooks/useHover';
import { Tooltip, ConfigProvider } from 'antd'
import { createEditor } from 'slate';
import { PreviewEditor } from './Component/PreviewEditor';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { formatI18NText } from './utils/formatI18NText';
import { withInlines } from './utils/withInlines';
import { useDocRef } from './hooks/useDocRef';
import { useEditable } from './hooks/useEditable';
import {  ThemeContext } from './Component/Theme';
import { I18NContext } from './Component/I18nProvider';
import { getAntTheme, t } from './utils';
import { TEMPLATE_TYPE } from './constants/type';

interface IRecordData {
  isTemplate: boolean;
  templateType: string;
  iconType: string;
  colorType: string;
  value: any[];
  meta: PageMeta;
}
export const saveData = async (data: IRecordData) =>
  DocMiniApp.Interaction.setData({
    type: InteractionChangesetType.REPLACE,
    data: {
      path: [],
      value: { ...data }
    }
  });

export default () => {
  const [data, updateData] = useState<IRecordData>();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [readDuration, setReadDuration] = useState<any>();
  const editRef = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const lang = useContext(I18NContext);
  const docRef = useDocRef();
  const editable = useEditable(docRef);
  const visible = useHover(editRef.current);

  const editor = useMemo(() => withInlines(withHistory(withReact(createEditor()))), []);

  const getTemplateList = useCallback((meta: PageMeta, readDuration: number | undefined) => {
    const date = new Date();
    const dateNow = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    return [
      {
        type: TEMPLATE_TYPE.templateOne,
        label: t('ViewData_Settings_templateOne_value', lang),
        templateKey: { WordCount: meta?.word_count, EstRead: readDuration },
        iconType: iconList[1].type,
        colorType: colorList[3].type
      },
      {
        type: TEMPLATE_TYPE.templateTwo,
        label: t('ViewData_Settings_templateTwo_value', lang),
        templateKey: { Date: dateNow, VisitorCount: meta?.uv },
        iconType: iconList[4].type,
        colorType: colorList[1].type
      }
    ];
  }, []);

  const handleDataChange = useCallback(
    (recordData: any) => {
      if (!recordData || Object.getOwnPropertyNames(recordData).length === 0) {
        return;
      }

      const { templateType, isTemplate, iconType, colorType, value, meta } = recordData;
      editor.children = value;
      const newData = {
        isTemplate,
        templateType,
        iconType,
        colorType,
        value,
        meta
      };
      updateData(newData);
    },
    [editor, updateData]
  );

  const handleDocChange = async () => {
    // 两秒触发一次
    if (!data || !docRef) {
      return;
    }

    const meta = await DocMiniApp.Document.getPageMeta(docRef);
    const _readDuration = await getReadDuration(docRef, meta);
    _readDuration && setReadDuration(_readDuration);
    const newData = {
      ...data,
      meta
    };
    saveData(newData);
  };

  useEffect(() => {
    if (!docRef) {
      return;
    }

    DocMiniApp.Interaction.getData()
      .then(async (recordData: any) => {
        await DocMiniApp.Interaction.onDataChange(handleDataChange);
        const meta = await DocMiniApp.Document.getPageMeta(docRef);
        const _readDuration = await getReadDuration(docRef, meta);
        await DocMiniApp.Service.User.login();
        const _userInfo = await DocMiniApp.Service.User.getUserInfo();
        setUserInfo(_userInfo);
        setReadDuration(_readDuration);

        if (recordData && Object.keys(recordData).length) {
          await saveData({ ...recordData, meta }); // 同步远端数据,更新meta
          return;
        }

        const templateList = getTemplateList(meta, _readDuration);
        const initValue = formatI18NText(templateList[0].label, templateList[0].templateKey);
        // 填入默认的本地数据
        await saveData({
          isTemplate: true,
          templateType: templateList[0].type,
          iconType: iconList[1].type,
          colorType: colorList[3].type,
          value: initValue,
          meta
        });
      })
      .then(async () => {
        await DocMiniApp.LifeCycle.notifyAppReady();
      })
      .catch(error => {
        console.error('[page-viewers]', error);
      });
    return () => {
      DocMiniApp.Interaction.offDataChange(handleDataChange);
    };
  }, [docRef, handleDataChange]);

  useEffect(() => {
    if (!docRef) {
      return;
    }

    DocMiniApp.Events.onDocumentChange(docRef, handleDocChange);

    return () => {
      DocMiniApp.Events.offDocumentChange(docRef, handleDocChange);
    };
  }, [data, docRef]);

  const getColor = useCallback(() => {
    if (!data) {
      return;
    }
    let iconColor = '';
    colorList.map(value => {
      if (value.type === data.colorType) {
        iconColor = value.iconColor;
      }
    });
    return iconColor;
  }, [data]);
  const getBgColor = useCallback(() => {
    if (!data) {
      return '';
    }
    let bgColor = '';
    colorList.map(value => {
      if (value.type === data.colorType) {
        bgColor = value.bgColor;
      }
    });
    return bgColor;
  }, [data]);

  useEffect(() => {
    // 高度自适应
    const observer = new ResizeObserver(() => {
      DocMiniApp.Bridge.updateHeight();
    });
    const root = document.getElementById('root');
    root && observer.observe(root);
    return () => {
      observer.disconnect();
    };
  }, []);

  const handlePopUp = useCallback(async () => {
    if (!data) {
      return;
    }
    const result = await DocMiniApp.View.Action.showPopup({
      style: {
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.55)'
      },
      data: {
        meta: data.meta,
        docRef,
        userInfo,
        iconType: data.iconType,
        colorType: data.colorType,
        isTemplate: data.isTemplate,
        templateType: data.templateType,
        value: data.value
      }
    });
    if (!result.data || Object.getOwnPropertyNames(result.data).length === 0) {
      return;
    }
    const { templateType, isTemplate: newIsTemplate, iconType, colorType, value, pageMeta } = result.data;
    editor.children = value;
    saveData({
      isTemplate: newIsTemplate,
      templateType,
      iconType,
      colorType,
      value,
      meta: pageMeta
    });
  }, [userInfo, docRef, data]);

  if (!data || !data.value || !data.meta) {
    return null;
  }

  return (
    <ConfigProvider theme={{ algorithm: getAntTheme(theme) }}>
      <div
        id="content-container"
        className="content-container"
        style={{ background: getBgColor(), color: 'var(--text-title)' }}
      >
        {data.iconType !== 'ban' ? (
          <div className="icon-content" style={{ color: getColor() }}>
            {iconList.map(({ type, icon }) => {
              if (type === data.iconType) {
                return icon;
              }
            })}
          </div>
        ) : null}
        <div className="preview-content-container">
          <PreviewEditor
            editor={editor}
            value={data.value}
            pageMeta={data.meta}
            userInfo={userInfo}
            readDuration={readDuration}
            colorType={data.colorType}
          />
        </div>
        {editable && !device.mobile() ? (
          <Tooltip title={t('ViewData_Settings_Setting', lang)} placement="left">
            <div className="icon-content edit" ref={editRef}>
              <EditOutlined className="edit" onClick={handlePopUp} style={{ opacity: visible ? 1 : 0 }} />
            </div>
          </Tooltip>
        ) : null}
      </div>
    </ConfigProvider>
  );
};
