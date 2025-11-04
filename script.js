  const landing1 = document.getElementById('landing1');
  const landing2 = document.getElementById('landing2');
  const getStartedBtn = document.getElementById('getStartedBtn');
  const virtualTourBtn = document.getElementById('virtualTourBtn');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const backgroundMusic = document.getElementById('backgroundMusic');
  const backBtn = document.getElementById('backBtn');
  const hamburger = document.getElementById('hamburger');
  const navRight = document.getElementById('navigation-menu');

  // Show and hide with scale/blur fade effect
  async function showSection(toShow, toHide) {
    // Hide current
    toHide.classList.remove('visible');
    toHide.classList.add('hidden');
    await new Promise(r => setTimeout(r, 950));

    toHide.style.display = 'none';

    // Show new
    toShow.style.display = toShow.id === 'landing1' ? 'flex' : 'block';
    await new Promise(r => setTimeout(r, 30));
    toShow.classList.remove('hidden');
    toShow.classList.add('visible');
  }

  // Initial states
  landing1.classList.add('visible');
  landing2.classList.add('hidden');
  landing2.style.display = 'none';
  backBtn.style.display = 'none';

  getStartedBtn.addEventListener('click', async () => {
    await showSection(landing2, landing1);
    backBtn.style.display = 'block';
    window.scrollTo(0,0);
    backgroundMusic.play().catch(() => {});
    updateMusicIcon();
  });

  backBtn.addEventListener('click', async () => {
    await showSection(landing1, landing2);
    backBtn.style.display = 'none';
    backgroundMusic.pause();
  });

  const virtualTourUrl = "https://virtual-tour-laboratorium.vercel.app/";
  virtualTourBtn.addEventListener('click', () => {
    window.location.href = virtualTourUrl;
  });

  // Smooth scroll for navbar anchors
  document.querySelectorAll('nav a.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if(target) {
        target.scrollIntoView({behavior: 'smooth', block:"start"});
      }
      // Close menu after clicking on small screens
      if(window.innerWidth <= 768){
        toggleMenu(false);
      }
    });
  });

  // Hamburger toggle function
  function toggleMenu(show) {
    if(show){
      navRight.classList.add('open');
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded','true');
    } else {
      navRight.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded','false');
    }
  }

  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    toggleMenu(!expanded);
  });

  hamburger.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      hamburger.click();
    }
  });

  function updateMusicIcon(){
    if(backgroundMusic.paused){
      musicToggleBtn.innerHTML = '&#128263;';
      musicToggleBtn.setAttribute('aria-label', 'Turn on background music');
    } else {
      musicToggleBtn.innerHTML = '&#128266;';
      musicToggleBtn.setAttribute('aria-label', 'Turn off background music');
    }
  }
  musicToggleBtn.addEventListener('click', () => {
    if(backgroundMusic.paused){
      backgroundMusic.play();
    } else {
      backgroundMusic.pause();
    }
    updateMusicIcon();
  });

  const navItems = document.querySelectorAll('nav a, nav button');
  navItems.forEach(el => {
    el.addEventListener('focus', () => {
      el.style.outline = '3px solid #f6e500';
      el.style.outlineOffset = '3px';
    });
    el.addEventListener('blur', () => {
      el.style.outline = 'none';
    });
  });

  // ===== BASEMAPS =====
  var baseLayers = {
    "Street (OSM)": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 21, attribution: '© OpenStreetMap contributors' }),
    "OsmHOT": L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', { maxZoom: 21, attribution: '&copy; OpenStreetMap contributors, style by Humanitarian OSM Team, hosted by OSM France' }),
    "Grayscale": L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', { maxZoom: 21, attribution: '© Stadia Maps, © OpenMapTiles, © OpenStreetMap contributors' }),
    "Toner Lite": L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', { maxZoom: 21, attribution: '© Stadia Maps, © OpenMapTiles, © OpenStreetMap contributors' }),
    "Night": L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', { maxZoom: 21, attribution: '© Stadia Maps' }),
    "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: '© Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community' }),
    "CartoDB Positron": L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png', { maxZoom: 21, attribution: '&copy; OpenStreetMap contributors &copy; CARTO' })
  };

  // ===== INISIALISASI MAP =====
  var map = L.map('map', {
    center: [-7.763723654760681, 110.40967759944611],
    zoom: 21,
    layers: [baseLayers["Street (OSM)"]]
  });

  // ===== FIX AGAR MAP TERLIHAT SAAT LANDING2 DITAMPILKAN =====
  document.getElementById('getStartedBtn').addEventListener('click', function() {
  // tampilkan landing2
  document.getElementById('landing1').style.display = 'none';
  document.getElementById('landing2').style.display = 'block';

  // scroll ke bagian rute biar map langsung kelihatan
  setTimeout(() => {
    map.invalidateSize(); // force Leaflet redraw
    map.setView([-7.763723654760681, 110.40967759944611], 17); // reset posisi & zoom
  }, 600);
});

  // ===== KONTROL LAYER =====
  L.control.layers(baseLayers).addTo(map);

  // ===== ICON CUSTOM =====
  var iconLab = L.icon({
    iconUrl: 'images/marker.png',
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50]
  });

  var iconMobil = L.icon({
    iconUrl: 'images/drone.png',
    iconSize: [40, 50],
    iconAnchor: [20, 50]
  });

  // ===== TITIK TUJUAN =====
  var labTerpadu = L.latLng(-7.763723654760681, 110.40967759944611);

  L.marker(labTerpadu, { icon: iconLab }).addTo(map)
  .bindPopup(`
    <div style="text-align:center; max-width:220px;">
      <img src='images/DJI_0986.JPG' style="width:100%; border-radius:10px; margin-bottom:8px;">
      <h4 style="margin:0; font-size:1rem; font-weight:700; color:#333;">
        Laboratorium Riset Terpadu<br>UPN "Veteran" Yogyakarta
      </h4>
      <p style="font-size:0.85rem; color:#555; margin-top:6px; line-height:1.4;">
        Alamat:<br>Jl. Pintu Selatan UPN, Ngropoh, Condongcatur,<br>Depok, Sleman, DIY
      </p>
    </div>
  `);

  // ===== VARIABEL GLOBAL UNTUK ROUTING & ANIMASI =====
  var routingControl;
  var mobil;
  var animasiInterval;

  // ===== FUNGSI MEMBUAT RUTE =====
  function buatRute(lokasiAsal) {
    if (routingControl) map.removeControl(routingControl);
    if (mobil) { map.removeLayer(mobil); mobil = null; }
    if (animasiInterval) { clearInterval(animasiInterval); animasiInterval = null; }

    routingControl = L.Routing.control({
      waypoints: [lokasiAsal, labTerpadu],
      routeWhileDragging: false,
      createMarker: function(i, wp, nWps) {
        if (i === 0) return L.marker(wp.latLng, { icon: iconLab }).bindPopup("<b>Lokasi Asal</b>");
        else if (i === nWps - 1) return L.marker(wp.latLng, { icon: iconLab }).bindPopup("<b>Laboratorium Terpadu</b>");
      }
    }).addTo(map);

    routingControl.on('routesfound', function(e) {
      var summary = e.routes[0].summary;
      document.getElementById('Jarak').value = summary.totalDistance.toFixed(0);
      animasiCarHalus(e.routes[0]);
    });
  }

  // ===== ANIMASI DRONE HALUS =====
  function animasiCarHalus(route) {
    var coords = route.coordinates;
    var index = 0;
    var latlngA = coords[0];
    var latlngB = coords[1];
    var step = 0;
    var stepsPerSegment = 10;

    mobil = L.marker([latlngA.lat, latlngA.lng], { icon: iconMobil }).addTo(map);

    animasiInterval = setInterval(function() {
      var lat = latlngA.lat + (latlngB.lat - latlngA.lat) * (step / stepsPerSegment);
      var lng = latlngA.lng + (latlngB.lng - latlngA.lng) * (step / stepsPerSegment);
      mobil.setLatLng([lat, lng]);

      step++;
      if (step > stepsPerSegment) {
        step = 0;
        index++;
        if (index >= coords.length - 1) index = 0;
        latlngA = coords[index];
        latlngB = coords[index + 1];
      }
    }, 50);
  }

  // ===== TOMBOL GUNAKAN LOKASI SAYA =====
  document.getElementById('btnLokasiSaya').onclick = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(pos) {
        var userLatLng = L.latLng(pos.coords.latitude, pos.coords.longitude);
        buatRute(userLatLng);
        L.marker(userLatLng, { icon: iconLab }).bindPopup("<b>Posisi Anda Saat Ini</b>").addTo(map).openPopup();
      }, function() { alert("Tidak dapat menemukan lokasi Anda."); });
    } else { alert("Browser Anda tidak mendukung geolokasi."); }
  };

  // ===== TOMBOL CARI KOORDINAT =====
  document.getElementById('btnCari').onclick = function() {
    var lat = parseFloat(document.getElementById('latAsal').value);
    var lng = parseFloat(document.getElementById('lngAsal').value);
    if (isNaN(lat) || isNaN(lng)) { alert("Masukkan nilai koordinat yang valid!"); return; }

    var lokasi = L.latLng(lat, lng);
    buatRute(lokasi);
    L.marker(lokasi, { icon: iconLab }).bindPopup("<b>Lokasi Asal</b><br>Lat: " + lat + "<br>Lng: " + lng).addTo(map).openPopup();
  };

  // TAB FUNCTION
const tabs = document.querySelectorAll('.tab-btn');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// ACCORDION FUNCTION (untuk instrumen)
const accBtns = document.querySelectorAll('.accordion-btn');

accBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    const content = btn.nextElementSibling;
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
  });
});

