import { Col, Row, Card, BackTop } from "antd";
import React, { useEffect, useState } from "react";
import SearchApi from "./components/SearchApi";
import ApiInfo from "./components/ApiInfo";
import { getDocItem, getDocMenus } from "../../services/api";
import ApiContext from "./components/ApiContext";

function ApiDoc() {
  const [apiDetail, setApiDetail] = useState({});
  const [apiData, setApiData] = useState({});

  const initData = async () => {
    const { code, data = {} } = await getDocMenus();
    if (code === 200) {
      const { menuProjects = [] } = data;
      const createKey = (treeData, keys) => {
        treeData.forEach((item, index) => {
          const { children, id } = item;
          const key = [...keys, index].join("-");
          item.key = id || key;
          if (children?.length) {
            createKey(children, [...keys, index]);
          }
        });
      };
      createKey(menuProjects, []);
      data.menuProjects = menuProjects;
      setApiData(data);
      // FIXME
      handleSelectNode(["63415500-7bc3-4eed-a9d5-4679f05e1a59"]);
    }
  };

  const handleSelectNode = async ([id]) => {
    const { code, data } = await getDocItem({ id });
    if (code === 200) {
      setApiDetail(data);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  return (
    <ApiContext.Provider
      value={{
        apiDetail,
        apiData
      }}
    >
      <Card style={{ margin: 24 }}>
        <Row gutter={24}>
          <Col span={6}>
            <SearchApi onSelect={handleSelectNode} />
          </Col>
          <Col span={18}>
            <ApiInfo />
          </Col>
        </Row>
        <BackTop />
      </Card>
    </ApiContext.Provider>
  );
}

export default ApiDoc;
