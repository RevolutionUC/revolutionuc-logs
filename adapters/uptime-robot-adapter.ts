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
      iconUrl: `https://scontent.fdel5-1.fna.fbcdn.net/v/t1.0-9/106466793_3593514447345159_6087357964493207070_n.png?_nc_cat=106&_nc_sid=09cbfe&_nc_ohc=sXURKbWrZ7sAX8ayWuH&_nc_ht=scontent.fdel5-1.fna&oh=8da0e22f7f65a4f502eee30b97cce529&oe=5FA650B6`,
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