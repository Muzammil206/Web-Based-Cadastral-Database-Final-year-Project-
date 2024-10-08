'use client'

import React, { useRef, useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl'; 
import Component from '../siginUp[[...rest]]/nav';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from '@turf/turf';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from"@/components/ui/dropdown-menu";
import FeatureDetails from '@/components/FeatureDetails'



mapboxgl.accessToken = 'pk.eyJ1IjoibXV6YW1pbDIwNiIsImEiOiJjbGN5eXh2cW0wc2lnM290ZzJsZnNlbmxsIn0.o2Obvl7E_nQefSN34XsFmw';

const paragraphStyle = {
  fontFamily: 'Open Sans',
  margin: 0,
  fontSize: 13
};




export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(4.474076); 
  const [lat, setLat] = useState(8.70274);
  const [zoom, setZoom] = useState(16);
  const [data, setData] = useState(null); 
  const [roundedArea, setRoundedArea] = useState();
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [style, setStyle] = useState('mapbox://styles/mapbox/streets-v12');
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);



  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  useEffect(() => {
    if (map.current) return; // Initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: style,
      center: [lng, lat],
      zoom: zoom
    });



    const fetchGeoJSON = async () => {
      
      
        const response = await fetch('https://land-guard.vercel.app/api/data'); // 
        const data = await response.json();
        console.log(data)
        // Transform the data into GeoJSON FeatureCollection
        
    
  
    // Add all features from GeoJSON data to the map
    map.current.on('load', () => {
      // Create an empty ssource to hold all features
      const source = map.current.addSource('allFeaturesSource', {
        type: 'geojson',
        data: data
      });
       


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

      map.current.addLayer({
        id: 'poi-labels',
        type: 'symbol',
        source: 'allFeaturesSource',
        layout: {
          'text-field': ['get', 'PILLAR_NUMBER'],
          'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
          'text-radial-offset': 0.5,
          'text-justify': 'auto',
          'icon-image': ['get', 'icon']
        }
      });



  map.current.on('click', 'polygonsLayer', (e) => {
  
     
    
    if (e.features && e.features.length > 0) {
      const feature = e.features[0];
      
      setSelectedFeature({
        PLAN_NAME: feature.properties.PLAN_NAME || 'N/A',
        PLAN_LOCATION: feature.properties.PLAN_LOCATION || 'N/A',
        PLAN_LGA: feature.properties.PLAN_LGA || 'N/A',
        PLAN_NUMBER: feature.properties.PLAN_NUMBER || 'N/A',
        SURVEYOR: feature.properties.SURVEYOR || 'N/A',
        plan_area: feature.properties.plan_area || 'N/A',
        plan_origi: feature.properties.plan_origi || 'N/A',
      });
     
      setIsOpen(true);

    } else {
      console.log('No features found at clicked location.'); // Debugging log
      setSelectedFeature(null);
      setIsOpen(false);
    }

    });
    
  
    });

 }
    fetchGeoJSON();

    map.current.addControl(new mapboxgl.NavigationControl(), "top-left");


    map.current.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        bbox: [2.05, 7.7, 5.4, 9.4],
        countries: 'NG', // Limit search results to Nigeria
        mapboxgl: mapboxgl,
        position: 'top-left' 
      })
    );

    // const draw = new MapboxDraw({
    //   displayControlsDefault: false,
    //   controls: {
    //     polygon: true,
    //     trash: true
    //   },
    //   defaultMode: 'draw_polygon'
    // });
    // map.current.addControl(draw);

    // map.current.on('draw.create', updateArea);
    // map.current.on('draw.delete', updateArea);
    // map.current.on('draw.update', updateArea);

    // function updateArea(e) {
    //   const data = draw.getAll();
    //   if (data.features.length > 0) {
    //     const area = turf.area(data);
    //     setRoundedArea(Math.round(area * 100) / 100);
    //   } else {
    //     setRoundedArea();
    //     if (e.type !== 'draw.delete') alert('Click the map to draw a polygon.');
    //   }
    // }
  
  }, []);



  useEffect(() => {
    if (map.current) {

      map.current.setStyle(style);
       

         map.current.on('styledata', () => {
        if (!map.current.getSource('example-source')) {
          map.current.addSource('example-source', {
            type: 'geojson',
            data: 'https://land-guard.vercel.app/api/data',
          });

          // Add layers for different feature types (points and polygons)
          map.current.addLayer({
            id: 'pointsLaye',
            type: 'circle', 
            source: 'example-source',
            filter: ['==', '$type', 'Point'], // Filter for points
            paint: {
              'circle-color': '#ff0000', // Customize point color
              'circle-radius': 5 // Customize point size
            }
          });
    
          map.current.addLayer({
            id: 'lineLaye',
            type: 'line',
            source: 'example-source',
            layout: {},
            paint: {
                'line-color': '#ff0000',
                'line-width': 3
            }
        });
    
          map.current.addLayer({
            id: 'polygonsLaye',
            type: 'fill', // Use `fill` for polygons
            source: 'example-source',
            filter: ['==', '$type', 'Polygon'], // Filter for polygons
            paint: {
              'fill-color': 'rgba(200, 100, 240, 0.4)', // Customize polygon color
              'fill-opacity': 0.4
            }
          });
    
          map.current.addLayer({
            id: 'poi-label',
            type: 'symbol',
            source: 'example-source',
            layout: {
              'text-field': ['get', 'PILLAR_NUMBER'],
              'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
              'text-radial-offset': 0.5,
              'text-justify': 'auto',
              'icon-image': ['get', 'icon']
            }
          });


          map.current.on('click', 'polygonsLayer', (e) => {
            
             
    if (e.features && e.features.length > 0) {
      const feature = e.features[0];
      
      setSelectedFeature({
        PLAN_NAME: feature.properties.PLAN_NAME || 'N/A',
        PLAN_LOCATION: feature.properties.PLAN_LOCATION || 'N/A',
        PLAN_LGA: feature.properties.PLAN_LGA || 'N/A',
        PLAN_NUMBER: feature.properties.PLAN_NUMBER || 'N/A',
        SURVEYOR: feature.properties.SURVEYOR || 'N/A',
        PLAN_AREA: feature.properties.PLAN_AREA || 'N/A',
        PLAN_ORIGI: feature.properties.PLAN_ORIGI || 'N/A',
      });
     
      setIsOpen(true);

    } else {
      console.log('No features found at clicked location.'); // Debugging log
      setSelectedFeature(null);
      setIsOpen(false);
    }

    });
    
  
    




        }
      });
    }
  }, [style]); // Change map style whenever `style` changes

  const handleStyleChange = (newStyle) => {
    setStyle(newStyle);
    
  };



  return (
    <div>
      
      <div >
       <Component/>
       
      </div>
       <div ref={mapContainer} className="map-container " style={{ width: '100%', height: '88vh' }}>
       {selectedFeature && (
        
        <FeatureDetails
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        feature={selectedFeature}
        isMobile={isMobile} />
      )}

    <div className="flex space-x-4 mt-4 absolute z-50  bottom-20 left-12">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center px-4 py-2 bg-white text-gray-800 rounded-lg shadow-md hover:bg-gray-100 focus:outline-none">
          <div className="w-6 h-6 mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
        </svg>
        </div>  
          Map Style
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleStyleChange('mapbox://styles/mapbox/streets-v11')}>
            Streets
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStyleChange('mapbox://styles/mapbox/satellite-v9')}>
            Satellite
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStyleChange('mapbox://styles/mapbox/outdoors-v11')}>
            Outdoors
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStyleChange('mapbox://styles/mapbox/dark-v10')}>
            Dark
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
      <div>
        {/* <>
      
      <div
        className="calculation-box"
        style={{
          height: 75,
          width: 150,
          position: 'absolute',
          bottom: 40,
          left: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: 15,
          textAlign: 'center'
        }}
      >
        <p style={paragraphStyle}>Click the map to draw a polygon.</p>
        <div id="calculated-area">
          {roundedArea && (
            <>
              <p style={paragraphStyle}>
                <strong>{roundedArea}</strong>
              </p>
              <p style={paragraphStyle}>square meters</p>
            </>
          )}
        </div>
      </div> 
    </> */}
      </div>
      </div>
    </div>
  );
}