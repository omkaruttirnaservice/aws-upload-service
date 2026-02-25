module.exports = {
    apps: [
        {
            name: `aws-upload-service`,
            script: 'app.js',
            exec_mode: 'fork',
            instances: 1,
            autorestart: true,
	    max_memory_restart: '1G',
            watch: ['application/controllers', 'application/model', 'application/config', 'routes'],
            ignore_watch: [
                'node_modules',
                'application/views/**',
                'public/**',
                'db_backup/**',
                'db_backup/**.gz',
                'logs',
            ],

            env: {
            },
            env_production: {
            },
        },
    ],
};
