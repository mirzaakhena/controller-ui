import { DatePicker } from "antd";
import dayjs from "dayjs";
import dayjsPluginUTC from "dayjs/plugin/utc";
import { DateType } from "../model/data_type";
import { dateTimeFormat } from "../util/constant";
import FormItem, { FormItemProps } from "./FormItem";

dayjs.extend(dayjsPluginUTC);

const FormItemDate = (props: FormItemProps<DateType> & { onChange: () => void }) => {
  //

  return (
    <FormItem
      fieldNames={props.fieldNames}
      required={props.field.required}
    >
      <DatePicker
        style={{ width: "100%" }}
        format={dateTimeFormat}
        showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
        onChange={props.onChange}
        // disabled
      />
    </FormItem>
  );
};

export default FormItemDate;
