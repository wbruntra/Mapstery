(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$(document).ready( function () {
  "use strict";

  var countriesData;
  var countryToClick;
  var countryToClickCode;
  var goalLatLng = {lat: "", lng: ""};
  var regionHint;
  var numBorderCountries;
  var borderCountryCodes = [];
  var borderCountryNames = [];
  var borderCountryList;
  var clickedCountryCode;
  var countryClicked;
  var bonusCountryData =
      { population: "",
        demonym: "",
        capital: ""
      };
  var mapRevealed = false;

  /**
  http://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
  * Returns a random integer between min (inclusive) and max (inclusive)
  * Using Math.round() will give you a non-uniform distribution!
  */

  $.ajax({
    method: 'GET',
    url: 'https://restcountries.eu/rest/v1/all',
    success: function (allCountryData) {
        countriesData = allCountryData;
        setUpCountry(countriesData);
    }, error: function (request, error) {
        console.error(request);
    }
  });

  function setUpCountry(countriesDataArray) {
    var randCountryNum = Math.floor(Math.random() * (246 - 0 + 1)) + 0;
    countryToClickCode = countriesDataArray[randCountryNum].alpha2Code;
    countryToClick = countriesDataArray[randCountryNum].name;
    getBonusCountryData(randCountryNum);

    if (!countriesDataArray[randCountryNum].subregion) {
        regionHint = "the Antarctic";
    } else if (countriesDataArray[randCountryNum].subregion === "Caribbean") {
        regionHint = "the Caribbean";
    } else {
        regionHint = countriesDataArray[randCountryNum].subregion;
    }

    goalLatLng = {lat: countriesDataArray[randCountryNum].latlng[0], lng: countriesDataArray[randCountryNum].latlng[1]};
    numBorderCountries = countriesDataArray[randCountryNum].borders.length;
    borderCountryCodes = countriesDataArray[randCountryNum].borders;

    if (numBorderCountries === 0) {
    } else {
        //create arrays of border country names alpha2 country codes for the target country
        borderCountryCodes.forEach( function( BorderCountryAlpha3Code, index ) {
            countriesDataArray.forEach( function (country) {
                if (BorderCountryAlpha3Code === country.alpha3Code) {
                    borderCountryCodes.splice( index, 1, country.alpha2Code );
                    borderCountryNames.push( country.name );
                }
            });
        });
    }

    $(".modal").modal('show');
    $(".modal").html("Click on " + countryToClick + "<div class='modalInstructions' data-dismiss='modal'>(Click anywhere to start)</div>");
    $(".well").html("Click on " + countryToClick + "<div id='reveal-country'>Or click here to reveal " + countryToClick + "</div>");
  }

  // this stackoverflow helped me get my google maps call working: http://stackoverflow.com/questions/34466718/googlemaps-does-not-load-on-page-load

  var map;
  var markers = [];
  var markersLength;

  // function resetMarkers() {
  //   for (var i=0;i<markers.length;i++) {
  //     markers[i].setMap(null);
  //   }
  //   markers = [];
  // }

  window.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 42.29, lng: -85.585833},
      zoom: 3,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      disableDefaultUI: true,
      zoomControl: true,
      draggableCursor: 'crosshair'
    });

    //get the latitude and longitude of a user's click
    google.maps.event.addListener(map, "click", function(event) {

        var MarkerWithLabel = require('markerwithlabel')(google.maps);

        function placeMarker(location, color) {
          markersLength = (markers.length + 1).toString();
          var markerLabel = markersLength + "<br>" + clickedCountryCode;

          var clickMarker = new MarkerWithLabel({
            position: location,
            map: map,
            labelContent: markerLabel,
            labelAnchor: new google.maps.Point(10, 50),
            labelClass: "labels", // the CSS class for the label
            labelInBackground: false,
            icon: pinSymbol(color)
          });

          markers.push(clickMarker);
        }

        function pinSymbol(color) {
            return {
                path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
                fillColor: color,
                fillOpacity: 1,
                strokeColor: '#000',
                strokeWeight: 2,
                scale: 1.5
            };
        }

        var clickedSpot = {position: event.latLng, map: map};
        var latitude = clickedSpot.position.lat();
        var longitude = clickedSpot.position.lng();

        var geocoder = new google.maps.Geocoder;
        var latlng = {lat: latitude, lng: longitude};

        geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {

                function isCountryName(element) {
                    return element.types[0] === "country";
                };

                var countryIndex = results.findIndex(isCountryName);
                countryClicked = results[countryIndex].formatted_address;
                clickedCountryCode = results[countryIndex].address_components[0].short_name;

                if (mapRevealed === false) {
                    if (clickedCountryCode === countryToClickCode) {
                        placeMarker(event.latLng, 'green');
                        victoryDisplay(countryToClick);
                    } else {
                        $(".modal").modal('show');
                        $(".modal").html("You clicked on " + countryClicked);
                        placeMarker(event.latLng, 'red');

                        //determine the supplementary message to display upon click
                        if (numBorderCountries === 0) {
                            constructHint(mapRevealed, markers.length, numBorderCountries);
                        } else {
                            var clickedBorderIndex = borderCountryCodes.indexOf(clickedCountryCode);

                            if (clickedBorderIndex === -1) {
                                constructHint(mapRevealed, markers.length, numBorderCountries);
                            } else {
                                constructHint(mapRevealed, markers.length, numBorderCountries, clickedBorderIndex);
                            }
                        }
                    }
                } else {
                    $(".modal").modal('show');
                    $(".modal").html("You clicked on " + countryClicked);
                    constructHint(mapRevealed);
                }
            } else {
                $(".modal").modal('show');
                $(".modal").html("Whoops! You clicked on unclaimed territory! <br> <p class='modalInstructions' data-dismiss='modal'>Try again!</p>");
            }

        });
    });
  }

  function constructHint(isMapRevealed, numClicks, borderCount, borderCountryClickedIndex) {
      if (isMapRevealed === false) {
          if (borderCountryClickedIndex >= 0) {
            //slice() is used here to create a copy of the border country codes array without affecting the original array. Explanation here: http://stackoverflow.com/questions/6612385/why-does-changing-an-array-in-javascript-affect-copies-of-the-array
            var modifiedBorderCountryNames = borderCountryNames.slice();
            modifiedBorderCountryNames.splice(borderCountryClickedIndex, 1);
            constructBorderCountryList(modifiedBorderCountryNames);

            if (modifiedBorderCountryNames.length === 0) {
                $(".modal").append("<p class='modalInstructions' data-dismiss='modal'>So close! " + countryClicked + " is the only country that shares a border with " + countryToClick + "!");
            } else if (modifiedBorderCountryNames.length === 1) {
                $(".modal").append("<p class='modalInstructions' data-dismiss='modal'>Not too shabby! " + countryToClick + " shares a border with " + countryClicked + " and " + borderCountryList);
            } else {
                $(".modal").append("<p class='modalInstructions' data-dismiss='modal'>So close! " + countryToClick + " shares a border with " + countryClicked + ", as well as " + borderCountryList);
            }
          } else if (numClicks > 5) {

              if (borderCount === 0) {
                  $(".modal").append("<p class='modalInstructions' data-dismiss='modal'>Hint: " + countryToClick + " is an island nation in " + regionHint + "</p>");
              } else {
                  constructBorderCountryList(borderCountryNames);
                  $(".modal").append("<p class='modalInstructions' data-dismiss='modal'>Hint: " + countryToClick + " is in " + regionHint + " and shares a border with " + borderCountryList);
              }
          } else {
              $(".modal").append("<p class='modalInstructions' data-dismiss='modal'>Try again!</p>");
          }
      } else {
          var clickedCountryIndex = countriesData.findIndex(getClickedCountryIndex);
          getBonusCountryData(clickedCountryIndex);
          $(".modal").append("<p class='modalInstructions' data-dismiss='modal'>Population: " + bonusCountryData.population +
              "<br>Demonym: " + bonusCountryData.demonym + "<br>Capital City: " + bonusCountryData.capital + "</p>");
      }
  };

  function constructBorderCountryList(countryNameArray) {
      if (countryNameArray.length === 0) {
      } else if (countryNameArray.length === 1) {
          borderCountryList = countryNameArray[0];
      } else if (countryNameArray.length === 2) {
          borderCountryList = countryNameArray.join(" and ");
      } else {
          if (!countryNameArray[countryNameArray.length - 1].startsWith("and ")) {
              var lastCountry = countryNameArray.pop();
              countryNameArray.push("and " + lastCountry);
          }
          borderCountryList = countryNameArray.join(", ");
      }
  };

  function victoryDisplay(targetCountryName) {
    map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    $(".modal").modal('show');
    var msg = "";
    if (markers.length === 1) {
        msg = "Fantastic! You found "+ targetCountryName + " on the first try!"
    } else {
        msg = "You found " + targetCountryName + " after " + markers.length + " tries!"
    }

    mapRevealed = true;
    $(".modal").html(msg + "<div class='modalInstructions' data-dismiss='modal'>Population: " + bonusCountryData.population +
        "<br>Demonym: " + bonusCountryData.demonym + "<br>Capital City: " + bonusCountryData.capital + "<br>Click anywhere to explore the map!</div>");
    $(".well").html("<a href='javascript:window.location.reload()'>Find a new country!</a>");
  };

  function revealCountry() {
      map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
      map.setCenter(goalLatLng);
      map.setZoom(6);
      mapRevealed = true;
      $(".well").html("<a href='javascript:window.location.reload()'>Find a new country!</a>");
  }

  function getBonusCountryData(countryIndex) {
      var popNum = countriesData[countryIndex].population;
      popNum = popNum.toString().split("").reverse();
      for (var i = 3; i < popNum.length ;i = i+4) {
          popNum.splice(i, 0, '.');
      }
      bonusCountryData.population = popNum.reverse().join("");
      bonusCountryData.demonym = countriesData[countryIndex].demonym;
      bonusCountryData.capital = countriesData[countryIndex].capital;
  };

  function getClickedCountryIndex(allCountries) {
      return allCountries.alpha2Code === clickedCountryCode;
  };

  $(".well").click(function() {
      revealCountry();
  });

  // function startNewRound() {
  //   map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
  //   resetMarkers();
  //   setUpCountry(countryList);
  // }

});

},{"markerwithlabel":2}],2:[function(require,module,exports){
/**
 * @name MarkerWithLabel for V3
 * @version 1.1.9 [June 30, 2013]
 * @author Gary Little (inspired by code from Marc Ridey of Google).
 * @copyright Copyright 2012 Gary Little [gary at luxcentral.com]
 * @fileoverview MarkerWithLabel extends the Google Maps JavaScript API V3
 *  <code>google.maps.Marker</code> class.
 *  <p>
 *  MarkerWithLabel allows you to define markers with associated labels. As you would expect,
 *  if the marker is draggable, so too will be the label. In addition, a marker with a label
 *  responds to all mouse events in the same manner as a regular marker. It also fires mouse
 *  events and "property changed" events just as a regular marker would. Version 1.1 adds
 *  support for the raiseOnDrag feature introduced in API V3.3.
 *  <p>
 *  If you drag a marker by its label, you can cancel the drag and return the marker to its
 *  original position by pressing the <code>Esc</code> key. This doesn't work if you drag the marker
 *  itself because this feature is not (yet) supported in the <code>google.maps.Marker</code> class.
 */

/*!
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint browser:true */
/*global document,google */

/**
 * @param {Function} childCtor Child class.
 * @param {Function} parentCtor Parent class.
 */
function inherits(childCtor, parentCtor) {
  /** @constructor */
  function tempCtor() {};
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  /** @override */
  childCtor.prototype.constructor = childCtor;
}

/**
 * @param {Object} gMapsApi The Google Maps API instance (usually `google.maps`)
 * @return {Function} The instantiable MarkerWithLabel class
 */
module.exports = function(gMapsApi) {

  /**
   * This constructor creates a label and associates it with a marker.
   * It is for the private use of the MarkerWithLabel class.
   * @constructor
   * @param {Marker} marker The marker with which the label is to be associated.
   * @param {string} crossURL The URL of the cross image =.
   * @param {string} handCursor The URL of the hand cursor.
   * @private
   */
  function MarkerLabel_(marker, crossURL, handCursorURL) {
    this.marker_ = marker;
    this.handCursorURL_ = marker.handCursorURL;

    this.labelDiv_ = document.createElement("div");
    this.labelDiv_.style.cssText = "position: absolute; overflow: hidden;";

    // Set up the DIV for handling mouse events in the label. This DIV forms a transparent veil
    // in the "overlayMouseTarget" pane, a veil that covers just the label. This is done so that
    // events can be captured even if the label is in the shadow of a google.maps.InfoWindow.
    // Code is included here to ensure the veil is always exactly the same size as the label.
    this.eventDiv_ = document.createElement("div");
    this.eventDiv_.style.cssText = this.labelDiv_.style.cssText;

    // This is needed for proper behavior on MSIE:
    this.eventDiv_.setAttribute("onselectstart", "return false;");
    this.eventDiv_.setAttribute("ondragstart", "return false;");

    // Get the DIV for the "X" to be displayed when the marker is raised.
    this.crossDiv_ = MarkerLabel_.getSharedCross(crossURL);
  }
  inherits(MarkerLabel_, gMapsApi.OverlayView);

  /**
   * Returns the DIV for the cross used when dragging a marker when the
   * raiseOnDrag parameter set to true. One cross is shared with all markers.
   * @param {string} crossURL The URL of the cross image =.
   * @private
   */
  MarkerLabel_.getSharedCross = function (crossURL) {
    var div;
    if (typeof MarkerLabel_.getSharedCross.crossDiv === "undefined") {
      div = document.createElement("img");
      div.style.cssText = "position: absolute; z-index: 1000002; display: none;";
      // Hopefully Google never changes the standard "X" attributes:
      div.style.marginLeft = "-8px";
      div.style.marginTop = "-9px";
      div.src = crossURL;
      MarkerLabel_.getSharedCross.crossDiv = div;
    }
    return MarkerLabel_.getSharedCross.crossDiv;
  };

  /**
   * Adds the DIV representing the label to the DOM. This method is called
   * automatically when the marker's <code>setMap</code> method is called.
   * @private
   */
  MarkerLabel_.prototype.onAdd = function () {
    var me = this;
    var cMouseIsDown = false;
    var cDraggingLabel = false;
    var cSavedZIndex;
    var cLatOffset, cLngOffset;
    var cIgnoreClick;
    var cRaiseEnabled;
    var cStartPosition;
    var cStartCenter;
    // Constants:
    var cRaiseOffset = 20;
    var cDraggingCursor = "url(" + this.handCursorURL_ + ")";

    // Stops all processing of an event.
    //
    var cAbortEvent = function (e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      e.cancelBubble = true;
      if (e.stopPropagation) {
        e.stopPropagation();
      }
    };

    var cStopBounce = function () {
      me.marker_.setAnimation(null);
    };

    this.getPanes().markerLayer.appendChild(this.labelDiv_);
    this.getPanes().overlayMouseTarget.appendChild(this.eventDiv_);
    // One cross is shared with all markers, so only add it once:
    if (typeof MarkerLabel_.getSharedCross.processed === "undefined") {
      this.getPanes().markerLayer.appendChild(this.crossDiv_);
      MarkerLabel_.getSharedCross.processed = true;
    }

    this.listeners_ = [
      gMapsApi.event.addDomListener(this.eventDiv_, "mouseover", function (e) {
        if (me.marker_.getDraggable() || me.marker_.getClickable()) {
          this.style.cursor = "pointer";
          gMapsApi.event.trigger(me.marker_, "mouseover", e);
        }
      }),
      gMapsApi.event.addDomListener(this.eventDiv_, "mouseout", function (e) {
        if ((me.marker_.getDraggable() || me.marker_.getClickable()) && !cDraggingLabel) {
          this.style.cursor = me.marker_.getCursor();
          gMapsApi.event.trigger(me.marker_, "mouseout", e);
        }
      }),
      gMapsApi.event.addDomListener(this.eventDiv_, "mousedown", function (e) {
        cDraggingLabel = false;
        if (me.marker_.getDraggable()) {
          cMouseIsDown = true;
          this.style.cursor = cDraggingCursor;
        }
        if (me.marker_.getDraggable() || me.marker_.getClickable()) {
          gMapsApi.event.trigger(me.marker_, "mousedown", e);
          cAbortEvent(e); // Prevent map pan when starting a drag on a label
        }
      }),
      gMapsApi.event.addDomListener(document, "mouseup", function (mEvent) {
        var position;
        if (cMouseIsDown) {
          cMouseIsDown = false;
          me.eventDiv_.style.cursor = "pointer";
          gMapsApi.event.trigger(me.marker_, "mouseup", mEvent);
        }
        if (cDraggingLabel) {
          if (cRaiseEnabled) { // Lower the marker & label
            position = me.getProjection().fromLatLngToDivPixel(me.marker_.getPosition());
            position.y += cRaiseOffset;
            me.marker_.setPosition(me.getProjection().fromDivPixelToLatLng(position));
            // This is not the same bouncing style as when the marker portion is dragged,
            // but it will have to do:
            try { // Will fail if running Google Maps API earlier than V3.3
              me.marker_.setAnimation(gMapsApi.Animation.BOUNCE);
              setTimeout(cStopBounce, 1406);
            } catch (e) {}
          }
          me.crossDiv_.style.display = "none";
          me.marker_.setZIndex(cSavedZIndex);
          cIgnoreClick = true; // Set flag to ignore the click event reported after a label drag
          cDraggingLabel = false;
          mEvent.latLng = me.marker_.getPosition();
          gMapsApi.event.trigger(me.marker_, "dragend", mEvent);
        }
      }),
      gMapsApi.event.addListener(me.marker_.getMap(), "mousemove", function (mEvent) {
        var position;
        if (cMouseIsDown) {
          if (cDraggingLabel) {
            // Change the reported location from the mouse position to the marker position:
            mEvent.latLng = new gMapsApi.LatLng(mEvent.latLng.lat() - cLatOffset, mEvent.latLng.lng() - cLngOffset);
            position = me.getProjection().fromLatLngToDivPixel(mEvent.latLng);
            if (cRaiseEnabled) {
              me.crossDiv_.style.left = position.x + "px";
              me.crossDiv_.style.top = position.y + "px";
              me.crossDiv_.style.display = "";
              position.y -= cRaiseOffset;
            }
            me.marker_.setPosition(me.getProjection().fromDivPixelToLatLng(position));
            if (cRaiseEnabled) { // Don't raise the veil; this hack needed to make MSIE act properly
              me.eventDiv_.style.top = (position.y + cRaiseOffset) + "px";
            }
            gMapsApi.event.trigger(me.marker_, "drag", mEvent);
          } else {
            // Calculate offsets from the click point to the marker position:
            cLatOffset = mEvent.latLng.lat() - me.marker_.getPosition().lat();
            cLngOffset = mEvent.latLng.lng() - me.marker_.getPosition().lng();
            cSavedZIndex = me.marker_.getZIndex();
            cStartPosition = me.marker_.getPosition();
            cStartCenter = me.marker_.getMap().getCenter();
            cRaiseEnabled = me.marker_.get("raiseOnDrag");
            cDraggingLabel = true;
            me.marker_.setZIndex(1000000); // Moves the marker & label to the foreground during a drag
            mEvent.latLng = me.marker_.getPosition();
            gMapsApi.event.trigger(me.marker_, "dragstart", mEvent);
          }
        }
      }),
      gMapsApi.event.addDomListener(document, "keydown", function (e) {
        if (cDraggingLabel) {
          if (e.keyCode === 27) { // Esc key
            cRaiseEnabled = false;
            me.marker_.setPosition(cStartPosition);
            me.marker_.getMap().setCenter(cStartCenter);
            gMapsApi.event.trigger(document, "mouseup", e);
          }
        }
      }),
      gMapsApi.event.addDomListener(this.eventDiv_, "click", function (e) {
        if (me.marker_.getDraggable() || me.marker_.getClickable()) {
          if (cIgnoreClick) { // Ignore the click reported when a label drag ends
            cIgnoreClick = false;
          } else {
            gMapsApi.event.trigger(me.marker_, "click", e);
            cAbortEvent(e); // Prevent click from being passed on to map
          }
        }
      }),
      gMapsApi.event.addDomListener(this.eventDiv_, "dblclick", function (e) {
        if (me.marker_.getDraggable() || me.marker_.getClickable()) {
          gMapsApi.event.trigger(me.marker_, "dblclick", e);
          cAbortEvent(e); // Prevent map zoom when double-clicking on a label
        }
      }),
      gMapsApi.event.addListener(this.marker_, "dragstart", function (mEvent) {
        if (!cDraggingLabel) {
          cRaiseEnabled = this.get("raiseOnDrag");
        }
      }),
      gMapsApi.event.addListener(this.marker_, "drag", function (mEvent) {
        if (!cDraggingLabel) {
          if (cRaiseEnabled) {
            me.setPosition(cRaiseOffset);
            // During a drag, the marker's z-index is temporarily set to 1000000 to
            // ensure it appears above all other markers. Also set the label's z-index
            // to 1000000 (plus or minus 1 depending on whether the label is supposed
            // to be above or below the marker).
            me.labelDiv_.style.zIndex = 1000000 + (this.get("labelInBackground") ? -1 : +1);
          }
        }
      }),
      gMapsApi.event.addListener(this.marker_, "dragend", function (mEvent) {
        if (!cDraggingLabel) {
          if (cRaiseEnabled) {
            me.setPosition(0); // Also restores z-index of label
          }
        }
      }),
      gMapsApi.event.addListener(this.marker_, "position_changed", function () {
        me.setPosition();
      }),
      gMapsApi.event.addListener(this.marker_, "zindex_changed", function () {
        me.setZIndex();
      }),
      gMapsApi.event.addListener(this.marker_, "visible_changed", function () {
        me.setVisible();
      }),
      gMapsApi.event.addListener(this.marker_, "labelvisible_changed", function () {
        me.setVisible();
      }),
      gMapsApi.event.addListener(this.marker_, "title_changed", function () {
        me.setTitle();
      }),
      gMapsApi.event.addListener(this.marker_, "labelcontent_changed", function () {
        me.setContent();
      }),
      gMapsApi.event.addListener(this.marker_, "labelanchor_changed", function () {
        me.setAnchor();
      }),
      gMapsApi.event.addListener(this.marker_, "labelclass_changed", function () {
        me.setStyles();
      }),
      gMapsApi.event.addListener(this.marker_, "labelstyle_changed", function () {
        me.setStyles();
      })
    ];
  };

  /**
   * Removes the DIV for the label from the DOM. It also removes all event handlers.
   * This method is called automatically when the marker's <code>setMap(null)</code>
   * method is called.
   * @private
   */
  MarkerLabel_.prototype.onRemove = function () {
    var i;
    this.labelDiv_.parentNode.removeChild(this.labelDiv_);
    this.eventDiv_.parentNode.removeChild(this.eventDiv_);

    // Remove event listeners:
    for (i = 0; i < this.listeners_.length; i++) {
      gMapsApi.event.removeListener(this.listeners_[i]);
    }
  };

  /**
   * Draws the label on the map.
   * @private
   */
  MarkerLabel_.prototype.draw = function () {
    this.setContent();
    this.setTitle();
    this.setStyles();
  };

  /**
   * Sets the content of the label.
   * The content can be plain text or an HTML DOM node.
   * @private
   */
  MarkerLabel_.prototype.setContent = function () {
    var content = this.marker_.get("labelContent");
    if (typeof content.nodeType === "undefined") {
      this.labelDiv_.innerHTML = content;
      this.eventDiv_.innerHTML = this.labelDiv_.innerHTML;
    } else {
      // Remove current content
      while (this.labelDiv_.lastChild) {
        this.labelDiv_.removeChild(this.labelDiv_.lastChild);
      }

      while (this.eventDiv_.lastChild) {
        this.eventDiv_.removeChild(this.eventDiv_.lastChild);
      }

      this.labelDiv_.appendChild(content);
      content = content.cloneNode(true);
      this.eventDiv_.appendChild(content);
    }
  };

  /**
   * Sets the content of the tool tip for the label. It is
   * always set to be the same as for the marker itself.
   * @private
   */
  MarkerLabel_.prototype.setTitle = function () {
    this.eventDiv_.title = this.marker_.getTitle() || "";
  };

  /**
   * Sets the style of the label by setting the style sheet and applying
   * other specific styles requested.
   * @private
   */
  MarkerLabel_.prototype.setStyles = function () {
    var i, labelStyle;

    // Apply style values from the style sheet defined in the labelClass parameter:
    this.labelDiv_.className = this.marker_.get("labelClass");
    this.eventDiv_.className = this.labelDiv_.className;

    // Clear existing inline style values:
    this.labelDiv_.style.cssText = "";
    this.eventDiv_.style.cssText = "";
    // Apply style values defined in the labelStyle parameter:
    labelStyle = this.marker_.get("labelStyle");
    for (i in labelStyle) {
      if (labelStyle.hasOwnProperty(i)) {
        this.labelDiv_.style[i] = labelStyle[i];
        this.eventDiv_.style[i] = labelStyle[i];
      }
    }
    this.setMandatoryStyles();
  };

  /**
   * Sets the mandatory styles to the DIV representing the label as well as to the
   * associated event DIV. This includes setting the DIV position, z-index, and visibility.
   * @private
   */
  MarkerLabel_.prototype.setMandatoryStyles = function () {
    this.labelDiv_.style.position = "absolute";
    this.labelDiv_.style.overflow = "hidden";
    // Make sure the opacity setting causes the desired effect on MSIE:
    if (typeof this.labelDiv_.style.opacity !== "undefined" && this.labelDiv_.style.opacity !== "") {
      this.labelDiv_.style.MsFilter = "\"progid:DXImageTransform.Microsoft.Alpha(opacity=" + (this.labelDiv_.style.opacity * 100) + ")\"";
      this.labelDiv_.style.filter = "alpha(opacity=" + (this.labelDiv_.style.opacity * 100) + ")";
    }

    this.eventDiv_.style.position = this.labelDiv_.style.position;
    this.eventDiv_.style.overflow = this.labelDiv_.style.overflow;
    this.eventDiv_.style.opacity = 0.01; // Don't use 0; DIV won't be clickable on MSIE
    this.eventDiv_.style.MsFilter = "\"progid:DXImageTransform.Microsoft.Alpha(opacity=1)\"";
    this.eventDiv_.style.filter = "alpha(opacity=1)"; // For MSIE

    this.setAnchor();
    this.setPosition(); // This also updates z-index, if necessary.
    this.setVisible();
  };

  /**
   * Sets the anchor point of the label.
   * @private
   */
  MarkerLabel_.prototype.setAnchor = function () {
    var anchor = this.marker_.get("labelAnchor");
    this.labelDiv_.style.marginLeft = -anchor.x + "px";
    this.labelDiv_.style.marginTop = -anchor.y + "px";
    this.eventDiv_.style.marginLeft = -anchor.x + "px";
    this.eventDiv_.style.marginTop = -anchor.y + "px";
  };

  /**
   * Sets the position of the label. The z-index is also updated, if necessary.
   * @private
   */
  MarkerLabel_.prototype.setPosition = function (yOffset) {
    var position = this.getProjection().fromLatLngToDivPixel(this.marker_.getPosition());
    if (typeof yOffset === "undefined") {
      yOffset = 0;
    }
    this.labelDiv_.style.left = Math.round(position.x) + "px";
    this.labelDiv_.style.top = Math.round(position.y - yOffset) + "px";
    this.eventDiv_.style.left = this.labelDiv_.style.left;
    this.eventDiv_.style.top = this.labelDiv_.style.top;

    this.setZIndex();
  };

  /**
   * Sets the z-index of the label. If the marker's z-index property has not been defined, the z-index
   * of the label is set to the vertical coordinate of the label. This is in keeping with the default
   * stacking order for Google Maps: markers to the south are in front of markers to the north.
   * @private
   */
  MarkerLabel_.prototype.setZIndex = function () {
    var zAdjust = (this.marker_.get("labelInBackground") ? -1 : +1);
    if (typeof this.marker_.getZIndex() === "undefined") {
      this.labelDiv_.style.zIndex = parseInt(this.labelDiv_.style.top, 10) + zAdjust;
      this.eventDiv_.style.zIndex = this.labelDiv_.style.zIndex;
    } else {
      this.labelDiv_.style.zIndex = this.marker_.getZIndex() + zAdjust;
      this.eventDiv_.style.zIndex = this.labelDiv_.style.zIndex;
    }
  };

  /**
   * Sets the visibility of the label. The label is visible only if the marker itself is
   * visible (i.e., its visible property is true) and the labelVisible property is true.
   * @private
   */
  MarkerLabel_.prototype.setVisible = function () {
    if (this.marker_.get("labelVisible")) {
      this.labelDiv_.style.display = this.marker_.getVisible() ? "block" : "none";
    } else {
      this.labelDiv_.style.display = "none";
    }
    this.eventDiv_.style.display = this.labelDiv_.style.display;
  };

  /**
   * @name MarkerWithLabelOptions
   * @class This class represents the optional parameter passed to the {@link MarkerWithLabel} constructor.
   *  The properties available are the same as for <code>google.maps.Marker</code> with the addition
   *  of the properties listed below. To change any of these additional properties after the labeled
   *  marker has been created, call <code>google.maps.Marker.set(propertyName, propertyValue)</code>.
   *  <p>
   *  When any of these properties changes, a property changed event is fired. The names of these
   *  events are derived from the name of the property and are of the form <code>propertyname_changed</code>.
   *  For example, if the content of the label changes, a <code>labelcontent_changed</code> event
   *  is fired.
   *  <p>
   * @property {string|Node} [labelContent] The content of the label (plain text or an HTML DOM node).
   * @property {Point} [labelAnchor] By default, a label is drawn with its anchor point at (0,0) so
   *  that its top left corner is positioned at the anchor point of the associated marker. Use this
   *  property to change the anchor point of the label. For example, to center a 50px-wide label
   *  beneath a marker, specify a <code>labelAnchor</code> of <code>google.maps.Point(25, 0)</code>.
   *  (Note: x-values increase to the right and y-values increase to the top.)
   * @property {string} [labelClass] The name of the CSS class defining the styles for the label.
   *  Note that style values for <code>position</code>, <code>overflow</code>, <code>top</code>,
   *  <code>left</code>, <code>zIndex</code>, <code>display</code>, <code>marginLeft</code>, and
   *  <code>marginTop</code> are ignored; these styles are for internal use only.
   * @property {Object} [labelStyle] An object literal whose properties define specific CSS
   *  style values to be applied to the label. Style values defined here override those that may
   *  be defined in the <code>labelClass</code> style sheet. If this property is changed after the
   *  label has been created, all previously set styles (except those defined in the style sheet)
   *  are removed from the label before the new style values are applied.
   *  Note that style values for <code>position</code>, <code>overflow</code>, <code>top</code>,
   *  <code>left</code>, <code>zIndex</code>, <code>display</code>, <code>marginLeft</code>, and
   *  <code>marginTop</code> are ignored; these styles are for internal use only.
   * @property {boolean} [labelInBackground] A flag indicating whether a label that overlaps its
   *  associated marker should appear in the background (i.e., in a plane below the marker).
   *  The default is <code>false</code>, which causes the label to appear in the foreground.
   * @property {boolean} [labelVisible] A flag indicating whether the label is to be visible.
   *  The default is <code>true</code>. Note that even if <code>labelVisible</code> is
   *  <code>true</code>, the label will <i>not</i> be visible unless the associated marker is also
   *  visible (i.e., unless the marker's <code>visible</code> property is <code>true</code>).
   * @property {boolean} [raiseOnDrag] A flag indicating whether the label and marker are to be
   *  raised when the marker is dragged. The default is <code>true</code>. If a draggable marker is
   *  being created and a version of Google Maps API earlier than V3.3 is being used, this property
   *  must be set to <code>false</code>.
   * @property {boolean} [optimized] A flag indicating whether rendering is to be optimized for the
   *  marker. <b>Important: The optimized rendering technique is not supported by MarkerWithLabel,
   *  so the value of this parameter is always forced to <code>false</code>.
   * @property {string} [crossImage="http://maps.gstatic.com/intl/en_us/mapfiles/drag_cross_67_16.png"]
   *  The URL of the cross image to be displayed while dragging a marker.
   * @property {string} [handCursor="http://maps.gstatic.com/intl/en_us/mapfiles/closedhand_8_8.cur"]
   *  The URL of the cursor to be displayed while dragging a marker.
   */
  /**
   * Creates a MarkerWithLabel with the options specified in {@link MarkerWithLabelOptions}.
   * @constructor
   * @param {MarkerWithLabelOptions} [opt_options] The optional parameters.
   */
  function MarkerWithLabel(opt_options) {
    opt_options = opt_options || {};
    opt_options.labelContent = opt_options.labelContent || "";
    opt_options.labelAnchor = opt_options.labelAnchor || new gMapsApi.Point(0, 0);
    opt_options.labelClass = opt_options.labelClass || "markerLabels";
    opt_options.labelStyle = opt_options.labelStyle || {};
    opt_options.labelInBackground = opt_options.labelInBackground || false;
    if (typeof opt_options.labelVisible === "undefined") {
      opt_options.labelVisible = true;
    }
    if (typeof opt_options.raiseOnDrag === "undefined") {
      opt_options.raiseOnDrag = true;
    }
    if (typeof opt_options.clickable === "undefined") {
      opt_options.clickable = true;
    }
    if (typeof opt_options.draggable === "undefined") {
      opt_options.draggable = false;
    }
    if (typeof opt_options.optimized === "undefined") {
      opt_options.optimized = false;
    }
    opt_options.crossImage = opt_options.crossImage || "http" + (document.location.protocol === "https:" ? "s" : "") + "://maps.gstatic.com/intl/en_us/mapfiles/drag_cross_67_16.png";
    opt_options.handCursor = opt_options.handCursor || "http" + (document.location.protocol === "https:" ? "s" : "") + "://maps.gstatic.com/intl/en_us/mapfiles/closedhand_8_8.cur";
    opt_options.optimized = false; // Optimized rendering is not supported

    this.label = new MarkerLabel_(this, opt_options.crossImage, opt_options.handCursor); // Bind the label to the marker

    // Call the parent constructor. It calls Marker.setValues to initialize, so all
    // the new parameters are conveniently saved and can be accessed with get/set.
    // Marker.set triggers a property changed event (called "propertyname_changed")
    // that the marker label listens for in order to react to state changes.
    gMapsApi.Marker.apply(this, arguments);
  }
  inherits(MarkerWithLabel, gMapsApi.Marker);

  /**
   * Overrides the standard Marker setMap function.
   * @param {Map} theMap The map to which the marker is to be added.
   * @private
   */
  MarkerWithLabel.prototype.setMap = function (theMap) {

    // Call the inherited function...
    gMapsApi.Marker.prototype.setMap.apply(this, arguments);

    // ... then deal with the label:
    this.label.setMap(theMap);
  };

  return MarkerWithLabel;
}

},{}]},{},[1]);