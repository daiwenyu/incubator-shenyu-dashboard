/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Typography,
  Form,
  Input,
  Button,
  Radio,
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
  createRef,
  useContext
} from "react";
import ReactJson from "react-json-view";
import fetch from "dva/fetch";
import { sandboxProxyGateway } from "../../../services/api";
import ApiContext from "./ApiContext";
import { getIntlContent } from "../../../utils/IntlUtils";

const { Title, Text } = Typography;
const { TreeNode } = Tree;
const FormItem = Form.Item;

const FCForm = forwardRef(({ form, onSubmit }, ref) => {
  useImperativeHandle(ref, () => ({
    form
  }));

  const {
    apiDetail: { name: apiUrl, httpMethodList, requestParameters },
    apiData: { appKey, gatewayUrl, cookie }
  } = useContext(ApiContext);
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
      data.forEach(item => {
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
          &nbsp;
          {required ? (
            <Text type="danger">required</Text>
          ) : (
            <Text type="warning">optional</Text>
          )}
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
      <Title level={4}>
        {getIntlContent("SHENYU.DOCUMENT.APIDOC.INFO.REQUEST.INFORMATION")}
      </Title>
      <FormItem label="GatewayUrl">
        {form.getFieldDecorator("gatewayUrl", {
          initialValue: gatewayUrl + apiUrl,
          rules: [{ type: "string", required: true }]
        })(<Input />)}
      </FormItem>
      <FormItem label="AppKey">
        {form.getFieldDecorator("appKey", {
          initialValue: appKey,
          rules: [{ type: "string" }]
        })(
          <Input placeholder=" If the current API requires signature authentication, this parameter is required" />
        )}
      </FormItem>
      <FormItem label="Cookie">
        {form.getFieldDecorator("cookie", {
          initialValue: cookie,
          rules: [{ type: "string" }]
        })(
          <Input placeholder="Fill in the real cookie value.(signature authentication and login free API ignore this item)" />
        )}
      </FormItem>
      <FormItem label="HttpMethod">
        {form.getFieldDecorator("method", {
          initialValue: httpMethodList?.[0]?.toLocaleUpperCase(),
          rules: [{ type: "string", required: true }]
        })(
          <Radio.Group
            options={httpMethodList?.map(v => v.toLocaleUpperCase())}
          />
        )}
      </FormItem>
      <FormItem label="RequestParameters" required />
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
          {getIntlContent("SHENYU.DOCUMENT.APIDOC.INFO.SEND.REQUEST")}
        </Button>
      </FormItem>
    </Form>
  );
});

const EnhancedFCForm = Form.create()(FCForm);

function ApiDebug() {
  const [responseInfo, setResponseInfo] = useState({});
  const formRef = createRef();

  const handleSubmit = async values => {
    const baseUrl = document.getElementById("httpPath").innerHTML;
    const baseUrlTest = "http://139.199.37.58:9095";
    fetch(`${baseUrlTest}/sandbox/proxyGateway`, {
      method: "POST",
      data: values
    }).then(async response => {
      const data = await response.json();
      console.log(response.headers.keys());
      // return response;
    });
    // const res = await sandboxProxyGateway(values);
    // setResponseInfo(res);
  };

  return (
    <>
      <EnhancedFCForm wrappedComponentRef={formRef} onSubmit={handleSubmit} />
      <Title level={4}>
        {getIntlContent("SHENYU.DOCUMENT.APIDOC.INFO.REQUEST.RESULTS")}
      </Title>
      <Card>
        <ReactJson src={responseInfo} name={false} />
      </Card>
    </>
  );
}

export default ApiDebug;
