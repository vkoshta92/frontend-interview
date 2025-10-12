const ProductCardSkeleton = ({count}) => {
  return Array(count)
    .fill(null)
    .map((_, i) => {
      return (
        <div
          key={i}
          className="rounded-lg overflow-hidden border-2 p-4 bg-grey-200"
        >
          <div className="h-48 bg-gray-400 mb-2"></div>
          <div className="h-6 w-2/3 bg-gray-400 mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-400"></div>
        </div>
      );
    });
};

export default ProductCardSkeleton;
