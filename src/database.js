import fs from 'node:fs/promises';

const pathDbJson = new URL('../db.json', import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(pathDbJson, 'utf-8')
      .then(data => {
        this.#database = JSON.parse(data);
      })
      .catch(() => this.#persist());
  }

  #persist() {
    fs.writeFile(pathDbJson, JSON.stringify(this.#database));
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data]
    }

    this.#persist();
  }

  delete(table, taskId) {
    const taskIndex = this.#database[table].findIndex(({ id }) => id === taskId);

    if (taskIndex > -1) {
      this.#database[table].splice(taskIndex, 1);
      this.#persist();
      return true;
    }
    return false;
  }

  findById(table, taskId) {
    const taskIndex = this.#database[table].findIndex(({ id }) => id === taskId);

    if (taskIndex > -1) {
      return this.#database[table][taskIndex];
    }
    return false;
  }

  update(table, taskId, data) {
    const isTaskExist = this.findById(table, taskId);

    if (isTaskExist) {
      Object.entries(data).map(([key, value]) => {
        isTaskExist[key] = value 
      })
      this.#persist();
    }
    return isTaskExist;
  }
}