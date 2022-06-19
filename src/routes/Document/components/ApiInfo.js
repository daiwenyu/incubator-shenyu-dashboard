import { Typography, Table } from "antd";
import React, { useContext } from "react";
import ApiDebug from "./ApiDebug";
import ApiContext from "./ApiContext";

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

const envPropsColumns = [
  {
    title: "环境",
    dataIndex: "envLabel"
  },
  {
    title: "类型",
    dataIndex: "addressLabel"
  },
  {
    title: "请求地址",
    dataIndex: "addressUrl"
  }
];

function ApiInfo() {
  const {
    apiData: { envProps = [] },
    apiDetail: {
      summary,
      name: apiName,
      description,
      requestParameters,
      responseParameters
    }
  } = useContext(ApiContext);

  return (
    <>
      <Title level={2}>{summary}</Title>
      <Title level={4}>接口名</Title>
      <Text code>{apiName}</Text>
      <Title level={4}>接口描述</Title>
      <Text type="secondary">{description}</Text>
      <Title level={4}>请求地址</Title>
      <Paragraph>
        <Table
          size="small"
          rowKey="envLabel"
          bordered
          dataSource={envProps}
          pagination={false}
          columns={envPropsColumns}
        />
      </Paragraph>

      <Title level={2}>请求参数</Title>
      <Title level={4}>业务请求参数</Title>
      <Paragraph>
        <Table
          size="small"
          rowKey="id"
          bordered
          dataSource={requestParameters}
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
          dataSource={responseParameters}
          pagination={false}
          childrenColumnName="refs"
          columns={columns}
        />
      </Paragraph>

      <Title level={2}>接口调试</Title>
      <ApiDebug />
    </>
  );
}

export default ApiInfo;
