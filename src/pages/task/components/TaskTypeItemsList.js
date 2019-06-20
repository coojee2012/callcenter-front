/**
 * 催收业务参数
 * @type {*[]}
 */
const CS_TEST_ITEMS = [
  {
    code: 'M1',
    taskTypeName: '逾期M1',
  },
  {
    code: 'M2',
    taskTypeName: '逾期M2',
  },
  {
    code: 'M3',
    taskTypeName: '逾期M3',
  },
  {
    code: 'M3+',
    taskTypeName: '逾期M3+',
  },
];

/**
 * 业务类型匹配业务参数
 * @param typeList
 * @returns {Array}
 */
export default (typeList) => {
  const newList = [];
  typeList.forEach((item, index) => {
    if (item.businessCode === 'CS_TEST') {
      newList.push({
        ...item,
        //        items: CS_TEST_ITEMS,
      });
    } else {
      newList.push({
        ...item,
      });
    }
  });
  return newList;
};
