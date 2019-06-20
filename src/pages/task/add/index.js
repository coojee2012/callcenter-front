import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Button, Upload, Icon, Form, Spin, Input, Cascader, DatePicker,
} from 'antd';
import router from 'umi/router';
import { findItemByKey } from '@/utils/common';
import { EXCEL_MODEL, FORM_ITEM_LAYOUT, FORM_BTN_LAYOUT } from '@/utils/constant';
import ModalBar from '@/components/ModalBar';
import TaskTypeItemsList from '../components/TaskTypeItemsList';
import TaskPramas from '@/components/TaskPramas';
import styles from './index.less';

const { TextArea } = Input;

// 新增任务Page
@connect(({ loading, taskActions }) => ({
  addPageLoading: loading.effects['taskActions/loadAddPage'],
  addTaskLoading: loading.effects['taskActions/addTask'],
  taskTypeList: taskActions.taskTypeList,
  useableProjs: taskActions.useableProjs,
  nameList: taskActions.nameList,
  showModal: taskActions.showModal,
  taskTypePramas: taskActions.taskTypePramas,
  showTypeParam: taskActions.showTypeParam,
}))
@Form.create()
class AddTask extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      fileList: [],
      typePramaValues: [],
      taskTypeValue: '',
      taskTypeName: '',
      rosterId: '',
      modelFile: '',
    });
    this.setTypePrams = this.setTypePrams.bind(this);
  }

  componentWillMount() {
    const { dispatch, location } = this.props;
    const { projCode } = location.query;
    dispatch({
      type: 'taskActions/loadAddPage',
      projectCode: projCode,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { useableProjs, location, form, taskTypeList } = this.props;
    const useableProjsPre = prevProps.useableProjs;
    const { projCode } = location.query;
    if (projCode && useableProjs.length > 0 && useableProjsPre.length === 0) {
      console.log('useable projet is get over....when did update');
      const o = findItemByKey(useableProjs, 'projectCode', projCode);
      if (o) {
        const { businessCode } = o;
        const { setFieldsInitialValue } = form;
        const taskType = findItemByKey(taskTypeList, 'businessCode', businessCode);
        const taskTypeName = taskType ? taskType.typeName : '';
        setFieldsInitialValue({ taskTypeName });
      }
    }
  }

  setTypePrams(value) {
    this.setState({
      typePramaValues: value || [],
    });
  }

  toBack = () => {
    router.push('/task');
  };

  downloadModel = () => {
    const { modelFile } = this.state;
    window.open(modelFile);
  };

  // model确认
  handleOk = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'taskActions/closeModel',
    });
    this.toBack();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, taskTypeList } = this.props;
    const { typePramaValues, rosterId, taskTypeValue } = this.state;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        let businessCode = '';
        taskTypeList.forEach((item) => {
          if (item.typeName === values.taskTypeName) {
            ({ businessCode } = item);
          }
        });

        dispatch({
          type: 'taskActions/addTask',
          data: {
            businessCode: taskTypeValue || businessCode,
            rosterId,
            projectCode: values.projectCode[0],
            taskName: values.taskName,
            startTime: values.startTime ? values.startTime.format('YYYY-MM-DD') : '',
            endTime: values.endTime ? values.endTime.format('YYYY-MM-DD') : '',
            remark: values.remark,
            typePramaValues,
          },
        });
      } else {
        console.log('输入有误');
      }
    });
  };

  onCascaderChange = (value) => {
    const { useableProjs, taskTypeList, dispatch } = this.props;
    const o = findItemByKey(useableProjs, 'projectCode', value[0]);
    if (o) {
      const { businessCode } = o;
      const taskType = findItemByKey(taskTypeList, 'businessCode', businessCode);
      const taskTypeName = taskType ? taskType.typeName : '';
      dispatch({
        type: 'taskActions/getNameLists',
        businessCode,
      });
      this.setState({
        taskTypeValue: businessCode,
        taskTypeName,
      });
      this.props.form.setFieldsValue({ taskTypeName });
    }
  };

  onNameCascaderChange = (value) => {
    this.setState({
      rosterId: value[0],
    });
  };

  render() {
    const { fileList } = this.state;
    const {
      addPageLoading, addTaskLoading, taskTypeList, showModal, showTypeParam,
      useableProjs, location, nameList,
    } = this.props;
    const { projCode } = location.query;
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
    const typeList = TaskTypeItemsList(taskTypeList !== undefined ? taskTypeList : []);

    return (
      <div className={styles.main}>
        <Spin
          tip='正在加载...'
          spinning={addPageLoading}
        >
          <Form
            onSubmit={this.handleSubmit}
            className={styles.form}
          >
            <Form.Item
              {...FORM_ITEM_LAYOUT}
              label='所属项目：'
            >
              {getFieldDecorator('projectCode', {
                rules: [{ required: true, message: '请选择所属项目!' }],
                initialValue: projCode ? [projCode] : [],
              })(
                <Cascader
                  allowClear={false}
                  options={useableProjs}
                  fieldNames={{ label: 'projectName', value: 'projectCode', children: 'items' }}
                  onChange={this.onCascaderChange}
                  placeholder='请选择所属项目'
                />,
              )}
            </Form.Item>
            <Form.Item
              {...FORM_ITEM_LAYOUT}
              label='业务类型：'
            >
              {getFieldDecorator('taskTypeName', {
                rules: [{ required: true, message: '请设置业务类型!' }],
              })(
                <Input disabled placeholder='请设置业务类型' />,
              )}
            </Form.Item>
            <Form.Item
              {...FORM_ITEM_LAYOUT}
              label='任务名称：'
            >
              {getFieldDecorator('taskName', {
                rules: [{ required: true, message: '请输任务名称!' }],
              })(
                <Input placeholder='请输入任务名称' />,
              )}
            </Form.Item>
            {showTypeParam && (
              <Form.Item
                {...FORM_ITEM_LAYOUT}
                label='业务参数：'
              >
                <TaskPramas setTypePrams={this.setTypePrams} />
              </Form.Item>
            )}
            <Form.Item
              {...FORM_ITEM_LAYOUT}
              label='任务名单：'
            >
              {getFieldDecorator('rosterId', {
                rules: [{ required: true, message: '请选择一份任务名单!' }],
              })(
                <Cascader
                  allowClear={false}
                  options={nameList.list}
                  fieldNames={{ label: 'rosterName', value: 'rosterId', children: 'items' }}
                  onChange={this.onNameCascaderChange}
                  placeholder='选择一份任务名单'
                />,
              )}
            </Form.Item>
            <Form.Item
              {...FORM_ITEM_LAYOUT}
              label='开始时间：'
            >
              {getFieldDecorator('startTime', {
                rules: [{ required: false }],
              })(
                <DatePicker />,
              )}
            </Form.Item>
            <Form.Item
              {...FORM_ITEM_LAYOUT}
              label='结束时间：'
            >
              {getFieldDecorator('endTime', {
                rules: [{ required: false }],
              })(
                <DatePicker />,
              )}
            </Form.Item>
            <Form.Item
              {...FORM_ITEM_LAYOUT}
              label='任务说明：'
            >
              {getFieldDecorator('remark', {
                rules: [{ required: false }],
              })(
                <TextArea
                  placeholder='请输入任务描述或者其他信息'
                  autosize={{ minRows: 2, maxRows: 6 }}
                />,
              )}
            </Form.Item>
            <Form.Item
              {...FORM_BTN_LAYOUT}
              className={styles.btn_group}
            >
              <Button type='primary' htmlType='submit' style={{ marginRight: 50 }} loading={addTaskLoading}>
                提交审核
              </Button>
              <Button onClick={this.toBack}>返  回</Button>
            </Form.Item>
          </Form>
        </Spin>
        <ModalBar loading={showModal} title='成功' backText='返回' text='新建任务成功！' handleOk={this.handleOk} />
      </div>
    );
  }
}

export default AddTask;
