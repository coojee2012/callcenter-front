import React from 'react';
import { Steps, Popover } from 'antd';

import styles from './StepBar.less';

const { Step } = Steps;

// 进度条鼠标悬停
const customDot = (dot, { status }) => {
  return <Popover content={<span>状态: {status}</span>}>{dot}</Popover>;
};

// 进度条组件
export function createStepBar(data, type) {
  const { current, progress } = data;
  if (type === 'task') {
    return (
      <Steps progressDot={customDot} current={current} className={styles.main}>
        {progress.map((item, index) => (
          <Step
            className={styles.pro_item}
            key={index}
            title={item.title}
            description={item.description}
          />
        ))}
      </Steps>
    );
  } else {
    return (
      <Steps current={current} className={styles.main}>
        {progress.map((item, index) => (
          <Step
            className={styles.pro_item}
            key={index}
            title={item.title}
            description={item.description}
          />
        ))}
      </Steps>
    );
  }
}
