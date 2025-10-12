import {useState} from "react";
import useDebounce from "../hooks/use-debounce";

const DebouncedInput = () => {
  const [inputText, setInputText] = useState("");

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const debouncedValue = useDebounce(inputText, 1000, () => {
    // API Call
    console.log("Function Call");
  });

  return (
    <div>
      <p>{debouncedValue}</p>
      <input
        type="text"
        value={inputText}
        placeholder="Type Something... "
        onChange={handleInputChange}
      />
    </div>
  );
};

export default DebouncedInput;
