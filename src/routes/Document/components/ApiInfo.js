import { Typography, Table } from "antd";
import React, { useEffect, useState } from "react";

const { Title, Text } = Typography;

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
      <Title level={3}>接口描述</Title>
      {apiDetail.description}
      <Title level={3}>请求地址</Title>
      {location.origin + apiDetail.name}
      <Title level={2}>请求参数</Title>
      <Title level={3}>业务请求参数</Title>
      <Table
        rowKey="id"
        bordered
        dataSource={apiDetail.requestParameters || []}
        pagination={false}
        childrenColumnName="refs"
        columns={columns}
      />
      <Title level={2}>响应参数</Title>
      <Title level={3}>公共响应参数</Title>
      <Table
        rowKey="id"
        bordered
        dataSource={defaultCommonData}
        pagination={false}
        columns={columns.filter((_, i) => ![2, 3].includes(i))}
      />
      <Title level={3}>业务响应参数</Title>
      <Table
        rowKey="id"
        bordered
        dataSource={apiDetail.responseParameters || []}
        pagination={false}
        childrenColumnName="refs"
        columns={columns}
      />
      <Title level={3}>响应示例</Title>
      <Title level={3}>错误示例</Title>
      {/* <Title level={2}>业务错误码</Title> */}
    </>
  );
}

export default ApiInfo;
