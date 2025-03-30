import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { execSync, spawn, spawnSync } from 'child_process';
import path from 'path';

module.exports = async function () {
    console.log('\nSetting up...\n');
    const container = await new PostgreSqlContainer().start();

    const DB_ENV = {
        POSTGRES_HOST: container.getHost(),
        POSTGRES_PASSWORD: container.getPassword(),
        POSTGRES_USER: container.getUsername(),
        POSTGRES_DB: container.getName(),
        POSTGRES_PORT: container.getPort().toString(),
    } as const;

    globalThis.__CONTAINER = container;

    const DATABASE_URL = `postgresql://${DB_ENV.POSTGRES_USER}:${DB_ENV.POSTGRES_PASSWORD}@${DB_ENV.POSTGRES_HOST}:${DB_ENV.POSTGRES_PORT}/${DB_ENV.POSTGRES_DB}?schema=public`;
    process.env.DATABASE_URL = DATABASE_URL;

    execSync('npx prisma migrate dev', {
        env: { ...process.env, ...DB_ENV, DATABASE_URL },
        cwd: path.resolve(__dirname, '../../../../'),
    });
    // Start services that that the app needs to run (e.g. database, docker-compose, etc.).

    // Start the API server
    const server = spawn('nx', ['serve', 'api'], {
        shell: true,
        //stdio: 'inherit',
        stdio: 'pipe',
    });

    globalThis.__SERVER_PROCESS__ = server;
    globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';

    await new Promise((resolve) => setTimeout(resolve, 5_000));
};
