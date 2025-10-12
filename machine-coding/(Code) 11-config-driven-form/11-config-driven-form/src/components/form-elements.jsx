/* eslint-disable react/prop-types */

const TextFeild = ({name, label, isRequired, type, onChange}) => {
  const handleBlur = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="inputContainer">
      <label htmlFor={name}>
        {label}
        {isRequired && <span>*</span>}
      </label>
      <input type={type} name={name} onBlur={handleBlur} />
    </div>
  );
};

const Checkbox = ({name, label, isRequired, onChange}) => {
  return (
    <div className="inputContainer">
      <input
        type="checkbox"
        name={name}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor={name}>
        {label}
        {isRequired && <span>*</span>}
      </label>
    </div>
  );
};

const RadioButton = ({name, label, options, isRequired, onChange}) => {
  return (
    <div className="inputContainer">
      <label>
        {label}
        {isRequired && <span>*</span>}
      </label>

      {options.map((option) => {
        return (
          <div className="inputContainer" key={option}>
            <input
              id={option}
              type="radio"
              name={name}
              value={option}
              onChange={(e) => onChange(e.target.value)}
            />
            <label htmlFor={option}>{option}</label>
          </div>
        );
      })}
    </div>
  );
};

const DatePicker = ({name, label, isRequired, onChange}) => {
  return (
    <div className="inputContainer">
      <label htmlFor={name}>
        {label}
        {isRequired && <span>*</span>}
      </label>
      <input
        type="date"
        name={name}
        id={name}
        onChange={(e) => onChange(e.target.value)}
        placeholder="MM/DD/YYYY"
      />
    </div>
  );
};

const Slider = ({name, label, minValue, maxValue, isRequired, onChange}) => {
  return (
    <div className="inputContainer">
      <label htmlFor={name}>
        {label}
        {isRequired && <span>*</span>}
      </label>
      <input
        type="range"
        name={name}
        id={name}
        min={minValue}
        max={maxValue}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export {TextFeild, Checkbox, RadioButton, DatePicker, Slider};
