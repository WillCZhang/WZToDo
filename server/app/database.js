const fs = require('fs');
const uuidv4 = require('uuid/v4');
let db = null;
var path = require('path');
let localDB = path.join(__dirname, "localDB.json")

// db is a pair of collection : data array
function database() {
    db = JSON.parse(fs.readFileSync(localDB));
}

// This is a very expensive operation, will replace this with database
// just some thoughts, splitting it into smaller files, then update only the ones
// that were changed will make it cheaper, but still, json itself is just bad for performance...
function storeData() {
    fs.writeFile(localDB, JSON.stringify(db), function(err) {
        if(err) {
            console.log(err);
        }
        console.log("Database updated");
    });
}

function matchCondition(data, condition) {
    for (let key of Object.keys(condition)) {
        if (data[key] !== condition[key]) {
            return false;
        }
    }
    return true;
}

/**
 * Dev notes: if the collection is a hash, then can check if the given key
 * includes the object unique key in the collection to get better performance.
 * @param collection: an existing collection to find the data
 * @param condition: an object to compare with
 * @returns a list of matched results
 */
database.prototype.find = (collection, condition) => {
    let result = [];
    for (let data of db[collection]) {
        if (matchCondition(data, condition)) {
            result.push(data);
        }
    }
    return result;
}

// Note: this toUpdate will extend the object (adding keys that weren't exist before)
// I think that's how mongodb works, won't be strict on validating the inputs.
database.prototype.update = (collection, condition, toUpdate) => {
    let counter = 0;
    for (let data of db[collection]) {
        if (condition === null || matchCondition(data, condition)) {
            for (let key of Object.keys(toUpdate)) {
                data[key] = toUpdate[key];
            }
            counter++;
        }
    }
    storeData();
    return counter;
}

// I believe mongodb has reserved unique ids for objects, I'll do similar things.
// so the key "id" is special, if the data specified "id", we'll use this as the object unique id
// (caller is responsible to ensure the id is unique). Otherwise I'll give it a unique id.
database.prototype.add = (collection, data) => {
    if (db[collection] === null || db[collection] === undefined) {
        db[collection] = [];
    }
    console.log(data);
    console.log(db)
    if (data.id === null || data.id === undefined) {
        data.id = uuidv4();
    }
    console.log(data);
    db[collection].push(data);
    storeData();
}

// Delete should almost always return 200 except for connection lost or unexpected networking issues.
database.prototype.delete = (collection, condition) => {
    let newCollection = [];
    for (let data of db[collection]) {
        if (!matchCondition(data, condition)) {
            newCollection.push(data);
        }
    }
    console.log(newCollection)
    db[collection] = newCollection;
    storeData();
}

module.exports = database;