import data from '../docs/collection.json' assert { type: "json" };
import { writeFileSync } from 'fs';

const normalizedData = data.map(doc => {
  return {
    title: doc.title,
    link: doc.link,
    content: (doc.description) + ' ' + (doc.content),
  };
});

// Write the normalized data to a new JSON file
writeFileSync('../docs/normalized_collection.json', JSON.stringify(normalizedData, null, 2), 'utf-8');