const { Client } = require('@elastic/elasticsearch')

const elasticClient = new Client({
    node: 'http://localhost:9200',
})

const createIndex = async (indexName) => {
    try {
        console.log('in');
        await elasticClient.indices.create({ index: indexName });
        console.log("Index created");
    } catch (error) {
        console.log(error.message)
    }
};

createIndex("posts");

// const elastic = require('elasticsearch')

// const elasticClient = elastic.Client({
//     host: 'localhost:9200'
    
// })
// elasticClient.index({
//     index: 'logs',
//     body: {
//         'name': 'hello',
//         'pass': '123'
//     }
// })
// .then(res => console.log('indexed'))
// .catch(err => console.log(err.message))