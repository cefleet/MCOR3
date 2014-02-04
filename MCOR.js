MCOR = {
	version : '.01a',
	Stores: {},
	Models: {}
}

//When it is minified from here Down will be the mini version of this
var libFiles = [
	"Tools/Util.js",
	"Tools/Class.js",
	"Tools/EventEmmiter.js",
	"Model.js",
	"ModelItem.js",
	"Store.js"
];

for (var i=0, len=libFiles.length; i<len; i++) {
	document.write("<script src='libs/MCOR/lib/" + libFiles[i] + "'></script>");
}
