import { useState } from "react";

export default function TodoItem({ item, onUpdate }) {
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(item.title);

  const save = () => {
    onUpdate(item.id, value);
    setEdit(false);
  };

  return (
    <div style={{ border: "1px solid #ccc", margin: 8, padding: 8 }}>
      {edit ? (
        <>
          <input value={value} onChange={(e) => setValue(e.target.value)} />
          <button onClick={save}>Save</button>
        </>
      ) : (
        <>
          <span>{item.title}</span>
          <button onClick={() => setEdit(true)}>Edit</button>
        </>
      )}
    </div>
  );
}
