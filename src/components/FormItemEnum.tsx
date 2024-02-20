import { Select } from "antd";
import { EnumType } from "../model/data_type";
import FormItem, { FormItemProps } from "./FormItem";

const FormItemEnum = (props: FormItemProps<EnumType> & { onChange: () => void }) => {
  //

  return (
    <FormItem
      fieldNames={props.fieldNames}
      required={props.field.required}
    >
      <Select
        placeholder={props.field.summary}
        allowClear
        options={props.field.enum?.map((val) => ({ value: val, label: val.toString() }))}
        onChange={props.onChange}
      />
    </FormItem>
  );
};

export default FormItemEnum;
