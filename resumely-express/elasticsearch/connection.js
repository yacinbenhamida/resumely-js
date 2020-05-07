const es = require('elasticsearch');
const esClient = new es.Client({
    host: 'http://51.178.142.162:9200',
    log: 'trace'
});

module.exports = esClient;