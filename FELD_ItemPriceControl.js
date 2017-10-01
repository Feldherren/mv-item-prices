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
 * @param Sell Price Multiplier Affects Explicitly Set Prices
 * @desc Whether the set buy price multiplier affects explicitly set buy prices.
 * @default false
 *
 * @param Item Buy Price Multiplier
 * @desc Default multiplier to use when calculating buy price.
 * @default 1.0
 *
 * @param Buy Price Multiplier Affects Explicitly Set Prices
 * @desc Whether the set buy price multiplier affects explicitly set sell prices.
 * @default false
 *
 * @help Item Price Control v1.1, by Feldherren (rpaliwoda AT googlemail.com)
 
Changelog:
1.3: fixed how buying price was being determined, is now displayed properly 
in shop item list
1.2: can now set item buy price multipler via plugin parameter and command
1.1: can now explicitly set item buy and sell prices
1.0: initial commit
 
Allows you to set whether item selling price is calculated based on the 
database price, or the shop price; by default RPG Maker MV only has the 
selling price dependent on the database price, even if the shop has a 
custom price for the item in question.

Additionally, allows you to change the sell-price and buy-price multiplier 
from game start (as a plugin parameter), and mid-game (via plugin command).
Note:if you change the buying price multiplier, and have selling price 
determined by shop price (and not explicitly set for an item), this will 
affect selling price. For example, if you have a buying price multiplier
of 1.1, a selling price multiplier of 1.0, and the item price is set to
20, the item will both buy and sell for 22.

Finally, allows you to outright set buy and sell prices (which overrides 
the above settings), and unset the same.

Plugin commands:
SETSELLPRICEDEPENDENCY [shop|database]
Changes whether the sell price is dependent on the shop value, or the 
database value, of an item.
SELLINGMULTIPLIER [float]
Changes the sell-price multiplier to the specified float. 
SELLINGMULTIPLIERAFFECTSSETPRICES [true|false]
Sets whether the selling multiplier is applied to explicitly-set prices.
BUYINGMULTIPLIER [float]
Changes the buy-price multiplier to the specified float. 
BUYINGMULTIPLIERAFFECTSSETPRICES [true|false]
Sets whether the buying multiplier is applied to explicitly-set prices.
SETSELLPRICE [item|weapon|armor] [id] [price]
Sets the selling price for the item/weapon/armor with the specified ID 
to the given price.
UNSETSELLPRICE [item|weapon|armor] [id]
Unsets a defined selling price for the item/weapon/armor with the 
specified ID.
SETBUYPRICE [item|weapon|armor] [id] [price]
Sets the buying price for the item/weapon/armor with the specified ID 
to the given price.
UNSETBUYPRICE [item|weapon|armor] [id]
Unsets a defined buying price for the item/weapon/armor with the 
specified ID.

Free for use with commercial projects, though I'd appreciate being
contacted if you do use it in any games, just to know.
 */ 
