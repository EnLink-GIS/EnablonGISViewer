	// changeCursor for map onMouseOver
	function changeCursor(cursors) {		
		switch (cursors) {
			case "zoomin":
				dojo.byId("map_layers").style.cursor= "url('zoomin.cur'),crosshair";
				//dojo.byId("center").style.cursor= 'default';
				dojo.byId("map_zoom_slider").style.cursor='default';
				dojo.byId("map_infowindow").style.cursor='default';
				dojo.byId("navToolbar").style.cursor='default';				
				break;
			case "zoomout":
				dojo.byId("map_layers").style.cursor= "url('zoomout.cur'),crosshair";
				dojo.byId("center").style.cursor= "url('zoomout.cur'),crosshair";
				dojo.byId("map_zoom_slider").style.cursor='default';
				dojo.byId("map_infowindow").style.cursor='default';
				dojo.byId("navToolbar").style.cursor='default';
				break;
			case "pan":
				dojo.byId("map_layers").style.cursor= "url('pan.cur'),crosshair";
				dojo.byId("center").style.cursor= "url('pan.cur'),crosshair";
                    down = dojo.connect(map, "onMouseDown", function(evt) {
                        dojo.byId("map_layers").style.cursor = "url('grab.cur'),crosshair";
						dojo.byId("center").style.cursor = "url('grab.cur'),crosshair";
                    });
                    dojo.connect(map, "onMouseUp", function(evt) {
                        dojo.byId("map_layers").style.cursor = "url('pan.cur'),crosshair";
						dojo.byId("center").style.cursor = "url('pan.cur'),crosshair";
                    });
				dojo.byId("map_zoom_slider").style.cursor='default';
				dojo.byId("map_infowindow").style.cursor='default';
				dojo.byId("navToolbar").style.cursor='default';
				break;

			case "select":
				dojo.byId("map_layers").style.cursor= "url('select.cur'),crosshair";
				dojo.byId("centerPane").style.cursor= "url('select.cur'),crosshair";
				dojo.byId("map_zoom_slider").style.cursor='default';
				dojo.byId("map_infowindow").style.cursor='default';
				dojo.byId("navToolbar").style.cursor='default';				
				break;
			case "identify":
				dojo.byId("map_layers").style.cursor= "url('identify.cur'),crosshair";
				dojo.byId("centerPane").style.cursor= "url('identify.cur'),crosshair";
				dojo.byId("map_zoom_slider").style.cursor='default';
				dojo.byId("map_infowindow").style.cursor='default';
				dojo.byId("navToolbar").style.cursor='default';				
				break;
		}
	}