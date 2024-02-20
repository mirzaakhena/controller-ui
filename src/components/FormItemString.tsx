import { Input } from "antd";
import FormItem, { FormItemProps } from "./FormItem";
import { StringType } from "../model/data_type";

const FormItemString = (props: FormItemProps<StringType>) => {
  //

  return (
    <FormItem
      fieldNames={props.fieldNames}
      required={props.field.required}
    >
      <Input
        placeholder={props.field.summary}
        maxLength={props.field.maxLength}
      />
    </FormItem>
  );
};

export default FormItemString;
