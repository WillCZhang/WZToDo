const Database = require('./database');
const collection = "todo";
let db = null;

function Todo() {
    db = new Database();
}

Todo.prototype.loadTodoList = async (username) => {
    let condition = {"user": username};
    let todoList = await db.find(collection, condition);
    let result = {todo: [], done: []};
    for (let todo of todoList) {
        let toPush = todo["done"]? result["done"] : result["todo"];
        todo = {...todo, id: todo._id};
        toPush.push(todo);
    }
    return Promise.resolve(result);
}

Todo.prototype.addItem = async (username, text, detail) => {
    let data = {"user": username, "text": text, "detail": detail, "done": false};
    await db.add(collection, data);
}

Todo.prototype.changeStatus = async (username, uuid) => {
    let condition = {"user": username, "_id": uuid};
    let items = await db.find(collection, condition);
    if (items.length !== 1) {
        console.log("Unknow item: " + JSON.stringify(items));
    }
    console.log("Found item to flip status: " + JSON.stringify(items[0]));
    await db.update(collection, condition, {done: !items[0].done});
}

Todo.prototype.deleteItem = async (username, uuid) => {
    let condition = {"user": username, "_id": uuid};
    await db.delete(collection, condition);
}

module.exports = Todo;