import {useEffect, useRef, useState} from "react";
import {FixedSizeList as List} from "react-window";

/* eslint-disable react/prop-types */
const Carousel = ({
  images = [],
  isLoading = false,
  imageLimit = images.length,
  customPrevButton,
  customNextButton,
  onImgClick = () => {},
  imgPerSlide = 1,
}) => {
  const imgRef = useRef(null);
  const listRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgWidth, setImgWidth] = useState(0);

  useEffect(() => {
    if (images.length > 0) {
      setCurrentIndex(0);
    }
  }, [images]);

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageLimit - 1 : prevIndex - 1
    );
  };
  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imageLimit - 1 ? 0 : prevIndex + 1
    );
  };

  const Column = ({index, style}) => (
    <div style={style}>
      <img
        onLoad={() => setImgWidth(imgRef?.current?.offsetWidth)}
        ref={imgRef}
        key={images[index].id}
        src={images[index].url}
        onClick={() => onImgClick(images[index], index)}
        alt={images[index].title}
        className="image"
      />
    </div>
  );

  useEffect(() => {
    console.log(currentIndex * imgWidth);
    listRef.current.scrollTo(currentIndex * imgWidth);
  }, [currentIndex]);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div className="carousel" style={{width: imgPerSlide * imgWidth}}>
      <div
        className="image-container"
        // style={{transform: `translateX(-${currentIndex * imgWidth}px)`}}
      >
        <List
          ref={listRef}
          height={400}
          itemCount={images.length}
          itemSize={400}
          layout="horizontal"
          width={800}
        >
          {Column}
        </List>
      </div>
      {customPrevButton instanceof Function ? (
        customPrevButton(goToPrev)
      ) : (
        <button className="btn prev" onClick={goToPrev}>
          Prev
        </button>
      )}
      {customNextButton instanceof Function ? (
        customNextButton(goToNext)
      ) : (
        <button className="btn next" onClick={goToNext}>
          Next
        </button>
      )}
    </div>
  );
};

export default Carousel;
