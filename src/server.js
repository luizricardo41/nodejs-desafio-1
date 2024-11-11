import http from 'node:http';
import { json } from './middlewares/json.js';
import { randomUUID } from 'node:crypto';

const allTasks = [];

const server = http.createServer(async (req, res) => {

  await json(req, res);  

  if (req.method === 'GET') {
    return res.end(JSON.stringify(allTasks));
  };

  if (req.method === 'POST') {
    const { title, description } = req.body;
    allTasks.push(
      {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'long' }).format(new Date()),
        updated_at: new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'long' }).format(new Date()),
      }
    );
    return res.writeHead(201).end();
  }

  return res.writeHead(404).end();
});

server.listen(3001, () => console.log('Server listen on port 3001'));