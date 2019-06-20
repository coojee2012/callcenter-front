import React from 'react';
import { Divider, Modal } from 'antd';

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
          operId: id,
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
        action = 'memberActions/deleteMember';
        showConfirm(dispatch, title, content, id, action);
        break;
      case 'reset':
        title = '确认重置密码？';
        action = 'memberActions/resetMemberPwd';
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
  //         <Menu.Item key="reset">重置密码</Menu.Item>
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
    {
      title: 'ID',
      dataIndex: 'operId',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'operName',
      key: 'name',
    },
    {
      title: '账号',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: '状态',
      key: 'enable',
      render: (text, record) => {
        let enable = '';
        if (record.enable !== 1) {
          enable = '停用';
        } else {
          enable = '启用';
        }
        return enable;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href={`/member/${record.operId}`}>编辑</a>
          <Divider type='vertical'/>
          <a href='javascript:void(0);' onClick={() => clickMore('reset', record.operId)}>重置密码</a>
          <Divider type='vertical'/>
          <a href='javascript:void(0);' onClick={() => clickMore('delete', record.operId)}>删除</a>
          {/*<MoreBtn {...props} current={record.operId}/>*/}
        </span>
      ),
    }];
};
