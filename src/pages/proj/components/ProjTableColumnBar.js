import React from 'react';
import { Divider } from 'antd';
import Moment from 'moment';
import router from 'umi/router';
import { getProjStatusName } from '@/utils/common';

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

  const endProj = (projectCode) => {
    const { dispatch } = props;
    dispatch({
      type: 'projActions/endProj',
      projectCode,
    });
  };

  return [
    // {
    //   title: '项目编号',
    //   dataIndex: 'projectCode',
    //   key: 'projectCode',
    // },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        const { status } = record;

        return getProjStatusName(status);
      },
    },
    {
      title: '任务数(个)',
      dataIndex: 'taskSum',
      key: 'taskSum',
    },
    {
      title: '项目说明',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '预计起始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text, record) => {
        const { startTime, endTime } = record;
        if (!startTime || startTime === '') {
          return '';
        } else {
          return `${Moment(startTime).format('YYYY-MM-DD')}至${Moment(endTime).format('YYYY-MM-DD')}`;
        }
      },
    },
    // {
    //   title: '预计结束时间',
    //   dataIndex: 'endTime',
    //   key: 'endTime',
    //   render: (text, record) => {
    //     const { endTime } = record;
    //     if (!endTime || endTime === '') {
    //       return '';
    //     } else {
    //       return Moment(endTime).format('YYYY-MM-DD');
    //     }
    //   },
    // },

    // {
    //   title: '已结束任务数',
    //   dataIndex: 'finishTaskSum',
    //   key: 'finishTaskSum',
    // },
    // {
    //   title: '未开始任务数',
    //   dataIndex: 'nostartTaskSum',
    //   key: 'nostartTaskSum',
    // },
    // {
    //   title: '待审核任务数',
    //   dataIndex: 'auditTaskSum',
    //   key: 'auditTaskSum',
    // },
    // {
    //   title: '总联系人数',
    //   dataIndex: 'totalContactSum',
    //   key: 'totalContactSum',
    // },
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
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (text, record) => {
        const { updateTime } = record;
        if (!updateTime || updateTime === '') {
          return '';
        } else {
          return Moment(updateTime).format('YYYY-MM-DD HH:mm:ss');
        }
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        /** @namespace record.callId */
        /** @namespace record.recordFile */
        const {
          projectCode, finishTaskSum, nostartTaskSum, auditTaskSum, status,
        } = record;
        const goDetail = (e) => {
          router.push(`/proj/${projectCode}`);
        };
        const endTheProj = (e) => {
          endProj(projectCode);
        };
        return (
          <span>
            <a href='javascript:void(0);' onClick={(e) => { goDetail(e); }}>编辑/查看</a>

            { status !== 2 ? (<>  <Divider type='vertical'/> <a href={`/task/add?projCode=${projectCode}`}>新建任务</a> </>)
              : null
            }
            { nostartTaskSum === 0 && auditTaskSum === 0 && status !== 2 ? (
              <>
                <Divider type='vertical'/>
                <a href='javascript:void(0);' onClick={(e) => { endTheProj(e); }}>结束项目</a>
              </>
            )
              : null
            }
          </span>
        );
      },
    }];
};
