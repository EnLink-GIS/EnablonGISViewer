// config settings for the Viewer application
// change the service urls and other properties to work with your GIS server.

function setConfigProperties(){

	startExtent = new esri.geometry.Extent({
	  		"xmin": -10970837.202174,
	  		"ymin": 3065249.13099937,
	  		"xmax": -9819378.34751022,
	  		"ymax": 4212571.0077422,
	  		"spatialReference": {
	  			"wkid": 102100
	  		}
	  	});

	//Sets the layers that begin enabled.
	initialLayers = [0, 16];

	// Sets the services that are used in viewer.
	basemapservice = "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer";
	opplservice = "http://dallc8330jfb/ArcGIS/rest/services/OPPL/MapServer";
	dynamicservice = "http://dal-gisweb/ArcGIS/rest/services/XTX-Pipelines-New/MapServer";
	  	



}