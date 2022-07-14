const { createClient } = require('redis');

const client = createClient();

client.on('error', (err) => console.log('Redis Client Error', err));

const connect = async() => await client.connect();

connect();

client.set('key', 'value');
const value = client.get('key');