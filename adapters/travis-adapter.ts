import { APIGatewayEvent } from 'aws-lambda';
import * as qs from 'querystring';
import { Color } from '../card/card';
import { Adapter } from './adapter';

type BuildState = `Pending` | `Passed` | `Fixed` | `Broken` | `Failed` | `Still Failing` | `Canceled` | `Errored`;

interface TravisData {
  state: string
  status_message: BuildState
  result_message: BuildState
  started_at: string
  finished_at: string
  duration: number,
  build_url: string
  branch: string
  author_name: string
  committer_name: string
  committer_email: string
  repository: {
    name: string
    owner_name: string
  }
};

const stateToColor = (state: BuildState): Color => {
  switch(state) {
    case `Pending`:
      return `accent`;
    case `Canceled`:
      return `warning`;
    case `Passed`:
    case `Fixed`:
      return `good`;
    default:
      return `attention`;
  };
};

const dateToEST = input => (new Date(input)).toLocaleString("en-US", { timeZone: "America/Atikokan" });

export const TravisAdapter: Adapter = {
  async parseRequest(e: APIGatewayEvent) {
    const body: any = qs.parse(e.body);
    const data: TravisData = JSON.parse(body.payload);

    return {
      iconUrl: `https://travis-ci.com/images/logos/TravisCI-Mascot-1.png`,
      title: {
        text: `Build ${data.status_message}`,
        color: stateToColor(data.result_message)
      },
      facts: [
        { title: `Repo`, value: `${data.repository.owner_name}/${data.repository.name}` },
        { title: `By`, value: data.committer_name },
        { title: `Started at`, value: dateToEST(data.started_at) },
        { title: `Finished at`, value: dateToEST(data.finished_at) },
      ],
      viewUrl: data.build_url
    };
  }
}