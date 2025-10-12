/* eslint-disable react/prop-types */

const ProductCard = ({product}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden border-2 p-4">
      <img
        src={product.thumbnail}
        alt={product.title}
        className="w-full h-48 object-cover"
      />
      <h2 className="text-lg font-semibold mt-2">{product.title}</h2>
      <p className="text-gray-500">${product.price}</p>
    </div>
  );
};

export default ProductCard;
