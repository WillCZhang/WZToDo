// Mongodb refactoring
const fs = require('fs');
const uuidv4 = require('uuid/v4');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;

let dbName = 'project';
let credentialFile = path.join(__dirname, "credential.json");
let json = JSON.parse(fs.readFileSync(credentialFile, 'utf8'));
let connectionURL = json.connectionUrl;

let db = null;
function database() {
    MongoClient.connect(connectionURL, { useNewUrlParser: true }, function (err, client) {
        if (err !== null) {
            console.log(err);
        }
        client.connect(err => {
            if (err !== null) {
                console.error(err);
                return;
            }
            db = client.db(dbName);
        });
    });
}

function connect(collectionName, callback) {
    while (true) {
        if (db !== null && db !== undefined) {
            break;
        }
    }
    return new Promise(function (fulfill, reject) {
        const collection = db.collection(collectionName);
        callback(collection).then((data) => {
            fulfill({ data: data });
        }).catch((err) => {
            console.log(err);
            reject({});
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
            console.log(condition)
            collection.find(condition).toArray(function (err, docs) {
                if (err !== null) {
                    console.log(err);
                    reject(err);
                }
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
    if (data._id === null || data._id === undefined) {
        data._id = uuidv4();
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
        return new Promise(function (fulfill, reject) {
            collection.deleteOne(condition, function (err, obj) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                fulfill({});
            })
        });
    }
    await dbHandler(collection, callback);
}

async function dbHandler(collection, callback) {
    let result = await connect(collection, callback);
    return result.data;
}

module.exports = database;