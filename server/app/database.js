// Mongodb refactoring
const fs = require('fs');
const uuidv4 = require('uuid/v4');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;

let db = 'project';
let credentialFile = path.join(__dirname, "credential.json");
let json = JSON.parse(fs.readFileSync(credentialFile, 'utf8'));
let connectionURL = json.connectionUrl;

function database() { }

function connect(collectionName, callback) {
    return new Promise(function (fulfill, reject) {
        MongoClient.connect(connectionURL, { useNewUrlParser: true }, function (err, client) {
            if (err !== null) {
                console.log(err);
                reject({});
                return;
            }
            client.connect(err => {
                if (err !== null) {
                    console.log(err);
                    reject({});
                    return;
                }
                const collection = client.db(db).collection(collectionName);
                callback(collection).then((data) => {
                    fulfill({data: data, client: client});
                }).catch((err) => {
                    console.log(err);
                    reject({client: client});
                });
            })
        });
    });
}

/**
 * Dev notes: if the collection is a hash, then can check if the given key
 * includes the object unique key in the collection to get better performance.
 * @param collection: an existing collection to find the data
 * @param condition: an object to compare with
 * @returns a list of matched results
 */
database.prototype.find = async (collection, condition) => {
    let callback = (collection) => {
        return new Promise(function (fulfill, reject) {
            collection.find(condition).toArray(function (err, docs) {
                if (err !== null) {
                    console.log(err);
                    reject(err);
                }
                console.log(docs);
                if (!(docs instanceof Array)) {
                    docs = [docs]
                }
                fulfill(docs);
            });
        })
    }
    return await dbHandler(collection, callback);
}

database.prototype.add = async (collection, data) => {
    if (data.id === null || data.id === undefined) {
        data.id = uuidv4();
    }
    let callback = (collection) => {
        return new Promise(function (fulfill, reject) {
            collection.insertOne(data, function (err, col) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log('inserted ' + JSON.stringify(data));
                    fulfill({});
                }
            })
        });
    }
    await dbHandler(collection, callback);
}

// Note: this toUpdate will extend the object (adding keys that weren't exist before)
// I think that's how mongodb works, won't be strict on validating the inputs.
database.prototype.update = async (collection, condition, toUpdate) => {
    let callback = (collection) => {
        return new Promise(function (fulfill, reject) {
            let data = { $set: toUpdate };
            collection.updateOne(condition, data, null, function (err, col) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                fulfill({});
            });
        })
    }
    await dbHandler(collection, callback);
}

// Delete should almost always return 200 except for connection lost or unexpected networking issues.
database.prototype.delete = async (collection, condition) => {
    let callback = (collection) => {
        return new Promise(function(fulfill, reject) {
            collection.deleteOne(condition, function (err, obj) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                console.log("1 document deleted");
                fulfill({});
            })
        });
    }
    await dbHandler(collection, callback);
}

async function dbHandler(collection, callback) {
    let result = await connect(collection, callback);
    if (result.client !== null) {
        result.client.close();
    }
    return result.data;
}

module.exports = database;