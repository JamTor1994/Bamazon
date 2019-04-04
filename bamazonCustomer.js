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
            choices: ["Shop", "Exit"]
        })
        .then(function (answer) {
            if (answer.Home === "Shop") {
                postInventory();
            }
            else {
                connection.end();
            }
        });
}

function postInventory() {
    connection.query("SELECT * FROM bamazonInventory",
        function (err, response) {
            if (err) throw err;
            console.table(response)
            inquirer
                .prompt([{
                    name: "item",
                    message: "What item would you like to purchase, select item by ID please?"
                }]).then(function (ansItem) {
                    if (ansItem.item.toUpperCase() == "Q") {
                        connection.end();
                    } else{
                        inquirer
                            .prompt([{
                                name: "qty",
                                message: "how much would you like to buy?"
                            }]).then(function (ansQty) {
                                console.log(ansItem.item);
                                connection.query("SELECT * FROM bamazonInventory WHERE ?", { item_id: ansQty.qty }, function(err, results){
                                    if (err) throw err;
                                    console.log(results);
                                    if (results[0].stock_quantity > ansQty.qty) {
                                        var cost = results[0].price * ansQty.qty
                                        console.log(cost,results[0].price)
                                        console.log("Your ord has been placed. \nThe total cost is $" + cost.toFixed(2) + "\n Thank you for shopping Bamazon")
                                        start();

                                        var newQty = results[0].stock_quantity - ansQty.qty
                                        connection.query("UPDATE bamazonInventory SET ? WHERE ?", [{
                                            stock_quantity: newQty
                                        }, {
                                            item_id: ansItem.item
                                        }], function (err, response) { });
                                    } else {
                                        console.log("Sorry we dont have enough stock of that item \nWe only have " + response[0].stock_quantity + "units of " + ansItem.item + ". \n Please retyr your order. \nTHank you")
                                    start();
                                    }
                                });
                            });
                    }
                });
        });
};