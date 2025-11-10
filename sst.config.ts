/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  async app(input) {
    const config = await import(`./config/${input.stage}.json`);

    return {
      name: config.name,
      removal: input?.stage === "prod" ? "retain" : "remove",
      protect: ["prod"].includes(input?.stage),
      home: config.home,
      providers: config.providers,
      stage: config.stage,
    };
  },
  async run() {
    const stage: string = $app.stage ?? "dev";
    const config = await import(`./config/${stage}.json`);

    const environment = {
      TELEGRAM_BOT_TOKEN: config.environment.TELEGRAM_BOT_TOKEN,
      TELEGRAM_WEBHOOK_SECRET: config.environment.TELEGRAM_WEBHOOK_SECRET,
      PUBLIC_WEBHOOK_USERNAME: config.environment.PUBLIC_WEBHOOK_USERNAME,
      PUBLIC_WEBHOOK_PASSWORD: config.environment.PUBLIC_WEBHOOK_PASSWORD,
    };

    const clientsTable = new sst.aws.Dynamo("clientsTable", {
      fields: {
        id: "string",
      },
      primaryIndex: {
        hashKey: "id",
      },
    });

    const queue = new sst.aws.Queue("webhookQueue", {
      visibilityTimeout: "30 seconds",
    });

    new sst.aws.Function("api", {
      url: true,
      handler: "src/index.handler",
      link: [clientsTable, queue],
      environment,
    });

    return {
      clientsTableName: clientsTable.name,
      queueUrl: queue.url,
      queueArn: queue.arn,
    };
  },
});
