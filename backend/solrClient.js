import SolrClient from "solr-client";

const client = SolrClient.createClient({
    host: 'localhost',
    port: 8983,
    core: 'mycore',
    path: '/solr'
});

function indexDocument(data) {
    return new Promise((resolve, reject) => {
        client.add(data, (err, obj) => {
            if (err) {
                return reject(err);
            }
            client.commit((err) => {
                if (err) {
                    return reject(err);
                }
                resolve(obj);
            });
        });
    });
}

module.exports = { indexDocument };