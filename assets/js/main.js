!function(e){var t={};function a(i){if(t[i])return t[i].exports;var n=t[i]={i:i,l:!1,exports:{}};return e[i].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=e,a.c=t,a.d=function(e,t,i){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(a.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)a.d(i,n,function(t){return e[t]}.bind(null,n));return i},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="",a(a.s=0)}([function(e,t,a){var i=a(1);$(document).ready(function(){"use strict";var e,t,n,r,o,l,s,c,d,u,m,p,g,h,b,y,v,_=$(window).width(),f={capital:"",largest_city:""},S={lat:"",lng:""},k=[],D=[],C={flag:"",population:"",demonym:"",capital:"",multiple_currencies:!1,currencies:[],multiple_languages:!1,languages:[]},M=!1;const A="<button type='button' class='btn btn-primary' data-dismiss='modal'>Explore the Map</button>",L="<a href='javascript:window.location.reload()'>Play Mapstery Again</a>";function w(a){t=a,"worldCountries"===a?$.ajax({method:"GET",url:"https://restcountries.eu/rest/v2/all",data:{fields:"flag;name;alpha2Code;alpha3Code;capital;subregion;population;latlng;demonym;area;borders;languages;currencies"},success:function(t){(function(e){var t=Math.floor(Math.random()*e.length);o=e[t],s=o.alpha2Code,l=o.name,c=o.flag,d=o.area,"GF"===s?d=83534:"SJ"===s&&(d=61022);v=function(e,t){var a=0;switch(!0){case isNaN(e):a=8;break;case e>97e5:a=3;break;case e>75e5:a=4;break;case e>25e4:a=5;break;case e>4e4:a=6;break;case e>1e3:a=7;break;case e>10:a=8;break;case e>3:a=9;break;default:a=12}return a-=t>70?2:0}(d,o.latlng[0]),N(t),u=o.subregion?"Caribbean"===o.subregion?"the Caribbean":o.subregion:"the Antarctic";S="UM"===s?{lat:19.3,lng:166.633333}:{lat:o.latlng[0],lng:o.latlng[1]};m=o.borders.length,k=o.borders,0===m||k.forEach(function(t,a){e.forEach(function(e){t===e.alpha3Code&&(k.splice(a,1,e.alpha2Code),D.push(e.name))})});$(".modal").modal("show"),$(".modal").html("Click on "+l+"<img class='targetFlag' src="+c+"></img><div id='proceed_button' class='modalInstructions'><button type='button' class='btn btn-primary' data-dismiss='modal'>Click to start playing</button></div>"),$(".well").show(),$(".well").html("Click on "+l+"<img class='targetFlagWell' src="+c+"></img><div id='reveal-country'>Or click here to reveal "+l+"</div>")})(e=t),I.setOptions({center:{lat:0,lng:0}})},error:function(e,t){console.error(t)}}):"usStates"===a?(e=i,I.setOptions({zoom:_>500?4:3,center:{lat:39.810556,lng:-98.556111}}),function(e){var t=Math.floor(Math.random()*e.length);n=e[t],B(t),$(".modal").modal("show"),$(".modal").html("Click on "+n.name+"<div id='proceed_button' class='modalInstructions'><button type='button' class='btn btn-primary' data-dismiss='modal'>Click to start playing</button></div>"),$(".well").show(),$(".well").html("Click on "+n.name)}(e)):alert("uh oh! Mapstery can't do that yet")}var I;$("#countries_button").click(function(){w("worldCountries")}),$("#states_button").click(function(){w("usStates")}),$(".well").hide(),$(".modal").modal("show"),window.initMap=function(){I=new google.maps.Map(document.getElementById("map"),{center:{lat:42.29,lng:-85.585833},zoom:2,mapTypeId:google.maps.MapTypeId.SATELLITE,disableDefaultUI:!0,zoomControl:_>500,draggableCursor:"crosshair",scaleControl:!0}),google.maps.event.addListener(I,"click",function(e){var i=a(2)(google.maps);function o(e,t){x=(U.length+1).toString();var a=new i({position:e,map:I,labelContent:x+"<br>"+g,labelAnchor:new google.maps.Point(10,50),labelClass:"labels",labelInBackground:!1,icon:function(e){return{path:"M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z",fillColor:e,fillOpacity:1,strokeColor:"#000",strokeWeight:2,scale:1.5}}(t)});U.push(a)}var c={position:e.latLng,map:I},d=c.position.lat(),u=c.position.lng(),p=function(e,t,a,i){var n,r=.017453292519943295,o=Math.cos,l=.5-o((a-e)*r)/2+o(e*r)*o(a*r)*(1-o((i-t)*r))/2,s=12742*Math.asin(Math.sqrt(l)),c=.621371*s;"number"==typeof b&&(n=b>c);return b=c,{miles:K(c),kilometers:K(s),closerClick:n}}(S.lat,S.lng,d,u),y={lat:d,lng:u};function v(e){return"administrative_area_level_1"===e.types[0]}function _(e){return"country"===e.types[0]}(new google.maps.Geocoder).geocode({location:y},function(a,i){if(i===google.maps.GeocoderStatus.OK){if("worldCountries"===t){var c=a.findIndex(_);if(-1===c){e:for(var d=a.length-1;d>=0;d--)for(var u=a[d].address_components.length-1;u>=0;u--)if(_(a[d].address_components[u])){h=a[d].address_components[u].long_name,g=a[d].address_components[u].short_name;break e}}else h=a[c].address_components[0].long_name,g=a[c].address_components[0].short_name;if(!1===M)if(g===s)o(e.latLng,"green"),O(l);else if($(".modal").modal("show"),$(".modal").html("You clicked on "+h),o(e.latLng,"red"),0===m)P(M,p,U.length,m);else{var b=k.indexOf(g);-1===b?P(M,p,U.length,m):P(M,p,U.length,m,b)}else $(".modal").modal("show"),$(".modal").html("You clicked on "+h),P(M)}else if("usStates"===t){var y=a.findIndex(v);g=a[y].address_components[0].short_name,r=a[y].address_components[0].long_name,!1===M?n.abbr===g?(o(e.latLng,"green"),O(r)):($(".modal").modal("show"),$(".modal").html("You clicked on "+r+"<div id='proceed_button' class='modalInstructions'><button type='button' class='btn btn-primary' data-dismiss='modal'>Try Again</button></div>"),o(e.latLng,"red")):($(".modal").modal("show"),$(".modal").html("You clicked on "+r),P(M))}}else $(".modal").modal("show"),$(".modal").html("Whoops! You clicked on unclaimed territory! <div id='proceed_button' class='modalInstructions'><button type='button' class='btn btn-primary' data-dismiss='modal'>Try Again</button></div>")})})};var x,U=[];function K(e){for(var t=(e=Math.round(e)).toString().split("").reverse(),a=3;a<t.length;a+=4)t.splice(a,0,",");return t.reverse().join("")}function P(a,i,n,r,o){if(!1===a)if(y=!0===i.closerClick?"You're getting warmer!":!1===i.closerClick?"You're getting colder.":"",$(".modal").append("<p class='modalInstructions'>"+y+" Your click was about "+i.miles+" Miles ("+i.kilometers+" Kilometers) from "+l+"<div id='proceed_button' class='modalInstructions'><button type='button' class='btn btn-primary' data-dismiss='modal'>Try Again</button></div>"),o>=0){var s=D.slice();s.splice(o,1),T(s),0===s.length?$(".modal").append("<p class='modalInstructions'>"+h+" is the only country that shares a border with "+l+"!"):1===s.length?$(".modal").append("<p class='modalInstructions'>"+l+" shares a border with "+h+" and "+p):$(".modal").append("<p class='modalInstructions'>"+l+" shares a border with "+h+", as well as "+p)}else n>5&&(0===r?$(".modal").append("<p class='modalInstructions'>Hint: "+l+" is an island nation in "+u+"</p>"):(T(D),$(".modal").append("<p class='modalInstructions'>Hint: "+l+" is in "+u+" and shares a border with "+p)));else if("worldCountries"===t)N(e.findIndex(j)),$(".modal").append(z());else if("usStates"===t){var c=e.findIndex(E);-1!=c?(B(c),$(".modal").append(V())):$(".modal").append("<p class='modalInstructions'>"+A+"</p>")}}function T(e){if(0===e.length);else if(1===e.length)p=e[0];else if(2===e.length)p=e.join(" and ");else{if(!e[e.length-1].startsWith("and ")){var t=e.pop();e.push("and "+t)}p=e.join(", ")}}function O(e){I.setOptions({mapTypeId:google.maps.MapTypeId.ROADMAP,disableDefaultUI:!1,zoomControl:_>500,streetViewControl:!1,fullscreenControl:!1}),$(".modal").modal("show");var a="";a=1===U.length?"Fantastic! You found "+e+" on the first try!":"You found "+e+" after "+U.length+" tries!",M=!0,"worldCountries"===t?($(".modal").html(a+z()),$(".well").html(L)):"usStates"===t&&($(".modal").html(a+V()),$(".well").html(L))}function N(t){const a=e[t];C={flag:a.flag,population:K(a.population),demonym:a.demonym,capital:a.capital,multiple_currencies:a.currencies.length>1,currencies:function(e){const t=[];return e.forEach(function(e){e.name&&t.push(e.name+(e.symbol?" ("+e.symbol+")":""))}),t.join(", ")}(a.currencies),multiple_languages:a.languages.length>1,languages:function(e){const t=[];return e.forEach(function(e){e.name&&t.push(e.name)}),t.join(", ")}(a.languages)}}function z(){return"<p class='modalInstructions'><img class='bonusCountryFlag' src="+C.flag+"></img><br>Population: "+C.population+"<br>Demonym: "+C.demonym+"<br>Capital City: "+C.capital+"<br>"+(C.multiple_currencies?"Currencies: ":"Currency: ")+C.currencies+"<br>"+(C.multiple_languages?"Languages: ":"Language: ")+C.languages+"<br>"+A+"</p>"}function B(t){const a=e[t];f={largest_city:a.largest_city,capital:a.capital}}function V(){return"<div class='modalInstructions'>Capital City: "+f.capital+"<br>Largest City: "+f.largest_city+"<br>"+A+"</div>"}function j(e){return e.alpha2Code===g}function E(e){return e.abbr===g}$(".well").click(function(){"worldCountries"===t&&function(e){I.setOptions({mapTypeId:google.maps.MapTypeId.ROADMAP,disableDefaultUI:!1,zoomControl:_>500,streetViewControl:!1,fullscreenControl:!1,zoom:e,center:S}),M=!0,$(".well").html(L)}(v)})})},function(e,t){e.exports=[{id:1,country:"USA",name:"Alabama",abbr:"AL",area:"135767SKM",largest_city:"Birmingham",capital:"Montgomery"},{id:2,country:"USA",name:"Alaska",abbr:"AK",area:"1723337SKM",largest_city:"Anchorage",capital:"Juneau"},{id:3,country:"USA",name:"Arizona",abbr:"AZ",area:"113594SKM",largest_city:"Phoenix",capital:"Phoenix"},{id:4,country:"USA",name:"Arkansas",abbr:"AR",area:"52035SKM",largest_city:"Little Rock",capital:"Little Rock"},{id:5,country:"USA",name:"California",abbr:"CA",area:"423967SKM",largest_city:"Los Angeles",capital:"Sacramento"},{id:6,country:"USA",name:"Colorado",abbr:"CO",area:"103642SKM",largest_city:"Denver",capital:"Denver"},{id:7,country:"USA",name:"Connecticut",abbr:"CT",area:"14357SKM",largest_city:"Bridgeport",capital:"Hartford"},{id:8,country:"USA",name:"Delaware",abbr:"DE",area:"6446SKM",largest_city:"Wilmington",capital:"Dover"},{id:9,country:"USA",name:"Florida",abbr:"FL",area:"170312SKM",largest_city:"Jacksonville",capital:"Tallahassee"},{id:10,country:"USA",name:"Georgia",abbr:"GA",area:"57513SKM",largest_city:"Atlanta",capital:"Atlanta"},{id:11,country:"USA",name:"Hawaii",abbr:"HI",area:"6423SKM",largest_city:"Honolulu",capital:"Honolulu"},{id:12,country:"USA",name:"Idaho",abbr:"ID",area:"82643SKM",largest_city:"Boise",capital:"Boise"},{id:13,country:"USA",name:"Illinois",abbr:"IL",area:"149995SKM",largest_city:"Chicago",capital:"Springfield"},{id:14,country:"USA",name:"Indiana",abbr:"IN",area:"35826SKM",largest_city:"Indianapolis",capital:"Indianapolis"},{id:15,country:"USA",name:"Iowa",abbr:"IA",area:"55857SKM",largest_city:"Des Moines",capital:"Des Moines"},{id:16,country:"USA",name:"Kansas",abbr:"KS",area:"213100SKM",largest_city:"Wichita",capital:"Topeka"},{id:17,country:"USA",name:"Kentucky",abbr:"KY",area:"104656SKM",largest_city:"Louisville",capital:"Frankfort"},{id:18,country:"USA",name:"Louisiana",abbr:"LA",area:"135659SKM",largest_city:"New Orleans",capital:"Baton Rouge"},{id:19,country:"USA",name:"Maine",abbr:"ME",area:"91633SKM",largest_city:"Portland",capital:"Augusta"},{id:20,country:"USA",name:"Maryland",abbr:"MD",area:"32131SKM",largest_city:"Baltimore",capital:"Annapolis"},{id:21,country:"USA",name:"Massachusetts",abbr:"MA",area:"7800SKM",largest_city:"Boston",capital:"Boston"},{id:22,country:"USA",name:"Michigan",abbr:"MI",area:"250487SKM",largest_city:"Detroit",capital:"Lansing"},{id:36,country:"USA",name:"Oklahoma",abbr:"OK",area:"68595SKM",largest_city:"Oklahoma City",capital:"Oklahoma City"},{id:37,country:"USA",name:"Oregon",abbr:"OR",area:"254799SKM",largest_city:"Portland",capital:"Salem"},{id:38,country:"USA",name:"Pennsylvania",abbr:"PA",area:"119280SKM",largest_city:"Philadelphia",capital:"Harrisburg"},{id:39,country:"USA",name:"Rhode Island",abbr:"RI",area:"1034SKM",largest_city:"Providence",capital:"Providence"},{id:40,country:"USA",name:"South Carolina",abbr:"SC",area:"82933SKM",largest_city:"Charleston",capital:"Columbia"},{id:41,country:"USA",name:"South Dakota",abbr:"SD",area:"199729SKM",largest_city:"Sioux Falls",capital:"Pierre"},{id:42,country:"USA",name:"Tennessee",abbr:"TN",area:"41235SKM",largest_city:"Nashville",capital:"Nashville"},{id:43,country:"USA",name:"Texas",abbr:"TX",area:"695662SKM",largest_city:"Houston",capital:"Austin"},{id:44,country:"USA",name:"Utah",abbr:"UT",area:"82170SKM",largest_city:"Salt Lake City",capital:"Salt Lake City"},{id:23,country:"USA",name:"Minnesota",abbr:"MN",area:"225163SKM",largest_city:"Minneapolis",capital:"St. Paul"},{id:24,country:"USA",name:"Mississippi",abbr:"MS",area:"46923SKM",largest_city:"Jackson",capital:"Jackson"},{id:25,country:"USA",name:"Missouri",abbr:"MO",area:"180540SKM",largest_city:"Kansas City",capital:"Jefferson City"},{id:26,country:"USA",name:"Montana",abbr:"MT",area:"380831SKM",largest_city:"Billings",capital:"Helena"},{id:27,country:"USA",name:"Nebraska",abbr:"NE",area:"200330SKM",largest_city:"Omaha",capital:"Lincoln"},{id:28,country:"USA",name:"Nevada",abbr:"NV",area:"286380SKM",largest_city:"Las Vegas",capital:"Carson City"},{id:29,country:"USA",name:"New Hampshire",abbr:"NH",area:"24214SKM",largest_city:"Manchester",capital:"Concord"},{id:30,country:"USA",name:"New Jersey",abbr:"NJ",area:"22591SKM",largest_city:"Newark",capital:"Trenton"},{id:31,country:"USA",name:"New Mexico",abbr:"NM",area:"314917SKM",largest_city:"Albuquerque",capital:"Santa Fe"},{id:32,country:"USA",name:"New York",abbr:"NY",area:"141297SKM",largest_city:"New York City",capital:"Albany"},{id:33,country:"USA",name:"North Carolina",abbr:"NC",area:"139391SKM",largest_city:"Charlotte",capital:"Raleigh"},{id:34,country:"USA",name:"North Dakota",abbr:"ND",area:"183108SKM",largest_city:"Fargo",capital:"Bismarck"},{id:35,country:"USA",name:"Ohio",abbr:"OH",area:"40861SKM",largest_city:"Columbus",capital:"Columbus"},{id:45,country:"USA",name:"Vermont",abbr:"VT",area:"24906SKM",largest_city:"Burlington",capital:"Montpelier"},{id:46,country:"USA",name:"Virginia",abbr:"VA",area:"110787SKM",largest_city:"Virginia Beach",capital:"Richmond"},{id:47,country:"USA",name:"Washington",abbr:"WA",area:"184661SKM",largest_city:"Seattle",capital:"Olympia"},{id:48,country:"USA",name:"West Virginia",abbr:"WV",area:"24038SKM",largest_city:"Charleston",capital:"Charleston"},{id:49,country:"USA",name:"Wisconsin",abbr:"WI",area:"169635SKM",largest_city:"Milwaukee",capital:"Madison"},{id:50,country:"USA",name:"Wyoming",abbr:"WY",area:"97093SKM",largest_city:"Cheyenne",capital:"Cheyenne"},{id:51,country:"USA",name:"District of Columbia",abbr:"DC",area:"177SKM",largest_city:"N/A",capital:"N/A"}]},function(e,t){
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
function a(e,t){function a(){}a.prototype=t.prototype,e.superClass_=t.prototype,e.prototype=new a,e.prototype.constructor=e}e.exports=function(e){function t(e,a,i){this.marker_=e,this.handCursorURL_=e.handCursorURL,this.labelDiv_=document.createElement("div"),this.labelDiv_.style.cssText="position: absolute; overflow: hidden;",this.eventDiv_=document.createElement("div"),this.eventDiv_.style.cssText=this.labelDiv_.style.cssText,this.eventDiv_.setAttribute("onselectstart","return false;"),this.eventDiv_.setAttribute("ondragstart","return false;"),this.crossDiv_=t.getSharedCross(a)}function i(a){(a=a||{}).labelContent=a.labelContent||"",a.labelAnchor=a.labelAnchor||new e.Point(0,0),a.labelClass=a.labelClass||"markerLabels",a.labelStyle=a.labelStyle||{},a.labelInBackground=a.labelInBackground||!1,void 0===a.labelVisible&&(a.labelVisible=!0),void 0===a.raiseOnDrag&&(a.raiseOnDrag=!0),void 0===a.clickable&&(a.clickable=!0),void 0===a.draggable&&(a.draggable=!1),void 0===a.optimized&&(a.optimized=!1),a.crossImage=a.crossImage||"http"+("https:"===document.location.protocol?"s":"")+"://maps.gstatic.com/intl/en_us/mapfiles/drag_cross_67_16.png",a.handCursor=a.handCursor||"http"+("https:"===document.location.protocol?"s":"")+"://maps.gstatic.com/intl/en_us/mapfiles/closedhand_8_8.cur",a.optimized=!1,this.label=new t(this,a.crossImage,a.handCursor),e.Marker.apply(this,arguments)}return a(t,e.OverlayView),t.getSharedCross=function(e){var a;return void 0===t.getSharedCross.crossDiv&&((a=document.createElement("img")).style.cssText="position: absolute; z-index: 1000002; display: none;",a.style.marginLeft="-8px",a.style.marginTop="-9px",a.src=e,t.getSharedCross.crossDiv=a),t.getSharedCross.crossDiv},t.prototype.onAdd=function(){var a,i,n,r,o,l,s,c=this,d=!1,u=!1,m="url("+this.handCursorURL_+")",p=function(e){e.preventDefault&&e.preventDefault(),e.cancelBubble=!0,e.stopPropagation&&e.stopPropagation()},g=function(){c.marker_.setAnimation(null)};this.getPanes().markerLayer.appendChild(this.labelDiv_),this.getPanes().overlayMouseTarget.appendChild(this.eventDiv_),void 0===t.getSharedCross.processed&&(this.getPanes().markerLayer.appendChild(this.crossDiv_),t.getSharedCross.processed=!0),this.listeners_=[e.event.addDomListener(this.eventDiv_,"mouseover",function(t){(c.marker_.getDraggable()||c.marker_.getClickable())&&(this.style.cursor="pointer",e.event.trigger(c.marker_,"mouseover",t))}),e.event.addDomListener(this.eventDiv_,"mouseout",function(t){!c.marker_.getDraggable()&&!c.marker_.getClickable()||u||(this.style.cursor=c.marker_.getCursor(),e.event.trigger(c.marker_,"mouseout",t))}),e.event.addDomListener(this.eventDiv_,"mousedown",function(t){u=!1,c.marker_.getDraggable()&&(d=!0,this.style.cursor=m),(c.marker_.getDraggable()||c.marker_.getClickable())&&(e.event.trigger(c.marker_,"mousedown",t),p(t))}),e.event.addDomListener(document,"mouseup",function(t){var i;if(d&&(d=!1,c.eventDiv_.style.cursor="pointer",e.event.trigger(c.marker_,"mouseup",t)),u){if(o){(i=c.getProjection().fromLatLngToDivPixel(c.marker_.getPosition())).y+=20,c.marker_.setPosition(c.getProjection().fromDivPixelToLatLng(i));try{c.marker_.setAnimation(e.Animation.BOUNCE),setTimeout(g,1406)}catch(e){}}c.crossDiv_.style.display="none",c.marker_.setZIndex(a),r=!0,u=!1,t.latLng=c.marker_.getPosition(),e.event.trigger(c.marker_,"dragend",t)}}),e.event.addListener(c.marker_.getMap(),"mousemove",function(t){var r;d&&(u?(t.latLng=new e.LatLng(t.latLng.lat()-i,t.latLng.lng()-n),r=c.getProjection().fromLatLngToDivPixel(t.latLng),o&&(c.crossDiv_.style.left=r.x+"px",c.crossDiv_.style.top=r.y+"px",c.crossDiv_.style.display="",r.y-=20),c.marker_.setPosition(c.getProjection().fromDivPixelToLatLng(r)),o&&(c.eventDiv_.style.top=r.y+20+"px"),e.event.trigger(c.marker_,"drag",t)):(i=t.latLng.lat()-c.marker_.getPosition().lat(),n=t.latLng.lng()-c.marker_.getPosition().lng(),a=c.marker_.getZIndex(),l=c.marker_.getPosition(),s=c.marker_.getMap().getCenter(),o=c.marker_.get("raiseOnDrag"),u=!0,c.marker_.setZIndex(1e6),t.latLng=c.marker_.getPosition(),e.event.trigger(c.marker_,"dragstart",t)))}),e.event.addDomListener(document,"keydown",function(t){u&&27===t.keyCode&&(o=!1,c.marker_.setPosition(l),c.marker_.getMap().setCenter(s),e.event.trigger(document,"mouseup",t))}),e.event.addDomListener(this.eventDiv_,"click",function(t){(c.marker_.getDraggable()||c.marker_.getClickable())&&(r?r=!1:(e.event.trigger(c.marker_,"click",t),p(t)))}),e.event.addDomListener(this.eventDiv_,"dblclick",function(t){(c.marker_.getDraggable()||c.marker_.getClickable())&&(e.event.trigger(c.marker_,"dblclick",t),p(t))}),e.event.addListener(this.marker_,"dragstart",function(e){u||(o=this.get("raiseOnDrag"))}),e.event.addListener(this.marker_,"drag",function(e){u||o&&(c.setPosition(20),c.labelDiv_.style.zIndex=1e6+(this.get("labelInBackground")?-1:1))}),e.event.addListener(this.marker_,"dragend",function(e){u||o&&c.setPosition(0)}),e.event.addListener(this.marker_,"position_changed",function(){c.setPosition()}),e.event.addListener(this.marker_,"zindex_changed",function(){c.setZIndex()}),e.event.addListener(this.marker_,"visible_changed",function(){c.setVisible()}),e.event.addListener(this.marker_,"labelvisible_changed",function(){c.setVisible()}),e.event.addListener(this.marker_,"title_changed",function(){c.setTitle()}),e.event.addListener(this.marker_,"labelcontent_changed",function(){c.setContent()}),e.event.addListener(this.marker_,"labelanchor_changed",function(){c.setAnchor()}),e.event.addListener(this.marker_,"labelclass_changed",function(){c.setStyles()}),e.event.addListener(this.marker_,"labelstyle_changed",function(){c.setStyles()})]},t.prototype.onRemove=function(){var t;for(this.labelDiv_.parentNode.removeChild(this.labelDiv_),this.eventDiv_.parentNode.removeChild(this.eventDiv_),t=0;t<this.listeners_.length;t++)e.event.removeListener(this.listeners_[t])},t.prototype.draw=function(){this.setContent(),this.setTitle(),this.setStyles()},t.prototype.setContent=function(){var e=this.marker_.get("labelContent");if(void 0===e.nodeType)this.labelDiv_.innerHTML=e,this.eventDiv_.innerHTML=this.labelDiv_.innerHTML;else{for(;this.labelDiv_.lastChild;)this.labelDiv_.removeChild(this.labelDiv_.lastChild);for(;this.eventDiv_.lastChild;)this.eventDiv_.removeChild(this.eventDiv_.lastChild);this.labelDiv_.appendChild(e),e=e.cloneNode(!0),this.eventDiv_.appendChild(e)}},t.prototype.setTitle=function(){this.eventDiv_.title=this.marker_.getTitle()||""},t.prototype.setStyles=function(){var e,t;for(e in this.labelDiv_.className=this.marker_.get("labelClass"),this.eventDiv_.className=this.labelDiv_.className,this.labelDiv_.style.cssText="",this.eventDiv_.style.cssText="",t=this.marker_.get("labelStyle"))t.hasOwnProperty(e)&&(this.labelDiv_.style[e]=t[e],this.eventDiv_.style[e]=t[e]);this.setMandatoryStyles()},t.prototype.setMandatoryStyles=function(){this.labelDiv_.style.position="absolute",this.labelDiv_.style.overflow="hidden",void 0!==this.labelDiv_.style.opacity&&""!==this.labelDiv_.style.opacity&&(this.labelDiv_.style.MsFilter='"progid:DXImageTransform.Microsoft.Alpha(opacity='+100*this.labelDiv_.style.opacity+')"',this.labelDiv_.style.filter="alpha(opacity="+100*this.labelDiv_.style.opacity+")"),this.eventDiv_.style.position=this.labelDiv_.style.position,this.eventDiv_.style.overflow=this.labelDiv_.style.overflow,this.eventDiv_.style.opacity=.01,this.eventDiv_.style.MsFilter='"progid:DXImageTransform.Microsoft.Alpha(opacity=1)"',this.eventDiv_.style.filter="alpha(opacity=1)",this.setAnchor(),this.setPosition(),this.setVisible()},t.prototype.setAnchor=function(){var e=this.marker_.get("labelAnchor");this.labelDiv_.style.marginLeft=-e.x+"px",this.labelDiv_.style.marginTop=-e.y+"px",this.eventDiv_.style.marginLeft=-e.x+"px",this.eventDiv_.style.marginTop=-e.y+"px"},t.prototype.setPosition=function(e){var t=this.getProjection().fromLatLngToDivPixel(this.marker_.getPosition());void 0===e&&(e=0),this.labelDiv_.style.left=Math.round(t.x)+"px",this.labelDiv_.style.top=Math.round(t.y-e)+"px",this.eventDiv_.style.left=this.labelDiv_.style.left,this.eventDiv_.style.top=this.labelDiv_.style.top,this.setZIndex()},t.prototype.setZIndex=function(){var e=this.marker_.get("labelInBackground")?-1:1;void 0===this.marker_.getZIndex()?(this.labelDiv_.style.zIndex=parseInt(this.labelDiv_.style.top,10)+e,this.eventDiv_.style.zIndex=this.labelDiv_.style.zIndex):(this.labelDiv_.style.zIndex=this.marker_.getZIndex()+e,this.eventDiv_.style.zIndex=this.labelDiv_.style.zIndex)},t.prototype.setVisible=function(){this.marker_.get("labelVisible")?this.labelDiv_.style.display=this.marker_.getVisible()?"block":"none":this.labelDiv_.style.display="none",this.eventDiv_.style.display=this.labelDiv_.style.display},a(i,e.Marker),i.prototype.setMap=function(t){e.Marker.prototype.setMap.apply(this,arguments),this.label.setMap(t)},i}}]);