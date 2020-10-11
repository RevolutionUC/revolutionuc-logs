import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';
import Axios from 'axios';
import { getAdapter } from './adapters/adapter';
import { createCard } from './card/card';

const flowWebhook = process.env.FLOW_WEBHOOK;

export const log: Handler = async (e: APIGatewayEvent, ctx: Context, cb: Callback) => {
  try {
    // get event data and decide which adapter to use
    const { service } = e.queryStringParameters;

    // get the adapter and pass in event data
    const adapter = getAdapter(service);
    console.log(`Sending event data to adpater`);
    const data = await adapter.parseRequest(e);

    // create a card from the data returned by adapter
    console.log(`Creating card from card data`);
    const card = createCard(data);

    // send card over to teams
    console.log(`Sending card to flow`);
    await Axios({
      url: flowWebhook,
      method: `POST`,
      data: { title: data.title.text, card: JSON.stringify(card) }
    });

    // respond with a 200
    console.log(`Returning 200`);
    return { statusCode: 200 };
  } catch (err) {
    // failed authentication
    console.log(`Returning 403`);
    return { statusCode: 403 };
  }
};
