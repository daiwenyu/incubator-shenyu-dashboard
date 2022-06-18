import { Typography, Table, Card, Button } from "antd";
import React, { useEffect, useState } from "react";
import ApiDebug from "./ApiDebug";

const { Title, Text, Paragraph } = Typography;

const columns = [
  {
    title: "名称",
    dataIndex: "name"
  },
  {
    title: "类型",
    dataIndex: "type"
  },
  {
    title: "必填",
    dataIndex: "required",
    render: v => (v ? <Text type="danger">是</Text> : "否")
  },
  {
    title: "最大长度",
    dataIndex: "maxLength"
  },
  {
    title: "描述",
    dataIndex: "description"
  },
  {
    title: "示例值",
    dataIndex: "example"
  }
];

const defaultCommonData = [
  {
    id: 1,
    name: "code",
    type: "integer",
    description: "返回码",
    example: "200"
  },
  {
    id: 2,
    name: "message",
    type: "string",
    description: "错误描述信息",
    example: "非法的参数"
  },
  {
    id: 3,
    name: "data",
    type: "object",
    description: "响应的业务结果",
    example: '{"id":"1988771289091030"}'
  }
];

function ApiInfo(props) {
  const { data } = props;
  const [apiDetail, setApiDetail] = useState({});

  useEffect(
    () => {
      setApiDetail(data);
    },
    [data]
  );

  return (
    <>
      <Title level={2}>{apiDetail.summary}</Title>
      <Title level={4}>接口名</Title>
      <Text code>{apiDetail.name}</Text>
      <Title level={4}>接口描述</Title>
      <Text type="secondary">{apiDetail.description}</Text>

      <Title level={2}>请求参数</Title>
      <Title level={4}>业务请求参数</Title>
      <Paragraph>
        <Table
          size="small"
          rowKey="id"
          bordered
          dataSource={apiDetail.requestParameters || []}
          pagination={false}
          childrenColumnName="refs"
          columns={columns}
        />
      </Paragraph>

      <Title level={2}>响应参数</Title>
      <Title level={4}>公共响应参数</Title>
      <Paragraph>
        <Table
          size="small"
          rowKey="id"
          bordered
          dataSource={defaultCommonData}
          pagination={false}
          columns={columns.filter((_, i) => ![2, 3].includes(i))}
        />
      </Paragraph>
      <Title level={4}>业务响应参数</Title>
      <Paragraph>
        <Table
          size="small"
          rowKey="id"
          bordered
          dataSource={apiDetail.responseParameters || []}
          pagination={false}
          childrenColumnName="refs"
          columns={columns}
        />
      </Paragraph>

      <Title level={2}>接口调试</Title>
      <ApiDebug data={apiDetail} />
    </>
  );
}

export default ApiInfo;
