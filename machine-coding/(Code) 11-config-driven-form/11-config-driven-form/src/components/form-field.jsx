/* eslint-disable react/prop-types */

import React from "react";
import {
  Checkbox,
  DatePicker,
  RadioButton,
  Slider,
  TextFeild,
} from "./form-elements";

const componentMapping = {
  TEXT_FIELD: TextFeild,
  CHECKBOX: Checkbox,
  RADIO_BUTTON: RadioButton,
  DATE_PICKER: DatePicker,
  SLIDER: Slider,
};

const FormField = ({field, onChange}) => {
  const Component = componentMapping[field.component];

  if (Component) {
    return (
      <React.Fragment>
        <Component
          {...field}
          onChange={(value) => onChange(field.name, value)}
        />
        {field?.error && <p style={{color: "red"}}>{field?.error}</p>}
      </React.Fragment>
    );
  }

  return null;
};

export default FormField;
