import { Form } from "antd";
import { ReactNode } from "react";

interface Props {
  fieldNames: (string | number)[];
  required?: boolean;
  children: ReactNode;
}

const FormItem = (props: Props) => {
  //
  const lastFieldName = props.fieldNames[props.fieldNames.length - 1];

  return (
    <Form.Item
      key={lastFieldName}
      label={lastFieldName}
      name={props.fieldNames}
      required={props.required}
    >
      {props.children}
    </Form.Item>
  );
};

export default FormItem;

export interface FormItemProps<T> {
  field: T;
  fieldNames: (string | number)[];
}
