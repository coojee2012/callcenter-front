import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import { Layout } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

import FooterBar from '@/components/FooterBar';
import HeaderBar from '@/components/HeaderBar';
import SiderBar from '@/components/SiderBar';
import styles from './BaseLayout.less';

moment.locale('zh-cn');
const {
  Header, Footer, Sider, Content,
} = Layout;

// 默认图层
export default class IndexLayout extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      showLogo: true,
    });
  }

  render() {
    const { showLogo } = this.state;
    const { children } = this.props;

    return (
      <DocumentTitle title='欢迎使用智能外呼业务处理系统'>
        <Layout className={styles.main}>
          <Sider
            breakpoint='lg'
            collapsedWidth='80'
            onCollapse={(collapsed) => {
              if (collapsed) {
                this.setState({
                  showLogo: false,
                });
              } else {
                this.setState({
                  showLogo: true,
                });
              }
            }}
            className={styles.sider}
          >
            <SiderBar showLogo={showLogo}/>
          </Sider>
          <Layout>
            <Header className={styles.header}>
              <HeaderBar/>
            </Header>
            <Content style={{ minHeight: 'auto' }}>
              {children}
            </Content>
            <Footer>
              <FooterBar/>
            </Footer>
          </Layout>
        </Layout>
      </DocumentTitle>
    );
  }
}
