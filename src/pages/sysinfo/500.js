import React from 'react';

import image from '@/assets/500.png';
import styles from './exception.less';

export default () => {
  return (
    <div className={styles.main}>
      <img alt='' className={styles.image} src={image}/>
    </div>
  );
};
