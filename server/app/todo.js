const Database = require('./database');
const collection = "todoList";
let db = null;

function Todo() {
    db = new Database();
}

Todo.prototype.loadTodoList = (username) => {
    let condition = {"user": username};
    let todoList = db.find(collection, condition);
    let result = {todo: [], done: []};
    for (let todo of todoList) {
        let toPush = todo["done"]? result["done"] : result["todo"];
        toPush.push(todo);
    }
    return result;
}

Todo.prototype.addItem = (username, text, detail) => {
    let data = {"user": username, "text": text, "detail": detail, "done": false};
    db.add(collection, data);
}

Todo.prototype.changeStatus = (username, uuid) => {
    let condition = {"user": username, "id": uuid};
    let items = db.find(collection, condition);
    if (items.length !== 1)
        throw 'Unknown todo item';
        console.log("Found item to flip status: " + JSON.stringify(items[0]));
    db.update(collection, condition, {done: !items[0].done});
}

Todo.prototype.deleteItem = (username, uuid) => {
    let condition = {"user": username, "id": uuid};
    db.delete(collection, condition);
}

module.exports = Todo;