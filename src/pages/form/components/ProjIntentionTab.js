import React, { Component } from 'react';
import FormSearchBar from './FormSearchBar';
import FormTabItemBar from './FormTabItemBar';


class ProjIntenionTab extends Component {
  constructor(props) {
    super(props);
    const { SearchBarProps } = props;
    this.state = ({
      formType: SearchBarProps.type,
    });
  }

  getColumns = () => {
    const { Intention } = this.props;
    const keys = Object.keys(Object.assign({}, Intention));
    const columns = [{
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
    }, {
      title: '名单数',
      dataIndex: 'rosterSum',
      key: 'rosterSum',
    }];
    keys.forEach((key) => {
      columns.push({
        title: Intention[key],
        dataIndex: key,
        key,
      });
    });
    return columns;
  }

  render() {
    const { SearchBarProps, export2Excel, onSearch, Data } = this.props;
    const columns = this.getColumns();
    return (
      <>
        <FormSearchBar
          SearchBarProps={SearchBarProps}
          export2Excel={export2Excel}
          onSearch={onSearch}
          formName='项目意图'
          formId='ProjIntenionTab'
        />
        <FormTabItemBar
          loading={false}
          column={columns}
          data={Data}
          keyId='projectCode'
        />
      </>
    );
  }
}
export default ProjIntenionTab;
