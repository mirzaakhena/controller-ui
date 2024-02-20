import { Form } from "antd";
import { ObjectType } from "../model/data_type";
import CollapseForm from "./CollapseForm";
import { FormItemProps } from "./FormItem";

const FormItemObject = (props: FormItemProps<ObjectType> & { onChange: () => void }) => {
  //

  const lastFieldName = props.fieldNames[props.fieldNames.length - 1];

  return (
    <Form.Item
      key={lastFieldName}
      label={lastFieldName}
    >
      <CollapseForm
        json={props.field.properties}
        previousField={props.fieldNames}
        onChange={props.onChange}
      />
    </Form.Item>
  );
};

export default FormItemObject;
