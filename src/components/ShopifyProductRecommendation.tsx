import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  images: {
    edges: {
      node: {
        src: string;
      };
    }[];
  };
  variants: {
    edges: {
      node: {
        id: string;
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    }[];
  };
}

interface RecommendationProps {
  numerology?: { lifePath: number; expression: number };
  tarot?: string[];
  iching?: string;
}

const ShopifyProductRecommendation: React.FC<RecommendationProps> = ({ numerology, tarot, iching }) => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await api.post('/recommendations', { numerology, tarot, iching });
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch product recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [numerology, tarot, iching]);

  const handleBuyNow = async (variantId: string) => {
    try {
      const response = await api.post('/shopify/checkout', { variantId, quantity: 1 });
      const { webUrl } = response.data.checkout;
      if (webUrl) {
        window.location.href = webUrl;
      }
    } catch (error) {
      console.error('Failed to create checkout:', error);
    }
  };

  if (loading) {
    return <div>Loading recommendations...</div>;
  }

  if (products.length === 0) {
    return <div>No recommendations found.</div>;
  }

  return (
    <div className="product-recommendations">
      <h3>Recommended for You</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="border p-4 rounded">
            <img src={product.images.edges[0]?.node.src} alt={product.title} className="w-full h-48 object-cover mb-4" />
            <h4 className="font-bold">{product.title}</h4>
            <p>{product.description}</p>
            <p>
              {product.variants.edges[0]?.node.price.amount} {product.variants.edges[0]?.node.price.currencyCode}
            </p>
            <button onClick={() => handleBuyNow(product.variants.edges[0]?.node.id)}>
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopifyProductRecommendation;
