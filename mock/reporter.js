export default {
  'GET /api/report/getProjectSummary': (req, res) => {
    res.send({ code: 200,
      data: [{
        blankNum: 0,
        projectName: '我想我是海1',
        rosterNum: 111,
        startTime: 1557158400000,
        dialedRoster: 0,
        outcallNum: 0,
        answeredNum: 0,
        stopPhone: 133,
        projectCode: 1,
        endTime: 1557200451000,
      },
      {
        blankNum: 0,
        projectName: '我想我是海2',
        rosterNum: 111,
        startTime: 1557158400000,
        dialedRoster: 0,
        outcallNum: 0,
        answeredNum: 0,
        stopPhone: 33,
        projectCode: 2,
        endTime: 1557200451000,
      }],
      msg: '成功',
      success: true });
  },
  'GET /api/report/getProjectDailySummary': (req, res) => {
    const data = [];

    for (let i = 1; i < 6; i++) {
      data.push(
        {
          date: `2019-05-0${i}`,
          projectName: '我想我是海',
          rosterNum: 220 * i,
          startTime: 1557158400000,
          dialedRoster: 12,
          answeredNum: 13,
          stopPhone: 14,
          blankNum: 15,
        },
      );
    }


    res.send({ code: 200,
      data,
      msg: '成功',
      success: true });
  },
  'GET /api/report/getProjectIntentionSummary': (req, res) => {
    const data = [];

    for (let i = 1; i < 6; i++) {
      data.push(
        {
          projectCode: i,
          projectName: `我想我是海-${i}`,
          rosters: 220 * i,
          v1: 10,
          v2: 12,
          v3: 13,
          v4: 14,
          v5: 15,
        },
      );
    }


    res.send({ code: 200,
      data,
      msg: '成功',
      success: true });
  },
  'GET /api/report/getProjectIntention': (req, res) => {
    const data = [];
    const { businessCode } = req.query;
    for (let i = 1; i < 6; i++) {
      data.push(
        {
          name: `${businessCode}-意图${i}`,
          value: `v${i}`,
        },
      );
    }
    res.send({ code: 200,
      data,
      msg: '成功',
      success: true });
  },
};
