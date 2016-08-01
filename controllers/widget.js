var args = $.args;

init();
function init() {
	var exclude = [
		'id', 'children', 
		'index', 
		'labels',
		'Tab', 'Tab0', 'Tab1', 'Tab2', 'Tab3', 'Tab4', 'Tab5', 'Tab6', 'TabOn', 'TabOff', 
		'TabIcon',
		'TabTitle', 'TabTitleOn', 'TabTitleOff'
	];
	$.container.applyProperties(_.omit(args, exclude));
	
	args.index = args.index || 0;
	args.labels && loadTabs();
}

/*
 params = {
 	index: 0,
 	labels: [{ enabled: true, image: '', imageOn: '', title: '', width: 100 }]
 }
 * */
exports.load = function(params) {
	removeTabs();
	_.extend(args, params);
	args.index = args.index || 0;
	loadTabs();
};

exports.unload = function() {
	args.labels = [];
	args = null;
	removeTabs();
};

function loadTabs() {
  	var labels = args.labels,
		index = args.index || 0;
	
	for(var i=0,ii=labels.length; i<ii; i++){
		var label = labels[i];
		
		var icon, status;
		if (i !== index) {
			icon = label.image;
			status = 'Off';
		} else {
			icon = label.imageOn || label.image;
			status = 'On';
		}
		
		var tab = $.UI.create('View', _.extend({ tabIndex: i }, args.Tab, args['Tab' + i], args['Tab' + status]));
			label.image && tab.add( $.UI.create('ImageView', _.extend({ touchEnabled: false, image: icon }, args.TabIcon)) );
			label.title && tab.add( $.UI.create('Label', _.extend({ touchEnabled: false, text: label.title }, args.TabTitle, args['TabTitle' + status])) );
	  	$.container.add(tab);
	};
}

function removeTabs() {
  	$.container.removeAllChildren();
}

function tabbedbarClick(e) {
	setIndex(e.source.tabIndex, true);
}

exports.getIndex = function() {
	return args.index;
};

function setIndex(index, triggerEvent) {
	if (index == null || index == args.index) { return; }
	
	updateTab(index, true);
	updateTab(args.index, false);
	
	args.index = index;
		
	triggerEvent && $.trigger('click', { index: index, label: args.labels[index] });
};
exports.setIndex = setIndex;

function updateTab(index, active) {
	var status = active ? 'On' : 'Off';
	var label = args.labels[index];
  	var tab = $.container.children[index];
  	
	tab.applyProperties( args['Tab' + status] );
	if (label.imageOn) { 
		tab.children[0].image = active ? label.imageOn : label.image; 
	}
	if (label.title) { 
		tab.children[label.image ? 1 : 0].applyProperties( args['TabTitle' + status] ); 
	}
}



