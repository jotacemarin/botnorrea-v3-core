/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "botnorrea-v3-core",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          profile: "botnorrea",
          region: "us-east-2",
        }
      }
    };
  },
  async run() {
    new sst.aws.Function("Hono", {
      url: true,
      handler: "src/index.handler",
    });
  },
});
