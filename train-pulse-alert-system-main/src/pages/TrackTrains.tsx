
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTrainByNumber, generateTrainRoute, Train } from "@/services/trainService";
import { Loader2, Search, AlertTriangle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/components/ui/use-toast";

// Mock Leaflet imports (will be replaced with actual implementation in real app)
declare global {
  interface Window {
    L: any;
  }
}

const TrackTrains = () => {
  const [trainNumber, setTrainNumber] = useState("");
  const [train, setTrain] = useState<Train | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{lat: number; lng: number} | null>(null);
  const [routePoints, setRoutePoints] = useState<{lat: number; lng: number}[]>([]);
  const [pointIndex, setPointIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    // Load Leaflet and initialize map
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    
    document.head.appendChild(link);
    
    script.onload = initializeMap;
    document.body.appendChild(script);
    
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
      }
      if (animationRef.current) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || leafletMapRef.current) return;
    
    const L = window.L;
    
    // Center map on Tamil Nadu
    leafletMapRef.current = L.map(mapRef.current).setView([11.1271, 78.6569], 7);
    
    // Google Maps style with custom Leaflet tiles
    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps'
    }).addTo(leafletMapRef.current);
    
    // Add Tamil Nadu train stations
    addTamilNaduStations(L);
  };
  
  const addTamilNaduStations = (L: any) => {
    const stations = [
      { name: "Chennai Central", code: "MAS", lat: 13.0827, lng: 80.2707 },
      { name: "Coimbatore Junction", code: "CBE", lat: 11.0017, lng: 76.9650 },
      { name: "Madurai Junction", code: "MDU", lat: 9.9252, lng: 78.1198 },
      { name: "Tiruchirapalli Junction", code: "TPJ", lat: 10.8155, lng: 78.6969 },
      { name: "Salem Junction", code: "SA", lat: 11.6643, lng: 78.1460 },
      { name: "Thanjavur Junction", code: "TJ", lat: 10.7845, lng: 79.1378 },
      { name: "Tirunelveli Junction", code: "TEN", lat: 8.7139, lng: 77.7567 },
      { name: "Erode Junction", code: "ED", lat: 11.3410, lng: 77.7172 },
      { name: "Dindigul Junction", code: "DG", lat: 10.3624, lng: 77.9695 },
      { name: "Kumbakonam", code: "KMU", lat: 10.9602, lng: 79.3845 }
    ];
    
    stations.forEach(station => {
      const stationIcon = L.divIcon({
        html: `<div class="flex items-center justify-center">
                <div class="bg-red-500 text-white text-xs p-1 rounded-full shadow-lg">
                  ${station.code}
                </div>
              </div>`,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });
      
      const marker = L.marker([station.lat, station.lng], { icon: stationIcon })
        .addTo(leafletMapRef.current);
        
      marker.bindPopup(`
        <div class="p-2">
          <div class="font-bold">${station.name}</div>
          <div class="text-sm text-gray-600">${station.code}</div>
        </div>
      `);
    });
  };

  const handleSearch = () => {
    if (!trainNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a train number",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const foundTrain = getTrainByNumber(trainNumber.trim());
      
      if (foundTrain) {
        setTrain(foundTrain);
        const route = generateTrainRoute(foundTrain);
        setRoutePoints(route);
        setCurrentPosition(route[0]);
        setPointIndex(0);
        
        // Calculate estimated time (2 seconds per point in our simulation)
        const remainingPoints = route.length;
        const estimatedSeconds = remainingPoints * 2;
        setRemainingTime(estimatedSeconds);
      } else {
        toast({
          title: "Train Not Found",
          description: "No train found with that number",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const startTracking = () => {
    if (!train || !routePoints.length || !window.L) return;
    
    const L = window.L;
    
    // Clear existing markers and paths
    if (markerRef.current) {
      markerRef.current.remove();
    }
    
    if (polylineRef.current) {
      polylineRef.current.remove();
    }
    
    // Create custom train icon
    const trainIcon = L.divIcon({
      html: `<div class="flex items-center justify-center w-12 h-12">
               <div class="animate-train-move bg-train-primary text-white p-1 rounded-full shadow-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                   <rect x="4" y="3" width="16" height="16" rx="2"/>
                   <path d="M4 11h16"/>
                   <path d="M12 3v8"/>
                   <path d="M8 19l-2 3"/>
                   <path d="M18 22l-2-3"/>
                   <path d="M8 15h0"/>
                   <path d="M16 15h0"/>
                 </svg>
               </div>
             </div>`,
      className: '',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
    
    // Draw route
    const routeLatLngs = routePoints.map(point => [point.lat, point.lng]);
    polylineRef.current = L.polyline(routeLatLngs, {
      color: '#4361ee',
      weight: 3,
      opacity: 0.7,
      dashArray: '10, 10',
      lineCap: 'round'
    }).addTo(leafletMapRef.current);
    
    // Create markers for source and destination
    L.marker([routePoints[0].lat, routePoints[0].lng], {
      icon: L.divIcon({
        html: `<div class="bg-green-500 text-white p-1 rounded-full shadow">S</div>`,
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
    }).addTo(leafletMapRef.current);
    
    L.marker([routePoints[routePoints.length - 1].lat, routePoints[routePoints.length - 1].lng], {
      icon: L.divIcon({
        html: `<div class="bg-red-500 text-white p-1 rounded-full shadow">D</div>`,
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
    }).addTo(leafletMapRef.current);
    
    // Add train marker at starting position
    markerRef.current = L.marker([routePoints[0].lat, routePoints[0].lng], {
      icon: trainIcon
    }).addTo(leafletMapRef.current);
    
    // Fit map to route
    leafletMapRef.current.fitBounds(routeLatLngs);
    
    // Start animation
    setIsTracking(true);
    animateTrain();
  };

  const animateTrain = () => {
    if (pointIndex >= routePoints.length - 1) {
      setIsTracking(false);
      setRemainingTime(0);
      return;
    }
    
    // Move to next point
    setPointIndex(prevIndex => prevIndex + 1);
    setCurrentPosition(routePoints[pointIndex + 1]);
    
    // Update remaining time (2 seconds per point remaining)
    const pointsRemaining = routePoints.length - (pointIndex + 2);
    const secondsRemaining = Math.max(0, pointsRemaining * 2);
    setRemainingTime(secondsRemaining);
    
    // Update marker position
    if (markerRef.current && window.L) {
      const newPos = routePoints[pointIndex + 1];
      markerRef.current.setLatLng([newPos.lat, newPos.lng]);
      
      // Center map on marker
      leafletMapRef.current.panTo([newPos.lat, newPos.lng]);
    }
    
    // Schedule next animation frame
    animationRef.current = setTimeout(() => {
      animateTrain();
    }, 2000) as unknown as number;
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  };
  
  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <DashboardLayout title="Track Trains" activeTab="track">
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Enter train number (e.g. 12301)"
                value={trainNumber}
                onChange={(e) => setTrainNumber(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleSearch} 
                className="btn-train"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Find Train
                  </>
                )}
              </Button>
            </div>
            
            {train && (
              <div className="mt-4 border-t pt-4">
                <h3 className="text-lg font-medium">{train.number} - {train.name}</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Source</span>
                    <span className="font-medium">{train.source.name} ({train.source.code})</span>
                    <span className="text-sm text-green-600">{train.departureTime}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Destination</span>
                    <span className="font-medium">{train.destination.name} ({train.destination.code})</span>
                    <span className="text-sm text-red-600">{train.arrivalTime}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Duration</span>
                    <span className="font-medium">{train.duration}</span>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-4">
                  {!isTracking ? (
                    <Button onClick={startTracking} className="btn-secondary-train">
                      Start Live Tracking
                    </Button>
                  ) : (
                    <Button onClick={stopTracking} variant="destructive">
                      Stop Tracking
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Map Container */}
        <Card className="relative">
          <CardContent className="p-0">
            <div ref={mapRef} className="h-[400px] rounded-md overflow-hidden"></div>
            
            {!train && (
              <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
                  <h3 className="text-lg font-medium">No Train Selected</h3>
                  <p className="text-gray-600 mt-1">
                    Search for a train to begin tracking
                  </p>
                </div>
              </div>
            )}
            
            {isTracking && currentPosition && (
              <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
                <div className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <div className="mr-3">
                      <span className="pulse-dot"></span>
                    </div>
                    <div>
                      <div className="font-medium">{train?.name}</div>
                      <div className="text-sm text-gray-600">Currently tracking</div>
                    </div>
                  </div>
                  
                  {remainingTime !== null && (
                    <div className="bg-blue-50 p-2 rounded-md text-center">
                      <span className="text-xs text-gray-500">ETA to destination</span>
                      <div className="text-lg font-bold text-blue-600">{formatTime(remainingTime)}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TrackTrains;
