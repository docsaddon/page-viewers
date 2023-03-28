import React, { useRef, useState } from 'react';
import { Dropdown, Menu } from 'antd';
import './index.less';
import { iconList } from '../../constants/iconAndColor';
import { DownOutlined } from '@ant-design/icons';

export default (props: { iconType: string; setIconType: React.Dispatch<any> }) => {
  const { iconType, setIconType } = props;
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
    setIconType(info.key);
  };

  const menulist = () => (
    // todo css 样式不生效
    <Menu className="icon-item-container" onClick={onClick}>
      {iconList.map(({ icon, type }) => {
        const active = type === iconType;
        return (
          <Menu.Item className={`icon-item ${active && 'active'}`} key={type}>
            {icon}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  return (
    // menulist()
    <Dropdown dropdownRender={menulist} placement="bottom" onOpenChange={onVisibleChange} open={visible}>
      <div className="icon">
        <div className="icon-content" style={{ color: 'var(--icon-n2)' }}>
          {iconList.map(({ icon, type }) => {
            const active = type === iconType;
            return active ? icon : null;
          })}
        </div>
        <DownOutlined style={{ fontSize: 12, color: 'var(--icon-n3)' }} className="downblod" />
      </div>
    </Dropdown>
  );
};
