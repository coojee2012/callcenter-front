import React, { Component } from 'react';

import { createTable } from '@/components/Tables';

class FormTabItemBar extends Component {
  render() {
    const {
      column, data, keyId, loading,
    } = this.props;
    const TableComponent = createTable(column, data, keyId, loading, 'small');
    return <div>{TableComponent}</div>;
  }
}

export default FormTabItemBar;
