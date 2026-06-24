
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

// This is a placeholder component for the admin panel
// It will be enhanced with MongoDB integration in the future

const AdminPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("trains");

  // Placeholder functions - these will be connected to MongoDB later
  const handleAddTrain = () => {
    toast({
      title: "Coming Soon",
      description: "Train database integration will be available soon.",
    });
  };

  const handleAddStation = () => {
    toast({
      title: "Coming Soon",
      description: "Station database integration will be available soon.",
    });
  };

  const handleManageUsers = () => {
    toast({
      title: "Coming Soon",
      description: "User database integration will be available soon.",
    });
  };

  const handleTwilioSetup = () => {
    toast({
      title: "Coming Soon",
      description: "Twilio SMS integration will be available soon.",
    });
  };

  return (
    <DashboardLayout title="Admin Panel" activeTab="admin">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Administration</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="trains" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="trains">Trains</TabsTrigger>
                <TabsTrigger value="stations">Stations</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="trains" className="p-4">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Train Management</h3>
                  <p className="text-muted-foreground">
                    Add, modify, or remove trains from the database. This section will be connected to MongoDB.
                  </p>
                  <div className="flex gap-4">
                    <Button onClick={handleAddTrain}>Add New Train</Button>
                    <Button variant="outline">View All Trains</Button>
                  </div>
                  
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm">
                      <strong>Coming Soon:</strong> MongoDB integration for real-time train data management.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="stations" className="p-4">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Station Management</h3>
                  <p className="text-muted-foreground">
                    Add, modify, or remove stations from the database. This section will be connected to MongoDB.
                  </p>
                  <div className="flex gap-4">
                    <Button onClick={handleAddStation}>Add New Station</Button>
                    <Button variant="outline">View All Stations</Button>
                  </div>
                  
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm">
                      <strong>Coming Soon:</strong> MongoDB integration for station management including specific Tamil Nadu stations.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="users" className="p-4">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">User Management</h3>
                  <p className="text-muted-foreground">
                    View and manage user accounts. This section will be connected to MongoDB.
                  </p>
                  <div className="flex gap-4">
                    <Button onClick={handleManageUsers}>Manage Users</Button>
                    <Button variant="outline">Export User Data</Button>
                  </div>
                  
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm">
                      <strong>Coming Soon:</strong> MongoDB integration for user management, including gender-based avatars and preferences.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications" className="p-4">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Notification Settings</h3>
                  <p className="text-muted-foreground">
                    Configure Twilio SMS integration and notification preferences.
                  </p>
                  <div className="flex gap-4">
                    <Button onClick={handleTwilioSetup}>Configure Twilio</Button>
                    <Button variant="outline">Test Notifications</Button>
                  </div>
                  
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm">
                      <strong>Coming Soon:</strong> Twilio SMS integration for sending train alerts and notifications to users.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminPanel;
