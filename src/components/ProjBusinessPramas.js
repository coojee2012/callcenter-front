/* eslint-disable space-before-blocks */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Button, Row, Col, Radio,
} from 'antd';

import styles from './TaskPramas.less';

class ProjBusinessParamsComponent extends Component {
    state = {
      value: [],
      businessTypeId: -1,
    }

    componentWillMount() {
      console.log('Proj Params Will Mount......');
      const { businessPramas = [] } = this.props;
      this.SetPramasValue(businessPramas);
    }

    componentDidMount(){
      console.log('Proj Params Did Mount......');
    }

    shouldComponentUpdate(nextProps, nextState){
      // businessTypeId
      const { businessPramas = [] } = this.props;
      const { businessPramas: businessPramasNex = [], loadingBusinessParam } = nextProps;

      const { businessTypeId } = this.state;
      let resetStateValue = false;
      console.log('ProjBusiness shuold Update:', businessPramas, businessPramasNex, businessTypeId);
      if (businessPramasNex.length && businessPramasNex[0].businessTypeId !== businessTypeId && !businessPramas.length){
        resetStateValue = true;
      } else if (businessPramasNex.length && businessPramasNex[0].businessTypeId !== businessTypeId && businessPramasNex[0].businessTypeId !== businessPramas[0].businessTypeId) {
        resetStateValue = true;
      } else if (!businessPramasNex.length && businessPramas.length && businessTypeId !== -1){
        resetStateValue = true;
      }
      if (resetStateValue){
        console.log('==================需要重设');
        this.SetPramasValue(businessPramasNex);
        return false;
      } else if (loadingBusinessParam){
        console.log('==================不需要渲染');
        return false;
      } else {
        return true;
      }
    }

    componentDidUpdate(prevProps){

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

    SetPramasValue(businessPramas){
      const defaultValues = this.props.defaultValues || [];
      const { value } = this.state;
      businessPramas.forEach((element, index) => {
        switch (element.paramType) {
        // 单选
          case 1: {
            value[index] = { paramId: element.paramId, value: element.options[0].value, label: element.options[0].label };
            defaultValues.forEach((item) => {
              if (item.paramId === element.paramId){
                value[index] = { paramId: element.paramId, value: item.value, label: item.label };
              }
            });
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
      const { setTypePrams } = this.props;
      if (businessPramas.length){
        this.setState({
          value,
          businessTypeId: businessPramas[0].businessTypeId,
        });
        setTypePrams(value);
      } else {
        this.setState({
          value: [],
          businessTypeId: -1,
        });
        setTypePrams([]);
      }
    }

    render(){
      console.log('render ProjParams......');
      const businessPramas = this.props.businessPramas || [];
      const doms = [];
      const ArraysDoms = () => doms;
      const RadioGroup = Radio.Group;
      const values = this.state.value;
      if (businessPramas.length < 1) {
        doms.push(<Col key='1' span={8}> 无</Col>);
      } else {
        businessPramas.forEach((element, index) => {
          switch (element.paramType) {
            // 单选
            case 1: {
              const options = element.options || [];
              const optionEls = [];
              options.forEach((item) => {
                optionEls.push(<Radio value={item.value} key={item.value}>{item.label}</Radio>);
              });
              const OptionEls = () => optionEls;

              doms.push(
                <>
                  <Col span={8}> { element.paramName }:</Col>
                  <Col span={16}>
                    <RadioGroup onChange={e => this.onChange(element, index, e)} value={values[index].value}>
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

export default ProjBusinessParamsComponent;
