import React from 'react';

import styles from './FooterBar.less';

// 底部footer图层
export default () => {
  return (
    <div className={styles.footer}>
      <span className={styles.text}>copyright © 2019 哈工大新金融科技(成都)有限公司</span>
    </div>
  );
};
