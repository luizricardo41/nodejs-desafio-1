import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";
import { randomUUID } from "node:crypto";

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select('tasks', search ? {
        description: search,
        title: search
      } : null);

      return res.end(JSON.stringify(tasks));
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'long' }).format(new Date()),
        updated_at: new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'long' }).format(new Date()),
      }

      database.insert('tasks', task);

      return res.writeHead(201).end();
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { title, description } = req.body;
      const { id } = req.params;

      const isTaskExist = database.findById('tasks', id);

      if (!isTaskExist) {
        return res.writeHead(404)
          .end(JSON.stringify({ message: "A task não foi criada ou já foi excluida do banco de dados!" }));
      }

      title ? isTaskExist.title = title : null;
      description ? isTaskExist.description = description : null;
      
      database.update('tasks', id, isTaskExist);
      
      return res.writeHead(204).end();
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      const taskDeleted = database.delete('tasks', id);

      if (!taskDeleted) {
        return res.writeHead(404)
          .end(JSON.stringify({ message: "A task não foi criada ou já foi excluida do banco de dados!" }));
      }

      return res.writeHead(204).end();
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;

      const isTaskExist = database.findById('tasks', id);

      if (!isTaskExist) {
        return res.writeHead(404)
          .end(JSON.stringify({ message: "A task não foi criada ou já foi excluida do banco de dados!" }));
      };

      isTaskExist.completed_at === null ?
        isTaskExist.completed_at = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'long' }).format(new Date()) :
        isTaskExist.completed_at = null;
      
      database.update('tasks', id, isTaskExist);

      return res.writeHead(204).end();
    }
  }
];