import {
  Typography,
  Table,
  Form,
  Input,
  Button,
  Radio,
  Tabs,
  Card,
  Row,
  Col,
  Tree
} from "antd";
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  createRef
} from "react";
import ReactJson from "react-json-view";
import { sandboxProxyGateway } from "../../../services/api";

const { Title, Text } = Typography;
const { TreeNode } = Tree;
const FormItem = Form.Item;

const FCForm = forwardRef(({ form, onSubmit, apiDetail }, ref) => {
  useImperativeHandle(ref, () => ({
    form
  }));
  const { name: apiUrl, httpMethodList = [], requestParameters } = apiDetail;
  const [questJson, setRequestJson] = useState({});

  const handleSubmit = e => {
    e.preventDefault();
    ref.current.form.validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        onSubmit({
          ...values,
          bizParam: questJson
        });
      }
    });
  };

  const createRequestJson = (params = []) => {
    const exampleJSON = {};
    const key = [];
    const loopExample = (data, obj) => {
      data.map(item => {
        const { name, refs, example, type } = item;
        key.push(name);
        switch (type) {
          case "array":
            if (Array.isArray(refs)) {
              obj[name] = [{}];
              key.push(0);
              loopExample(refs, obj[name][0]);
              key.pop();
            } else {
              obj[name] = [];
            }
            break;
          case "object":
            obj[name] = {};
            if (Array.isArray(refs)) {
              loopExample(refs, obj[name]);
            }
            break;
          default:
            obj[name] = example;
            break;
        }
        key.pop();
      });
    };

    loopExample(params, exampleJSON);
    setRequestJson(exampleJSON);
  };

  const renderTreeNode = (data, indexArr = []) => {
    return data.map((item, index) => {
      const { name, type, required, description } = item;
      const TreeTitle = (
        <>
          <Text strong>{name}</Text>
          &nbsp;<Text code>{type}</Text>
          &nbsp;<Text mark>{required ? "required" : "optional"}</Text>
          &nbsp;<Text type="secondary">{description}</Text>
        </>
      );
      return (
        <TreeNode key={[...indexArr, index].join("-")} title={TreeTitle}>
          {item.refs && renderTreeNode(item.refs, [...indexArr, index])}
        </TreeNode>
      );
    });
  };

  const updateJson = obj => {
    setRequestJson(obj.updated_src);
  };

  useEffect(
    () => {
      createRequestJson(requestParameters);
    },
    [requestParameters]
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Title level={4}>请求信息</Title>
      <FormItem label="网关地址">
        {form.getFieldDecorator("gatewayUrl", {
          initialValue: location.origin + apiUrl,
          rules: [{ type: "string", required: true }]
        })(<Input />)}
      </FormItem>
      <FormItem label="appKey">
        {form.getFieldDecorator("appKey", {
          rules: [{ type: "string" }]
        })(<Input />)}
      </FormItem>
      <FormItem label="Cookie">
        {form.getFieldDecorator("cookie", {
          rules: [{ type: "string" }]
        })(<Input />)}
      </FormItem>
      <FormItem label="httpMethod">
        {form.getFieldDecorator("method", {
          initialValue: httpMethodList[0]?.toLocaleUpperCase(),
          rules: [{ type: "string", required: true }]
        })(
          <Radio.Group
            options={httpMethodList.map(v => v.toLocaleUpperCase())}
          />
        )}
      </FormItem>
      <FormItem label="请求参数" required />
      <Row gutter={16}>
        <Col span={14}>
          <ReactJson
            src={questJson}
            theme="monokai"
            displayDataTypes={false}
            name={false}
            onAdd={updateJson}
            onEdit={updateJson}
            onDelete={updateJson}
            style={{ borderRadius: 4, padding: 16 }}
          />
        </Col>
        <Col span={10}>
          {requestParameters && (
            <Tree showLine defaultExpandAll>
              {renderTreeNode(requestParameters)}
            </Tree>
          )}
        </Col>
      </Row>
      <FormItem label=" " colon={false}>
        <Button htmlType="submit" type="primary">
          发送请求
        </Button>
      </FormItem>
    </Form>
  );
});

const EnhancedFCForm = Form.create()(FCForm);

function ApiDebug(props) {
  const { data: apiInfoData } = props;
  const [apiDetail, setApiDetail] = useState({});
  const [responseInfo, setResponseInfo] = useState({});
  const formRef = createRef();

  const handleSubmit = async values => {
    const res = await sandboxProxyGateway(values);
    setResponseInfo(res);
  };

  useEffect(
    () => {
      setApiDetail(apiInfoData);
    },
    [apiInfoData]
  );

  return (
    <>
      <EnhancedFCForm
        wrappedComponentRef={formRef}
        apiDetail={apiDetail}
        onSubmit={handleSubmit}
      />
      <Title level={4}>请求结果</Title>
      <Card>
        <ReactJson src={responseInfo} name={false} />
      </Card>
    </>
  );
}

export default ApiDebug;
