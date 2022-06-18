import { Col, Row, Card, BackTop } from "antd";
import React, { useEffect, useState } from "react";
import SearchApi from "./components/SearchApi";
import ApiInfo from "./components/ApiInfo";
import { getDocItem } from "../../services/api";

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
    handleSelectNode(["63415500-7bc3-4eed-a9d5-4679f05e1a59"]);
  }, []);

  return (
    <Card style={{ margin: 24 }}>
      <Row gutter={24}>
        <Col span={6}>
          <SearchApi onSelect={handleSelectNode} />
        </Col>
        <Col span={18}>
          <ApiInfo data={apiDetail} />
        </Col>
      </Row>
      <BackTop />
    </Card>
  );
}

export default ApiDoc;
