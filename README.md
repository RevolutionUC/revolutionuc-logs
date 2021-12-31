# RevolutionUC Logs

This is a serverless application that processes important events from web and cloud apps and sends them to Microsoft Teams.
The application is written in Typescript and deployed on AWS Lambda. The default url is `logs.revolutionuc.com/post`

## Architecture

### Service Adapters
The application uses a microkernel based architecture. This means that for any web or cloud app, there is a service adapter that processes the webhook.
The function uses a query string to determine what adapter to use. For example, if the request was made to `logs.revolutionuc.com/post?service=heroku`, the Heroku adapter is used.
Every adapter must implement the [`Adapter`](https://github.com/RevolutionUC/revolutionuc-logs/blob/master/adapters/adapter.ts) interface.
The adapters implemented right now are:
* Github
* Netlify
* Heroku
* Travis CI
* Uptime Robot
* Revvit

### Adaptive Cards
To display the event on Teams, the application creates [Adaptive Cards](https://adaptivecards.io), a UI format developed by Microsoft and is native to most Microsoft apps.
The details of the card are abstracted into the [`CardData`](https://github.com/RevolutionUC/revolutionuc-logs/blob/master/card/card.ts#L3) interface that service adapters should return.
The `CardData` interface needs the following properties:
1. `iconUrl`: URL of the icon image of the service that will be used in the log display. PNG with transparent background recommended.
2. `title.text`: Title for the event.
3. `title.color`: Color to provide context to the event. [Possible values are here](https://github.com/RevolutionUC/revolutionuc-logs/blob/master/card/card.ts#L1)
4. `facts`: An array of facts about the event. Each fact has a `title` and `value`.
5. `viewUrl`: Link to get more details about the event. Recommended to go to the web/cloud application that triggered the event.

### Marco Polo
This is an endpoint to check if the application is up. A `get` request to the application url should return a 200 response with `polo` in the body.
