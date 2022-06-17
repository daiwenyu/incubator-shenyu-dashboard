import {
  Typography,
  Table,
  Form,
  Input,
  Button,
  Radio,
  Tabs,
  Card
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
const FormItem = Form.Item;
const { TabPane } = Tabs;

const FCForm = forwardRef(({ form, onSubmit, apiDetail }, ref) => {
  useImperativeHandle(ref, () => ({
    form
  }));
  const {
    summary,
    name: apiUrl,
    httpMethodList = [],
    requestParameters
  } = apiDetail;

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit();
  };

  const createRequestJson = (params = []) => {
    console.log(params);
    const exampleJSON = {};

    const key = [];
    const loop = (data, obj) => {
      data.map(item => {
        const { name, refs, example, type } = item;
        key.push(name);
        switch (type) {
          case "array":
            break;
          case "object":
            break;
          default:
            exampleJSON[name] = example;
            break;
        }
        if (Array.isArray(refs)) {
        } else {
          key.pop();
        }
      });
    };

    loop(params, exampleJSON);
    console.log(exampleJSON);
  };

  useEffect(
    () => {
      createRequestJson(requestParameters);
    },
    [requestParameters]
  );

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      onSubmit={handleSubmit}
    >
      <Title level={2}>{summary}</Title>
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
      <Title level={2}>请求参数</Title>
      <ReactJson src={{}} name={false} />
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
      <Button htmlType="submit" type="primary">
        发送请求
      </Button>
    </Form>
  );
});

const EnhancedFCForm = Form.create()(FCForm);

function ApiDebug(props) {
  const { data: apiInfoData } = props;
  const [apiDetail, setApiDetail] = useState({});
  const [requestInfo, setRequestInfo] = useState({});
  const [responseInfo, setResponseInfo] = useState({});
  const formRef = createRef();

  const handleSubmit = () => {
    formRef.current.form.validateFieldsAndScroll((errors, values) => {
      console.log(values);
      if (!errors) {
        setRequestInfo(values);
      }
    });
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
      <Tabs>
        <TabPane tab="请求信息" key="1">
          <Card />
        </TabPane>
        <TabPane tab="请求结果" key="2">
          <Card />
        </TabPane>
      </Tabs>
    </>
  );
}

export default ApiDebug;
