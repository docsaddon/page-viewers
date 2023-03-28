import { useCallback } from 'react';
import { Editable } from 'slate-react';
import * as SlateReact from 'slate-react';
import { colorList } from '../../constants/iconAndColor';
import { Descendant } from 'slate';
import { PageMeta, UserInfo } from '@lark-opdev/block-docs-addon-api';

interface IProps {
  editor: SlateReact.ReactEditor;
  value: Descendant[];
  pageMeta?: PageMeta;
  userInfo?: UserInfo;
  readDuration?: number;
  colorType?: string;
}

export const PreviewEditor = (props: IProps) => {
  const { editor, value, pageMeta, readDuration, userInfo, colorType } = props;

  const getContent = useCallback(
    (type: string) => {
      if (!pageMeta || typeof readDuration === 'undefined') {
        return '';
      }
      const date = new Date();
      const dateNow = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      switch (type) {
        case 'WordCount': // 文档字数
          return pageMeta.word_count;
          break;
        case 'EstRead': // 阅读时长
          return readDuration;
          break;
        case 'VisitorRank': // 访问排序
          return pageMeta.pv;
          break;
        case 'VisitorCount': // 访问人数
          return pageMeta.uv;
          break;
        case 'VisitorName': // 访客名
          return userInfo?.nickName;
          break;
        case 'Date': // 当前日期
          return dateNow;
          break;
        default:
          return '';
      }
    },
    [pageMeta, readDuration, userInfo]
  );

  const getColor = useCallback(() => {
    let iconColor = '';
    colorList.map(value => {
      if (value.type === colorType) {
        iconColor = value.iconColor;
      }
    });
    return iconColor;
  }, [colorType]);

  const EditableButtonComponent = ({ attributes, element }) => {
    const content = getContent(element.type);
    const color = getColor();
    return (
      <span
        {...attributes}
        onClick={ev => ev.preventDefault()}
        className="close"
        style={{ color }}
        contentEditable={false}
      >
        <span>{content}</span>
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

  return (
    <>
      <SlateReact.Slate editor={editor} value={value}>
        <Editable className="preview" renderElement={props => <Element {...props} />} readOnly />
      </SlateReact.Slate>
    </>
  );
};
