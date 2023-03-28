import React, { useCallback, useEffect, useState, useContext } from 'react';
import { Dropdown, Menu } from 'antd';
import { PlusCircleOutlined, CloseOutlined  } from '@ant-design/icons'
import './index.less';
import IconEditor from '../IconEditor';
import ColorEditor from '../ColorEditor';
import { Editable } from 'slate-react';
import * as SlateReact from 'slate-react';
import { Transforms, Editor, Range, Descendant } from 'slate';
import { I18NContext } from '../I18nProvider';
import { t } from '../../utils'


export default (props: {
  editor: SlateReact.ReactEditor;
  editor2: SlateReact.ReactEditor;
  value: Descendant[];
  setValue: React.Dispatch<any>;
  iconType: string;
  setIconType: React.Dispatch<any>;
  colorType: string;
  setColorType: React.Dispatch<any>;
}) => {
  const [isFocus, setIsFocus] = useState(true);
  const lang = useContext(I18NContext);
  const { editor, editor2, iconType, value, setValue, setIconType, colorType, setColorType } = props;
  const PageDataList = [
    { type: 'WordCount', value: t('ViewData_Settings_References_WordCount_Menu', lang)},
    { type: 'EstRead', value: t('ViewData_Settings_References_EstRead_Menu', lang) },
    { type: 'VisitorRank', value: t('ViewData_Settings_References_VisitorRank_Menu', lang) },
    {
      type: 'VisitorCount',
      value: t('ViewData_Settings_References_VisitorCount_Menu', lang)
    },
    { type: 'VisitorName', value: t('ViewData_Settings_References_VisitorName_Menu', lang) },
    { type: 'Date', value: t('ViewData_Settings_References_Date_Menu', lang) }
  ];
  const getContent = type => {
    let content = null;
    PageDataList.map(item => {
      if (item.type === type) {
        content = item.value;
      }
    });
    return content;
  };
  const EditableButtonComponent = ({ attributes, children, element }) => {
    const path = SlateReact.ReactEditor.findPath(editor, element);
    const content = getContent(element.type);
    console.log('===content==', content);
    return (
      <span {...attributes} onClick={ev => ev.preventDefault()} className="close" contentEditable={false}>
        <span className="content-wrapper">{content}</span>
        <span className="icon-wrapper" onClick={() => deleteButton(editor, path)}>
          {children}
          <CloseOutlined style={{ fontSize: 12 }} />
        </span>
      </span>
    );
  };

  const Element = (props: any) => {
    const { attributes, children, element } = props;
    switch (element.type) {
      case 'WordCount':
      case 'EstRead':
      case 'VisitorRank':
      case 'VisitorCount':
      case 'VisitorName':
      case 'Date':
        return <EditableButtonComponent {...props} />;
      default:
        return <div {...attributes}>{children}</div>;
    }
  };

  const handleChange = useCallback(
    (value: Descendant[]) => {
      if (typeof value === 'undefined') {
        return;
      }
      editor2.children = value;
      setValue(value);
    },
    [editor2]
  );

  const insertButton = (editor: any, type: string) => {
    // if(!isFocus) return;
    const { selection } = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);
    if (!isCollapsed) {
      return;
    }
    const button = {
      type,
      children: [{ text: '' }]
    };
    Transforms.insertNodes(editor, button);
    const nextNode = Editor.next(editor);
    console.log('nextNode', editor, nextNode);

    if (nextNode) {
      Transforms.setSelection(editor, {
        anchor: { path: nextNode[1], offset: 0 },
        focus: { path: nextNode[1], offset: 0 }
      });
    }
  };

  const deleteButton = (editor: any, path: any) => {
    Transforms.removeNodes(editor, {
      at: path
    });
  };

  const onClick = (info: any) => {
    const { key } = info;
    const listA = PageDataList.filter(({ type }) => key === type);
    insertButton(editor, listA[0].type);
    // 传入
  };

  const menu = () => (
    <Menu style={{ padding: '3px 1px' }} onClick={onClick} onMouseDown={e => e.preventDefault()}>
      <Menu.ItemGroup title={t('ViewData_Settings_Dynamic_Data', lang)}>
        {PageDataList.map(({ type, value }) => (
          <Menu.Item className="PageDataItem" key={type}>
            {value}
          </Menu.Item>
        ))}
      </Menu.ItemGroup>
    </Menu>
  );

  useEffect(() => {
    const endPoint = Editor.end(editor, []);
    const newPath = endPoint.path;

    Transforms.deselect(editor);

    setTimeout(() => {
      Transforms.select(editor, {
        anchor: { path: newPath, offset: endPoint.offset },
        focus: { path: newPath, offset: endPoint.offset }
      });
    }, 10);
  }, [editor]);

  return (
    <div className="editor-container">
      <div className={`content-editor-container ${isFocus && 'focus'}`}>
        <SlateReact.Slate editor={editor} value={value} onChange={value => handleChange(value)}>
          <Editable
            className="input-container"
            renderElement={props => <Element {...props} />}
            autoFocus
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          />
          <div className="add-wrapper">
            <Dropdown dropdownRender={menu} placement="bottomRight">
              <div className="add-container">
                <PlusCircleOutlined className="add" style={{ fontSize: 16 }} />
              </div>
            </Dropdown>
          </div>
        </SlateReact.Slate>
      </div>
      <div className="icon-color-container">
        <div className="color-container">
          <div className="color-header">{t('ViewData_Settings_Theme', lang)}</div>
          <ColorEditor colorType={colorType} setColorType={setColorType} />
        </div>
        <div className="icon-container">
          <div className="icon-header">{t('ViewData_Settings_Icon', lang)}</div>
          <IconEditor iconType={iconType} setIconType={setIconType} />
        </div>
      </div>
    </div>
  );
};
