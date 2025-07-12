import axios from 'axios';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// Shopify配置
const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL || 'https://your-store.myshopify.com';
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2025-07';
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN || 'bb700b526ea36bedf8f3ed68cf8f8974';
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN || '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';
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY || '1332cf0da7e008b854a6978f2e27044e';
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET || '49066cf6a268bef827734e3847d5ddf0';

// Storefront API客户端
const storefrontApi = axios.create({
  baseURL: `${SHOPIFY_STORE_URL}/api/${SHOPIFY_API_VERSION}/graphql.json`,
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
  },
});

// Admin API客户端
const adminApi = axios.create({
  baseURL: `${SHOPIFY_STORE_URL}/admin/api/${SHOPIFY_API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
  },
});

export const getProducts = async (query: string) => {
  const graphqlQuery = {
    query: `
      query getProducts($query: String) {
        products(first: 10, query: $query) {
          edges {
            node {
              id
              title
              description
              images(first: 1) {
                edges {
                  node {
                    src
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: { query },
  };

  const response = await storefrontApi.post('', graphqlQuery);
  return response.data.data.products.edges.map((edge: any) => edge.node);
};

export const createCheckout = async (variantId: string, quantity: number) => {
  const graphqlQuery = {
    query: `
      mutation createCheckout($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            webUrl
          }
          checkoutUserErrors {
            code
            field
            message
          }
        }
      }
    `,
    variables: {
      input: {
        lineItems: [{ variantId, quantity }],
      },
    },
  };

  const response = await storefrontApi.post('', graphqlQuery);
  return response.data.data.checkoutCreate;
};

export const getCustomerOrders = async (customerAccessToken: string) => {
    const graphqlQuery = {
      query: `
        query getCustomerOrders($customerAccessToken: String!) {
          customer(customerAccessToken: $customerAccessToken) {
            orders(first: 10) {
              edges {
                node {
                  id
                  name
                  processedAt
                  totalPrice {
                    amount
                    currencyCode
                  }
                  lineItems(first: 5) {
                    edges {
                      node {
                        title
                        quantity
                      }
                    }
                  }
                  fulfillmentStatus
                  shippingAddress {
                    address1
                    city
                    zip
                    country
                  }
                }
              }
            }
          }
        }
      `,
      variables: { customerAccessToken },
    };
  
    const response = await storefrontApi.post('', graphqlQuery);
    return response.data.data.customer.orders.edges.map((edge: any) => edge.node);
};

export const createCustomer = async (input: any) => {
  const graphqlQuery = {
    query: `
      mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            firstName
            lastName
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `,
    variables: { input },
  };

  const response = await storefrontApi.post('', graphqlQuery);
  return response.data.data.customerCreate;
};

export const customerLogin = async (input: any) => {
  const graphqlQuery = {
    query: `
      mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `,
    variables: { input },
  };

  const response = await storefrontApi.post('', graphqlQuery);
  return response.data.data.customerAccessTokenCreate;
};

export const renewCustomerAccessToken = async (customerAccessToken: string) => {
  const graphqlQuery = {
    query: `
      mutation customerAccessTokenRenew($customerAccessToken: String!) {
        customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: { customerAccessToken },
  };
  const response = await storefrontApi.post('', graphqlQuery);
  return response.data.data.customerAccessTokenRenew;
};

export const getCustomer = async (customerAccessToken: string) => {
  const graphqlQuery = {
    query: `
      query getCustomer($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          id
          email
          firstName
          lastName
        }
      }
    `,
    variables: { customerAccessToken },
  };
  const response = await storefrontApi.post('', graphqlQuery);
  return response.data.data.customer;
};

// 创建产品
export const createProduct = async (product: any) => {
  const response = await adminApi.post('/products.json', { product });
  return response.data.product;
};

// 获取产品详情
export const getProductById = async (productId: string) => {
  const response = await adminApi.get(`/products/${productId}.json`);
  return response.data.product;
};

// 更新产品
export const updateProduct = async (productId: string, product: any) => {
  const response = await adminApi.put(`/products/${productId}.json`, { product });
  return response.data.product;
};

// 删除产品
export const deleteProduct = async (productId: string) => {
  await adminApi.delete(`/products/${productId}.json`);
  return true;
};

// 创建订单
export const createOrder = async (order: any) => {
  const response = await adminApi.post('/orders.json', { order });
  return response.data.order;
};

// 获取订单详情
export const getOrderById = async (orderId: string) => {
  const response = await adminApi.get(`/orders/${orderId}.json`);
  return response.data.order;
};

// 更新订单
export const updateOrder = async (orderId: string, order: any) => {
  const response = await adminApi.put(`/orders/${orderId}.json`, { order });
  return response.data.order;
};

// 取消订单
export const cancelOrder = async (orderId: string, reason?: string) => {
  const response = await adminApi.post(`/orders/${orderId}/cancel.json`, { reason });
  return response.data.order;
};
