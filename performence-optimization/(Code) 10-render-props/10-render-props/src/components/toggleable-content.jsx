/* eslint-disable react/prop-types */

import {useState} from "react";

const ToggleableContent = ({render}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <h2>Toggle Component</h2>
      {render({isOpen, toggle})}
    </div>
  );
};

export default ToggleableContent;
