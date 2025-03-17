import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: process.env.REDIS_PWD,
    socket: {
        host: 'redis-16644.c245.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 16644
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

await client.set('foo', 'bar');
const result = await client.get('foo');
console.log(result)  // >>> bar

export default client;