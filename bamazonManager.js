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
            choices: ["Manager","Exit"]
        })
        .then(function (answer) {
            if (answer.Home === "Shop") {
                postInventory();
            }else if(answer.Home === "Manager"){
                manager();
            }
            else {
                connection.end();
            }
        });
}

function manager() {
    inquirer
    .prompt([{
        name: "pass",
        message: "Welcome Manager what is the password",

    }]).then(function (password) {
        console.log(password)
        if (password.pass.toUpperCase() == "BAM") {
            postManager();
        } else {
            console.log("Wrong Passowrd")
            manager();
        };
    });
}
function postManager() {

    connection.query("SELECT * FROM bamazonInventory",
        function (err, response) {
            if (err) throw err;
            console.table(response)
            inquirer
                .prompt([{
                    name: "order",
                    message: "What item would you like to order, select item by ID?(Q to quit)"
                }]).then(function (orderItem) {
                    if (orderItem.order.toUpperCase() == "Q") {
                        connection.end();
                    } else {
                        inquirer
                            .prompt([{
                                name: "qty",
                                message: "how much would you like to order?"
                            }]).then(function (orderQty) {
                                // console.log(ansItem.item);
                                connection.query("SELECT * FROM bamazonInventory WHERE ?", { item_id: orderItem.order }, function (err, results) {
                                    if (err) throw err;
                                    // console.log(results);
                                    if ( orderQty.qty > 0) {
                                        var cost = results[0].price * orderQty.qty
                                        // console.log(cost, results[0].price)
                                        console.log("Your order has been placed. \nThe total cost is $" + cost.toFixed(2) + "\n Thank you for ordering")

                                        start();

                                        var newQty = results[0].stock_quantity + +orderQty.qty

                                        connection.query("UPDATE bamazonInventory SET ? WHERE ?", [{
                                            stock_quantity: newQty
                                        }, {
                                            item_id: orderItem.order
                                        }], function (err, response) { });
                                    } else {
                                        console.log("Sorry we dont have enough stock of that item \nWe only have " + response[0].stock_quantity + " units of  " + ansItem.item + ". \n Please retry your order. \nTHank you")
                                        start();
                                    }
                                });
                            });
                    }
                });
        });
};