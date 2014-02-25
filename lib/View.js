MCOR.View = MCOR.Class({
	initialize : function(options){
	    MCOR.Util.extend(this,options);
	    MCOR.Util.extend(this,  EventEmitter.prototype);
	    
        this.data = this.data || {}; //this could just be data
        
        this.templete = this.templete || $nE('view'); // This could be the html file
        this.model = this.model || null; // this is good
        this.parent = this.parent || null; //so is this
        if(this.model) {
            this.add_to_model(this.model);
        }
        if(typeof this.init === 'function'){
            this.init();
        }
    },
 
    build : function(){
        if(this.parent === null){
            this.parent = document.body;
        }
        if(typeof this.parent === 'string'){
            this.parent = $g(this.parent)
        };
        this._templete = $tN(this.templete);
    },
    
    //Removes all of the items in the view then runs append
    update : function(){
        if(!this._templete){
            this.build();
        }
        
        $rAC(this.parent);
        this.append();
    },
    
    //adds data from context to the view
    append : function(){
        if(!this._templete){
            this.build();
        }
        
        //$aC(this.parent,[$tN(this._templete(this.context))]);
        $aC(this.parent,[this.templete]);
        
        this.on_append();
    },
    
    //This is a function that should be overwritten by the view
    //It is called after the append has happend. It is useful for setting up event
    //listeners.
    on_append : function(){
        console.log('Item Appended');
    },
    
    //adds the view to the model so it can recieve events from the model
    add_to_model : function(model){
        this.model = model;
        if(!this.model.views){
            this.model.views = [];
        }
        this.model.views.push(this);
    }
    
});