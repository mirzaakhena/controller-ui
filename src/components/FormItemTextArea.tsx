import { Input } from "antd";
import { TextAreaType } from "../model/data_type";
import FormItem, { FormItemProps } from "./FormItem";

const FormItemTextArea = (props: FormItemProps<TextAreaType>) => {
  //

  return (
    <FormItem
      fieldNames={props.fieldNames}
      required={props.field.required}
    >
      <Input.TextArea
        placeholder={props.field.summary}
        rows={props.field.textAreaLine}
      />
    </FormItem>
  );
};

// autoSize={{ minRows: 3, maxRows: 5 }}
// style={{ height: 120, resize: 'none' }}
// showCount
// disabled

export default FormItemTextArea;
