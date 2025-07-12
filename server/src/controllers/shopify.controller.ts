import { Request, Response } from 'express';
import * as shopifyService from '../services/shopify.service';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const products = await shopifyService.getProducts(query as string);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products from Shopify', error });
  }
};

export const createCheckout = async (req: Request, res: Response) => {
  try {
    const { variantId, quantity } = req.body;
    const checkout = await shopifyService.createCheckout(variantId, quantity);
    res.json(checkout);
  } catch (error) {
    res.status(500).json({ message: 'Error creating checkout', error });
  }
};

export const getCustomerOrders = async (req: Request, res: Response) => {
    try {
      const { customerAccessToken } = req.body; 
      if (!customerAccessToken) {
        return res.status(401).json({ message: 'Unauthorized: Customer access token is required.' });
      }
      const orders = await shopifyService.getCustomerOrders(customerAccessToken);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching customer orders', error });
    }
  };
