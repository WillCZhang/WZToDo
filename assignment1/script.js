const cache = `{
    "todo": [
        "do cpsc 436 assignment",
        "plan projects",
        "plan meeting schedule"
    ],
    "done": [
        "find a group",
        "buy some food"
    ]
}`

function loadCache() {
    let cached = JSON.parse(cache);
    for (let todo of cached["todo"]) {
        insertItem(todo);
    }
    for (let done of cached["done"]) {
        insertItem(done, true);
    }
}

let counter = 0;
function getNextItemId() {
    // not sure if javascript needs to handle overflow,
    // but this really isn't a good implementation...
    return "item" + counter++;
}

function insertItem(text, done=false) {
    if (!text) {
        alert("Please enter content :)");
        return;
    }
    let id = getNextItemId();
    let ul = document.createElement("ul");
    ul.setAttribute("class", "horizontal");
    ul.setAttribute("id", id);
    let item = document.createElement("LI");
    item.innerText = text;
    let doneButton = document.createElement("LI");
    doneButton.setAttribute("onclick", "flipStatusWithId(\""+id+"\")");
    flipStatus(item, doneButton, done);
    let cancelButton = document.createElement("LI");
    cancelButton.setAttribute("class", "cancel");
    cancelButton.setAttribute("onclick", "removeElement(\""+id+"\")");
    cancelButton.innerText = "Cancel";
    ul.appendChild(item);
    ul.appendChild(doneButton);
    ul.appendChild(cancelButton);
    document.getElementById("todo").appendChild(ul);
}

function flipStatusWithId(id) {
    let item = document.getElementById(id);
    let textElem = item.childNodes[0];
    let doneButton = item.childNodes[1];
    flipStatus(textElem, doneButton, doneButton.innerText == DONE);
}

const DONE = "Done";
const NOT_DONE = "Not Done"
function flipStatus(item, doneButton, done) {
    if (done) {
        item.setAttribute("class", "text cross-out");
        doneButton.innerText = NOT_DONE;
    } else {
        item.setAttribute("class", "text");
        doneButton.innerText = DONE;
    }
    doneButton.setAttribute("class", "done")
}

function removeElement(elementId) {
    let element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}

function clearAllItem() {
    document.getElementById("todo").innerHTML = "";
}
