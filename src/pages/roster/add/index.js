import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Button, Upload, Icon, Form, Spin, Input, Cascader, DatePicker, message,
  Radio,
} from 'antd';
import router from 'umi/router';
import ModalBar from '@/components/ModalBar';
import { FORM_ITEM_LAYOUT, FORM_BTN_LAYOUT, BASE_URL } from '@/utils/constant';
import ProjBusinessPramas from '@/components/ProjBusinessPramas';
import { createBreadcrumbs } from '@/components/Breakcrumbs';
import styles from './index.less';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
// 新增Page
@connect(({ loading, rosterActions }) => ({
  taskTypeList: rosterActions.taskTypeList,
  showAddModal: rosterActions.showAddModal,
  rollTemplate: rosterActions.rollTemplate,
  businessPramas: rosterActions.businessPramas,
  showBussinessParam: rosterActions.showBussinessParam,
}))
@Form.create()
class AddRoster extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      fileList: [],
      tempalteValue: -1,
    });
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rosterActions/loadAddPage',
    });
  }

  toBack = () => {
    router.push('/roster');
  };

  downloadModel = () => {
    const { tempalteValue } = this.state;
    const { rollTemplate = [] } = this.props;
    let tempalteId = tempalteValue;
    if (tempalteId === -1) {
      for (let ii = 0; ii < rollTemplate.length; ii++) {
        const element = rollTemplate[ii];
        if (element.rollTemplateId > 1) {
          tempalteId = element.rollTemplateId;
          break;
        }
      }
    }
    if (tempalteId === -1) {
      message.error('错误的模板ID');
    } else {
      window.open(`${BASE_URL}roll/templateCSV?rollTemplateId=${tempalteId}`);
    }
  };

  // model确认
  handleOk = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rosterActions/closeModel',
    });
    this.toBack();
  };

    handleSubmit = (e) => {
      e.preventDefault();
      const { dispatch } = this.props;
      this.props.form.validateFields((err, values) => {
        if (!err) {
          const { fileList } = this.state;
          dispatch({
            type: 'rosterActions/addRoster',
            data: {
              roll: fileList[0],
              businessCode: values.businessCode[0],
              rollTemplateId: values.tempalteId,
              rosterName: values.rosterName,
              // remark: values.remark,
            },
          });
        } else {
          message.info('表单数据有误，请重新核实！');
        }
      });
    };

    onTemplateSelect = (e) => {
      console.log('radio checked', e.target.value);
      this.setState({
        tempalteValue: e.target.value,
      });
    };

    onCascaderChange = (value) => {
      if (value[0]) {
        const { dispatch } = this.props;
        dispatch({
          type: 'rosterActions/getTemplate',
          businessCode: value[0],
        });
      }
    };

    render() {
      const Breadcrumb = createBreadcrumbs();
      const { fileList } = this.state;
      const { showAddModal, taskTypeList = [], rollTemplate = [] } = this.props;
      const typeList = taskTypeList;
      const { getFieldDecorator } = this.props.form;
      const templateOptions = [
      ];
      let defaultTempalteId = -1;
      if (rollTemplate.length) {
        for (let ii = 0; ii < rollTemplate.length; ii++) {
          const element = rollTemplate[ii];
          if (element.rollTemplateId > 1) {
            templateOptions.push({
              label: element.templateName, value: element.rollTemplateId,
            });
            if (defaultTempalteId === -1) {
              defaultTempalteId = element.rollTemplateId;
            }
          }
        }
      }
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
      return (
        <div>
          <Breadcrumb />
          <div className={styles.main}>
            <Form
              onSubmit={this.handleSubmit}
              className={styles.form}
            >
              <Form.Item
                {...FORM_ITEM_LAYOUT}
                label='名单名称：'
              >
                {getFieldDecorator('rosterName', {
                  rules: [{ required: true, message: '请输入名单名称!' }],
                })(
                  <Input placeholder='请输入名单名称'/>,
                )}
              </Form.Item>
              <Form.Item
                {...FORM_ITEM_LAYOUT}
                label='业务类型：'
              >
                {getFieldDecorator('businessCode', {
                  rules: [{ required: true, message: '请选择业务类型!' }],
                })(
                  <Cascader
                    allowClear={false}
                    options={typeList}
                    fieldNames={{ label: 'typeName', value: 'businessCode', children: 'items' }}
                    onChange={this.onCascaderChange}
                    placeholder='请选择业务类型'
                  />,
                )}
              </Form.Item>
              {rollTemplate.length > 0 && (
                <Form.Item
                  {...FORM_ITEM_LAYOUT}
                  label='名单模板：'
                >
                  {getFieldDecorator('tempalteId', {
                    rules: [{ required: true, message: '请选业务模板!' }],
                    initialValue: defaultTempalteId,
                  })(
                    <RadioGroup options={templateOptions} onChange={this.onTemplateSelect} value={this.state.tempalteValue} />,
                  )}
                  <Button onClick={this.downloadModel} shape='round'>点击下载</Button>

                </Form.Item>
              )}

              {rollTemplate.length > 0 && (
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
              )}


              {/* <Form.Item
                {...FORM_ITEM_LAYOUT}
                label='名单说明：'
              >
                {getFieldDecorator('remark', {
                  rules: [{ required: false }],
                })(
                  <TextArea
                    placeholder='请输入名单描述或者其他信息'
                    autosize={{ minRows: 2, maxRows: 6 }}
                  />,
                )}
              </Form.Item> */}
              <Form.Item
                {...FORM_BTN_LAYOUT}
                className={styles.btn_group}
              >
                <Button type='primary' icon='save' htmlType='submit' style={{ marginRight: 50 }} loading={false}>
                  保存
                </Button>
                <Button icon='left' onClick={this.toBack}>返回</Button>
              </Form.Item>
            </Form>

            <ModalBar loading={showAddModal} title='成功' backText='返回' text='新建名单成功！' handleOk={this.handleOk}/>
          </div>
        </div>
      );
    }
}

export default AddRoster;
