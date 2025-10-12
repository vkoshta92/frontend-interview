export interface Option {
  id: number;
  title: string;
  votes: number;
}

export interface Poll {
  id: number;
  question: string;
  totalCount: number;
  options: Option[];
}

// Fetch a specific poll by ID
export const fetchPoll = async (pollId: number): Promise<Poll> => {
  const response = await fetch(`http://localhost:3000/polls/${pollId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch poll");
  }
  return response.json();
};

// Submit a vote to the poll
export const submitVote = async (
  pollId: number,
  selectedOptions: number[]
): Promise<Option[]> => {
  const poll = await fetchPoll(pollId);
  const updatedOptions = poll.options.map((option) => {
    if (selectedOptions.includes(option.id)) {
      return { ...option, votes: option.votes + 1 };
    }
    return option;
  });

  const totalCount = updatedOptions.reduce(
    (acc, option) => acc + option.votes,
    0
  );

  await fetch(`http://localhost:3000/polls/${pollId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ options: updatedOptions, totalCount }),
  });

  return updatedOptions;
};

// Remove a vote from the poll
export const removeVote = async (
  pollId: number,
  selectedOptions: number[]
): Promise<Option[]> => {
  const poll = await fetchPoll(pollId);
  const updatedOptions = poll.options.map((option) => {
    if (selectedOptions.includes(option.id)) {
      return { ...option, votes: option.votes > 0 ? option.votes - 1 : 0 };
    }
    return option;
  });

  const totalCount = updatedOptions.reduce(
    (acc, option) => acc + option.votes,
    0
  );

  await fetch(`http://localhost:3000/polls/${pollId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ options: updatedOptions, totalCount }),
  });

  return updatedOptions;
};