(function(){
	var parameters = PluginManager.parameters('FELD_ItemPriceControl');
	
	var shopSellPriceDependentOnShopBuyPrice = (parameters["Item Sell Price Dependent on Shop Price"] == 'shop');
	var sellMultiplier = parseFloat(parameters["Item Sell Price Multiplier"]);
	var buyMultiplier = parseFloat(parameters["Item Buy Price Multiplier"]);
	var explicitSellPriceAffectedByMultiplier = (parameters["Sell Price Multiplier Affects Explicitly Set Prices"] == 'true');
	var explicitBuyPriceAffectedByMultiplier = (parameters["Buy Price Multiplier Affects Explicitly Set Prices"] == 'true');
	
	var itemBuyPrices = new Object();
	var weaponBuyPrices = new Object();
	var armorBuyPrices = new Object();
	
	var itemSellPrices = new Object();
	var weaponSellPrices = new Object();
	var armorSellPrices = new Object();
	
	var oldPrice = Window_ShopBuy.prototype.price;
	Window_ShopBuy.prototype.price = function(item) {
		price = oldPrice.call(this, item) * buyMultiplier;
		if (DataManager.isItem(this._item)/* && this._item.itypeId === 1*/) // item
		{
			if (this._item.id in itemBuyPrices)
			{
				price = itemBuyPrices[this._item.id];
				if (explicitBuyPriceAffectedByMultiplier)
				{
					price = price * buyMultiplier;
				}
			}
		}
		else if (DataManager.isWeapon(this._item)) // weapon
		{
			if (this._item.id in weaponBuyPrices)
			{
				price = weaponBuyPrices[this._item.id];
				if (explicitBuyPriceAffectedByMultiplier)
				{
					price = price * buyMultiplier;
				}
			}
		}
		else if (DataManager.isArmor(this._item)) // armor
		{
			if (this._item.id in armorBuyPrices)
			{
				price = armorBuyPrices[this._item.id];
				if (explicitBuyPriceAffectedByMultiplier)
				{
					price = price * buyMultiplier;
				}
			}
		}
		return Math.floor(price);
	};

	// new sellingPrice function
	var oldSellingPrice = Scene_Shop.prototype.sellingPrice;
	Scene_Shop.prototype.sellingPrice = function() {
		// calls the old method.
		var sellingPrice = oldSellingPrice.call(this);
		// check that shopSellPriceDependentOnShopBuyPrice is true
		if (shopSellPriceDependentOnShopBuyPrice) // dependent on shop value
		{
			sellingPrice = this._buyWindow.price(this._item) * sellMultiplier;
		}
		else // dependent on database value
		{
			sellingPrice = this._item.price * sellMultiplier;
		}
		
		if (DataManager.isItem(this._item)/* && this._item.itypeId === 1*/) // item
		{
			if (this._item.id in itemSellPrices)
			{
				sellingPrice = itemSellPrices[this._item.id];
				if (explicitSellPriceAffectedByMultiplier)
				{
					sellingPrice = sellingPrice * sellMultiplier;
				}
			}
		}
		else if (DataManager.isWeapon(this._item)) // weapon
		{
			if (this._item.id in weaponSellPrices)
			{
				sellingPrice = weaponSellPrices[this._item.id];
				if (explicitSellPriceAffectedByMultiplier)
				{
					sellingPrice = sellingPrice * sellMultiplier;
				}
			}
		}
		else if (DataManager.isArmor(this._item)) // armor
		{
			if (this._item.id in armorSellPrices)
			{
				sellingPrice = armorSellPrices[this._item.id];
				if (explicitSellPriceAffectedByMultiplier)
				{
					sellingPrice = sellingPrice * sellMultiplier;
				}
			}
		}
		
		return Math.floor(sellingPrice);
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
		else if(command == "SELLINGMULTIPLIERAFFECTSSETPRICES" && args[0] != null)
		{
			if (args[0] == 'true')
			{
				explicitSellPriceAffectedByMultiplier = true;
			}
			else
			{
				explicitSellPriceAffectedByMultiplier = false;
			}
		}
		else if(command == "BUYINGMULTIPLIER" && args[0] != null)
		{
			buyMultiplier = parseFloat(args[0]);
		}
		else if(command == "BUYINGMULTIPLIERAFFECTSSETPRICES" && args[0] != null)
		{
			if (args[0] == 'true')
			{
				explicitBuyPriceAffectedByMultiplier = true;
			}
			else
			{
				explicitBuyPriceAffectedByMultiplier = false;
			}
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
		else if(command == "UNSETSELLPRICE" && args[0] != null && args[1] != null)
		{
			if (args[0] == 'item')
			{
				delete itemSellPrices[parseInt(args[1])];
			}
			else if (args[0] == 'weapon')
			{
				delete weaponSellPrices[parseInt(args[1])];
			}
			else if (args[0] == 'armor')
			{
				delete armorSellPrices[parseInt(args[1])];
			}
		}
		else if(command == "UNSETBUYPRICE" && args[0] != null && args[1] != null)
		{
			if (args[0] == 'item')
			{
				delete itemBuyPrices[parseInt(args[1])];
			}
			else if (args[0] == 'weapon')
			{
				delete weaponBuyPrices[parseInt(args[1])];
			}
			else if (args[0] == 'armor')
			{
				delete armorBuyPrices[parseInt(args[1])];
			}
		}
	}
})();