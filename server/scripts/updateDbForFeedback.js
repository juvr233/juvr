/**
 * MongoDB Database Update Script for Feedback System
 * This script adds the necessary collections and indexes for the user feedback system
 */

// Use native MongoDB driver for direct database operations
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  // Read from environment variables or use defaults
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/divination',
  dbName: process.env.MONGO_DB_NAME || 'divination'
};

async function updateDatabase() {
  console.log('Starting database update for feedback system...');
  
  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(config.mongoUri);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(config.dbName);
    
    // Create userFeedback collection if it doesn't exist
    const collections = await db.listCollections({ name: 'userfeedbacks' }).toArray();
    
    if (collections.length === 0) {
      console.log('Creating userFeedbacks collection...');
      await db.createCollection('userfeedbacks');
      console.log('userFeedbacks collection created successfully');
    } else {
      console.log('userFeedbacks collection already exists');
    }
    
    // Create indexes
    console.log('Creating indexes for userFeedbacks collection...');
    
    const userFeedbackCollection = db.collection('userfeedbacks');
    
    // Index for unique user feedback per reading
    await userFeedbackCollection.createIndex(
      { userId: 1, readingId: 1 },
      { unique: true, background: true }
    );
    console.log('Created unique index on userId and readingId');
    
    // Index for querying by reading type and rating
    await userFeedbackCollection.createIndex(
      { readingType: 1, rating: 1 },
      { background: true }
    );
    console.log('Created index on readingType and rating');
    
    // Index for finding feedback that can be used for training
    await userFeedbackCollection.createIndex(
      { usedForTraining: 1, rating: 1 },
      { background: true }
    );
    console.log('Created index on usedForTraining and rating');
    
    // Create initial statistics document
    const statsCollection = db.collection('feedbackstats');
    
    // Check if stats document exists
    const statsDoc = await statsCollection.findOne({ type: 'global' });
    
    if (!statsDoc) {
      console.log('Creating initial feedback stats document...');
      await statsCollection.insertOne({
        type: 'global',
        lastUpdated: new Date(),
        readingTypes: {
          tarot: { totalCount: 0, averageRating: 0 },
          iching: { totalCount: 0, averageRating: 0 },
          bazi: { totalCount: 0, averageRating: 0 },
          numerology: { totalCount: 0, averageRating: 0 },
          compatibility: { totalCount: 0, averageRating: 0 },
          holistic: { totalCount: 0, averageRating: 0 }
        }
      });
      console.log('Initial feedback stats document created');
    }
    
    // Update schema version document
    const schemaCollection = db.collection('schemaversions');
    await schemaCollection.updateOne(
      { system: 'divination' },
      {
        $set: {
          'features.userFeedback': {
            version: '1.0.0',
            updatedAt: new Date()
          }
        }
      },
      { upsert: true }
    );
    console.log('Schema version updated');
    
    console.log('Database update for feedback system completed successfully!');
    
  } catch (error) {
    console.error('Error updating database:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the update
updateDatabase().catch(console.error); 