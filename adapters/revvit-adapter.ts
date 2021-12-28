import { APIGatewayEvent } from 'aws-lambda';
import { CardData } from '../card/card';
import { Adapter } from "./adapter";

interface DailyUpdate {
  total: {
    registrants: number;
    confirmed: number;
  };
  last24hrs: {
    registrants: number;
    confirmed: number;
  };
}

export const RevvitAdapter: Adapter = {
  async parseRequest(e: APIGatewayEvent) {
    const data: DailyUpdate = JSON.parse(e.body);

    const cardData: CardData = {
      iconUrl: '',
      title: {
        text: 'Daily Registration Update',
        color: 'default'
      },
      facts: [
        {
          title: 'Total Registrants',
          value: data.total.registrants.toString()
        },
        {
          title: 'Registered in last 24hrs',
          value: data.last24hrs.registrants.toString()
        },
        {
          title: 'Total Confirmed',
          value: data.total.confirmed.toString()
        },
        {
          title: 'Confirmed in last 24hrs',
          value: data.last24hrs.confirmed.toString()
        }
      ],
      viewUrl: 'https://stats.revolutionuc.com/'
    };

    return cardData;
  }
}