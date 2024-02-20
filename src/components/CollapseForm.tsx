import { Collapse } from "antd";
import { ReactNode } from "react";
import { InputType } from "../model/data_type";
import { generateForm } from "./FormComponent";

const CollapseForm: React.FC<{ json: Record<string, InputType>; previousField: (string | number)[]; onChange: () => void; extra?: ReactNode }> = ({
  json,
  previousField,
  extra,
  onChange,
}) => {
  //

  const innerCardStyle = previousField.length ? {} : { marginTop: "20px" };

  return (
    <Collapse
      size="small"
      style={innerCardStyle}
      collapsible="header"
      defaultActiveKey={["1"]}
      items={[
        {
          key: "1",
          label: previousField.length === 0 ? "Body" : "",
          children: generateForm(json, previousField, onChange),
          extra,
        },
      ]}
    />
  );
};

export default CollapseForm;
