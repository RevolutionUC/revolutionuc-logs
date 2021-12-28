import { APIGatewayEvent } from 'aws-lambda';
import { CardData } from '../card/card';
import { NetlifyAdapter } from './netlify-adapter';
import { GithubAdapter } from './github-adapter';
import { HerokuAdapter } from './heroku-adapter';
import { TravisAdapter } from './travis-adapter';
import { UptimeRobotAdapter } from './uptime-robot-adapter';
import { RevvitAdapter } from './revvit-adapter';

const adapters = {
  netlify: NetlifyAdapter,
  github: GithubAdapter,
  heroku: HerokuAdapter,
  travis: TravisAdapter,
  uptimerobot: UptimeRobotAdapter,
  revvit: RevvitAdapter
};

export interface Adapter {
  parseRequest(e: APIGatewayEvent): Promise<CardData>
};

export const getAdapter = (service: string): Adapter => adapters[service];
