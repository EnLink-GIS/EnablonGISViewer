window.onload = function () {
    dojo.require("dijit.dijit");
    dojo.require("dijit.layout.BorderContainer");
    dojo.require("dijit.layout.ContentPane");
    dojo.require("dijit.layout.TabContainer");
    dojo.require("dijit.form.CheckBox");
    dojo.require("dijit.form.Button");
    dojo.require("dijit.Toolbar");
    dojo.require("dijit.TitlePane");
    dojo.require("dijit.form.DropDownButton");
    dojo.require("dijit.TooltipDialog");
    dojo.require("dijit.form.ValidationTextBox");
    dojo.require("esri.map");
    //dojo.require("esri.dijit.Legend");
    //dojo.require("esri.dijit.OverviewMap");
    dojo.require("esri.toolbars.navigation");
    dojo.require("esri.arcgis.utils");
    dojo.require("esri.dijit.BasemapGallery");
    dojo.require("esri.toolbars.draw");

    setConfigProperties();

    var map, navToolbar, symbol, geomtask, loading, drawToolbar;
    var visible = [];
    var gsvc = null;
    var pt = null;
    var handle;
    var symbol = new esri.symbol.PictureMarkerSymbol('Pmap/yellow-flag.png', 70, 70);
    var dynamicMapServiceLayer;


    function extentHistoryChangeHandler() {
        dijit.byId("zoomprev").disabled = navToolbar.isFirstExtent();
        dijit.byId("zoomnext").disabled = navToolbar.isLastExtent();
    }
    //Sets up the ability for dynamic layers to be toggled.

    //Sets up the ability for the layers to be toggled.
    function updatedynamicMapServiceLayerVisibility() {
        var inputs = dojo.query(".list_item"),
            input;
        //Placing layer numbers below will enforce them to be visible.
        visible = [];
        for (var i = 0, il = inputs.length; i < il; i++) {
            if (inputs[i].checked) {
                visible.push(inputs[i].id);
            }
        }
        dynamicMapServiceLayer.setVisibleLayers(visible);
    }


    function updateOPPLLayerVisibility() {
        var inputs = dojo.query(".list_item"),
            input;
        //Placing layer numbers below will enforce them to be visible.
        visible = [];
        for (var i = 0, il = inputs.length; i < il; i++) {
            if (inputs[i].checked) {
                visible.push(inputs[i].id);
            }
        }
        oppllayer.setVisibleLayers(visible);

    }

    function createBasemapGallery() {

        var basemapGallery = new esri.dijit.BasemapGallery({
            showArcGISBasemaps: true,
            map: map
        }, "basemapGallery");

        basemapGallery.startup();

        dojo.connect(basemapGallery, "onError", function (msg) {
            console.log(msg)
        });
    }
    //Sets up the funcions for the GoToXY
    function createPoint() {
        map.graphics.clear(pnt_xysym);
        var infoSymbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_X, 15, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0]), 2), new dojo.Color([0, 255, 0, 1]));


        //add point using the coordinates fromt he form below.
        var pnt_X = document.getElementById("frm_X").value;
        var pnt_Y = document.getElementById("frm_Y").value;
        var pnt_xy = new esri.geometry.Point(pnt_X, pnt_Y, map.spatialReference);

        var pnt_xysym = new esri.Graphic(esri.geometry.geographicToWebMercator(pnt_xy), infoSymbol);

        map.graphics.add(pnt_xysym);
        map.centerAndZoom(esri.geometry.geographicToWebMercator(pnt_xy), map.getLevel() + 1);

    }
    //Create the drawing toolbar.
    function createdrawToolbar(map) {

        drawToolbar = new esri.toolbars.Draw(map);
        //drawToolbar.activate(esri.toolbars.Draw.POINT);
        dojo.connect(drawToolbar, "onDrawEnd", addToMap);

    }

    function addToMap(geometry) {
        map.graphics.clear();
        drawToolbar.deactivate();
        map.showZoomSlider();
        switch (geometry.type) {
        case "point":
            var symbol = new esri.symbol.PictureMarkerSymbol('files/Pmap/yellow-flag.png', 70, 70);

        }

        var graphic = new esri.Graphic(geometry, symbol);
        map.graphics.add(graphic);
        projectToLatLong(geometry);
    }

    function projectToLatLong(evt) {
        //map.graphics.clear();
        var point = evt;
        var outSR = new esri.SpatialReference({
            wkid: 4326
        });


        gsvc.project([point], outSR, function (projectedPoints) {

            pt = projectedPoints[0];
            //display list of points in extent
            dojo.byId("results").innerHTML = "&nbsp;Lat: " + pt.y.toFixed(6) + ",&nbsp;Long: " + pt.x.toFixed(6);

        });
    }
    //Used to deactivate tools in order to enable others.
    function deactAllTools() {
        navToolbar.deactivate();
        drawToolbar.deactivate();
    }

    function addOriginalPoint(map) {
        var pointLocation = new esri.geometry.Point(eventPosX, eventPosY, map.spatialReference);
        var locationPointGraphic = new esri.Graphic(esri.geometry.geographicToWebMercator(pointLocation), symbol);
        map.graphics.add(locationPointGraphic);
        map.centerAndZoom(esri.geometry.geographicToWebMercator(pointLocation), 7);
        displayInBar(pointLocation.x, pointLocation.y);
    }

    function init() {

        var layersLoaded = 0;
        var loading = dojo.byId("loadingImg");
        var initialExtent = startExtent;
        map = new esri.Map("map", {
            extent: initialExtent,
            logo: false
        });

        //Initialize layers
        var imageParameters = new esri.layers.ImageParameters();
        imageParameters.layerIds = initialLayers;
        imageParameters.layerOption = esri.layers.ImageParameters.LAYER_OPTION_SHOW;
        var basemap = new esri.layers.ArcGISTiledMapServiceLayer(basemapservice);
        dynamicMapServiceLayer = new esri.layers.ArcGISDynamicMapServiceLayer("http://dal-gisweb/ArcGIS/rest/services/XTX-Pipelines-New/MapServer");

        var gsvc = new esri.tasks.GeometryService("http://dal-gisweb/ArcGIS/rest/services/Geometry/GeometryServer");

        //Functions
        function showLoading() {
            esri.show(loading);
        }

        function hideLoading(error) {
            esri.hide(loading);
        }

        function resizeMap() {
            var resizeTimer;
            dojo.connect(map, 'onLoad', function (theMap) {
                dojo.connect(dijit.byId('map'), 'resize', function () {
                    clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(function () {
                        map.resize();
                        map.reposition();
                    }, 500);
                });
            });
        }

        dojo.connect(map, "onUpdateStart", showLoading);
        dojo.connect(map, "onUpdateEnd", hideLoading);
        dojo.connect(map, 'onLoad', function (map) {
            dojo.connect(dijit.byId('map'), 'resize', resizeMap);
        });
        dojo.connect(map, "onLoad", createdrawToolbar);

        dojo.connect(map, 'onLayersAddResult', function (results) {
            var legend = new esri.dijit.Legend({
                map: map,
                layerInfos: [{
                    layer: dynamicMapServiceLayer,
                    title: "Crosstex"
                }],
                arrangement: esri.dijit.Legend.ALIGN_Left
            }, "legendDiv");
            legend.startup();
        });
        dynamicMapServiceLayer.setOpacity(0.8);
        map.addLayer(basemap);
        dojo.connect(basemap, "onUpdateEnd", hideLoading);
        map.addLayer(dynamicMapServiceLayer);
        dojo.connect(dynamicMapServiceLayer, "onUpdateEnd", hideLoading);

        if (typeof (eventPosX) !== 'undefined' && typeof (eventPosY) !== 'undefined') {
            dojo.connect(map, "onLoad", addOriginalPoint);
        }

        createBasemapGallery();
        dojo.connect(dijit.byId('map'), 'resize', resizeMap);

        //navtoolbar was here
        navToolbar = new esri.toolbars.Navigation(map);
        dojo.connect(navToolbar, "onExtentHistoryChange", extentHistoryChangeHandler);
        esriConfig.defaults.map.slider = {
            left: "10px",
            top: "35px",
            width: null,
            height: "200px"
        };
    }

    function zoomToXY() {
        var pointLocation = new esri.geometry.Point(eventPosX, eventPosY, map.spatialReference);
        map.centerAndZoom(esri.geometry.geographicToWebMercator(pointLocation), 7);
    }

    function getPoint(evt) {
        map.graphics.clear();
        toolbar.deactivate();
        var geoPt = esri.geometry.webMercatorToGeographic(evt.mapPoint);
        var graphic = new esri.Graphic(evt.mapPoint, symbol);
        map.graphics.add(graphic);
        map.centerAt(evt.mapPoint);
        //check enablon map
        if (typeof (enablonMap) === "undefined") {
            enablonMap = "%s1";
        }
        eventPosX = geoPt.x.toFixed(2);
        eventPosY = geoPt.y.toFixed(2);
        var mapDataFieldValue = enablonMap + ";" + eventPosX + ";" + eventPosY;
        //window.parent.thd.table().field('CS_MapsData').value(mapDataFieldValue);
        window.parent.thd.table().field('MapsData').value(mapDataFieldValue);
        displayInBar(eventPosX, eventPosY);
        dojo.disconnect(handle);
    }

    function displayInBar(x, y) {
        dojo.byId("results").innerHTML = "&nbsp;Latitude = " + y + ",&nbsp;Longitude = " + x;
    }

    function setPointMode() {
        handle = dojo.connect(map, "onClick", getPoint);
        toolbar = new esri.toolbars.Draw(map);
        toolbar.activate(esri.toolbars.Draw.POINT);
    }
    
document.body.className = 'claro';
dojo.addOnLoad(init);
}