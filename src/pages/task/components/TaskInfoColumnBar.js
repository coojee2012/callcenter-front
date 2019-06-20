import React from 'react';

/**
bankCardFourNumber: "7890" 卡号后四位
billAmount: "500" 账单金额
createOper: "liny"
createOperId: 76
createTime: ""
dueDate: "2019年03月11日" 到期还款日
firstName: "林"
gender: "男"
lastName: "勇"
lateCharge: "11" 滞纳金
minimalPaymentAmount: "400" 最低还款金额
mobileNo: "15308098290" 联系电话
orgName: "大洋银行"
overdueAmount: "300" 逾期金额
overdueDate: "2019年01月02日" 逾期金额截止日
overdueInterest: "80" 逾期利息
screeningDate: "2019年03月11日" 筛选日期
statementDate: "2019年03月03日" 账单日
*/

export default [
  {
    title: '姓名',
    key: 'firstName',
    render: (text, record) => {
      /** @namespace record.callId */
      /** @namespace record.recordFile */
      return (
        <span>{ record.firstName + record.lastName}</span>
      );
    },
  },
  {
    title: '客户编号',
    dataIndex: 'customerId',
    key: 'customerId',
  },
  {
    title: '联系电话',
    dataIndex: 'mobileNo',
    key: 'mobileNo',
  },
  {
    title: '性别',
    dataIndex: 'gender',
    key: 'gender',
  },
  {
    title: '卡号后四位',
    dataIndex: 'bankCardFourNumber',
    key: 'bankCardFourNumber',
  },
  {
    title: '逾期金额',
    dataIndex: 'overdueAmount',
    key: 'overdueAmount',
  },
  {
    title: '逾期利息',
    dataIndex: 'overdueInterest',
    key: 'overdueInterest',
  },
  {
    title: '逾期金额截止日',
    dataIndex: 'overdueDate',
    key: 'overdueDate',
  },
  {
    title: '账单金额',
    dataIndex: 'billAmount',
    key: 'billAmount',
  },
  {
    title: '账单日',
    dataIndex: 'statementDate',
    key: 'statementDate',
  },
  {
    title: '到期还款日',
    dataIndex: 'dueDate',
    key: 'dueDate',
  },
  {
    title: '最低还款金额',
    dataIndex: 'minimalPaymentAmount',
    key: 'minimalPaymentAmount',
  },
  {
    title: '滞纳金',
    dataIndex: 'lateCharge',
    key: 'lateCharge',
  },
];
