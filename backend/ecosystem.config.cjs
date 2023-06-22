module.exports = {
    apps: [
        {
            time: true,
            instances: 1,
            watch: false,
            args: "start",
            script: "npm",
            autorestart: true,
            exec_mode: "fork",
            max_memory_restart: "1G",
            name: "social-media-app",
            env: { NODE_ENV: "development" },
            env_production: { NODE_ENV: "production" },
        },
    ],
};
