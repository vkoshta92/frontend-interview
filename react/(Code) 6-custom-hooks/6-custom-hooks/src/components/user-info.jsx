import useLocalStorage from "../hooks/use-local-storage";

const UserInfo = () => {
  const [value, set, remove] = useLocalStorage("username", "Guest");

  const handleLogout = () => {
    remove();
    set("");
  };

  return (
    <div>
      <h3>Hello {value}</h3>
      <input
        type="text"
        placeholder="Enter your name"
        value={value}
        onChange={(e) => set(e.target.value)}
      />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserInfo;
