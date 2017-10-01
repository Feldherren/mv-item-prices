#Item Sell Price Control v1.0, by Feldherren (rpaliwoda AT googlemail.com)
 
Allows you to set whether item selling price is calculated based on the 
database price, or the shop price; by default RPG Maker MV only has the 
selling price dependent on the database price, even if the shop has a 
custom price for the item in question.

Additionally, allows you to change the sell-price multiplier from game
start (as a plugin parameter), and mid-game (via plugin command).

Plugin commands:
SETSELLPRICEDEPENDENCY [shop|database]
Changes whether the sell price is dependent on the shop value, or the database value,
of an item.
SELLINGMULTIPLIER [float]
Changes the sell-price multiplier to the specified float.