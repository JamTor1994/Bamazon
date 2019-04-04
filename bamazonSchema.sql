drop database bamazon_DB;
create database bamazon_DB;

use bamazon_DB;

create table bamazonInventory (
item_id int not null Auto_Increment,
product_name varchar (30) not null,
department_name varchar (30) not null,
price int default 0,
stock_quantity int default 0,
primary key (item_id)
);
insert into bamazonInventory (product_name, department_name, price, stock_quantity)
value 
("Hoodies", "clothing", 20, 15),
("Figureine", "toys", 50, 5),
("Dark Souls", "Video Games", 60, 10),
("50-in Flat Screen", "Electronics", 400, 5),
("Sofa", "furniture", 250, 3),
("Snap-Back Hat", "clothing", 15, 40),
("Borderlands", "Video Games", 60, 10),
("Office Chair", "furniture", 45, 7),
("Raybands", "Accessories", 15, 50),
("lego set", "toys", 50, 10);
select * from bamazonInventory