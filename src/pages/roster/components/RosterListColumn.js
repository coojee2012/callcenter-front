import React from 'react';
import { Divider, Modal } from 'antd';
import Moment from 'moment';
import router from 'umi/router';

const { confirm } = Modal;
// 列表表头组件
export default (props) => {
  const SetBusinessName = (code) => {
    const { taskTypeList } = props;
    let name = '';
    taskTypeList.forEach((item) => {
      if (item.businessCode === code) {
        name = item.typeName;
      }
    });
    return name;
  };

  const openImportModal = (rosterCode) => {
    const { dispatch } = props;
    dispatch({
      type: 'rosterActions/openImportModel',
      importNameCode: rosterCode,
    });
  };

  const showDeleteConfirm = (rosterId) => {
    const { dispatch } = props;
    confirm({
      title: '确认要删除该名单吗?',
      content: '名单删除将会删除该名单下的所有记录，不可在恢复。',
      okText: '我要删除',
      okType: 'danger',
      cancelText: '不删除了',
      onOk() {
        dispatch({
          type: 'rosterActions/delRoster',
          rosterId,
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return [
    // {
    //   title: '名单编号',
    //   dataIndex: 'rosterId',
    //   key: 'rosterId',
    // },
    {
      title: '名单名称',
      dataIndex: 'rosterName',
      key: 'rosterName',
    },
    {
      title: '业务类型',
      dataIndex: 'businessCode',
      key: 'businessCode',
      render: (text, record) => {
        const { businessCode } = record;
        return SetBusinessName(businessCode);
      },
    },

    {
      title: '用户数',
      dataIndex: 'customerCount',
      key: 'customerCount',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text, record) => {
        const { createTime } = record;
        if (!createTime || createTime === '') {
          return '';
        } else {
          return Moment(createTime).format('YYYY-MM-DD HH:mm:ss');
        }
      },
    },
    {
      title: '创建人',
      dataIndex: 'createOper',
      key: 'createOper',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        const { rosterId } = record;
        const goDetail = (e) => {
          router.push(`/roster/info/${rosterId}`);
        };
        const openImport = (e) => {
          openImportModal(rosterId);
        };
        const delRoster = (e) => {
          showDeleteConfirm(rosterId);
        };
        return (
          <span>
            <a href='javascript:void(0);' onClick={(e) => { goDetail(e); }}>编辑/查看</a>
            <Divider type='vertical'/>
            {/* <a href={`/task/add?projCode=${projectCode}`}>下载模板</a>
            <Divider type='vertical'/>
            <a href='javascript:void(0);' onClick={(e) => { openImport(e); }}>导入名单</a>
            <Divider type='vertical'/> */}
            <a href='javascript:void(0);' onClick={(e) => { delRoster(e); }}>删除</a>
          </span>
        );
      },
    }];
};
