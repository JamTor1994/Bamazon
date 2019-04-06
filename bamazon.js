var mysql = require("mysql");
var inquirer = require("inquirer")

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "Skellington1994",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;

    start();
});

function start() {
    inquirer
        .prompt({
            name: "Home",
            type: "list",
            message: "Welcome to Bamazon",
            choices: ["Shop","Manager", "Supervisor","Exit"]
        })
        .then(function (answer) {
            if (answer.Home === "Shop") {
                postInventory();
            }else if(answer.Home === "Manager"){
                manager();
            }
            else if(answer.Home === "Supervisor"){
                supervisor();
            }
            else {
                connection.end();
            }
        });
}