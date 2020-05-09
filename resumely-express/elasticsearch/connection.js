const es = require('elasticsearch');
const esClient = new es.Client({
    host: 'http://51.178.142.162:9200/',

    log: 'trace',
    requestTimeout: Infinity, // Test
    keepAlive: true // Test

  // host: 'localhost:9200/',
    
});

module.exports = esClient;
