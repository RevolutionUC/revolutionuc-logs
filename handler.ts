import { APIGatewayEvent, Handler } from 'aws-lambda';
import Axios from 'axios';
import { getAdapter } from './adapters/adapter';
import { createCard } from './card/card';

const flowWebhook = process.env.FLOW_WEBHOOK;

export const log: Handler = async (e: APIGatewayEvent) => {
  try {
    const { service } = e.queryStringParameters;

    console.log(`Fetching adapter for service ${service}`);
    const adapter = getAdapter(service);
    if(!adapter) {
      throw new Error(`Invalid service string`);
    }

    console.log(`Sending request data to adpater`);
    const data = await adapter.parseRequest(e);

    console.log(`Creating card from card data titled ${data.title.text}`);
    const card = createCard(data);

    console.log(`Sending card to flow`);
    await Axios({
      url: flowWebhook,
      method: `POST`,
      data: { title: data.title.text, card: JSON.stringify(card) }
    });

    console.log(`Returning 200`);

    return { statusCode: 200 };
  } catch (err) {
    console.error(err);
    console.log(`Returning 403`);

    return { statusCode: 403, message: err.message };
  }
};

export const marco: Handler = async (e: APIGatewayEvent) => {
  return { statusCode: 200, message: `polo` };
};
