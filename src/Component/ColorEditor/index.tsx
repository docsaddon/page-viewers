import React, { useRef, useState } from 'react';
import { Dropdown, Menu } from 'antd';
import './index.less';
import { colorList } from '../../constants/iconAndColor';
import { DownOutlined } from '@ant-design/icons'

export default (props: { colorType: string; setColorType: React.Dispatch<any> }) => {
  const { colorType, setColorType } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const currentKey = useRef<string>();
  const onVisibleChange = (state: boolean) => {
    if (!currentKey.current) {
      setVisible(state);
    }
    currentKey.current = undefined;
  };
  const onClick = (info: any) => {
    currentKey.current = info.key;
    setColorType(info.key);
  };

  const menulist = () => (
    // todo css 样式不生效
    <Menu className="color-item-container" onClick={onClick}>
      {colorList.map(({ type, previewColor }) => {
        const active = type === colorType;
        return (
          <Menu.Item className={'color-item'} key={type}>
            <div
              className={`color-item-content ${active && 'active'}`}
              style={{ background: previewColor }}
            />
          </Menu.Item>
        );
      })}
    </Menu>
  );
  

  return (
    // menulist()
    <Dropdown dropdownRender={menulist} placement="bottom" onOpenChange={onVisibleChange} open={visible}>
      <div className="color">
        <div className="color-content">
          {colorList.map(({ type, previewColor }) => {
            const active = type === colorType;
            return active ? (
              <div style={{ background: previewColor, width: 16, height: 16, borderRadius: 4 }} />
            ) : null;
          })}
        </div>
        <DownOutlined style={{ fontSize: 12, color: 'var(--icon-n3)' }} className="downblod" />
      </div>
    </Dropdown>
  );
};
