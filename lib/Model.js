MCOR.Model = new MCOR.Class({
    //new functions
    initialize : function(options){
	    
		MCOR.Util.extend(this,options);
        MCOR.Util.extend(this,  EventEmitter.prototype);
        
	    this.source = this.source || this.modelName;
	    this.listeners = this.listeners || {};
	    this.queries = this.queries || {};
	    this.socket = this.socket || 
	        (function(){if(socket){return socket; } else {return null; }})() //needs to error out here
	   
	   //Adds basic crud
	    this.delete = function(params){
	        this.submit_request({
                request:'delete',
                data: params,
                callback: function(resp){
                    this.trigger('deleted', [resp]);
                }
            });
	    },
	    
	    this.update = function(params){
	        this.submit_request({
                request:'update',
                data: params,
                callback: function(resp){
                    this.trigger('updated', [resp]);
                }
            });
	    },
	    
	    this.list = function(params){
	        this.submit_request({
                request:'list',
                data: params,
                callback: function(resp){
                    this.trigger('listed', [resp]);
                }
            });
	    },
	    this.add = function(params){
	        this.submit_request({
                request:'add',
                data: params,
                callback: function(resp){
                    this.trigger('added', [resp]);
                }
            });
	    },
	    
	    //these need to be overwritten
	    this.listeners = {
            listed : {
                response:'listed',
                callback: function(data){
                    this.send_to_views('listed', data);
                }
            },
            added : {
                response:'added',
                callback: function(data){
                    this.send_to_views('added', data);
                }
            },
            updated : {
                response:'updated',
                callback: function(data){
                    this.send_to_views('updated', data);
                }
            },
            deleted : {
                response:'deleted',
                callback: function(data){
                    this.send_to_views('deleted', data);
                }
            }
        }; 
        
        this.on('sync', function(params){
            this.socket.emit('transReq', params);
        });
        
        this.socket.on('transRes', function(params){
            this.trigger(params.source+':'+params.response, [params.resData]); 
        }.bind(this));
        
        this.start_request_listeners();
	},
	
    submit_request : function(options){
        //request,response,callback,data
        
        var error = [];
        var request = options.request || error.push('No Request Given');
        var response = options.response || request;
        var callback = options.callback || function(data){
            console.log(data); //should be something 
        };
        var data = options.data || {};
        
        if(error.length === 0){
            
            //TODO don't send socket here . Instead send event and let the event handler 
            //send the socket
            var o =  {
                source:this.source,
                request: request,
                params: data,
                response: response
            };
            
            this.trigger('sync', [o]);
            this.once(this.source+':'+response,callback);
        }
    },
    
    //These are for events that do not go to the server
    listen_for_request : function(response,callback){
        this.on(response,callback);
    },
    
    //This is a utility to start listening on all of the listeners that are not 
    //initiated by a response 
    start_request_listeners : function(){
        for(var l in this.listeners){
            this.listen_for_request(
                this.listeners[l].response, 
                this.listeners[l].callback
            );
        }  
    },
    
    //This sends an event to all of the views attached to the model
    send_to_views : function(event, data){
        if(Array.isArray(this.views)){
            for(var i = 0; i < this.views.length; i++){
                this.send_to_view(this.views[i],event,data)
            }
        }
    },
	
	//this sends an event to a single view
	//TODO add a check to make sure the item is a view
	send_to_view : function(view,event,data){
	    view.trigger(event,[data]);  
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
});

//MCOR.Model.prototype = 