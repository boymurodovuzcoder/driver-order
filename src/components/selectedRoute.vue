<template>
  <div id="q-app">
      <span style="text-align: right; padding-top: 10px">Created: 30m</span>
    <div id="map">
    </div>
    <div class="info">
      <span style="font-weight: 500">{{pickup_date}}</span>
      <h6 id="origin"><i class="fas fa-arrow-circle-up"></i> {{origin}}</h6>
      <p><span id="distance"></span></p>
      <h6 id="destination"><i class="fas fa-arrow-circle-down"></i> {{destination}}</h6>
    </div>
    <hr/>
    <p style="font-size: 18px; font-weight: 400; padding: 10px 0;">{{equip}}</p>
    <div class="more">
      <div>
        <span>weight</span>
        <p>{{weight}}</p>
      </div>
      <div>
        <span>size</span>
        <p>Full</p>
      </div>
      <div>
        <span>price</span>
        <p>{{price}}</p>
      </div>
    </div>
    <hr/>
    <div class="footer">
      <div>
        <span>Broker</span>
        <h6>{{ name }}</h6>
      </div>
      <div>
        <span>Phone</span>
        <h6>+123456789</h6>
      </div>
      <button><i class="fas fa-phone"></i></button>
    </div>
  </div>
</template>
<script defer src="https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyBkxS5l87lclaC6MIWSGejdCXL13wSShRo"> </script>
<script>
  import { LocalStorage } from 'quasar'
  export default {
    name: 'driverMapMobile',
    props: ['pickup_date', 'origin', 'destination', 'weight','price', 'equip'],
    mounted: function () {
      this.initMap()
    },
    data() {
      return {
        watchId: ""
      }
    },
    computed: {
      name () {
        return LocalStorage.getItem('userName')
      }
    },
    beforeDestroy() {
      console.log('beforeDestroy')
      console.log(this.watchId)
      navigator.geolocation.clearWatch(this.watchId)
      console.log('cleared - ', this.watchId)
    },
    methods: {
      initMap() {
        var self = this
        const bounds = new google.maps.LatLngBounds
        const markersArray = []
        const origin = document.getElementById('origin').innerText
        const destination = document.getElementById('destination').innerText
        const outputDiv = document.getElementById('distance')
        var map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: 41.377491, lng: 69.585258 },
          zoom: 14
        })
        var geocoder = new google.maps.Geocoder
        var service = new google.maps.DistanceMatrixService
        service.getDistanceMatrix({
          origins: [origin],
          destinations: [destination],
          travelMode: 'DRIVING',
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        }, function (response, status) {
          if (status !== 'OK') {
            alert('Error was: ' + status)
          } else {
            var originList = response.originAddresses
            var destinationList = response.destinationAddresses
            const showGeocodedAddressOnMap = function (asDestination) {
              return function (results, status) {
                if (status === 'OK') {
                  map.fitBounds(bounds.extend(results[0].geometry.location))
                } else {
                  alert('Geocode was not successful due to: ' + status)
                }
              }
            }
            for (var i = 0; i < originList.length; i++) {
              var results = response.rows[i].elements
              geocoder.geocode({'address': originList[i]},
                showGeocodedAddressOnMap(false))
              for (var j = 0; j < results.length; j++) {
                geocoder.geocode({'address': destinationList[j]},
                  showGeocodedAddressOnMap(true))
                outputDiv.innerHTML += '<i class="fas fa-arrow-down"></i> ' + '<b>' + results[j].distance.text + '</b>' + ' in ' +
                  '<b>' + results[j].duration.text + '</b>' + ' <i class="fas fa-arrow-up"></i> ' + '<br>'
              }
            }
          }
        });
        // watchposition is being implemented
        var changed = false
        var geoLoc;
        var marker = "";
        function showLocation(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            var myLatLng = {lat: latitude, lng: longitude};
            //alert("Latitude : " + latitude + " Longitude: " + longitude);
            if (changed) {
              marker.setPosition(myLatLng)
              console.log("location detected again")
            } else {
               marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                draggable: true,
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 5,
                  strokeColor: "#3333FF",
                  strokeWeight: 5,
                  fillColor: "blue"
                }
            })
            }
            changed = true
            var infowindow = new google.maps.InfoWindow({
              content: 'your location'
            });
            marker.addListener('click', function() {
              infowindow.open(map, marker);
              map.panTo(this.getPosition());
              map.setZoom(13);
            });
            var circle = new google.maps.Circle({
              map: map,
              radius: 100,    // 10 miles in metres
              fillColor: '#2098d9',
              strokeColor: "#317bb9",
              strokeOpacity: 0.6,
              strokeWeight: 1
            });
            circle.bindTo('center', marker, 'position');
         }
         function errorHandler(err) {
            if(err.code == 1) {
               alert("Error: Access is denied!");
            } else if( err.code == 2) {
               alert("Error: Position is unavailable!");
            }
         }
         function getLocationUpdate(){
            if(navigator.geolocation){
               // timeout at 60000 milliseconds (60 seconds)
               var options = {timeout:1000};
               geoLoc = navigator.geolocation;
               self.watchId = geoLoc.watchPosition(showLocation, errorHandler, options);
            } else {
               alert("Sorry, browser does not support geolocation!");
            }
         }
         getLocationUpdate()
         // watchposition implementation finished
        const directionsRenderer = new google.maps.DirectionsRenderer()
        const directionsService = new google.maps.DirectionsService()
        directionsRenderer.setMap(map)
        calculateAndDisplayRoute(directionsService, directionsRenderer)
        function calculateAndDisplayRoute(directionsService, directionsRenderer) {
          directionsService.route(
            {
              origin: origin,
              destination: destination,
              travelMode: 'DRIVING'
            },
            (response, status) => {
              if (status === 'OK') {
                directionsRenderer.setDirections(response)
              } else {
                window.alert('Directions request failed due to ' + status)
              }
            }
          )
        }
      }
    }
  }
</script>

<style>
  h1,h2,h3,h4,h5,h6,p {
    padding: 0;
    margin: 0;
  }
  hr {
    background: #05662e;
    margin: 15px 15px;
  }
  #map {
    width: 100%;
    height: 40vh;
  }
  .info {
    padding: 10px 20px;
  }
  .info h6, p {
    text-align: center;
  }
  .info .fa-arrow-circle-up {
    color: #04863b;
  }
  .info .fa-arrow-circle-down {
    color: #f00;
  }
  .more {
    display: flex;
    justify-content: space-around;
  }
  .more div {
    border-right: 1px solid #aaa;
    padding: 0 50px;
  }
  .more div:last-child {
    border: none;
  }
  .more span, .footer span {
    text-transform: uppercase;
    font-size: 12px;
    color: #777;
  }
  .more p {
    font-size: 18px;
    font-weight: 400;
  }
  .footer {
    display: flex;
    justify-content: space-between;
  }
  .footer div {
    margin-right: 35px;
  }
  .footer button {
    border-radius: 50%;
    padding: 0 18px;
    border: none;
    background: #00c853;
    color: #fff;
    cursor: pointer;
  }
  #origin {
    color: #007033;
  }
  #destination {
    color: #b20000;
  }
  .info p {
    padding: 10px 0;
  }
  #distance i {
    color: #2e7d32;
  }
  #q-app span {
    padding-right: 5px;
    padding-bottom: 5px;
  }
</style>
