# Item Price Control
 
## Changelog:
1.2: can now set item buy price multipler via plugin parameter and command
1.1: can now explicitly set item buy and sell prices
1.0: initial commit

## Description
 
Allows you to set whether item selling price is calculated based on the 
database price, or the shop price; by default RPG Maker MV only has the 
selling price dependent on the database price, even if the shop has a 
custom price for the item in question.

Additionally, allows you to change the sell-price and buy-price multiplier 
from game start (as a plugin parameter), and mid-game (via plugin command).
Note: if you change the buying price multiplier, and have selling price 
determined by shop price (and not explicitly set for an item), this will 
affect selling price. For example, if you have a buying price multiplier
of 1.1, a selling price multiplier of 1.0, and the item price is set to
20, the item will both buy and sell for 22.

Finally, allows you to outright set buy and sell prices (which overrides 
the above settings), and unset the same.

## Plugin commands
### SETSELLPRICEDEPENDENCY [shop|database]
Changes whether the sell price is dependent on the shop value, or the database value,
of an item.
### SELLINGMULTIPLIER [float]
Changes the sell-price multiplier to the specified float.
### SELLINGMULTIPLIERAFFECTSSETPRICES [true|false]
Sets whether the selling multiplier is applied to explicitly-set prices.
### BUYINGMULTIPLIER [float]
Changes the buy-price multiplier to the specified float. 
### BUYINGMULTIPLIERAFFECTSSETPRICES [true|false]
Sets whether the buying multiplier is applied to explicitly-set prices.
### SETSELLPRICE [item|weapon|armor] [id] [price]
Sets the selling price for the item/weapon/armor with the specified ID to the given price.
### UNSETSELLPRICE [item|weapon|armor] [id]
Unsets a defined selling price for the item/weapon/armor with the specified ID.
### SETBUYPRICE [item|weapon|armor] [id] [price]
Sets the buying price for the item/weapon/armor with the specified ID to the given price.
### UNSETBUYPRICE [item|weapon|armor] [id]
Unsets a defined buying price for the item/weapon/armor with the specified ID.