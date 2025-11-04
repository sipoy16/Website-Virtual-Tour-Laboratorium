<div class="row">
  <div class="col-sm-6">
    <div class="form-group">
      <label>Jarak (*Meter)</label>
      <input class="form-control" name="jarak" id="Jarak">
    </div>
  </div>
</div>
<br>
<!-- Input koordinat asal -->
<div class="row mb-3 align-items-end">
  <div class="col-md-3">
    <input type="text" id="latAsal" class="form-control" placeholder="Latitude Asal (-7.763723654760681)">
  </div>
  <div class="col-md-3">
    <input type="text" id="lngAsal" class="form-control" placeholder="Longitude Asal (110.40967759944611)">
  </div>
  <div class="col-md-6 d-flex justify-content-start gap-2 mt-2 mt-md-0">
    <button id="btnCari" class="btn btn-primary flex-fill">Cari Rute ke Lab Terpadu</button>
    <button id="btnLokasiSaya" class="btn btn-success flex-fill">Gunakan Lokasi Saya</button>
  </div>
</div>
<br>
<div id="map" style="width: 100%; height: 100vh;"></div>

<script>
// ===== BASEMAPS =====
var baseLayers = {
  "Street (OSM)": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 21,
    attribution: '© OpenStreetMap contributors'
  }),
  "OsmHOT": L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 21,
    attribution: '&copy; OpenStreetMap contributors, style by Humanitarian OSM Team, hosted by OSM France'
  }),
  "Grayscale": L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    maxZoom: 21,
    attribution: '© Stadia Maps, © OpenMapTiles, © OpenStreetMap contributors'
  }),
  "Toner Lite": L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
    maxZoom: 21,
    attribution: '© Stadia Maps, © OpenMapTiles, © OpenStreetMap contributors'
  }),
  "Night": L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
    maxZoom: 21,
    attribution: '© Stadia Maps'
  }),
  "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: '© Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
  }),
  "CartoDB Positron": L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png', {
    maxZoom: 21,
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
  })
};

// ===== INISIALISASI MAP =====
var map = L.map('map', {
  center: [-7.763723654760681, 110.40967759944611],
  zoom: 18,
  layers: [baseLayers["CartoDB Positron"]]
});

// ===== KONTROL LAYER =====
L.control.layers(baseLayers).addTo(map);

// ===== TITIK TUJUAN (Laboratorium Terpadu UPNVYK) =====
var labTerpadu = L.latLng(-7.763723654760681, 110.40967759944611);
L.marker(labTerpadu).addTo(map)
  .bindPopup("<b>Laboratorium Terpadu UPN 'Veteran' Yogyakarta</b>")
  .openPopup();

// ===== VARIABEL UNTUK ROUTING =====
var routingControl;

// ===== FUNGSI UNTUK MEMBUAT RUTE =====
function buatRute(lokasiAsal) {
  if (routingControl) {
    map.removeControl(routingControl);
  }

  routingControl = L.Routing.control({
    waypoints: [lokasiAsal, labTerpadu],
    routeWhileDragging: false
  }).addTo(map);

  routingControl.on('routesfound', function(e) {
    var routes = e.routes;
    var summary = routes[0].summary;
    var totalDistance = summary.totalDistance;
    document.getElementById('Jarak').value = totalDistance.toFixed(0);
    animasiCar(routes[0]);
  });
}

// ===== FUNGSI ANIMASI MOBIL =====
function animasiCar(route) {
  var iconMobil = L.icon({
    iconUrl: '<?= ('images/drone.png') ?>',
    iconSize: [40, 50]
  });

  var mobil = L.marker([route.coordinates[0].lat, route.coordinates[0].lng], { icon: iconMobil }).addTo(map);

  var index = 0;
  var maxIndex = route.coordinates.length - 1;

  function animate() {
    mobil.setLatLng([route.coordinates[index].lat, route.coordinates[index].lng]);
    index++;
    if (index > maxIndex) index = 0;
    setTimeout(animate, 100);
  }
  animate();
}

// ===== TOMBOL GUNAKAN LOKASI SAYA =====
document.getElementById('btnLokasiSaya').onclick = function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      var userLatLng = L.latLng(pos.coords.latitude, pos.coords.longitude);
      L.marker(userLatLng).addTo(map).bindPopup("<b>Posisi Anda Saat Ini</b>").openPopup();
      buatRute(userLatLng);
    }, function() {
      alert("Tidak dapat menemukan lokasi Anda.");
    });
  } else {
    alert("Browser Anda tidak mendukung geolokasi.");
  }
};

// ===== TOMBOL CARI LOKASI KOORDINAT =====
document.getElementById('btnCari').onclick = function() {
  var lat = parseFloat(document.getElementById('latAsal').value);
  var lng = parseFloat(document.getElementById('lngAsal').value);

  if (isNaN(lat) || isNaN(lng)) {
    alert("Masukkan nilai koordinat yang valid!");
    return;
  }

  var lokasi = L.latLng(lat, lng);
  L.marker(lokasi).addTo(map).bindPopup("<b>Lokasi Asal</b><br>Lat: " + lat + "<br>Lng: " + lng).openPopup();
  buatRute(lokasi);
};
</script>
