import { CloseOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, DatePicker, Form, Input, InputNumber, Select, Space } from "antd";
import dayjs from "dayjs";
import { ReactNode } from "react";
import { ArrayType } from "../model/data_type";
import { dateTimeFormat } from "../util/constant";
import CollapseForm from "./CollapseForm";
import { FormItemProps } from "./FormItem";

const FormItemArray = (props: FormItemProps<ArrayType> & { onChange: () => void }) => {
  //

  if (props.field.items.type === "enum") {
    const lastFieldName = props.fieldNames[props.fieldNames.length - 1];

    return (
      <Form.Item
        key={lastFieldName}
        label={lastFieldName}
        name={props.fieldNames}
        required={props.field.required}
      >
        <Select
          placeholder={props.field.summary}
          allowClear
          mode="tags"
          options={props.field.items.enum?.map((val) => ({ value: val, label: val.toString() }))}
          onChange={props.onChange}
        />
      </Form.Item>
    );
  }

  if (props.field.items.type === "object") {
    const properties = props.field.items.properties;
    const lastFieldName = props.fieldNames[props.fieldNames.length - 1];

    return (
      <Form.Item
        key={lastFieldName}
        label={lastFieldName}
      >
        <Form.List name={props.fieldNames}>
          {(fields, opt) => (
            <>
              {fields.map((xfield, i) => (
                <Form.Item key={xfield.name}>
                  <CollapseForm
                    json={properties}
                    previousField={[xfield.name]}
                    extra={
                      <Space>
                        <b>{`index - [${i}]`}</b>
                        <CloseOutlined
                          onClick={() => {
                            opt.remove(xfield.name);
                          }}
                        />
                      </Space>
                    }
                    onChange={props.onChange}
                  />
                </Form.Item>
              ))}
              <Button
                type="dashed"
                onClick={() => opt.add()}
                block
                icon={<PlusOutlined />}
              >
                Add Sub Item
              </Button>
            </>
          )}
        </Form.List>
      </Form.Item>
    );
  }

  if (props.field.items.type === "string") {
    return (
      <FormList
        field={props.field}
        fieldNames={props.fieldNames}
      >
        <Input
          style={{ width: "100%" }}
          placeholder={props.field.items.summary}
        />
      </FormList>
    );
  }

  if (props.field.items.type === "number") {
    return (
      <FormList
        field={props.field}
        fieldNames={props.fieldNames}
      >
        <InputNumber
          style={{ width: "100%" }}
          placeholder={props.field.items.summary}
        />
      </FormList>
    );
  }

  if (props.field.items.type === "boolean") {
    return (
      <FormList
        field={props.field}
        fieldNames={props.fieldNames}
        isCheckbox={true}
      >
        <Checkbox />
      </FormList>
    );
  }

  if (props.field.items.type === "date") {
    return (
      <FormList
        field={props.field}
        fieldNames={props.fieldNames}
      >
        <DatePicker
          style={{ width: "100%" }}
          format={dateTimeFormat}
          showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
        />
      </FormList>
    );
  }

  if (props.field.items.type === "text") {
    return (
      <FormList
        field={props.field}
        fieldNames={props.fieldNames}
      >
        <Input.TextArea
          placeholder={props.field.summary}
          rows={props.field.items.textAreaLine}
        />
      </FormList>
    );
  }
};

interface FormListProps {
  field: ArrayType;
  fieldNames: (string | number)[];
  children: ReactNode;
  isCheckbox?: boolean;
}

const FormList = (props: FormListProps) => {
  //

  const lastFieldName = props.fieldNames[props.fieldNames.length - 1];

  return (
    <Form.Item
      key={lastFieldName}
      label={lastFieldName}
    >
      <Form.List name={props.fieldNames}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space.Compact
                key={key}
                style={{ width: "100%", display: "flex" }}
              >
                <Form.Item
                  style={{ width: "100%" }}
                  {...restField}
                  name={[name]}
                  rules={[{ required: props.field.items.required, message: "Missing input" }]}
                  valuePropName={props.isCheckbox ? "checked" : undefined}
                >
                  {props.children}
                </Form.Item>
                <MinusCircleOutlined
                  style={{ marginLeft: "10px", marginBottom: "24px" }}
                  onClick={() => remove(name)}
                />
              </Space.Compact>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form.Item>
  );
};

export default FormItemArray;
