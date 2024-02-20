import { Checkbox, Form } from "antd";
import { BooleanType } from "../model/data_type";
import { FormItemProps } from "./FormItem";

const FormItemBoolean = (props: FormItemProps<BooleanType>) => {
  //

  const lastFieldName = props.fieldNames[props.fieldNames.length - 1];

  return (
    <Form.Item
      key={lastFieldName}
      name={props.fieldNames}
      required={props.field.required}
      valuePropName="checked"
    >
      <Checkbox>{lastFieldName}</Checkbox>
    </Form.Item>
  );
};

export default FormItemBoolean;
