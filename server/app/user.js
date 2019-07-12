const Database = require('./database');
const collection = "user";
let db = null;

function User() {
    db = new Database();
}

User.prototype.exist = async (username) => {
    let condition = {"_id": username};
    let result = await db.find(collection, condition);
    return result.length === 1? Promise.resolve() : Promise.reject();
}

User.prototype.login = async (username, password) => {
    // TODO: regex to validate specifial char
    let condition = {"_id": username, "password": password};
    let result = await db.find(collection, condition);
    return result.length === 1? Promise.resolve() : Promise.reject();
}

User.prototype.register = async (username, password) => {
    let data = {"_id": username, "password": password};
    await db.add(collection, data)? Promise.resolve() : Promise.reject();
}

module.exports = User;