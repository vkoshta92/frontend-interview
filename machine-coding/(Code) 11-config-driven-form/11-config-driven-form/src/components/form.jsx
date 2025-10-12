/* eslint-disable react/prop-types */

import {useState} from "react";
import FormField from "./form-field";
import * as yup from "yup";

const Form = ({schema = [], onSubmit = () => {}}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const validationSchema = yup.object().shape(
    schema.reduce((acc, field) => {
      if (field.validate) {
        acc[field.name] = field.validate;
      }
      return acc;
    }, {})
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, {abortEarly: false});

      setErrors({});
      onSubmit(formData);
    } catch (err) {
      const validationErrors = err.inner.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {});

      setErrors(validationErrors);
    }
  };

  const handleChange = (name, value) => {
    setFormData({...formData, [name]: value});
  };

  return (
    <form onSubmit={handleSubmit}>
      {schema.map((field, index) => {
        return (
          <FormField
            key={index}
            field={{
              ...field,
              error: errors[field.name],
            }}
            value={formData[field.name] || ""}
            onChange={handleChange}
          />
        );
      })}
      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;
