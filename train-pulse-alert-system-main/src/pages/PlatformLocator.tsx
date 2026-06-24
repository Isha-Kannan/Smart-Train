
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { MapPin } from "lucide-react";

const PlatformLocator = () => {
  const [message, setMessage] = useState("");
  
  const handleLocatePlatform = () => {
    setMessage("This feature will be implemented soon.");
    
    // Simulate searching animation
    setTimeout(() => {
      setMessage("This feature will be implemented soon. Check back later!");
    }, 2000);
  };
  
  return (
    <DashboardLayout title="Platform Locator" activeTab="platform">
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center py-12">
            <div className="mb-6 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-train-primary/10 to-train-secondary/10 rounded-full mb-4">
                <MapPin className="h-10 w-10 text-train-primary" />
              </div>
              <h2 className="text-2xl font-bold gradient-text">Platform Locator</h2>
              <p className="text-gray-600 mt-2 max-w-md">
                Find platform details for your train at the station for easier boarding
              </p>
            </div>
            
            <Button 
              onClick={handleLocatePlatform} 
              className="btn-train"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Locate Platform
            </Button>
            
            {message && (
              <div className="mt-8 p-4 bg-amber-50 rounded-lg text-center max-w-md">
                <p className="font-medium text-amber-800">{message}</p>
              </div>
            )}
            
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              <div className="bg-gradient-card rounded-lg p-6 text-center">
                <h3 className="font-medium text-lg">Coming Soon</h3>
                <p className="text-sm text-gray-600 mt-2">Live platform updates</p>
              </div>
              <div className="bg-gradient-card rounded-lg p-6 text-center">
                <h3 className="font-medium text-lg">Coming Soon</h3>
                <p className="text-sm text-gray-600 mt-2">Coach position details</p>
              </div>
              <div className="bg-gradient-card rounded-lg p-6 text-center">
                <h3 className="font-medium text-lg">Coming Soon</h3>
                <p className="text-sm text-gray-600 mt-2">Station navigation maps</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PlatformLocator;
