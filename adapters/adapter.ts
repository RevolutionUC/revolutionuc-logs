import { APIGatewayEvent } from 'aws-lambda';
import { CardData } from '../card/card';
import { GithubAdapter } from './github-adapter';
import { HerokuAdapter } from './heroku-adapter';
import { NetlifyAdapter } from './netlify-adapter';
import { UptimeRobotAdapter } from './uptime-robot-adapter';

const adapters = {
  netlify: NetlifyAdapter,
  github: GithubAdapter,
  heroku: HerokuAdapter,
  uptimerobot: UptimeRobotAdapter
};

export interface Adapter {
  parseRequest(e: APIGatewayEvent): Promise<CardData>
};

export const getAdapter = (service: string): Adapter => adapters[service];
