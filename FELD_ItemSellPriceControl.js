/*:
 * @plugindesc Allows changing item prices mid-game via plugin command.
 * @author Feldherren
 *
 * @param Item Sell Price Dependent on Shop Price
 * @desc Sets whether the item sell price in shops is dependent on the shop value, or the database value
 * @default shop
 *
 * @param Item Sell Price Multiplier
 * @desc Default multiplier to use when calculating sell price.
 * @default 0.5
 *
 * @help Item Sell Price Control v1.0, by Feldherren (rpaliwoda AT googlemail.com)
 
Allows you to set whether item selling price is calculated based on the 
database price, or the shop price; by default RPG Maker MV only has the 
selling price dependent on the database price, even if the shop has a 
custom price for the item in question.

Additionally, allows you to change the sell-price multiplier from game
start (as a plugin parameter), and mid-game (via plugin command).

Plugin commands:
SETSELLPRICEDEPENDENCY [shop|database]
Changes whether the sell price is dependent on the shop value, or the 
database value, of an item.
SELLINGMULTIPLIER [float]
Changes the sell-price multiplier to the specified float.

Free for use with commercial projects, though I'd appreciate being
contacted if you do use it in any games, just to know.
 */ 
(function(){
	var parameters = PluginManager.parameters('FELD_ItemSellPriceControl');
	
	var shopSellPriceDependentOnShopBuyPrice = (parameters["Item Sell Price Dependent on Shop Price"] == 'shop');;
	var sellMultiplier = parseFloat(parameters["Item Sell Price Multiplier"]);

	var oldSellingPrice = Scene_Shop.prototype.sellingPrice;
	Scene_Shop.prototype.sellingPrice = function() {
		//Calls the old method.
		oldSellingPrice.call(this);
		// check that shopSellPriceDependentOnShopBuyPrice is true
		if (shopSellPriceDependentOnShopBuyPrice) // dependent on shop value
		{
			return Math.floor(this._buyWindow.price(this._item) * sellMultiplier);
		}
		else // dependent on database value
		{
			return Math.floor(this._item.price * sellMultiplier);
		}
	};

	var Feld_InventoryValue_aliasPluginCommand = Game_Interpreter.prototype.pluginCommand;

	Game_Interpreter.prototype.pluginCommand = function(command, args)
	{

		Feld_InventoryValue_aliasPluginCommand.call(this,command,args);
		if(command == "SETSELLPRICEDEPENDENCY" && args[0] != null)
		{
			if (args[0] == 'shop')
			{
				shopSellPriceDependentOnShopBuyPrice = true;
			}
			else
			{
				shopSellPriceDependentOnShopBuyPrice = false;
			}
		}
		else if(command == "SELLINGMULTIPLIER" && args[0] != null)
		{
			sellMultiplier = parseFloat(args[0]);
		}
	}
})();