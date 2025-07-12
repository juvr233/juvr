This library provides support for the backends of TypeScript/JavaScript Shopify apps to access the Shopify Admin API, by making it easier to perform the following actions:

Creating online or offline access tokens for the Admin API via OAuth
Making requests to the REST API
Making requests to the GraphQL API
Register/process webhooks
Once your app has access to the Admin API, you can also access the Shopify Storefront API to run GraphQL queries using the unauthenticated_* access scopes.

This library can be used in any application that runs on one of the supported runtimes. It doesn't rely on any specific framework, so you can include it alongside your preferred stack and only use the features that you need to build your app.

Note: this package will enable your app's backend to work with Shopify APIs, but you'll need to use Shopify App Bridge in your frontend if you're planning on embedding your app into the Shopify Admin.

Requirements
To follow these usage guides, you will need to:

have a basic understanding of TypeScript
have a Shopify Partner account and development store
OR have a test store where you can create a private app
have a private or custom app already set up in your test store or partner account
use ngrok, in order to create a secure tunnel to your app running on your localhost
add the ngrok URL and the appropriate redirect for your OAuth callback route to your app settings
have a JavaScript package manager such as yarn installed
Getting started
To install this package, you can run this on your terminal:

# You can use your preferred Node package manager
pnpm add @shopify/shopify-api
Note: throughout these docs, we'll provide some examples of how this library may be used in an app using the Express.js framework for simplicity, but you can use it with any framework you prefer, as mentioned before.

The first thing you need to import is the adapter for your app's runtime. This will internally set up the library to use the right defaults and behaviours for the runtime.

Node.js
import '@shopify/shopify-api/adapters/node';
CloudFlare Worker
import '@shopify/shopify-api/adapters/cf-worker';
Generic runtimes that implement the Web API
import '@shopify/shopify-api/adapters/web-api';
Next, configure the library - you'll need some values in advance:

Your app's API key from Partners dashboard (also called Client ID)
Your app's API secret from Partners dashboard (also called Client secret)
The scopes you need for your app
Call shopifyApi (see reference) to create your library object before setting up your app itself:

import '@shopify/shopify-api/adapters/node';
import {shopifyApi, LATEST_API_VERSION} from '@shopify/shopify-api';
import express from 'express';

const shopify = shopifyApi({
  // The next 4 values are typically read from environment variables for added security
  apiKey: 'APIKeyFromPartnersDashboard',
  apiSecretKey: 'APISecretFromPartnersDashboard',
  scopes: ['read_products'],
  hostName: 'ngrok-tunnel-address',
  ...
});

const app = express();
Next steps
Once you configure your app, you can use this package to access the Shopify APIs. See the reference documentation for details on all the methods provided by this package.

See the specific documentation in the Guides section for high-level instructions on how to get API access tokens and use them to query the APIs.

As a general rule, apps will want to interact with the Admin API to fetch / submit data to Shopify. To do that, apps will need to:

Create an Admin API access token by going through the OAuth flow.
Set up its own endpoints to:
Fetch the current session created in the OAuth process.
Create a REST or GraphQL API client.
Use the client to query the appropriate Admin API.
Guides
Performing OAuth
Storing sessions
Setting up webhooks
Using REST resources
Using GraphQL types
Configuring Billing
Adding custom runtimes
Customizing logging configuration
Setting up a custom store app
Testing your app
Migrating to v6
Before v6, this library only worked on Node.js runtimes. It now supports multiple runtimes through the use of adapters, more of which can be added over time. If an adapter for the runtime you wish to use doesn't exist, you can create your own adapter by implementing some key functions, or contribute a PR to this repository.

In addition to updating the library to work on different runtimes, we've also improved its public interface to make it easier for apps to load only the features they need from the library. If you're upgrading an existing app on v5 or earlier, please see the migration guide for v6.