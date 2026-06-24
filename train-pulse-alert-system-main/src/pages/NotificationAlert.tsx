
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { getTrainByNumber, getAllStations, TrainStation, Train } from "@/services/trainService";
import { setupDestinationAlert, showNotification, sendSmsAlert } from "@/services/notificationService";
import { Loader2, Bell, BellRing } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

const NotificationAlert = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [train, setTrain] = useState<Train | null>(null);
  const [stations] = useState<TrainStation[]>(getAllStations());
  const [alertActive, setAlertActive] = useState(false);
  const [alertCountdown, setAlertCountdown] = useState(0);
  // Fix: Change timerId type to NodeJS.Timeout | null to match setTimeout's return type
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  
  const [alertSettings, setAlertSettings] = useState({
    trainNumber: "",
    station: "",
    minutesBefore: 10,
    notifyBrowser: true,
    notifySMS: false,
  });
  
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (alertActive && alertCountdown > 0) {
      interval = setInterval(() => {
        setAlertCountdown((prev) => {
          if (prev <= 1) {
            if (interval) clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
      if (timerId) clearTimeout(timerId);
    };
  }, [alertActive, alertCountdown, timerId]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAlertSettings((prev) => ({ ...prev, [name]: value }));
    
    // If train number changes, try to find train info
    if (name === "trainNumber" && value.trim().length > 0) {
      setIsLoading(true);
      setTimeout(() => {
        const foundTrain = getTrainByNumber(value.trim());
        setTrain(foundTrain || null);
        setIsLoading(false);
      }, 500);
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setAlertSettings((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSliderChange = (value: number[]) => {
    setAlertSettings((prev) => ({ ...prev, minutesBefore: value[0] }));
  };
  
  const toggleSwitch = (name: string, value: boolean) => {
    setAlertSettings((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSetupAlert = () => {
    if (!alertSettings.trainNumber || !alertSettings.station) {
      toast({
        title: "Error",
        description: "Please select a train and station",
        variant: "destructive",
      });
      return;
    }
    
    // Request notification permission if needed
    if (alertSettings.notifyBrowser && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    
    // Get station name
    const stationName = stations.find(s => s.id === alertSettings.station)?.name || "destination";
    
    // Show confirmation
    toast({
      title: "Alert Set",
      description: `You will be notified ${alertSettings.minutesBefore} minutes before arriving at ${stationName}`,
    });
    
    // Convert minutes to seconds for demo, and add a little buffer
    const alertTimeInSeconds = alertSettings.minutesBefore;
    setAlertCountdown(alertTimeInSeconds);
    
    // Setup alert and store the timer ID
    const id = setupDestinationAlert(
      alertSettings.trainNumber,
      stationName,
      alertSettings.minutesBefore,
      () => {
        setAlertActive(false);
        
        // Show toast when alert triggers
        toast({
          title: "Destination Alert",
          description: `${alertSettings.trainNumber} will arrive at ${stationName} soon!`,
          variant: "destructive",
        });

        // Send SMS alert if selected
        if (alertSettings.notifySMS && user?.phone) {
          sendSmsAlert(
            user.phone,
            `Train ${alertSettings.trainNumber} approaching! Your train will arrive at ${stationName} in approximately ${alertSettings.minutesBefore} minutes.`
          );
        }
      }
    );
    
    // Fix: Store the timer ID as is without trying to set it as a React state directly
    setTimerId(id);
    setAlertActive(true);
    
    // Show notification to demonstrate functionality immediately
    setTimeout(() => {
      showNotification(
        "Alert Setup Successful",
        `You will be notified before arriving at ${stationName}`
      );
    }, 1000);
  };
  
  const handleCancelAlert = () => {
    if (timerId) {
      clearTimeout(timerId);
      setTimerId(null);
    }
    setAlertActive(false);
    setAlertCountdown(0);
    
    toast({
      title: "Alert Cancelled",
      description: "Your destination alert has been cancelled",
    });
  };
  
  return (
    <DashboardLayout title="Notification Alert" activeTab="alert">
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-train-accent/10 rounded-full p-3">
                  <BellRing className="h-6 w-6 text-train-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Destination Alert</h3>
                  <p className="text-gray-600 mt-1">
                    Set up alerts to notify you before reaching your destination station
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trainNumber">Train Number</Label>
                    <div className="flex gap-2">
                      <Input
                        id="trainNumber"
                        name="trainNumber"
                        placeholder="Enter train number"
                        value={alertSettings.trainNumber}
                        onChange={handleInputChange}
                        disabled={alertActive}
                      />
                      {isLoading && (
                        <Loader2 className="h-5 w-5 animate-spin text-train-primary" />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Train Name</Label>
                    <Input
                      placeholder="Train name will appear here"
                      value={train?.name || ""}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                
                {train && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <div className="font-medium">Route:</div>
                      <div>
                        {train.source.name} ({train.source.code})
                        {train.intermediateStations.map((station, i) => (
                          <span key={i}>
                            {" → "}
                            {station.name} ({station.code})
                          </span>
                        ))}
                        {" → "}
                        {train.destination.name} ({train.destination.code})
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="station">Destination Station</Label>
                  <Select
                    value={alertSettings.station}
                    onValueChange={(value) => handleSelectChange("station", value)}
                    disabled={alertActive}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination station" />
                    </SelectTrigger>
                    <SelectContent>
                      {train ? (
                        <>
                          {train.intermediateStations.map((station) => (
                            <SelectItem key={station.id} value={station.id}>
                              {station.name} ({station.code})
                            </SelectItem>
                          ))}
                          <SelectItem key={train.destination.id} value={train.destination.id}>
                            {train.destination.name} ({train.destination.code})
                          </SelectItem>
                        </>
                      ) : (
                        <SelectItem value="none" disabled>
                          Enter train number first
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="minutesBefore">Alert me before arrival</Label>
                    <span className="text-sm text-gray-500">
                      {alertSettings.minutesBefore} minutes
                    </span>
                  </div>
                  <Slider
                    id="minutesBefore"
                    min={5}
                    max={30}
                    step={5}
                    value={[alertSettings.minutesBefore]}
                    onValueChange={handleSliderChange}
                    disabled={alertActive}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifyBrowser">Browser Notifications</Label>
                      <Switch
                        id="notifyBrowser"
                        checked={alertSettings.notifyBrowser}
                        onCheckedChange={(checked) => toggleSwitch("notifyBrowser", checked)}
                        disabled={alertActive}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notifySMS">SMS Notifications</Label>
                        <p className="text-xs text-gray-500">
                          {user?.phone ? `Send alerts to ${user.phone}` : "Update profile with a phone number to enable"}
                        </p>
                      </div>
                      <Switch
                        id="notifySMS"
                        checked={alertSettings.notifySMS}
                        onCheckedChange={(checked) => toggleSwitch("notifySMS", checked)}
                        disabled={!user?.phone || alertActive}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {!alertActive ? (
                <Button
                  onClick={handleSetupAlert}
                  className="w-full btn-train"
                  disabled={!train || !alertSettings.station}
                >
                  <Bell className="mr-2 h-4 w-4" /> Set Alert
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className="mr-4 relative">
                        <div className="pulse-dot"></div>
                      </div>
                      <div>
                        <div className="font-medium">Alert Active</div>
                        <div className="text-sm text-gray-600">
                          {alertCountdown > 0 
                            ? `You will be notified in approximately ${alertCountdown} seconds`
                            : "Alert will trigger soon"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleCancelAlert}
                    variant="destructive"
                    className="w-full"
                  >
                    Cancel Alert
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NotificationAlert;
