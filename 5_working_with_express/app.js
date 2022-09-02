import {http} from 'http';

import { express } from 'express';

const app = express();

app.use((req,res,next) => {});

const server = http.createServer(app);

server.listen(3000);