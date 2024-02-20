import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Divider, Form, FormInstance, Input, InputNumber, Row, Select, Space, Switch, theme } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";
import { updateToStorage } from "../layout/ContentLayout";
import { HTTPData } from "../model/data_http";
import { InputType } from "../model/data_type";
import { pascalToCamel } from "../util/convert";
import { createDebounce } from "../util/debounce";

export type State = {
  active: boolean;
  description?: string;
  value?: string;
};

const formItemStyle = { marginBottom: "10px" };

export type AttributeParamType = "body" | "param" | "query" | "header" | "cookie";

interface Props {
  attributeParamType: AttributeParamType;
  httpData: HTTPData;
  onUpdated: () => void;
}

const InputOptionComponent = (props: Props) => {
  //

  const [form] = useForm();

  const resetFieldValues = () => {
    // const savedState = localStorage.getItem(`${props.httpData.usecase}`);
    // const jsonObj = savedState ? JSON.parse(savedState)[props.httpData.usecase][props.attributeParamType] : null;
    // const data = generateInitialValue(props.httpData[props.attributeParamType]!, jsonObj);

    const savedState = JSON.parse(localStorage.getItem(`${props.httpData.usecase}`) || "{}");
    const jsonObj = savedState?.[props.httpData.usecase]?.[props.attributeParamType];
    const data = generateInitialValue(props.httpData[props.attributeParamType]!, jsonObj);
    form.setFieldsValue({ [props.httpData.usecase]: { [props.attributeParamType]: data } });
  };

  const onChange = createDebounce(() => {
    updateToStorage(props.httpData.usecase, form);
    if (props.attributeParamType === "param" || props.attributeParamType === "query") {
      props.onUpdated();
    }
  });

  // const [initialized, setInitialized] = useState(false);
  // useEffect(() => setInitialized(true), [form]);
  // setTimeout(() => initialized && resetFieldValues(), 50);

  useEffect(resetFieldValues, [props.httpData]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Form
      form={form}
      onChange={onChange}
      autoComplete="off"
      layout="vertical"
      style={{ background: colorBgContainer, padding: "0px 20px" }}
    >
      {generateItem(props.httpData[props.attributeParamType]!, [pascalToCamel(props.httpData.usecase), props.attributeParamType], form, onChange)}
      {/* <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
        >
          Submit
        </Button>
      </Form.Item> */}
    </Form>
  );
};

export default InputOptionComponent;

function generateItem(recordInputType: Record<string, InputType>, previousField: (string | number)[], form: FormInstance, onChange: () => void) {
  //

  const handleSwitchChange = (i: number, fieldName: string, exclusive: boolean) => {
    //

    if (!exclusive) {
      onChange();
      return;
    }

    const usecase = form.getFieldValue(previousField[0]); // as State[];

    if (usecase) {
      //

      const attributes = usecase[previousField[1]];
      const states = attributes[fieldName] as State[];
      const updatedStates = [...states];

      if (!updatedStates[i].active) {
        updatedStates[i].active = false;
      } else {
        updatedStates[i].active = true;
        updatedStates.filter((_, index) => index !== i).forEach((x) => (x.active = false));
      }
      form.setFieldValue([...previousField, fieldName], updatedStates);

      onChange();
    }
  };

  const formItems: React.ReactNode[] = [];

  for (const fieldName in recordInputType) {
    //

    formItems.push(
      <Form.Item
        key={fieldName}
        style={{ marginBottom: "0px" }}
      >
        <Divider
          orientation="left"
          orientationMargin="0"
        >
          {fieldName}
        </Divider>
        <Form.List name={[...previousField, fieldName]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }, index) => (
                <Space
                  key={key}
                  style={{ display: "flex" }}
                  direction="vertical"
                >
                  <Row gutter={20}>
                    <Col>
                      <Form.Item
                        style={formItemStyle}
                        name={[name, "active"]}
                        valuePropName="checked"
                      >
                        <Switch
                          onChange={() => handleSwitchChange(index, fieldName, recordInputType[fieldName].type !== "array")}
                          checkedChildren="active"
                          unCheckedChildren="ignored"
                        />
                      </Form.Item>
                    </Col>

                    <Col>
                      <Form.Item
                        style={formItemStyle}
                        name={[name, "description"]}
                      >
                        <Input
                          placeholder="description (optional)"
                          style={fields.length === 1 ? { display: "none" } : {}}
                        />
                      </Form.Item>
                    </Col>

                    <Col flex="auto">{decideInputComponent(name, recordInputType[fieldName], onChange)}</Col>

                    <Col>
                      <Form.Item style={formItemStyle}>
                        {fields.length > 1 ? (
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        ) : (
                          <PlusCircleOutlined onClick={() => add({ active: fields.length === 0 ? true : false, description: "", value: "" })} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Space>
              ))}

              {fields.length > 1 ? (
                <Button
                  type="dashed"
                  onClick={() => {
                    add({ active: fields.length === 0 ? true : false, description: "", value: "" });
                  }}
                  block
                  icon={<PlusCircleOutlined />}
                >
                  Add new alternative variable
                </Button>
              ) : undefined}
            </>
          )}
        </Form.List>
      </Form.Item>
    );
  }

  return formItems;
}

