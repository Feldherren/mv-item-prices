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
SETSELLPRICE [item|weapon|armor] [id] [price]
Sets the selling price for the item/weapon/armor with the specified ID to the given price.
UNSETSELLPRICE [item|weapon|armor] [id]
SETBUYPRICE [item|weapon|armor] [id] [price]
Sets the buying price for the item/weapon/armor with the specified ID to the given price.
UNSETBUYPRICE [item|weapon|armor] [id]

Free for use with commercial projects, though I'd appreciate being
contacted if you do use it in any games, just to know.
 */ 
(function(){
	var parameters = PluginManager.parameters('FELD_ItemSellPriceControl');
	
	var shopSellPriceDependentOnShopBuyPrice = (parameters["Item Sell Price Dependent on Shop Price"] == 'shop');;
	var sellMultiplier = parseFloat(parameters["Item Sell Price Multiplier"]);
	
	var itemBuyPrices = new Array();
	var weaponBuyPrices = new Array();
	var armorBuyPrices = new Array();
	
	var itemSellPrices = new Array();
	var weaponSellPrices = new Array();
	var armorSellPrices = new Array();

	// new sellingPrice function
	var oldSellingPrice = Scene_Shop.prototype.sellingPrice;
	Scene_Shop.prototype.sellingPrice = function() {
		//Calls the old method.
		var sellingPrice = oldSellingPrice.call(this);
		// check that shopSellPriceDependentOnShopBuyPrice is true
		if (shopSellPriceDependentOnShopBuyPrice) // dependent on shop value
		{
			sellingPrice = Math.floor(this._buyWindow.price(this._item) * sellMultiplier);
		}
		else // dependent on database value
		{
			sellingPrice = Math.floor(this._item.price * sellMultiplier);
		}
		
		if (DataManager.isItem(this._item)/* && this._item.itypeId === 1*/) // item
		{
			if (this._item.id in itemSellPrices)
			{
				sellingPrice = itemSellPrices[this._item.id];
			}
		}
		else if (DataManager.isWeapon(this._item)) // weapon
		{
			if (this._item.id in weaponSellPrices)
			{
				sellingPrice = weaponSellPrices[this._item.id];
			}
		}
		else if (DataManager.isArmor(this._item)) // armor
		{
			if (this._item.id in armorSellPrices)
			{
				sellingPrice = armorSellPrices[this._item.id];
			}
		}
		// else if (DataManager.isItem(this._item) && this._item.itypeId === 2) // key item; may not actually need this?
		// {
		// }
		
		return sellingPrice;
	};
	
	// new buyingPrice function
	var oldBuyingPrice = Scene_Shop.prototype.buyingPrice;
	Scene_Shop.prototype.buyingPrice = function() {
		buyingPrice = oldBuyingPrice.call(this);
		//console.log(this._item)
		//console.log(DataManager.isWeapon(this._item));
		if (DataManager.isItem(this._item)/* && this._item.itypeId === 1*/) // item
		{
			if (this._item.id in itemBuyPrices)
			{
				buyingPrice = itemBuyPrices[this._item.id];
			}
		}
		else if (DataManager.isWeapon(this._item)) // weapon
		{
			if (this._item.id in weaponBuyPrices)
			{
				buyingPrice = weaponBuyPrices[this._item.id];
			}
		}
		else if (DataManager.isArmor(this._item)) // armor
		{
			if (this._item.id in armorBuyPrices)
			{
				buyingPrice = armorBuyPrices[this._item.id];
			}
		}
		
		return buyingPrice;
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
		else if(command == "SETSELLPRICE" && args[0] != null && args[1] != null && args[2] != null)
		{
			if (args[0] == 'item')
			{
				itemSellPrices[parseInt(args[1])] = parseInt(args[2]);
			}
			else if (args[0] == 'weapon')
			{
				weaponSellPrices[parseInt(args[1])] = parseInt(args[2]);
			}
			else if (args[0] == 'armor')
			{
				armorSellPrices[parseInt(args[1])] = parseInt(args[2]);
			}
		}
		else if(command == "SETBUYPRICE" && args[0] != null && args[1] != null && args[2] != null)
		{
			if (args[0] == 'item')
			{
				itemBuyPrices[parseInt(args[1])] = parseInt(args[2]);
			}
			else if (args[0] == 'weapon')
			{
				weaponBuyPrices[parseInt(args[1])] = parseInt(args[2]);
			}
			else if (args[0] == 'armor')
			{
				armorBuyPrices[parseInt(args[1])] = parseInt(args[2]);
			}
		}
	}
})();