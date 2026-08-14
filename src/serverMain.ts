import { WebServer } from './server';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const server = new WebServer(port);
server.start();