const generateInitialValue = (recordInputType: Record<string, InputType>, jsonObj: any) => {
  //

  const defaultValueObject: Record<string, any> = {};

  for (const fieldName in recordInputType) {
    //

    const field = recordInputType[fieldName];

    if (field.type === "array") {
      defaultValueObject[fieldName] = jsonObj ? jsonObj[fieldName] : [{ active: false, description: "", value: field.items.default ?? "" }];

      //
    } else {
      defaultValueObject[fieldName] = jsonObj ? jsonObj[fieldName] : [{ active: false, description: "", value: field.default ?? "" }];

      //
    }
  }

  return defaultValueObject;
};

export function getParamValue(newValue: any) {
  //

  let param: Record<string, string> = {};
  for (const key in newValue) {
    (newValue[key] as State[])
      .filter((state) => state.active)
      .forEach((z) => {
        if (z.value) {
          param = { ...param, [key]: z.value };
        }
      });
  }

  return param;
}

export function getQueryValue(newValue: any) {
  //

  let query: string = "";
  for (const key in newValue) {
    (newValue[key] as State[])
      .filter((state) => state.active)
      .forEach((z) => {
        if (z.value) {
          query = `${query}&${key}=${z.value}`;
        }
      });
  }

  return query ? `?${query.slice(1)}` : "";
}

// const decideInputComponent = (inputType: InputType, onChange?: () => void) => {
//   switch (inputType.type) {
//     case "string":
//       return <Input placeholder={"value"} />;
//     case "number":
//       return <InputNumber placeholder={"value"} />;
//     case "text":
//       return (
//         <Input.TextArea
//           rows={1}
//           placeholder={"value"}
//         />
//       );
//     case "enum":
//       return (
//         <Select
//           allowClear
//           options={inputType.enum.map((val) => ({ value: val, label: val.toString() }))}
//           onChange={onChange}
//         />
//       );
//     case "array":
//       return <Input placeholder={"value"} />;

//     case "boolean":
//       return <Checkbox />; // TODO put Form Item here!!!
//   }
// };

const decideInputComponent = (name: number, inputType: InputType, onChange?: () => void) => {
  switch (inputType.type) {
    case "string":
      return (
        <Form.Item
          style={formItemStyle}
          name={[name, "value"]}
        >
          <Input placeholder={"value"} />
        </Form.Item>
      );

    case "number":
      return (
        <Form.Item
          style={formItemStyle}
          name={[name, "value"]}
        >
          <InputNumber placeholder={"value"} />
        </Form.Item>
      );

    case "text":
      return (
        <Form.Item
          style={formItemStyle}
          name={[name, "value"]}
        >
          <Input.TextArea
            rows={1}
            placeholder={"value"}
          />
        </Form.Item>
      );

    case "enum":
      return (
        <Form.Item
          style={formItemStyle}
          name={[name, "value"]}
        >
          <Select
            allowClear
            options={inputType.enum.map((val) => ({ value: val, label: val.toString() }))}
            onChange={onChange}
          />
        </Form.Item>
      );

    case "array":
      return (
        <Form.Item
          style={formItemStyle}
          name={[name, "value"]}
        >
          <Input placeholder={"value"} />
        </Form.Item>
      );

    case "boolean":
      return (
        <Form.Item
          style={formItemStyle}
          name={[name, "value"]}
          valuePropName="checked"
        >
          <Checkbox />
        </Form.Item>
      );
  }
};
