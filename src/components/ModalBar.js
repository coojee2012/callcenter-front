import React from 'react';
import { Button, Modal } from 'antd';

export default (props) => {
  const {
    loading, title, backText, text, handleOk, width, extText,
  } = props;
  return (
    <Modal
      width={width}
      title={title}
      visible={loading}
      centered
      onCancel={handleOk}
      footer={[
        <Button
          onClick={handleOk}
          key='1'
        >
          {backText}
        </Button>,
      ]}
    >
      {text}
      {extText}
    </Modal>
  );
};
