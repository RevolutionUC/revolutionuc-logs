import { APIGatewayEvent } from 'aws-lambda';
import { CardData, Color } from '../card/card';
import { Adapter } from './adapter';

const webhookKey = process.env.UPTIME_ROBOT_WEBHOOK_KEY;

interface UptimeRobotData {
  monitorID: string
  monitorURL: string
  monitorFriendlyName: string
  alertTypeFriendlyName: `Up` | `Down`
  alertDetails: string
  alertFriendlyDuration: string
};

const alertToColor: {[key: string]: Color} = {
  Up: `good`,
  Down: `attention`
};

export const UptimeRobotAdapter: Adapter = {
  async parseRequest(e: APIGatewayEvent) {
    const { key } = JSON.parse(e.body);
    if(key !== webhookKey) throw new Error(`Invalid webhook key!`);

    const data: UptimeRobotData = e.queryStringParameters as any;

    const cardData: CardData = {
      iconUrl: `https://assets.revolutionuc.com/logos/ur.png`,
      title: {
        text: `Monitor is ${data.alertTypeFriendlyName}`,
        color: alertToColor[data.alertTypeFriendlyName]
      },
      facts: [
        { title: `Status`, value: data.alertDetails },
        { title: `URL`, value: data.monitorURL }
      ],
      viewUrl: `https://uptimerobot.com/dashboard#${data.monitorID}`
    };

    data.alertTypeFriendlyName === 'Up' &&
      cardData.facts.push({ title: `Down for`, value: data.alertFriendlyDuration });

    return cardData;
  }
}