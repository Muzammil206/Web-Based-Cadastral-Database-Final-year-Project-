'use client'

import React, { useRef, useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl'; 
import Header from '../auth/nav';

mapboxgl.accessToken = 'pk.eyJ1IjoibXV6YW1pbDIwNiIsImEiOiJjbGN5eXh2cW0wc2lnM290ZzJsZnNlbmxsIn0.o2Obvl7E_nQefSN34XsFmw';

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(4.474076);
  const [lat, setLat] = useState(8.70274);
  const [zoom, setZoom] = useState(15);
  const [data, setData] = useState(null); 
  

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });

    const fetchGeoJSON = async () => {
      const response = await fetch('https://eu-west-2.aws.data.mongodb-api.com/app/application-0-zzfnd/endpoint/data');
      const data = await response.json();
      setData(data);
      console.log(data[0])
      
    

    
    

    // Add all features from GeoJSON data to the map
    map.current.on('load', () => {
      // Create an empty source to hold all features
      const source = map.current.addSource('allFeaturesSource', {
        type: 'geojson',
        data: data[0]
      });

      // Loop through GeoJSON features and add them to the source
      if (data && data.features) {
        data.features.forEach(feature => {
          source.push({
            type: 'Feature',
            geometry: feature.geometry,
            properties: feature.properties 
          });
        });
      }

      // Add layers for different feature types (points and polygons)
      map.current.addLayer({
        id: 'pointsLayer',
        type: 'circle', 
        source: 'allFeaturesSource',
        filter: ['==', '$type', 'Point'], // Filter for points
        paint: {
          'circle-color': '#ff0000', // Customize point color
          'circle-radius': 5 // Customize point size
        }
      });

      map.current.addLayer({
        id: 'lineLayer',
        type: 'line',
        source: 'allFeaturesSource',
        layout: {},
        paint: {
            'line-color': '#ff0000',
            'line-width': 3
        }
    });

      map.current.addLayer({
        id: 'polygonsLayer',
        type: 'fill', // Use `fill` for polygons
        source: 'allFeaturesSource',
        filter: ['==', '$type', 'Polygon'], // Filter for polygons
        paint: {
          'fill-color': 'rgba(200, 100, 240, 0.4)', // Customize polygon color
          'fill-opacity': 0.4
        }
      });


// Change the cursor to a pointer when
// the mouse is over the states layer.
map.current.on('mouseenter', 'polygonsLayers', () => {
  map.current.getCanvas().style.cursor = 'pointer';
  });
   
  // Change the cursor back to a pointer
  // when it leaves the states layer.
  map.current.on('mouseleave', 'polygonsLayer', () => {
  map.current.getCanvas().style.cursor = '';
  });

  map.current.on('click', 'polygonsLayer', (e) => {
    new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(`<h2><span class="math-inline"> ${e.features[0].properties.NAME
      } 'Feature'\}</h2\><p\></span>{feature.properties.description || ''}</p>`)
    .addTo(map.current);
    });



    });

    }
    fetchGeoJSON();

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
  }, []);

  return (
    <div>
      <div>
         <Header/>
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

