import JsonView from "@uiw/react-json-view";
import { Button, Col, Collapse, Input, Row, Space, Tabs, TabsProps, theme } from "antd";
import { FormInstance } from "antd/lib";
import { useEffect, useState } from "react";
import FormComponent from "../components/FormComponent";
import InputOptionComponent, { State, getParamValue, getQueryValue } from "../components/InputOptionsComponent";
import TableComponent from "../components/TableComponent";
import { HTTPData } from "../model/data_http";

interface Props {
  httpData: HTTPData;
}

const ContentLayout = (props: Props) => {
  //

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [urlPathValue, setURLPathValue] = useState<string>();
  const [methodUrl, setMethodUrl] = useState<string>();

  const [submitResult, setSubmitResult] = useState<any>({});

  const [responseHeader, setResponseHeader] = useState<Record<string, any>>();

  const onUpdated = () => {
    //

    if (!props.httpData) {
      return;
    }

    const savedState = localStorage.getItem(`${props.httpData.usecase}`);
    const jsonB = savedState ? JSON.parse(savedState)[props.httpData.usecase] : undefined;

    const newValue = {
      [props.httpData.usecase]: {
        ...jsonB,
      },
    };

    const value = getParamValue(newValue[props.httpData.usecase]["param"]);
    const query = getQueryValue(newValue[props.httpData.usecase]["query"]);
    setURLPathValue(getURLWithParamAndQuery(props.httpData.path, value, query));

    setMethodUrl(props.httpData.method.toUpperCase());

    const responseHeader = newValue[props.httpData.usecase]["responseHeaders"];
    setResponseHeader(responseHeader ?? {});

    const responseBody = newValue[props.httpData.usecase]["responseBody"];

    setSubmitResult(responseBody ?? {});
  };

  const onSubmit = async () => {
    //

    const savedState = localStorage.getItem(props.httpData.usecase);

    let headers = { "Content-Type": "application/json" };

    let body: string | undefined = undefined;

    if (savedState) {
      const httpVariable = JSON.parse(savedState)[props.httpData.usecase];
      const headerOptions = httpVariable["header"] as { [key: string]: State[] };
      for (const key in headerOptions) {
        headers = { ...headers, [key]: headerOptions[key].find((header) => header.active)?.value ?? undefined };
      }

      body = httpVariable["body"] && JSON.stringify(httpVariable["body"]);
    }

    const response = await fetch(urlPathValue!, {
      method: methodUrl,
      headers,
      body,
    });
    const result = await response.json();

    setSubmitResult(result);

    let resHeader = {};
    response.headers.forEach((value, key) => {
      resHeader = { ...resHeader, [key]: value };
    });
    setResponseHeader(resHeader);

    const objInStorage = JSON.parse(localStorage.getItem(props.httpData.usecase) || "{}");

    const newValue = {
      [props.httpData.usecase]: {
        ...objInStorage[props.httpData.usecase],
        responseBody: result,
        responseHeaders: resHeader,
      },
    };

    localStorage.setItem(props.httpData.usecase, JSON.stringify(newValue));

    // if (result.items) {
    //   setTableItems(result.items);
    // }
  };

  useEffect(onUpdated, [props.httpData]);

  return (
    props.httpData && (
      <Space
        direction="vertical"
        style={{
          background: colorBgContainer,
          display: "flex",
          margin: "0px",
          minHeight: "500px",
        }}
      >
        <Space.Compact
          style={{ padding: "20px 20px 0px 20px" }}
          block
        >
          <Input
            addonBefore={methodUrl}
            value={urlPathValue}
            size="large"
            readOnly
          />
          <Button
            onClick={onSubmit}
            htmlType="submit"
            type="primary"
            size="large"
          >
            Submit
          </Button>
        </Space.Compact>

        {props.httpData.responseAsTable ? (
          <>
            <Collapse
              // bordered={false}
              ghost
              style={{ margin: "0px 5px 0px 5px" }}
              items={[
                {
                  key: "1",
                  label: "HTTP Variables",
                  children: <>{httpVariables("query", props.httpData, onUpdated, submitResult, responseHeader)}</>,
                },
              ]}
            />
            {/* <Breadcrumb
              style={{ margin: "0px 20px 10px 20px" }}
              items={[
                {
                  title: <NavLink to={"/usecase/user/userCreate"}>Home</NavLink>,
                },
                {
                  title: <a href="">Application Center</a>,
                },
                {
                  title: <a href="">Application List</a>,
                },
                {
                  title: "An Application",
                },
              ]}
            /> */}
            {/* <Table
              style={{ margin: "0px 20px 20px 20px", border: "1px solid", borderColor: colorBorderSecondary }}
              size="small"
              sticky={true}
              dataSource={generateDummyData(20)}
              columns={tableColumns}
              scroll={{ x: 1300, y: 480 }}
            /> */}

            <TableComponent
              httpData={props.httpData}
              items={submitResult?.items ?? []}
            />
          </>
        ) : (
          <div style={{ margin: "10px 20px 10px 20px" }}>{httpVariables("command", props.httpData, onUpdated, submitResult, responseHeader)}</div>
        )}
      </Space>
    )
  );
};

export default ContentLayout;

