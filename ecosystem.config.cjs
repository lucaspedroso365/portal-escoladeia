module.exports = {
  apps: [
    {
      name: "escolaia",
      script: "./node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1 -p 3000",
      interpreter: "node",
      exec_mode: "fork",
      instances: 1,
      env: { NODE_ENV: "production" },
    },
  ],
};
