import './style.css';
import { timePeriod } from './data.mock.js';
import ClusterManager from './cluster';

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5jZXN0cnltYXBib3giLCJhIjoiNllqcGhKYyJ9.p9QKjx4kc2E_55jLTmDw0Q';
const defaultOpts = {
    attributionControl: false,
    maxZoom: 6,
    minZoom: 1,
    maxBounds: [[-270, -85], [270, 85]],
    dragRotate: false,
    touchZoomRotate: true,
    doubleClickZoom: true,
    style: 'mapbox://styles/ancestrymapbox/cil1ctovd009pavm17fsttysd',
    trackResize: true
};

const options = Object.assign({ container: 'map', center: [-74.50, 40], zoom: 9 }, defaultOpts);
const map = new mapboxgl.Map(options);

// Markers
const { ancestors } = timePeriod;
let markers = [];
let markerElements = [];
const clusterManager = new ClusterManager();

map.on('load', () => {
    ancestors.forEach(({birthPlace, deathPlace}, i) => {
        if ((birthPlace && birthPlace.placeId) || (deathPlace && deathPlace.placeId)) {
            clusterManager.addNode((birthPlace && birthPlace.placeId) ?
                birthPlace.coords : deathPlace.coords, i);
        }
    })
})
map.on('zoom', () => {
    const level = Math.floor(map.getZoom());
    getClusters(level);
})

function getClusters(level) {
    markers.forEach(marker => marker.remove());
    markerElements.forEach(el => el.remove());
    markers = [];
    markerElements = [];
    const clusters = clusterManager.getClusters(level);
    clusters.forEach(cluster => {
        const el = document.createElement('div');
        el.className = 'marker';
        if (cluster.data.length === 1) {
            const ancestor = timePeriod.ancestors[cluster.data[0]];
            el.classList.add(ancestor.gender.toLowerCase());
            let classes = '';
            if (!ancestor.photoUrl) {
                classes += 'icon ';
            }
            let markerHtml = `<div class="photo photoSizeMarker photoCenter photoCircle ${classes}" role="presentation">`;
            if (ancestor.photoUrl) {
                markerHtml += `<img src="${ancestor.photoUrl}"/>`;
            }
            markerHtml += '</div>';
            el.innerHTML = markerHtml;
        } else {
            el.innerHTML = '<span>' + cluster.data.length + '</span>';
        }
        // add marker to map
        const marker = new mapboxgl.Marker(el, { offset: [-17, -44] })
            .setLngLat(cluster.lngLat)
            .addTo(map);

        markers.push(marker);
        markerElements.push(el);
    });
}