import { Col, Row, Typography, Input, Tabs, Icon, Card, Table } from "antd";
import React, { useEffect, useState } from "react";
import SearchApi from "./components/SearchApi";
import ApiInfo from "./components/ApiInfo";
import ApiDebug from "./components/ApiDebug";
import { getDocItem, sandboxProxyGateway } from "../../services/api";

const { TabPane } = Tabs;
const { Title, Text } = Typography;

function ApiDoc() {
  const [apiDetail, setApiDetail] = useState({});

  const handleSelectNode = async ([id]) => {
    const { code, data } = await getDocItem({ id });
    if (code === 200) {
      setApiDetail(data);
    }
  };

  useEffect(() => {
    // FIXME
    handleSelectNode(["95e12528-8ed3-4045-ac19-d94b375b4f55"]);
  }, []);

  return (
    <Card style={{ margin: 24 }}>
      <Row gutter={24}>
        <Col span={6}>
          <SearchApi onSelect={handleSelectNode} />
        </Col>
        <Col span={18}>
          <Tabs type="card" defaultActiveKey="2">
            <TabPane
              key="1"
              tab={
                <span>
                  <Icon type="file-text" />接口信息
                </span>
              }
            >
              <ApiInfo data={apiDetail} />
            </TabPane>
            <TabPane
              key="2"
              tab={
                <span>
                  <Icon type="code" />接口调试
                </span>
              }
            >
              <ApiDebug data={apiDetail} />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </Card>
  );
}

export default ApiDoc;
