import React from 'react';
import { Divider, Modal } from 'antd';

import { getDateTime } from '@/utils/common';

const { confirm } = Modal;

// 显示确认框
function showConfirm(dispatch, title, content, id, action) {
  confirm({
    title,
    content,
    onOk() {
      dispatch({
        type: action,
        data: {
          roleId: id,
        },
      });
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}

// 列表表头组件
export default (props) => {
  const clickMore = (key, id) => {
    const { dispatch } = props;
    let title = '';
    const content = '';
    let action = '';
    switch (key) {
      case 'delete':
        title = '确认删除？';
        action = 'roleActions/delRole';
        showConfirm(dispatch, title, content, id, action);
        break;
      default:
        break;
    }
  };

  // const MoreBtn = props => (
  //   <Dropdown
  //     overlay={
  //       <Menu onClick={(key) => clickMore(key, props.current)}>
  //         <Menu.Item key="delete">删除</Menu.Item>
  //       </Menu>
  //     }
  //   >
  //     <a>
  //       更多 <Icon type="down"/>
  //     </a>
  //   </Dropdown>
  // );

  return [
    // {
    //   title: 'ID',
    //   dataIndex: 'roleId',
    //   key: 'id',
    // },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'name',
    },
    {
      title: '创建时间',
      key: 'datetime',
      render: (text, record) => {
        const time = getDateTime(record.createTime);
        return (
          <span>{time}</span>
        );
      },
    },
    {
      title: '权限',
      dataIndex: 'resourceList',
      key: 'limit',
      render: (text, record) => {
        let newText = '';
        record.resourceList.forEach((item) => {
          const { resourceName } = item;
          newText = newText === '' ? resourceName : `${newText} | ${resourceName}`;
        });
        return newText;
      },
    },
    {
      title: '备注',
      key: 'remark',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        if (record.roleId < 4) {
          return (<span>--</span>);
        }
        return (
          <span>
            <a href={`/role/${record.roleId}`}>编辑</a>
            <Divider type='vertical'/>
            <a href='javascript:void(0);' onClick={() => clickMore('delete', record.roleId)}>删除</a>
            {/*<MoreBtn {...props} current={record.roleId}/>*/}
          </span>
        );
      },
    }];
};
