/*
 * Class: L.Forms
 * A class that creates form elements
 * Primarellery used with ML3.control.attributes
 * requires bootstrap
 */
 
MCOR.FormHelper  = {

	/*
	 * Function: hidden
	 * A hidden form. Normally used for storing data that the User does not need to see but the Database needs it to preform tasks
	 * 
	 * Parameters: 
	 * 	fieldObject - {OBJECT} 
	 * 			{ 
	 * 				fieldName: {STRING} //The column name of the field 
	 * 			}
	 * 	fieldValue - The value for this input
	 */

	hidden : function(fieldObject,fieldValue){
		//This keeps it from putting the the word "null" in the value	
		if(typeof fieldValue == 'undefined' || fieldValue == 'null' || fieldValue == null){
			fieldValue = '';
		}
		var elem = $nE('div', {id:'field_'+fieldObject.db_field, 'class':'hidden'});
		
		var input = 
		    $nE('input',{
		        type:'hidden',
		        id:fieldObject.db_field, 
		        name:fieldObject.db_field, 
		        value:fieldValue
		    });
		    
	    $aC(elem,[input]);
		return elem;
	},

	/*
	 * Function: button
	 * A simple Button
	 * 
	 * Parameters:
	 * 	fieldObject - {OBJECT}
	 * 		{
	 * 			fieldName: {STRING} //The column name of the field
	 * 		}
	 * 	fieldValue - {STRING} The value for this input
	 *  disabled - {BOOL} Set true to have the disabled attribute set to disabled
	 */

	button : function(fieldObject,fieldValue,disabled){
		//The word null apperently confuses users		
		if(typeof fieldValue == 'undefined' || fieldValue == 'null' || fieldValue == null){
			fieldValue = '';
		}				
		var elem = $nE('div',{id:'field_'+fieldObject.db_field, 'class':'text'});
		var button = $nE('input', {id:fieldObject.fieldName, name:fieldObject.fieldName,value:fieldValue,'type':'button'});
		if(disabled == true){
			button.setAttribute('disabled','disabled');
		}
		elem.appendChild(button);
		return elem;
	},
	/*
	 * Function: textarea
	 * A Textarea Form
	 * 
	 * Parameters:
	 * 	fieldObject - {OBJECT}
	 * 		{
	 * 			fieldName: {STRING} //The column name of the field
	 * 			fieldLabel: {STRING} //The Label for the field
	 * 		}
	 * 	fieldValue - {STRING} The value for this input
	 *  disabled - {BOOL} Set true to have the disabled attribute set to disabled
	 * 
	 */

	textarea : function(fieldObject,fieldValue,disabled){		
			//The word null apperently confuses users		
		if(typeof fieldValue == 'undefined' || fieldValue == 'null' || fieldValue == null){
			fieldValue = '';
		}
	
		var elem = $nE('div',{'class':'form-group'});
	
		var label = $nE('label', {
		                "class":"control-label", 
		                "for":fieldObject.db_field
		            }, 
		            $cTN(fieldObject.label));
		
		var input = $nE('textarea', {
		        "id":fieldObject.db_field, 
		        "name":fieldObject.db_field,
		        "placeHolder": fieldObject.label,
		        "class":"form-control"}, $cTN(fieldValue));
		        
		if(disabled == true){
			input.setAttribute('disabled','disabled');
		}
		$aC(elem,[label,input]);
		return elem;
	},
    /*
	 * Function: text
	 * The standard text input form.
	 * 
	 * Parameters:
	 * 	fieldObject - {OBJECT}
	 * 		{
	 * 			fieldName: {STRING} //The column name of the field
	 * 			fieldLabel: {STRING} //The Label for the field
	 * 		}
	 * 	fieldValue - {STRING} The value for this input
	 *  disabled - {BOOL} Set true to have the disabled attribute set to disabled
	 */

	text : function(fieldObject,fieldValue,disabled){
		//The word null apperently confuses users		
		if(typeof fieldValue == 'undefined' || fieldValue == 'null' || fieldValue == null){
			fieldValue = '';
		}
	
		var elem = $nE('div',{'class':'form-group'});
	
		var label = $nE('label', {
		                "class":"control-label", 
		                "for":"field_"+fieldObject.db_field
		            }, 
		            $cTN(fieldObject.label));
		
		var input = $nE('input', {
		        "id":fieldObject.db_field, 
		        "name":fieldObject.db_field,
		        "value":fieldValue,
		        "placeHolder": fieldObject.label,
		        "class":"form-control"});
		        
		if(disabled == true){
			input.setAttribute('disabled','disabled');
		}
		$aC(elem,[label,input]);
		return elem;
	},
	
	/*
	 * Function: dropdown
	 * A Dropdown Form Element
	 * 
	 * Parameters:
	 * 	fieldObject - {OBJECT}
	 * 		{
	 * 			fieldName: {STRING} //The column name of the field
	 * 			fieldLabel: {STRING} //The Label for the field
	 * 			fieldOptions : {JSON OBJECT} (dropdownList needs to be one of the attributes)
	 * 		}
	 * 	fieldValue - {STRING} The value for this input
	 *  disabled - {BOOL} Set true to have the disabled attribute set to disabled
	 * 
	 */
	dropdown: function(fieldObject,fieldValue,disabled){
		if(typeof fieldValue == 'undefined' || fieldValue == 'null' || fieldValue == null){
			fieldValue = '';
		}
	    var elem = $nE('span',{'class':'row'});

        var label = $nE('label', {
		                "class":"control-label", 
		                "for":fieldObject.db_field
		            }, 
		            $cTN(fieldObject.label));
		            
		var dropdown = $nE('select', {
		        "id":fieldObject.db_field, 
		        "name":fieldObject.db_field,
		        "class":"form-control"});
		        
		if(disabled == true){
			dropdown.setAttribute('disabled','disabled');
		}

		for(var option in fieldObject.dropdown_options){
		    //All of this is good but it has to deal with groups.. I don't want to deal with groups right now
		    
		    /*
			var inGroup = false;
			//if it is an object ..
			if(typeof fieldObject.fieldOptions.dropdownList[option] == 'object'){
				if(fieldObject.fieldOptions.dropdownList[option].hasOwnProperty('group')){
					inGroup = true;
					//check to see if group is created
					var found = false;
					for(var i = 0; i<dropdown.children.length; i++){
						if(dropdown.children[i].id == fieldObject.fieldOptions.dropdownList[option].group){
							found = true;
						}
					}
					if(found == false){
						var optionGroup = $nE('optgroup', {label:fieldObject.fieldOptions.dropdownList[option].group, id:fieldObject.fieldOptions.dropdownList[option].group});
						dropdown.appendChild(optionGroup);
					}					
				}
			}	

			if(inGroup){
				var optionElem = $nE('option', {value:option});
				optionElem.appendChild(document.createTextNode(fieldObject.fieldOptions.dropdownList[option].label));
				if(fieldValue == option){
					optionElem.setAttribute('selected','selected');
				}
				optionGroup.appendChild(optionElem);
				
				
			} else {
			*/
				var optionElem = $nE('option', {value:option});
				$aC(optionElem,[$cTN(fieldObject.dropdown_options[option])]);
				
				//optionElem.appendChild(document.createTextNode(fieldObject.dropdown_options[option]));
				
				if(fieldValue == option){
				    $sA(optionElem, {"selected":"selected"})
					//optionElem.setAttribute('selected','selected');
				
				}
				$aC(dropdown, [optionElem]);
				//dropdown.appendChild(optionElem);
		//	}
		}
		$aC(elem,[label,dropdown]);		
		return elem;
	},

	/*
	 * Function: checkbox
	 * A checkbox form element
	 * 
	 * Parameters:
	 * 	fieldObject - {OBJECT}
	 * 		{
	 * 			fieldName: {STRING} //The column name of the field
	 * 			fieldLabel: {STRING} //The Label for the field
	 * 			fieldOptions : {JSON OBJECT} (valueMap needs to be one of the attributes)
	 * 		}
	 * 	fieldValue - {STRING} The value for this input
	 *  disabled - {BOOL} Set true to have the disabled attribute set to disabled
	 *  
	 */

	checkbox : function(fieldObject,fieldValue,disabled){
		var pValues = {
			t : "true",
			f : "false"
		}
		//Checks to see if there is a valuemap set
		if(fieldObject.hasOwnProperty('fieldOptions')){
		if(fieldObject.fieldOptions.hasOwnProperty('valueMap')){
			if(typeof fieldObject.fieldOptions.valueMap != 'object'){
				fieldObject.fieldOptions.valueMap = JSON.parse(fieldObject.fieldOptions.valueMap);	
			}
			if(fieldObject.fieldOptions.valueMap.hasOwnProperty('checkbox')){
				pValues = {
					t : fieldObject.fieldOptions.valueMap.checkbox.t,
					f : fieldObject.fieldOptions.valueMap.checkbox.f
				}
			}	
		} 
		}
		//This makes sure it is true or false even if valueMap has changed.
		if(typeof fieldValue == 'undefined' || fieldValue == 'null' || fieldValue == null){
			fieldValue = pValues.f;
		} else if(fieldValue == '1' || fieldValue == 't' || fieldValue == 'true' || fieldValue == 'l' || fieldValue == 'I' || fieldValue == 'y' || fieldValue == 'yes' || fieldValue == 'YES' || fieldValue == 'Yes' || fieldValue == 'True' || fieldValue == 'T'){
			fieldValue = pValues.t;
		}

		var elem = $nE('div', {id:'field_'.concat(fieldObject.fieldName), 'class':'checkbox'});
		var label = $nE('label', {'for':fieldObject.fieldName}, document.createTextNode(fieldObject.fieldLabel));
		var falseBox = $nE('input',{type:'hidden',id:'false_'.concat(fieldObject.fieldName), value:pValues.f,name:fieldObject.fieldName});
		var checkbox = $nE('input',{type:'checkbox',id:fieldObject.fieldName,value:pValues.t,name:fieldObject.fieldName});

		if(disabled == true){
			checkbox.setAttribute('disabled','disabled');
		}
		if(fieldValue == pValues.t){
			checkbox.setAttribute('checked','checked');
		}
		if(fieldObject.bootstrap){
			$aC(label, [checkbox]);
			$aC(elem,[falseBox,label]);
		} else {
			$aC(elem,[label,falseBox,checkbox]);
		}
		return elem;
	},

	/*
	 * Function: date
	 * The standard text input form with the default being todays date.
	 * 
	 * Parameters:
	 * 	fieldObject - {OBJECT}
	 * 		{
	 * 			fieldName: {STRING} //The column name of the field
	 * 			fieldLabel: {STRING} //The Label for the field
	 * 			fieldDateType: {STRING} // ['date','datetime']
	 * 		}
	 * 	fieldValue - {STRING} The value for this input should be a date
	 *  disabled - {BOOL} Set true to have the disabled attribute set to disabled
	 */

	date : function(fieldObject,fieldValue,disabled){
		//TODO validate date
		elem = MCOR.Forms.text(fieldObject,fieldValue,disabled);
		if(typeof fieldValue == 'undefined' || fieldValue == 'null' || fieldValue == null){
			var d = new Date();
			if(fieldObject.hasOwnProperty('fieldDateType')){
				if(fieldObject.fieldDateType == 'date'){
					fieldValue = String(d.getFullYear()).concat('-').concat((d.getMonth()+1)).concat('-').concat(d.getDate());
				}
			} else {
					fieldValue = String(d.getFullYear()).concat('-').concat((d.getMonth()+1)).concat('-').concat(d.getDate()).concat(' ').concat(d.getHours()).concat(':').concat(d.getMinutes());		
			}
			elem.lastElementChild.setAttribute('value',fieldValue);
		}
		return elem;
	}
}