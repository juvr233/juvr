import { Request, Response } from 'express';
import * as shopifyService from '../services/shopify.service';
import User from '../models/user.model';
import { logger } from '../config/logger';

// Correlate Shopify customer account with local user account
const linkShopifyCustomer = async (userId: any, shopifyCustomerId: string, shopifyAccessToken: string) => {
  try {
    await User.findByIdAndUpdate(userId, { 
      shopifyCustomerId,
      shopifyAccessToken 
    });
    logger.info(`Linked Shopify customer ${shopifyCustomerId} to user ${userId}`);
  } catch (error) {
    logger.error(`Failed to link Shopify customer to user ${userId}:`, error);
  }
};

export const registerShopifyCustomer = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = (req.user as any)._id; // From protect middleware

    const shopifyCustomerData = await shopifyService.createCustomer({ email, password, firstName, lastName });

    if (shopifyCustomerData.customerUserErrors.length > 0) {
      return res.status(400).json({ errors: shopifyCustomerData.customerUserErrors });
    }

    const shopifyCustomer = shopifyCustomerData.customer;
    
    // Now, log the customer in to get an access token
    const loginData = await shopifyService.customerLogin({ email, password });

    if (loginData.customerUserErrors.length > 0) {
      // This case is unlikely if registration succeeded, but handle it anyway
      return res.status(400).json({ errors: loginData.customerUserErrors });
    }

    const shopifyAccessToken = loginData.customerAccessToken.accessToken;

    // Link accounts in the background
    linkShopifyCustomer(userId, shopifyCustomer.id, shopifyAccessToken);

    res.status(201).json({
      message: 'Shopify customer created and linked successfully.',
      shopifyCustomer,
      shopifyAccessToken,
    });

  } catch (error) {
    logger.error('Shopify customer registration failed:', error);
    res.status(500).json({ message: 'An error occurred during Shopify customer registration.' });
  }
};

export const loginShopifyCustomer = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = (req.user as any)._id;

    const loginData = await shopifyService.customerLogin({ email, password });

    if (loginData.customerUserErrors.length > 0) {
      return res.status(401).json({ errors: loginData.customerUserErrors });
    }

    const shopifyAccessToken = loginData.customerAccessToken.accessToken;
    
    // Get Shopify customer ID to link accounts
    const shopifyCustomer = await shopifyService.getCustomer(shopifyAccessToken);
    if (shopifyCustomer) {
      linkShopifyCustomer(userId, shopifyCustomer.id, shopifyAccessToken);
    }

    res.status(200).json({
      message: 'Shopify customer logged in successfully.',
      shopifyAccessToken,
    });

  } catch (error) {
    logger.error('Shopify customer login failed:', error);
    res.status(500).json({ message: 'An error occurred during Shopify customer login.' });
  }
};
