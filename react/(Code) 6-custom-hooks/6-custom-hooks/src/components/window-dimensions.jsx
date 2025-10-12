import useWindowSize from "../hooks/use-window-size";

const WindowDimensions = () => {
  const {width, height} = useWindowSize();

  return (
    <div>
      <p>Window Width: {width}</p>
      <p>Window Height: {height}</p>
    </div>
  );
};

export default WindowDimensions;
