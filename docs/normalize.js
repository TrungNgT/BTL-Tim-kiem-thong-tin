import data from './collection.json' assert { type: "json" };

for (const doc of data) {
  const newDoc = {  
    'title': doc.title,
    'link': doc.link,
    'content': (doc.description) + ' ' + (doc.content),
   };
   
}