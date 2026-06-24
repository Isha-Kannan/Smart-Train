
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Train } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { searchTrains, Train as TrainType } from "@/services/trainService";

const Dashboard = () => {
  const [searchParams, setSearchParams] = useState({
    source: "",
    destination: "",
    trainName: "",
    trainNumber: "",
  });
  
  const [searchResults, setSearchResults] = useState<TrainType[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSearch = () => {
    const results = searchTrains(
      searchParams.source,
      searchParams.destination,
      searchParams.trainName,
      searchParams.trainNumber
    );
    
    setSearchResults(results);
    setHasSearched(true);
  };
  
  return (
    <DashboardLayout title="Search Trains" activeTab="search">
      <div>
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="source" className="text-sm font-medium mb-1 block">
                  Source Station
                </label>
                <Input
                  id="source"
                  name="source"
                  placeholder="Enter source station"
                  value={searchParams.source}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="destination" className="text-sm font-medium mb-1 block">
                  Destination Station
                </label>
                <Input
                  id="destination"
                  name="destination"
                  placeholder="Enter destination station"
                  value={searchParams.destination}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="trainName" className="text-sm font-medium mb-1 block">
                  Train Name
                </label>
                <Input
                  id="trainName"
                  name="trainName"
                  placeholder="Enter train name"
                  value={searchParams.trainName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="trainNumber" className="text-sm font-medium mb-1 block">
                  Train Number
                </label>
                <Input
                  id="trainNumber"
                  name="trainNumber"
                  placeholder="Enter train number"
                  value={searchParams.trainNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleSearch} 
              className="w-full mt-4 btn-train"
            >
              <Search className="mr-2 h-4 w-4" /> Search Trains
            </Button>
          </CardContent>
        </Card>
        
        {/* Search Results */}
        {hasSearched && (
          <Card>
            <CardContent className="pt-6">
              {searchResults.length > 0 ? (
                <div className="rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-100">
                      <TableRow>
                        <TableHead>Train No.</TableHead>
                        <TableHead>Train Name</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Departure</TableHead>
                        <TableHead>Arrival</TableHead>
                        <TableHead>Duration</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchResults.map((train) => (
                        <TableRow key={train.id} className="hover:bg-blue-50">
                          <TableCell className="font-medium">{train.number}</TableCell>
                          <TableCell>{train.name}</TableCell>
                          <TableCell>{train.source.name} ({train.source.code})</TableCell>
                          <TableCell>{train.destination.name} ({train.destination.code})</TableCell>
                          <TableCell>{train.departureTime}</TableCell>
                          <TableCell>{train.arrivalTime}</TableCell>
                          <TableCell>{train.duration}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <Train className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium">No trains found</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Try adjusting your search parameters
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
