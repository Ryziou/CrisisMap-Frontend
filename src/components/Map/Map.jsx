import './Map.css'
import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { getDisasters } from '../../services/reliefDisasters'
import SidebarTab from '../Sidebar/Sidebar'
import { useNavigate, useSearchParams } from 'react-router'
import { Button } from '@headlessui/react'
import { markerImages, markerCursors } from '../../lib/mapHelper'

export default function DisasterMap() {
    const disasterLookupRef = useRef(new Map())
    const mapRef = useRef()
    const mapContainerRef = useRef()
    const [selectedDisaster, setSelectedDisaster] = useState(null)
    const [disasters, setDisasters] = useState([])
    const [searchParams] = useSearchParams()
    const eventIdFocuser = searchParams.get('event')
    const navigate = useNavigate()


    useEffect(() => {
        mapboxgl.accessToken = import.meta.env.VITE_API_SECRET_TOKEN
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [-1.91, 53.40],
            zoom: 5
        });

        mapRef.current.on('load', () => {
            fetchDisasters()

            markerImages(mapRef.current, [
                { name: 'marker-red', url: '/red.png' },
                { name: 'marker-yellow', url: '/yellow.png' },
                { name: 'marker-blue', url: '/blue.png' },
            ])

            markerCursors(mapRef.current, ['clusters', 'unclustered-point'])

        })

        function spreadMarkers([lon, lat], index) {
            const spreadAmount = 0.1 + Math.random() * 0.1
            const angle = (2 * Math.PI * index) / 10
            return [
                lon + Math.cos(angle) * spreadAmount,
                lat + Math.sin(angle) * spreadAmount
            ]
        }

        const fetchDisasters = async () => {
            const coordinateMap = new Map()
            try {
                const { data } = await getDisasters()
                const events = data.data
                setDisasters(events)

                const disasterLookup = new Map()
                events.forEach(disaster => {
                    disasterLookup.set(disaster.fields.id, disaster.fields)
                })
                disasterLookupRef.current = disasterLookup

                const geojson = {
                    type: 'FeatureCollection',
                    features: events.map(disaster => {
                        const { location } = disaster.fields.primary_country
                        const { lat, lon } = location
                        if (!lat || !lon) return null

                        const key = `${lat},${lon}`
                        const index = coordinateMap.get(key) || 0
                        coordinateMap.set(key, index + 1)

                        const [newLon, newLat] = spreadMarkers([lon, lat], index)

                        return {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [newLon, newLat]
                            },
                            properties: {
                                id: disaster.fields.id,
                                name: disaster.fields.name,
                                status: disaster.fields.status.toLowerCase()
                            }
                        }
                    }).filter(Boolean)
                }

                mapRef.current.addSource('disasters', {
                    type: 'geojson',
                    data: geojson,
                    cluster: true,
                    clusterMaxZoom: 14,
                    clusterRadius: 50
                })

                mapRef.current.addLayer({
                    id: 'clusters',
                    type: 'circle',
                    source: 'disasters',
                    filter: ['has', 'point_count'],
                    paint: {
                        'circle-color': '#5b71ba',
                        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            20,
                            10, 25,
                            30, 30
                        ]
                    }
                })

                mapRef.current.addLayer({
                    id: 'cluster-count',
                    type: 'symbol',
                    source: 'disasters',
                    filter: ['has', 'point_count'],
                    layout: {
                        'text-field': '{point_count_abbreviated}',
                        'text-size': 12
                    }
                })

                mapRef.current.addLayer({
                    id: 'unclustered-point',
                    type: 'symbol',
                    source: 'disasters',
                    filter: ['!', ['has', 'point_count']],
                    layout: {
                        'icon-image': ['match', ['get', 'status'],
                            'alert', 'marker-red',
                            'ongoing', 'marker-yellow',
                            'past', 'marker-blue',
                            'marker-blue'
                        ],
                        'icon-size': 0.20,
                    }
                })

                mapRef.current.on('click', 'unclustered-point', (e) => {
                    const id = e.features[0].properties.id
                    const fullDisaster = disasterLookupRef.current.get(id)
                    setSelectedDisaster(fullDisaster)
                })

                mapRef.current.on('click', 'clusters', (e) => {
                    const features = mapRef.current.queryRenderedFeatures(e.point, {
                        layers: ['clusters']
                    })
                    const clusterId = features[0].properties.cluster_id
                    mapRef.current.getSource('disasters').getClusterExpansionZoom(clusterId, (error, zoom) => {
                        if (error) return
                        mapRef.current.easeTo({
                            center: features[0].geometry.coordinates,
                            zoom: Math.max(zoom, 2)
                        })
                    })
                })

            } catch (error) {
                console.log(error);

            }
        }
        return () => {
            mapRef.current.remove();
        };
    }, []);

    useEffect(() => {
        if (!eventIdFocuser || disasters.length === 0 || !mapRef.current) return

        const target = disasters.find(d => String(d.fields.id) === eventIdFocuser)
        if (target) {
            const lat = target.fields.primary_country.location.lat
            const long = target.fields.primary_country.location.lon

            mapRef.current.flyTo({
                center: [long, lat],
                zoom: 10,
                speed: 0.35,
                curve: 1.4
            })
            setSelectedDisaster(target.fields)
        }


    }, [eventIdFocuser, disasters])

    function handleResetCamera() {
        mapRef.current.flyTo({
            center: [-1.91, 53.40],
            zoom: 5,
            speed: 0.5,
            curve: 1.2
        })
        setSelectedDisaster(null)
        navigate('/map')
    }

    return (
        <>
            <div className="map-holder">
                {selectedDisaster && (
                    <SidebarTab disaster={selectedDisaster} onClose={() => setSelectedDisaster(null)} />
                )}
                <div ref={mapContainerRef} className='map-container' />
                <Button className="reset-camera-btn" onClick={handleResetCamera}>
                    Reset
                </Button>

            </div>

        </>
    )
};