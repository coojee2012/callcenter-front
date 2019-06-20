import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Button, Upload, Icon, Form, Spin, Input, Cascader, DatePicker, message,
} from 'antd';
import router from 'umi/router';
import ModalBar from '@/components/ModalBar';
import { FORM_ITEM_LAYOUT, FORM_BTN_LAYOUT } from '@/utils/constant';
import ProjBusinessPramas from '@/components/ProjBusinessPramas';
import { createBreadcrumbs } from '@/components/Breakcrumbs';
import styles from './index.less';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
// 新增Page
@connect(({ loading, projActions }) => ({
  taskTypeList: projActions.taskTypeList,
  showAddModal: projActions.showAddModal,
  businessPramas: projActions.businessPramas,
  showBussinessParam: projActions.showBussinessParam,
}))
@Form.create()
class AddProj extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      fileList: [],
      businessPramaValues: [],
    });
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'projActions/loadAddPage',
    });
  }


  setTypePrams(value) {
    this.setState({
      businessPramaValues: value || [],
    });
  }

  toBack = () => {
    router.push('/proj');
  };

  // model确认
  handleOk = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'projActions/closeModel',
    });
    this.toBack();
  };

    handleSubmit = (e) => {
      e.preventDefault();
      const { dispatch } = this.props;
      const { businessPramaValues } = this.state;

      this.props.form.validateFields((err, values) => {
        if (!err) {
          const { fileList } = this.state;
          let startTime = '';
          let endTime = '';
          if (values.predictTime && values.predictTime.length) {
            startTime = values.predictTime[0].format('YYYY-MM-DD 00:00:00');
            endTime = values.predictTime[1].format('YYYY-MM-DD 23:59:59');
          }

          dispatch({
            type: 'projActions/addProj',
            data: {
              businessCode: values.businessCode[0],
              projectName: values.projName,
              startTime,
              endTime,
              remark: values.remark,
              businessPramaValues,
            },
          });
        } else {
          message.error('输入有误');
        }
      });
    };

    onCascaderChange = (value) => {
      const { dispatch, taskTypeList } = this.props;
      const businessCode = value[0];
      let businessTypeId;
      taskTypeList.forEach((item) => {
        if (item.businessCode === businessCode) {
          businessTypeId = item.id;
        }
      });
      dispatch({
        type: 'projActions/getBusinessPramas',
        businessTypeId,
      });
    };

    render() {
      const Breadcrumb = createBreadcrumbs();
      const { fileList } = this.state;
      const { showAddModal, taskTypeList = [], showBussinessParam, businessPramas } = this.props;
      const typeList = taskTypeList;
      const { getFieldDecorator } = this.props.form;

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
                label='项目名称：'
              >
                {getFieldDecorator('projName', {
                  rules: [{ required: true, message: '请输项目名称!' }],
                })(
                  <Input placeholder='请输入项目名称'/>,
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
              { showBussinessParam && (
                <Form.Item
                  {...FORM_ITEM_LAYOUT}
                  label='项目参数：'
                >
                  <ProjBusinessPramas businessPramas={businessPramas} setTypePrams={(value) => { this.setTypePrams(value); }}/>
                </Form.Item>
              )}
              <Form.Item
                {...FORM_ITEM_LAYOUT}
                label='预计起止时间：'
              >
                {getFieldDecorator('predictTime', {
                  rules: [{ required: false }],
                })(
                  <RangePicker />,
                )}
              </Form.Item>

              <Form.Item
                {...FORM_ITEM_LAYOUT}
                label='项目说明：'
              >
                {getFieldDecorator('remark', {
                  rules: [{ required: false }],
                })(
                  <TextArea
                    placeholder='请输入项目描述或者其他信息'
                    autosize={{ minRows: 2, maxRows: 6 }}
                  />,
                )}
              </Form.Item>
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

            <ModalBar loading={showAddModal} title='成功' backText='返回' text='新建项目成功！' handleOk={this.handleOk}/>
          </div>
        </div>
      );
    }
}

export default AddProj;
