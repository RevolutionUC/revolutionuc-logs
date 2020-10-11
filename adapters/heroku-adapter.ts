import { APIGatewayEvent } from 'aws-lambda';
import { Color } from '../card/card';
import { Adapter } from './adapter';

interface HerokuData {
  data: {
    id: string    
    app: { name: string }
    status: `pending` | `succeeded` | `failed`
    created_at: string
    updated_at: string
  }
  actor: { email: string }
};

const statusToColor: {[key: string]: Color} = {
  pending: `accent`,
  succeeded: `good`,
  failed: `attention`
};

const dateToEST = input => (new Date(input)).toLocaleString("en-US", { timeZone: "America/Atikokan" });

export const HerokuAdapter: Adapter = {
  async parseRequest(e: APIGatewayEvent) {
    const { data, actor }: HerokuData = JSON.parse(e.body);

    return {
      iconUrl: `https://ph-files.imgix.net/e70773df-1ac9-4d23-8eed-cebe4d9e1d11?auto=format&auto=compress&codec=mozjpeg&cs=strip`,
      title: {
        text: `Build ${data.status === `pending` ? `started` : data.status}`,
        color: statusToColor[data.status]
      },
      facts: [
        { title: `App`, value: data.app.name },
        { title: `By`, value: actor.email },
        { title: `Created at`, value: dateToEST(data.created_at) },
        { title: `Updated at`, value: dateToEST(data.updated_at) }
      ],
      viewUrl: `https://dashboard.heroku.com/apps/${data.app.name}/activity/builds/${data.id}`
    };
  }
}