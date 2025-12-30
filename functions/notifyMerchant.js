
/**
 * Appwrite Cloud Function: Notify Merchant of New Order
 * Trigger: databases.[DATABASE_ID].collections.errands.documents.create
 */

import { Client, Messaging } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const messaging = new Messaging(client);

  try {
    // Document created event payload
    const payload = JSON.parse(req.body);
    
    // Only proceed if a merchant is specified in the errand
    if (!payload.merchantId) {
      return res.json({ status: 'ignored', message: 'No merchantId associated with this errand' });
    }

    const { merchantId, id, budget } = payload;

    log(`Notifying merchant ${merchantId} about order ${id}`);

    // Send push notification to the merchant user ID
    // Assumes merchant user IDs match their merchant document IDs or mapped in preferences
    await messaging.createPush(
      [merchantId], // targeted user IDs
      `🔔 New Order: #${id.substring(0, 5)}`,
      `A customer has requested an errand worth $${budget}. Tap to accept.`,
      [], // data
      ['merchant-updates'], // topics
      'high' // priority
    );

    return res.json({ 
      status: 'success', 
      message: `Notification sent to merchant ${merchantId}` 
    });

  } catch (err) {
    error(`Error in NotifyMerchant: ${err.message}`);
    return res.json({ status: 'error', message: err.message }, 500);
  }
};
