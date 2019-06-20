import React, { Component } from 'react';
import {
  Button, Modal, Upload, Icon, Form, Spin, Input, message,
} from 'antd';
import { FORM_ITEM_LAYOUT, FORM_BTN_LAYOUT } from '@/utils/constant';

import styles from './ImportNameModal.less';

@Form.create()
class ImportNameModal extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      fileList: [],
      modelFile: '',
    });
  }

  downloadModel = () => {
    const { modelFile } = this.state;
    window.open(modelFile);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, nameCode } = this.props;
    this.props.form.validateFields((err) => {
      if (!err) {
        const { fileList } = this.state;
        dispatch({
          type: 'rosterActions/importNameRecords',
          data: {
            roll: fileList[0],
            rosterCode: nameCode,
          },
        });
      } else {
        message.info('表单数据有误，请重新核实！');
      }
    });
  }

  render() {
    const {
      loading, onCancel, nameCode,
    } = this.props;
    const { fileList } = this.state;
    const { getFieldDecorator } = this.props.form;
    const upProps = {
      onRemove: () => {
        this.setState({
          fileList: [],
        });
      },
      beforeUpload: (file) => {
        this.setState({
          fileList: [file],
        });
        return false;
      },
      fileList,
      // showUploadList: false,
    };
    const importNameLoading = false;
    return (
      <Modal
        title='名单导入'
        visible={loading}
        centered
        onCancel={onCancel}
        footer={null}
      >
        <p>正在为名单：{nameCode},导入数据，请认真核实导入数据的正确有效性。</p>
        <Form
          onSubmit={this.handleSubmit}
          className={styles.form}
        >
          <Form.Item
            {...FORM_ITEM_LAYOUT}
            label='业务模板：'
          >
            <Button onClick={this.downloadModel} shape='round'>点击下载</Button>
          </Form.Item>
          <Form.Item
            {...FORM_ITEM_LAYOUT}
            label='上传名单：'
          >
            {getFieldDecorator('roll', {
              rules: [{ required: true, message: '请上传文件!' }],
            })(
              <Upload {...upProps}>
                <Button shape='round'>
                  <Icon type='upload'/> 点击上传
                </Button>
              </Upload>,
            )}
          </Form.Item>
          <Form.Item
            {...FORM_BTN_LAYOUT}
            className={styles.btn_group}
          >
            <Button type='primary' htmlType='submit' style={{ marginRight: 50 }} loading={importNameLoading}>
                提 交
            </Button>
            <Button onClick={onCancel}>返回</Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default ImportNameModal;
