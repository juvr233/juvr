import React from 'react';

interface Product {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
}

interface ProductRecommendationProps {
  products: Product[];
}

const ProductRecommendation: React.FC<ProductRecommendationProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-center mb-8">为你推荐</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <p className="text-gray-700 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-purple-600">${product.price}</span>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors">
                  查看详情
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendation;
