import { 
  StopOutlined,
  RocketFilled,
  NotificationFilled,
  InfoCircleFilled,
  RobotFilled,
  StarFilled,
  PieChartFilled,
  FilterFilled
 } from '@ant-design/icons';

export const iconList = [
  { type: 'ban', icon: <StopOutlined className="icon" style={{ fontSize: 18 }} /> },
  { type: 'start', icon: <RocketFilled className="icon" style={{ fontSize: 18 }} /> },
  { type: 'announce', icon: <NotificationFilled className="icon" style={{ fontSize: 18 }} /> },
  { type: 'info', icon: <InfoCircleFilled className="icon" style={{ fontSize: 18 }} /> },
  { type: 'robot', icon: <RobotFilled className="icon" style={{ fontSize: 18 }} /> },
  {
    type: 'premium',
    icon: <StarFilled className="icon" style={{ fontSize: 18 }} />
  },
  {
    type: 'efficiency',
    icon: <PieChartFilled className="icon" style={{ fontSize: 18 }} />
  },
  { type: 'champion', icon: <FilterFilled className="icon" style={{ fontSize: 18 }} /> }
];
export const colorList = [
  { type: 'red', iconColor: 'var(--R600)', bgColor: 'var(--R50)', previewColor: 'var(--R500)' },
  { type: 'orange', iconColor: 'var(--O600)', bgColor: 'var(--O50)', previewColor: 'var(--O500)' },
  { type: 'yellow', iconColor: 'var(--Y600)', bgColor: 'var(--Y50)', previewColor: 'var(--Y500)' },
  { type: 'green', iconColor: 'var(--G600)', bgColor: 'var(--G50)', previewColor: 'var(--G500)' },
  { type: 'blue', iconColor: 'var(--B600)', bgColor: 'var(--B50)', previewColor: 'var(--B500)' },
  { type: 'purple', iconColor: 'var(--P600)', bgColor: 'var(--P50)', previewColor: 'var(--P500)' }
];
