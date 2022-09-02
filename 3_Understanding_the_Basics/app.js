import { createServer } from 'http';

import routes from './routes.js';

const server = createServer(routes); // no exection so no parentheses

server.listen(3000);




