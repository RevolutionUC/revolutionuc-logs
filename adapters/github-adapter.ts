import { APIGatewayEvent } from 'aws-lambda';
import { Adapter } from './adapter';

interface GithubData {
  repository: {
    full_name: string,
    html_url: string
  },
  sender: {
    login: string
  },
  compare: string,
  commits: { message: string }[]
};

export const GithubAdapter: Adapter = {
  async parseRequest(e: APIGatewayEvent) {
    const data: GithubData = JSON.parse(e.body);

    return {
      iconUrl: `https://cdn.iconscout.com/icon/free/png-256/github-153-675523.png`,
      title: {
        text: `Pushed ${data.commits.length} commits`,
        color: `accent`
      },
      facts: [
        { title: `Repo`, value: data.repository.full_name },
        { title: `By`, value: data.sender.login },
        {
          title: `Commits`,
          value: data.commits.reduce(
            (msg, commit, i) => `${msg}${i ? `\n\n` : ``}${commit.message}`, ``
          )
        }
      ],
      viewUrl: data.compare
    };
  }
}