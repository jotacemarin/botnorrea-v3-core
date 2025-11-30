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
      BOT_USERNAME: config.environment.BOT_USERNAME,
      OLLAMA_BASE_URL:
        config.environment.OLLAMA_BASE_URL || "http://localhost:11434",
      OLLAMA_MODEL: config.environment.OLLAMA_MODEL || "gemma3",
    };

    const clientsTable = new sst.aws.Dynamo("clientsTable", {
      fields: {
        id: "string",
      },
      primaryIndex: {
        hashKey: "id",
      },
    });

    const eventsTable = new sst.aws.Dynamo("eventsTable", {
      fields: {
        id: "string",
        service: "string",
        eventId: "string",
        from: "string",
        date: "number",
      },
      primaryIndex: {
        hashKey: "id",
      },
      globalIndexes: {
        serviceIndex: {
          hashKey: "service",
          rangeKey: "date",
        },
        serviceEventIdIndex: {
          hashKey: "service",
          rangeKey: "eventId",
        },
        serviceFromIndex: {
          hashKey: "service",
          rangeKey: "from",
        },
        serviceDateIndex: {
          hashKey: "service",
          rangeKey: "date",
        },
      },
      ttl: "ttl",
    });

    const usersTable = new sst.aws.Dynamo("usersTable", {
      fields: {
        id: "string",
      },
      primaryIndex: {
        hashKey: "id",
      },
    });

    const commandsTable = new sst.aws.Dynamo("commandsTable", {
      fields: {
        key: "string",
        creator: "string",
      },
      primaryIndex: {
        hashKey: "key",
      },
      globalIndexes: {
        creatorIndex: {
          hashKey: "creator",
        },
      },
    });

    const queue = new sst.aws.Queue("webhookQueue", {
      visibilityTimeout: "10 seconds",
      delay: "2 seconds",
    });

    new sst.aws.Function("api", {
      url: true,
      handler: "src/index.handler",
      link: [clientsTable, eventsTable, usersTable, commandsTable, queue],
      environment,
    });

    return {
      clientsTableName: clientsTable.name,
      eventsTableName: eventsTable.name,
      usersTableName: usersTable.name,
      commandsTableName: commandsTable.name,
      queueUrl: queue.url,
      queueArn: queue.arn,
    };
  },
});