export const updateToStorage = (usecaseName: string, form?: FormInstance) => {
  //

  const objInStorage = JSON.parse(localStorage.getItem(`${usecaseName}`) || "{}");
  const objInField = form && form.getFieldsValue();

  const newValue = {
    [usecaseName]: {
      ...objInStorage[usecaseName],
      ...objInField?.[usecaseName],
    },
  };

  localStorage.setItem(`${usecaseName}`, JSON.stringify(newValue));
};

const httpVariables = (requestType: "command" | "query", httpData: HTTPData, onUpdated: () => void, submitResult: any, responseHeader: any) => {
  //

  const tabItemStyle = {
    border: "1px solid",
    borderTop: "none",
    // minHeight: "300px",
    // maxHeight: "600px",
    paddingBottom: "40px",
    borderLeftColor: "#f0f0f0",
    borderRightColor: "#f0f0f0",
    borderBottomColor: "#f0f0f0",
  };

  const tabBarStyle = {
    margin: 0,
    border: "none",
  };

  const itemTabs: TabsProps["items"] = [];

  const keys = ["body", "param", "query", "header"];
  Object.keys(httpData).forEach((key) => {
    if (keys.some((k) => key === k)) {
      //

      if (key === "body") {
        itemTabs.push({
          label: "Request Body",
          key: "body",
          style: tabItemStyle,
          children: (
            <>
              <FormComponent
                attributeParamType="body"
                httpData={httpData}
              />
            </>
          ),
        });
        return;
      }

      if (key === "param") {
        itemTabs.push({
          label: "Path Parameters",
          key: "param",
          style: tabItemStyle,
          children: (
            <>
              <InputOptionComponent
                attributeParamType="param"
                httpData={httpData}
                onUpdated={onUpdated}
              />
            </>
          ),
        });
        return;
      }

      if (key === "query") {
        itemTabs.push({
          label: "Query Variables",
          key: "query",
          style: tabItemStyle,
          children: (
            <>
              <InputOptionComponent
                attributeParamType="query"
                httpData={httpData}
                onUpdated={onUpdated}
              />
            </>
          ),
        });
        return;
      }

      if (key === "header") {
        itemTabs.push({
          label: "Request Headers",
          key: "header",
          style: tabItemStyle,
          children: (
            <>
              <InputOptionComponent
                attributeParamType="header"
                httpData={httpData}
                onUpdated={onUpdated}
              />
            </>
          ),
        });
        return;
      }
    }
  });

  return (
    <Row gutter={20}>
      <Col span={requestType === "command" ? 15 : 13}>
        <Tabs
          tabBarStyle={tabBarStyle}
          items={itemTabs}
          // type="card"
          // onChange={(key) => onChange(key, "request")}
          // activeKey={defaultRequestActiveKey}
        />
      </Col>
      <Col span={requestType === "command" ? 9 : 11}>
        <Tabs
          tabBarStyle={tabBarStyle}
          // type="card"
          items={[
            {
              label: "Response Body",
              key: "body",
              style: tabItemStyle,
              children: (
                <JsonView
                  style={{ margin: "20px" }}
                  collapsed={1}
                  displayDataTypes={false}
                  value={submitResult}
                />
              ),
            },
            {
              label: "Response Headers",
              key: "header",
              style: tabItemStyle,
              children: (
                <JsonView
                  style={{ margin: "20px" }}
                  collapsed={3}
                  displayDataTypes={false}
                  value={responseHeader}
                />
              ),
            },
          ]}
          // onChange={(key) => onChange(key, "request")}
          // activeKey={defaultRequestActiveKey}
        />
      </Col>
    </Row>
  );
};

// const generateDummyData = (count: number) => {
//   const dummyData = [];
//   for (let i = 3; i <= count + 2; i++) {
//     dummyData.push({
//       key: i.toString(),
//       name: faker.person.fullName(),
//       age: faker.number.int({ min: 15, max: 50 }),
//       joinDate: faker.date.birthdate().toISOString(),
//       address: faker.location.streetAddress(),
//       latLng: `${faker.location.latitude()}, ${faker.location.longitude()}`,
//       favoritColor: faker.color.human(),
//       pet: faker.animal.type(),
//       company: faker.company.name(),
//       creditCard: faker.finance.creditCardNumber(),
//     });
//   }

//   return dummyData;
// };

function getURLWithParamAndQuery(path: string, param: Record<string, string>, query: string) {
  //

  let pu = path;
  for (const key in param) {
    pu = pu.replace(`:${key}`, `${param[key]}`);
  }

  return `http://localhost:3000${pu}${query}`;
}

// const tableColumns = [
//   {
//     title: "Name",
//     dataIndex: "name",
//     key: "name",
//   },
//   {
//     title: "Age",
//     dataIndex: "age",
//     key: "age",
//   },
//   {
//     title: "Join Date",
//     dataIndex: "joinDate",
//     key: "joinDate",
//   },
//   {
//     title: "Address",
//     dataIndex: "address",
//     key: "address",
//   },
//   {
//     title: "Lat Lng",
//     dataIndex: "latLng",
//     key: "latLng",
//   },
//   {
//     title: "Favorit Color",
//     dataIndex: "favoritColor",
//     key: "favoritColor",
//   },
//   {
//     title: "Pet",
//     dataIndex: "pet",
//     key: "pet",
//   },
//   {
//     title: "Company",
//     dataIndex: "company",
//     key: "company",
//   },
//   {
//     title: "Credit Card",
//     dataIndex: "creditCard",
//     key: "creditCard",
//   },
// ];
