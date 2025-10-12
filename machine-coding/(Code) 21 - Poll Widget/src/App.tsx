import React, { useState, useEffect } from "react";
import PollWidget from "./components/Poll";
import { fetchPoll, submitVote, removeVote, Poll as PollType } from "./db/api";
import Loading from "./components/loading";

const App: React.FC = () => {
  const [pollData, setPollData] = useState<PollType | null>(null);

  useEffect(() => {
    const loadPoll = async () => {
      try {
        const data = await fetchPoll(41);
        setPollData(data);
      } catch (error) {
        console.error("Failed to load poll:", error);
      }
    };

    loadPoll();
  }, []);

  if (!pollData) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex items-start pt-20 justify-center bg-gray-100">
      <PollWidget
        pollId={pollData.id}
        title={pollData.question}
        options={pollData.options}
        // isMultiple
        onVote={submitVote}
        onVoteRemove={removeVote}
        styles={{}}
      />
    </div>
  );
};

export default App;
