MCOR.Model = new MCOR.Class({

	  initialize : function(modelName, options){
	    if(typeof modelName === 'undefined'){
	  		    throw new Error("A Model cannot be initialized without a name.");
	  	}
	    this.modelName = modelName;
		MCOR.Util.extend(this,options);
        MCOR.Util.extend(this,  EventEmitter.prototype);
	    this.source = this.source || this.modelName;
	    this.socket = this.socket || function(){if(socket){return socket; } else {return null; }}//needs to error out here
	   
	    
	    /*TODO ok so the whole point of this major change is to make this thing
	        work with socket.io and allow the models to be less restrictive
	        What this means for us is that the model class will not have any
	        prebuilt queries. It is up to the individual program to supply those
	        .This will be done by doing a MyModel = new MCOR.Class(MCOR.Mode,{
	            queries: {
	                get_by_name : function(name){
	                    do something..
	                    this.submit_request(foo);
	                }
	            }
	        });
	    
	    */
	 

	}
});

MCOR.Model.prototype = {

    //new functions
    submit_request : function(foo){
        //find a way of getting querySource which is the event to send to the server
       this.socket.emit(this.source+':'+querySource);
    },
    
	/*
	 * Function: get_single
	 * Retrieves a single item from the Database and adds it to the model's store
	 * 
	 * Parameters: 
	 * id - {STRING} The id of the item that you want to retrive
	 * callback - {FUNCITON} the function that you want to exicute when the item has been retreived and created.
	 * 				The first argument in the callback is the newly creeated modelItem
	 */
	
	//TODO add fields option at the least
	get_single : function(id, callback){
	
	},
	
	/*
	 * Funciton: get_list
	 * Retrieves a list of items from the database and stores them as modelItems in the model's store
	 * 
	 * Parameters:
	 * queryOptions - {OBJECT} an object that contains query options //More info needed
	 * callback - {FUNCITON} the function that you want to exicute when the items have been retreived and created.
	 * 				The first argument in the callback is an array of newly created modelItems
	 */
	get_list : function(queryOptions, callback){
	    
	},
	
	/*
	 * Function: update_item
	 * Updates an existing record in the database and replaces the model's store old record with the new record
	 * 
	 * Parameters:
	 * id - {STRING} the id of the item that is being updated
	 * saveData - {OBJECT} the data to replace the old data in the database with
	 * callback - {FUNCITON} the function that you want to exicute when the item has been retreived and created.
	 * 				The first argument in the callback is the newly creeated modelItem
	 */
	
	update_item : function(id, saveData, callback){
		
	},
	
	/*
	 * Function: delete_item
	 * Deletes an item from the database and removes it from the model's store
	 * 
	 * Parameters:
	 * id - {STRING} the id of the item that is being deleted
	 * callback - {FUNCTION} the function to be exicuted after the item has been deleted
	 */
	delete_item : function(id, callback){
	    
	},
	
	/*
	 * Function: set_single
	 * called once a get_single request has been completed. Unless used as a callback it would be best to use "apply_single"
	 * 
	 * Parameters:
	 * values - {OBJECT} the collection of key:value pairs that will be turned into a Model Item
	 * callback - {FUNCITON} The function exicuted once the modelItem has been createted
	 */
	
	set_single: function(values, callback){
		var modelItem = this.apply_single(values);
		if(callback instanceof Function){
			callback(modelItem);
		}
	},
	/*
	 * Function: set_list
	 * called once a get_ listrequest has been completed. Unless used as a callback it would be best to use "apply_list"
	 * 
	 * Parameters:
	 * values - {ARRAY} the list of collections of key:value pairs that will be turned into a Model Items
	 * callback - {FUNCITON} The function exicuted once the modelItem's have been  has been createted
	 */
	
	set_list: function(values, callback){
		var createdItems = this.apply_list(values);
		if(callback instanceof Function){
			callback(createdItems);
		}
	},
	/*
	 * Function: apply_single
	 * Creates a single ModelItem from the values object and adds it the Model's store
	 * 
	 * Parameters:
	 * values - {OBJECT} the key:value pair of items to be the content of the ModelItems content parameter
	 * callBack - {OBJECT} The object that defines the callback for the function 
	 * 				{
	 * 					callBack:{FUNCTION} //function to exicute once the model item has been added
	 * 					callBackOptions:{VARIABLE} // the options that will be the arguments of the callback
	 * 				}
	 * 
	 * Returns:
	 * {ModelItem} the newly created modelItem
	 */
	//TODO get rid of the callback. It is not needed
	apply_single : function(values,callBack){
		var parameters = {
			model:this
		};
		if(typeof callBack != 'object'){
			callBack = {};
		}
		var modelItem = new MCOR.ModelItem(values, parameters);
		if(callBack.hasOwnProperty('callback')){
			var cBO = {};
			if(callBack.hasOwnProperty('callBackOptions')){
				MCOR.Util.extend(cBO, callBack.callBackOptions)
			}
			callBack.callback(values, cBO);
		}
		return modelItem;
	},
	/*
	 * Function: apply_list
	 * Creates multiple ModelItmes From the values and adds them to the Model's store
	 * 
	 * Prameters: {Array of OBJECTS} The array of Objects that wil lbe added to the model's store
	 * 
	 * Returns:
	 * {ARRAY} the array of the newly created items
	 */
	
	apply_list : function(values){
		var modelItems = [];
		for(var i = 0; i<values.length; i++){
			//TODO do something here on error
			var modelItem = this.apply_single(values[i]);
			modelItems.push(modelItem);
		}
		return modelItems;
	},
	
	
	
	/*
	 * Function: add_model_items
	 * Adds an array of modelItems to the Model's store
	 * 
	 * Parameters:
	 * modelItems - {ARRAY} The array of Model Items
	 *    
	 * Returns:
	 * true if it completes
	 */
	
	//TODO make sure it is a real model item
	add_model_items : function(modelItems){
		for(var i = 0; i < modelItems.length; i++){
			modelItems[i].model = this;
			//the pk needs to be applied here..
			modelItems[i].id = modelItems[i].content[this.pk];
			var arrayItem = this.get_item_by_id(modelItems[i].id, true);
			if(arrayItem == null){
				this.store.content.push(modelItems[i]);
			} else {
				//TODO is this right?
				this.store.content[arrayItem.index] = modelItems[i];
			} 
		}
		return true;
	},
		
	/*
	 * Function: remove_model_item
	 * Removes an item from the Model's store if the id is found
	 * 
	 * Parameters: 
	 * id - {STRING} The id id the item to remove
	 * 
	 * Returns:
	 * true - If an item by that id was removed
	 * false - If an item was not removed
	 */
	
	remove_model_item : function(id){
		for(var i = 0; i < this.store.content.length; i++){
			if(this.store.content[i].id == id){
				this.store.content.splice(i,1);
				return true;
				break;
			}
		}
		return false;	
	},
	
	/*
	 * Function: get_item_by_id
	 * Retrieves an item from the model's store
	 * 
	 * Parameters:
	 * id - {STRING} The id that is being searched for
	 * returnIndex - {BOOL} If returnIndex is true the item is returned as an object. 
	 * 			The index number of the array is the value of the parameter 'index'
	 * 			The modelItemFound  is the value of the paremeter 'modelItem'
	 * 
	 *          	{	
	 * 					index:indexNumber,
	 * 					modelItem:theModelItemFound
	 *				}
	 * 
	 * Returns:
	 * modelItem {ModelItem} if found
	 * null {NULL} if not found
	 */
	
	get_item_by_id : function(id, rI){
		for(var i = 0; i < this.store.content.length; i++){
			if(this.store.content[i].id == id){
				if(rI == true){
					return {index : i, modelItem : this.store.content[i].id}
				} else {
					return this.store.content[i];
				}
				break;
			}
		}
		return null;
	}	
}