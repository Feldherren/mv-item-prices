# Item Price Control v1.4.1
 
## Changelog:
#### 1.4.2
Fixed bug where category sell multipliers weren't being applied; instead category buy multipliers were applied when trying to sell items.
#### 1.4.1
Fixed bug where attempting to sell items would cause an error, and another issue where attempting to sell items with item price determined by shop price, when the item was not in the shop, would result in a price of 0 being offered, and a related issue where selling price wasn't properly calculated for weapons and armour. Also fixed a bug where database buying price wasn't getting the buying multiplier applied.
#### 1.4.0
Now handles item categories; you can apply categories to items, weapons and armour, and set multipliers for each category.
#### 1.3.2
fixed issue where buying price was not changed for an item after attempting to explicitly change buying price for it.
#### 1.3.1
fixed issue where plugin commands referred to an entirely different script.
#### 1.3.0
changed how buying price was being determined, is now displayed properly in shop item list.
#### 1.2.0
can now set item buy price multipler via plugin parameter and command.
#### 1.1.0
can now explicitly set item buy and sell prices.
#### 1.0.0
initial commit.

## Description
 
Allows you to set whether item selling price is calculated based on the 
database price, or the shop price; by default RPG Maker MV only has the 
selling price dependent on the database price, even if the shop has a 
custom price for the item in question.

Allows you to change the sell-price and buy-price multiplier 
from game start (as a plugin parameter), and mid-game (via plugin command).
Note:if you change the buying price multiplier, and have selling price 
determined by shop price (and not explicitly set for an item), this will 
affect selling price. For example, if you have a buying price multiplier
of 1.1, a selling price multiplier of 1.0, and the item price is set to
20, the item will both buy and sell for 22.

Allows you to outright set buy and sell prices (which overrides 
the above settings), and unset the same.

Allows you to set categories for items, weapons and armor, and set multipliers
to be applied to all bought or sold items with that category.

Note that all applicable multipliers are applied, not just one. For example, 
a general multiplier of 1.1 and a category multiplier of 1.1 effectively 
become a total multiplier of 1.21.

## Notebox tags
### Items, Weapons and Armor
<category:name>
<category:name,name>
Assigns a category to the item, weapon or armour. Multiple categories
can be separated via commas.

## Plugin commands
### SETSELLPRICEDEPENDENCY [shop|database]
Changes whether the sell price is dependent on the shop value, or the database value,
of an item.
### SELLINGMULTIPLIER [float]
Changes the sell-price multiplier to the specified float.
### CATEGORYSELLINGMULTIPLIER [category] [float]
Changes the sell-price multiplier for the specified category to the 
specified float. 
### SELLINGMULTIPLIERAFFECTSSETPRICES [true|false]
Sets whether the selling multiplier is applied to explicitly-set prices.
### BUYINGMULTIPLIER [float]
Changes the buy-price multiplier to the specified float. 
### CATEGORYBUYINGMULTIPLIER [category] [float]
Changes the sell-price multiplier for the specified category to the 
specified float. 
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