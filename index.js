import './style.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5jZXN0cnltYXBib3giLCJhIjoiNllqcGhKYyJ9.p9QKjx4kc2E_55jLTmDw0Q';
const options = {
    attributionControl: false,
    center: [-74.50, 40],
    container: 'map',
    maxZoom: 6,
    minZoom: 1,
    maxBounds: [[-270, -85], [270, 85]],
    dragRotate: false,
    touchZoomRotate: true,
    doubleClickZoom: true,
    style: 'mapbox://styles/ancestrymapbox/cil1ctovd009pavm17fsttysd',
    trackResize: true
};
const map = new mapboxgl.Map(options);

const LIMIT = 1000;
const speedTestBtn = document.querySelector('#speedTestBtn');

map.on('load', () => {
    speedTestBtn.addEventListener('click', runTests);
})

const startMarkersTest = () => {
    console.log('Markers test start.');
    for (let i = 0; i < LIMIT; i++) {
        // Create dom content
        let el = document.createElement('div');
        el.className = 'marker';
        el.innerHTML = '<span>0</span>';
        // add marker to map
        const marker = new mapboxgl.Marker(el, { offset: [-17, -44] })
            .setLngLat([-73.9749, 40.7736])
            .addTo(map);

        setTimeout(() => {
            // Dereference content
            el.remove();
            el = null;
            // Delete marker
            marker.remove();
        });
    }
    console.log('Markers test complete.');
}

const startPopupsTest = () => {
    console.log('Popups test start.');
    for (let i = 0; i < LIMIT; i++) {
        // Create content
        let domElem = document.createElement('div');
        domElem.innerHTML = 'TEST CONTENT';
        // Create popup
        const popup = new mapboxgl.Popup({ offset: { 'top': [-3, -10], 'bottom': [-3, -40] } })
            .setLngLat([-96, 37.8])
            .setDOMContent(domElem)
            .addTo(map);

        setTimeout(() => {
            // Dereference content
            domElem.remove();
            domElem = null;
            // Delete popup
            popup.remove();
        });
    }
    console.log('Popups test complete.');
}

const deleteMap = () => {
   map.remove();
}

const runTests = () => {
    startMarkersTest();
    startPopupsTest();
    deleteMap();
}