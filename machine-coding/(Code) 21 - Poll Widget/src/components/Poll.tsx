import React, { useState, useEffect, useCallback, CSSProperties } from "react";
import { Option } from "../db/api";

interface PollStyles {
  container?: CSSProperties;
  title?: CSSProperties;
  optionsContainer?: CSSProperties;
  optionLabel?: CSSProperties;
  optionInput?: CSSProperties;
  optionVotes?: CSSProperties;
  progressBar?: CSSProperties;
  progressBarFill?: CSSProperties;
  removeButton?: CSSProperties;
}

interface PollProps {
  pollId: number;
  title: string;
  options: Option[];
  isMultiple?: boolean;
  onVote: (pollId: number, selectedOptions: number[]) => Promise<Option[]>;
  onVoteRemove: (
    pollId: number,
    selectedOptions: number[]
  ) => Promise<Option[]>;
  styles?: PollStyles; // Add styles prop
}

const PollWidget: React.FC<PollProps> = ({
  pollId,
  title,
  options,
  isMultiple = false,
  onVote,
  onVoteRemove,
  styles = {},
}) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [currentOptions, setCurrentOptions] = useState<Option[]>(options);

  useEffect(() => {
    const storedVotes = localStorage.getItem(`poll-${pollId}`);
    if (storedVotes) {
      setSelectedOptions(JSON.parse(storedVotes));
    }
  }, [pollId]);

  const totalVotes = currentOptions.reduce(
    (acc, option) => acc + option.votes,
    0
  );

  const handleVote = async (optionId: number) => {
    let newSelectedOptions: number[];

    if (isMultiple) {
    } else {
      if (selectedOptions.length > 0 && selectedOptions[0] !== optionId) {
        const updatedOptions = await onVoteRemove(pollId, selectedOptions);
        setCurrentOptions(updatedOptions);
      }
      newSelectedOptions = [optionId];
      const updatedOptions = await onVote(pollId, newSelectedOptions);
      setCurrentOptions(updatedOptions);
    }

    setSelectedOptions(newSelectedOptions);
    localStorage.setItem(`poll-${pollId}`, JSON.stringify(newSelectedOptions));
  };

  const handleRemoveVote = useCallback(async () => {
    const updatedOptions = await onVoteRemove(pollId, selectedOptions);
    setSelectedOptions([]);
    localStorage.removeItem(`poll-${pollId}`);
    setCurrentOptions(updatedOptions); // Update the state with new options
  }, [pollId, selectedOptions, onVoteRemove]);

  return (
    <fieldset
      className="p-4 border border-gray-300 rounded-lg max-w-md mx-auto"
      role="group"
      aria-labelledby={`poll-${pollId}-title`}
      style={styles.container}
    >
      <legend
        id={`poll-${pollId}-title`}
        className="text-lg font-semibold"
        style={styles.title}
      >
        {title}
      </legend>
      <div
        className="space-y-2 overflow-y-auto"
        style={{
          ...styles.optionsContainer,
          maxHeight: currentOptions.length > 4 ? "200px" : "auto",
        }}
      >
        {currentOptions.map((option) => {
          const percentage =
            totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
          return (
            <div key={option.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  className="flex items-center space-x-2"
                  htmlFor={`option-${option.id}`}
                  style={styles.optionLabel}
                >
                  <input
                    id={`option-${option.id}`}
                    type={isMultiple ? "checkbox" : "radio"}
                    checked={selectedOptions.includes(option.id)}
                    onChange={() => handleVote(option.id)}
                    aria-checked={selectedOptions.includes(option.id)}
                    aria-describedby={`option-${option.id}-info`}
                    style={styles.optionInput}
                  />
                  <span id={`option-${option.id}-info`}>{option.title}</span>
                </label>
                {selectedOptions.length > 0 && (
                  <span style={styles.optionVotes}>
                    {option.votes} votes ({percentage.toFixed(1)}%)
                  </span>
                )}
              </div>
              <div
                className="w-full bg-gray-200 rounded-full h-2"
                style={styles.progressBar}
              >
                {selectedOptions.length > 0 && (
                  <div
                    className="bg-blue-500 h-full rounded-full transform origin-left"
                    style={{
                      ...styles.progressBarFill,
                      transform: `scaleX(${percentage / 100})`,
                    }}
                  ></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {selectedOptions.length > 0 && (
        <button
          className="mt-4 bg-red-500 text-white py-1 px-3 rounded"
          onClick={handleRemoveVote}
          style={styles.removeButton}
        >
          Remove Vote
        </button>
      )}
    </fieldset>
  );
};

export default PollWidget;
