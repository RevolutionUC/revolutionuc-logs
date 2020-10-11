import { APIGatewayEvent } from 'aws-lambda';
import { Color } from '../card/card';
import { Adapter } from './adapter';

interface NetlifyData {
  state: "building" | "ready" | "error"
  url: string
  admin_url: string
  created_at: string
  updated_at: string
  error_message: string | null
};

const stateToColor: {[key: string]: Color} = {
  building: `accent`,
  ready: `good`,
  error: `attention`
};

const dateToEST = input => (new Date(input)).toLocaleString("en-US", { timeZone: "America/Atikokan" });

export const NetlifyAdapter: Adapter = {
  async parseRequest(e: APIGatewayEvent) {
    const data: NetlifyData = JSON.parse(e.body);

    return {
      iconUrl: `https://img.stackshare.io/service/2748/lV55uZMx.png`,
      title: {
        text: `Site ${data.state}`,
        color: stateToColor[data.state]
      },
      facts: [
        { title: `Site`, value: data.url },
        { title: `Created at`, value: dateToEST(data.created_at) },
        { title: `Updated at`, value: dateToEST(data.updated_at) }
      ],
      viewUrl: data.admin_url
    };
  }
}