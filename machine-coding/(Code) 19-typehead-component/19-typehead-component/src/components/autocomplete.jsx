/* eslint-disable react/prop-types */

import {useState, useEffect, useCallback, useRef} from "react";
import debounce from "lodash/debounce";
import SuggestionsList from "./suggestions-list";
import useCache from "../hooks/use-cache";
import "./styles.css";

const Autocomplete = ({
  staticData,
  fetchSuggestions,
  caching = true,
  placeholder = "",
  customloading = "Loading...",
  onSelect = () => {},
  onBlur = () => {},
  onFocus = () => {},
  onChange = () => {},
  customStyles = {},
  dataKey = "",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const suggestionsListRef = useRef(null);

  const {setCache, getCache} = useCache("autocompleteCache", 3600); // Cache expires in 1 hour

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    onChange(event.target.value);
  };

  const scrollIntoView = (index) => {
    if (suggestionsListRef.current) {
      const suggestionElements =
        suggestionsListRef.current.getElementsByTagName("li");
      if (suggestionElements[index]) {
        suggestionElements[index].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowDown":
        setSelectedIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % suggestions.length;
          scrollIntoView(newIndex);
          return newIndex;
        });
        break;
      case "ArrowUp":
        setSelectedIndex((prevIndex) => {
          const newIndex =
            (prevIndex - 1 + suggestions.length) % suggestions.length;
          scrollIntoView(newIndex);
          return newIndex;
        });
        break;
      case "Enter":
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      default:
        break;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(dataKey ? suggestion[dataKey] : suggestion);
    onSelect(suggestion);
    setSuggestions([]);
  };

  const getSuggestions = async (query) => {
    setError(null);

    const cachedSuggestions = getCache(query);
    if (cachedSuggestions && caching) {
      setSuggestions(cachedSuggestions);
    } else {
      setLoading(true);
      try {
        let result;
        if (staticData) {
          result = staticData.filter((item) =>
            item.toLowerCase().includes(query.toLowerCase())
          );
        } else if (fetchSuggestions) {
          result = await fetchSuggestions(query);
        }
        setCache(query, result);
        setSuggestions(result);
      } catch (err) {
        setError("Failed to fetch suggestions");
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getSuggestionsDebounced = useCallback(
    debounce(getSuggestions, 300),
    []
  );

  useEffect(() => {
    if (inputValue.length > 1) {
      getSuggestionsDebounced(inputValue);
    } else {
      setSuggestions([]);
    }
    setSelectedIndex(-1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  return (
    <div className="autocomplete-container">
      <input
        style={customStyles}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder={placeholder}
        className="autocomplete-input"
        onKeyDown={handleKeyDown}
        aria-autocomplete="list"
        aria-controls="suggestions-list"
        aria-activedescendant={`suggestion-${selectedIndex}`}
      />
      {(suggestions.length > 0 || loading || error) && (
        <ul
          id="suggestions-list"
          className="suggestions-list"
          role="listbox"
          ref={suggestionsListRef}
        >
          {error && <div className="error">{error}</div>}
          {loading && <div className="loading">{customloading}</div>}

          <SuggestionsList
            dataKey={dataKey}
            suggestions={suggestions}
            highlight={inputValue}
            onSuggestionClick={handleSuggestionClick}
            selectedIndex={selectedIndex}
          />
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
