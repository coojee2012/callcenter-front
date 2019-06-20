export const PAGE_NUM = 1; // 默认显示第几页
export const PAGE_SIZE = 15; // 默认页面显示条数
export const LOAD_SIZE = 200; // 默认读取数据条数
export const FORM_ITEM_LAYOUT = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19, offset: 1 },
}; // 默认form排列格式
export const FORM_BTN_LAYOUT = { wrapperCol: { span: 19, offset: 5 } }; // 默认form_btn排列格式
export const BASE_URL = (() => {
  let { hostname, port } = window.location;
  port = `${port}`.replace(/7$/, '1');
  if (hostname === '47.100.229.19') {
    hostname = '172.19.92.77';
  }
  return `http://${hostname}:${port}/`;
})();
// export const BASE_URL = `http://20.1.30.214:8081/`;
export const EXCEL_MODEL = `${BASE_URL}file/taskUserListTemplate`; // 模板地址
export const OUTBOUND_URL = 'http://172.19.92.78:8141/';
export const BUSSINESS_CODE = {
  CS_STAN: 'COLLECTION', // 标准催收业务
  YX_STAN: 'MARKETING', // 标准营销业务
};
