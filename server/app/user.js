const Database = require('./database');
const collection = "user";
let db = null;

function User() {
    db = new Database();
}

User.prototype.exist = async (username) => {
    let condition = {"id": username};
    let result = await db.find(collection, condition);
    return result.length === 1;
}

User.prototype.login = async (username, password) => {
    let condition = {"id": username, "password": password};
    let result = await db.find(collection, condition);
    return result.length === 1;
}

User.prototype.register = async (username, password) => {
    let data = {"id": username, "password": password};
    await db.add(collection, data);
}

module.exports = User;