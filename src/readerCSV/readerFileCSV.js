import fs from 'node:fs';
import { parse } from 'csv-parse';

const pathToCSV = new URL('./tasks.csv', import.meta.url);

const processFile = async () => {
  const rows = fs
    .createReadStream(pathToCSV)
    .pipe(parse({ from_line: 2 }))
  
  for await (const row of rows) {
    const body = row.reduce((buildBody, currentValue, currentIndex) => {
      currentIndex === 0 ? buildBody['title'] = currentValue : buildBody['description'] = currentValue
      return buildBody;
    }, {});
    
    // console.log(body);
    await fetch('http://localhost:3001/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    })
  }
}

await processFile();