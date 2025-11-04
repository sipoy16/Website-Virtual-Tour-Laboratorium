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
        center: [-7.763723654760681, 110.40967759944611], // Yogyakarta
        zoom: 18,
        layers: [baseLayers["Satellite"]]
    });

    // ===== KONTROL LAYER =====
    L.control.layers(baseLayers).addTo(map);

    //=== marker ===
    ///costum marker
    const marker = L.icon({
    iconUrl: '<?= ('images/marker.png') ?>',

    iconSize:     [40, 50], // size of the icon
    shadowSize:   [40, 50], // size of the shadow
    iconAnchor:   [-3, 30], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    L.marker([-7.763723654760681, 110.40967759944611], {
        icon: marker
    })
        .bindPopup("<img src='<?= ('images/DJI_0986.JPG') ?>' width='100%'>" +
            "<h5>Laboratorium Riset Terpadu <br> UPN Veteran Yogyakarta</h5>" +
                "<h10>Alamat : Jl. Pintu Selatan UPN, Ngropoh, Condongcatur, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta<h10>"
                )
        .addTo(map);

</script>
