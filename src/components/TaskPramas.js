/* eslint-disable space-before-blocks */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Button, Row, Col, Radio,
} from 'antd';

import styles from './TaskPramas.less';

@connect(({ taskActions }) => ({
  taskTypePramas: taskActions.taskTypePramas,
}))
class TaskParamsComponent extends Component {
    state = {
      value: [],
    }

    componentWillMount() {
      const taskTypePramas = this.props.taskTypePramas || [];
      const { value } = this.state;
      taskTypePramas.forEach((element, index) => {
        switch (element.paramType) {
        // 单选
          case 1: {
            value[index] = { paramId: element.paramId, value: element.options[0].value, label: element.options[0].label };
            break;
          }
          // 多选
          case 2: {
            value[index] = { paramId: element.paramId };
            break;
          }
          // 下拉
          case 3: {
            value[index] = { paramId: element.paramId };
            break;
          }
          // 文本
          case 4: {
            value[index] = { paramId: element.paramId };
            break;
          }
          default: {
            value[index] = { paramId: element.paramId };
            break;
          }
        }
      });
      this.setState({
        value,
      });
      const { setTypePrams } = this.props;
      setTypePrams(value);
    }

    onChange(element, index, e){
      const { value } = this.state;
      const { setTypePrams } = this.props;
      switch (element.paramType) {
        // 单选
        case 1: {
          const { options } = element;
          let lable = '';
          options.forEach((item) => {
            if (item.value === e.target.value){
              lable = item.label;
            }
          });
          value[index] = { paramId: element.paramId, value: e.target.value, label: lable };
          break;
        }
        // 多选
        case 2: {
          value[index] = { paramId: element.paramId, value: e.target.value, label: '' };
          break;
        }
        // 下拉
        case 3: {
          value[index] = { paramId: element.paramId, value: e.target.value, label: '' };
          break;
        }
        // 文本
        case 4: {
          value[index] = { paramId: element.paramId, value: e.target.value, label: '' };
          break;
        }
        default: {
          value[index] = { paramId: element.paramId, value: e.target.value, label: '' };
          break;
        }
      }
      this.setState({
        value,
      });
      setTypePrams(value);
    }

    render(){
      const taskTypePramas = this.props.taskTypePramas || [];
      const doms = [];
      const ArraysDoms = () => doms;
      const RadioGroup = Radio.Group;
      if (taskTypePramas.length < 1) {
        doms.push(<Col key='1' span={8}> 无</Col>);
      } else {
        taskTypePramas.forEach((element, index) => {
          switch (element.paramType) {
            // 单选
            case 1: {
              const options = element.options || [];
              const optionEls = [];
              options.forEach((item) => {
                optionEls.push(<Radio value={item.value}>{item.label}</Radio>);
              });
              const OptionEls = () => optionEls;

              doms.push(
                <>
                  <Col span={8}> { element.paramName }:</Col>
                  <Col span={16}>
                    <RadioGroup onChange={e => this.onChange(element, index, e)} value={this.state.value[index].value}>
                      <OptionEls />
                    </RadioGroup>
                  </Col>
                </>,
              );
              break;
            }
            // 多选
            case 2: {
              // TODO
              break;
            }
            // 下拉
            case 3: {
              // TODO
              break;
            }
            // 文本
            case 4: {
              // TODO
              break;
            }
            default: {
              break;
            }
          }
        });
      }
      return (
        <Row> <ArraysDoms /> </Row>
      );
    }
}

export default TaskParamsComponent;
