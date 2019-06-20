const myDate = new Date();
const thisyear = myDate.getFullYear();
const thismonth = myDate.getMonth() + 1;
const thisday = myDate.getDate();

const xAxisData = () => {
  const dataArray = [];
  for (let i = 1; i <= thisday; i++) {
    dataArray.push(`${thisyear}年${thismonth}月${i}日`);
  }
  return dataArray;
};

const seriesData = () => {
  const dataArray = [];
  for (let i = 1; i <= thisday; i++) {
    dataArray.push(Math.random().toFixed(2));
  }
  return dataArray;
};

const randData = () => {
  return (Math.random() * (1000 - 5000) + 5000).toFixed(0);
};

export default {
  form_info: [
    {
      id: '1',
      title: '催收业务',
      row_key: 'date',
      header: [
        {
          title: '日期',
          dataIndex: 'date',
          key: 'date',
        },
        {
          title: '总话务量',
          dataIndex: 'callTotal',
          key: 'callTotal',
        },
        {
          title: '有效话务量',
          dataIndex: 'validCall',
          key: 'validCall',
        },
        {
          title: '联系人数',
          dataIndex: 'contact',
          key: 'contact',
        },
        {
          title: '有效联系人数',
          dataIndex: 'validContact',
          key: 'validContact',
        },
        {
          title: '承诺还款人数',
          dataIndex: 'yes',
          key: 'yes',
        },
      ],
      data: [
        {
          date: `${thisyear}年${thismonth}月1日`,
          callTotal: randData(),
          validCall: randData(),
          contact: randData(),
          validContact: randData(),
          yes: randData(),
        },
        {
          date: `${thisyear}年${thismonth}月2日`,
          callTotal: randData(),
          validCall: randData(),
          contact: randData(),
          validContact: randData(),
          yes: randData(),
        },
        {
          date: `${thisyear}年${thismonth}月3日`,
          callTotal: randData(),
          validCall: randData(),
          contact: randData(),
          validContact: randData(),
          yes: randData(),
        },
        {
          date: `${thisyear}年${thismonth}月4日`,
          callTotal: randData(),
          validCall: randData(),
          contact: randData(),
          validContact: randData(),
          yes: randData(),
        },
        {
          date: `${thisyear}年${thismonth}月5日`,
          callTotal: randData(),
          validCall: randData(),
          contact: randData(),
          validContact: randData(),
          yes: randData(),
        },
        {
          date: `${thisyear}年${thismonth}月6日`,
          callTotal: randData(),
          validCall: randData(),
          contact: randData(),
          validContact: randData(),
          yes: randData(),
        },
        {
          date: `${thisyear}年${thismonth}月7日`,
          callTotal: randData(),
          validCall: randData(),
          contact: randData(),
          validContact: randData(),
          yes: randData(),
        },
        {
          date: `${thisyear}年${thismonth}月8日`,
          callTotal: randData(),
          validCall: randData(),
          contact: randData(),
          validContact: randData(),
          yes: randData(),
        },
      ],
      option: {
        title: '催收业务对比图',
        legend: ['接通率', '承诺还款率'],
        category: xAxisData(),
        stack: '总量',
        type: 'line',
        series: [
          {
            name: '接通率',
            data: seriesData(),
          },
          {
            name: '承诺还款率',
            data: seriesData(),
          },
        ],
      },
    },
    {
      id: '2',
      title: '营销业务',
      row_key: 'date',
      header: [
        {
          title: '日期',
          dataIndex: 'date',
          key: 'date',
        },
        {
          title: '总话务量',
          dataIndex: 'callTotal',
          key: 'callTotal',
        },
        {
          title: '有效话务量',
          dataIndex: 'validCall',
          key: 'validCall',
        },
        {
          title: '联系人数',
          dataIndex: 'contact',
          key: 'contact',
        },
        {
          title: '有效联系人数',
          dataIndex: 'validContact',
          key: 'validContact',
        },
        {
          title: '有办卡意愿人数',
          dataIndex: 'yes',
          key: 'yes',
        },
      ],
      data: [
        {
          date: `${thisyear}年${thismonth}月1日`,
          callTotal: randData(),
          validCall: randData(),
          contact: randData(),
          validContact: randData(),
          yes: randData(),
        },
        {
          date: `${thisyear}年${thismonth}月2日`,
          callTotal: randData(),
          validCall: randData(),
          contact: randData(),
          validContact: randData(),
          yes: randData(),
        },
        {
          date: `${thisyear}年${thismonth}月3日`,
          callTotal: randData(),
          validCall: randData(),
          contact: randData(),
          validContact: randData(),
          yes: randData(),
        },
        {
          date: `${thisyear}年${thismonth}月4日`,
          callTotal: randData(),
          validCall: randData(),
          contact: randData(),
          validContact: randData(),
          yes: randData(),
        },
        {
          date: `${thisyear}年${thismonth}月5日`,
          callTotal: randData(),
          validCall: randData(),
          contact: randData(),
          validContact: randData(),
          yes: randData(),
        },
        {
          date: `${thisyear}年${thismonth}月6日`,
          callTotal: randData(),
          validCall: randData(),
          contact: randData(),
          validContact: randData(),
          yes: randData(),
        },
        {
          date: `${thisyear}年${thismonth}月7日`,
          callTotal: randData(),
          validCall: randData(),
          contact: randData(),
          validContact: randData(),
          yes: randData(),
        },
        {
          date: `${thisyear}年${thismonth}月8日`,
          callTotal: randData(),
          validCall: randData(),
          contact: randData(),
          validContact: randData(),
          yes: randData(),
        },
      ],
      option: {
        title: '营销业务对比图',
        legend: ['接通率', '转换率'],
        category: xAxisData(),
        stack: '总量',
        type: 'line',
        series: [
          {
            name: '接通率',
            data: seriesData(),
          },
          {
            name: '转换率',
            data: seriesData(),
          },
        ],
      },
    },
  ],
};
