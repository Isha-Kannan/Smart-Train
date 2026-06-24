
import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, CreditCard, Ticket } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { 
  getTrainByNumber, 
  getAllStations, 
  bookTicket,
  TrainStation,
  Train
} from "@/services/trainService";

interface PassengerInfo {
  name: string;
  age: string;
}

const BookTickets = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trains, setTrains] = useState<Train[]>([]);
  const [stations] = useState<TrainStation[]>(getAllStations());
  
  const [bookingDetails, setBookingDetails] = useState({
    trainNumber: "",
    trainName: "",
    source: "",
    destination: "",
    passengerName: user?.name || "",
    passengerAge: user?.age?.toString() || "",
    phoneNumber: user?.phone || "",
    numberOfTickets: "1",
    departureTime: "",
    arrivalTime: "",
    paymentMethod: "card",
  });
  
  const [additionalPassengers, setAdditionalPassengers] = useState<PassengerInfo[]>([]);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingDetails((prev) => ({ ...prev, [name]: value }));
    
    // If train number changes, try to find train info
    if (name === "trainNumber" && value.trim().length > 0) {
      setIsLoading(true);
      setTimeout(() => {
        const train = getTrainByNumber(value.trim());
        if (train) {
          setTrains([train]);
          setBookingDetails((prev) => ({
            ...prev,
            trainName: train.name,
            departureTime: train.departureTime,
            arrivalTime: train.arrivalTime,
          }));
        } else {
          setTrains([]);
          setBookingDetails((prev) => ({
            ...prev,
            trainName: "",
            departureTime: "",
            arrivalTime: "",
          }));
        }
        setIsLoading(false);
      }, 500);
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setBookingDetails((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleNumTicketsChange = (value: string) => {
    const numTickets = parseInt(value);
    setBookingDetails((prev) => ({ ...prev, numberOfTickets: value }));
    
    // Adjust additional passengers array
    if (numTickets > 1) {
      // Create or resize array to match number of additional passengers (total - 1)
      const newPassengers = [...additionalPassengers];
      const targetLength = numTickets - 1;
      
      if (newPassengers.length < targetLength) {
        // Add empty passengers
        while (newPassengers.length < targetLength) {
          newPassengers.push({ name: "", age: "" });
        }
      } else if (newPassengers.length > targetLength) {
        // Remove extra passengers
        newPassengers.splice(targetLength);
      }
      
      setAdditionalPassengers(newPassengers);
    } else {
      // Reset additional passengers if only one ticket
      setAdditionalPassengers([]);
    }
  };
  
  const handlePassengerChange = (index: number, field: string, value: string) => {
    setAdditionalPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (
      !bookingDetails.trainNumber ||
      !bookingDetails.source ||
      !bookingDetails.destination ||
      !bookingDetails.passengerName ||
      !bookingDetails.passengerAge ||
      !bookingDetails.phoneNumber
    ) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Validate additional passengers if any
    if (parseInt(bookingDetails.numberOfTickets) > 1) {
      const invalidPassenger = additionalPassengers.findIndex(
        p => !p.name || !p.age
      );
      
      if (invalidPassenger !== -1) {
        toast({
          title: "Error",
          description: `Please fill details for passenger ${invalidPassenger + 2}`,
          variant: "destructive",
        });
        return;
      }
    }
    
    // Simulate payment and booking process
    setIsSubmitting(true);
    
    setTimeout(() => {
      try {
        const sourceName = stations.find(s => s.id === bookingDetails.source)?.name || "";
        const destName = stations.find(s => s.id === bookingDetails.destination)?.name || "";
        
        // Create all passengers array
        const allPassengers = [
          { name: bookingDetails.passengerName, age: parseInt(bookingDetails.passengerAge) }
        ];
        
        additionalPassengers.forEach(p => {
          allPassengers.push({
            name: p.name,
            age: parseInt(p.age)
          });
        });
        
        // Book the ticket
        const ticket = bookTicket({
          trainNumber: bookingDetails.trainNumber,
          trainName: bookingDetails.trainName,
          source: sourceName,
          destination: destName,
          passengerName: bookingDetails.passengerName,
          passengerAge: parseInt(bookingDetails.passengerAge),
          departureTime: bookingDetails.departureTime,
          arrivalTime: bookingDetails.arrivalTime,
          phoneNumber: bookingDetails.phoneNumber,
          numberOfTickets: parseInt(bookingDetails.numberOfTickets),
          passengers: allPassengers,
          paymentStatus: "Paid",
        });
        
        // Show success and store ticket number
        setBookingComplete(true);
        setTicketNumber(ticket.ticketNumber);
        
        toast({
          title: "Booking Successful",
          description: `Your ticket has been booked. Ticket No: ${ticket.ticketNumber}`,
        });
      } catch (error) {
        toast({
          title: "Booking Failed",
          description: "There was an error processing your booking",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 2000);
  };
  
  const resetForm = () => {
    setBookingDetails({
      trainNumber: "",
      trainName: "",
      source: "",
      destination: "",
      passengerName: user?.name || "",
      passengerAge: user?.age?.toString() || "",
      phoneNumber: user?.phone || "",
      numberOfTickets: "1",
      departureTime: "",
      arrivalTime: "",
      paymentMethod: "card",
    });
    setAdditionalPassengers([]);
    setBookingComplete(false);
    setTicketNumber("");
    setTrains([]);
  };
  
  return (
    <DashboardLayout title="Book Tickets" activeTab="book">
      <div className="space-y-6">
        {!bookingComplete ? (
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                {/* Train Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Train Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="trainNumber">Train Number</Label>
                      <div className="flex gap-2">
                        <Input
                          id="trainNumber"
                          name="trainNumber"
                          placeholder="Enter train number"
                          value={bookingDetails.trainNumber}
                          onChange={handleInputChange}
                        />
                        {isLoading && (
                          <Loader2 className="h-5 w-5 animate-spin text-train-primary" />
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="trainName">Train Name</Label>
                      <Input
                        id="trainName"
                        name="trainName"
                        placeholder="Train name will appear here"
                        value={bookingDetails.trainName}
                        onChange={handleInputChange}
                        readOnly={trains.length > 0}
                        className={trains.length > 0 ? "bg-gray-50" : ""}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="source">Source Station</Label>
                      <Select
                        value={bookingDetails.source}
                        onValueChange={(value) => handleSelectChange("source", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select source station" />
                        </SelectTrigger>
                        <SelectContent>
                          {stations.map((station) => (
                            <SelectItem key={station.id} value={station.id}>
                              {station.name} ({station.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="destination">Destination Station</Label>
                      <Select
                        value={bookingDetails.destination}
                        onValueChange={(value) => handleSelectChange("destination", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination station" />
                        </SelectTrigger>
                        <SelectContent>
                          {stations.map((station) => (
                            <SelectItem 
                              key={station.id} 
                              value={station.id}
                              disabled={station.id === bookingDetails.source}
                            >
                              {station.name} ({station.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="departureTime">Departure Time</Label>
                      <Input
                        id="departureTime"
                        name="departureTime"
                        placeholder="Departure time will appear here"
                        value={bookingDetails.departureTime}
                        readOnly={trains.length > 0}
                        className={trains.length > 0 ? "bg-gray-50" : ""}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="arrivalTime">Arrival Time</Label>
                      <Input
                        id="arrivalTime"
                        name="arrivalTime"
                        placeholder="Arrival time will appear here"
                        value={bookingDetails.arrivalTime}
                        readOnly={trains.length > 0}
                        className={trains.length > 0 ? "bg-gray-50" : ""}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Passenger Information */}
                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-medium">Passenger Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="passengerName">Full Name</Label>
                      <Input
                        id="passengerName"
                        name="passengerName"
                        placeholder="Enter passenger name"
                        value={bookingDetails.passengerName}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="passengerAge">Age</Label>
                      <Input
                        id="passengerAge"
                        name="passengerAge"
                        type="number"
                        placeholder="Enter age"
                        min="1"
                        max="120"
                        value={bookingDetails.passengerAge}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="Enter phone number"
                        value={bookingDetails.phoneNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="numberOfTickets">Number of Tickets</Label>
                    <Select
                      value={bookingDetails.numberOfTickets}
                      onValueChange={handleNumTicketsChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of tickets" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Additional Passengers */}
                  {additionalPassengers.length > 0 && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium">Additional Passengers</h4>
                      
                      {additionalPassengers.map((passenger, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b last:border-0">
                          <div className="space-y-2">
                            <Label htmlFor={`passenger-${index}-name`}>
                              Passenger {index + 2} Name
                            </Label>
                            <Input
                              id={`passenger-${index}-name`}
                              placeholder="Enter name"
                              value={passenger.name}
                              onChange={(e) => handlePassengerChange(index, "name", e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`passenger-${index}-age`}>
                              Passenger {index + 2} Age
                            </Label>
                            <Input
                              id={`passenger-${index}-age`}
                              type="number"
                              placeholder="Enter age"
                              min="1"
                              max="120"
                              value={passenger.age}
                              onChange={(e) => handlePassengerChange(index, "age", e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Payment Method */}
                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-medium">Payment Method</h3>
                  
                  <RadioGroup
                    value={bookingDetails.paymentMethod}
                    onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex items-center space-x-2 bg-white border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="card" id="payment-card" />
                      <Label htmlFor="payment-card" className="flex-1 flex items-center cursor-pointer">
                        <CreditCard className="h-5 w-5 mr-3 text-train-primary" />
                        Credit/Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-white border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="upi" id="payment-upi" />
                      <Label htmlFor="payment-upi" className="flex-1 flex items-center cursor-pointer">
                        <svg className="h-5 w-5 mr-3 text-train-primary" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM13 20.01L4 11V4h7v-.01l9 9-7 7.02z" />
                          <circle cx="6.5" cy="6.5" r="1.5" />
                        </svg>
                        UPI
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-white border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="wallet" id="payment-wallet" />
                      <Label htmlFor="payment-wallet" className="flex-1 flex items-center cursor-pointer">
                        <svg className="h-5 w-5 mr-3 text-train-primary" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 7V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2v-2h1c.55 0 1-.45 1-1V8c0-.55-.45-1-1-1h-1zM5 5h13v2H5V5zm13 14H5V9h13v10zm1-3h-2v-2h2v2z" />
                        </svg>
                        Wallet
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button
                  type="submit"
                  className="w-full mt-8 btn-train"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Book Ticket</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                  <Ticket className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-6">Your ticket has been successfully booked.</p>
                
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 max-w-md mx-auto">
                  <div className="text-left">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500">Ticket Number</div>
                        <div className="font-medium">{ticketNumber}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Status</div>
                        <div className="font-medium text-green-600">Confirmed</div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 mb-4">
                      <div className="text-sm font-medium gradient-text mb-2">JOURNEY DETAILS</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Train</div>
                          <div className="font-medium">
                            {bookingDetails.trainNumber} - {bookingDetails.trainName}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Journey Date</div>
                          <div className="font-medium">{new Date().toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">From</div>
                          <div className="font-medium">
                            {stations.find(s => s.id === bookingDetails.source)?.name}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">To</div>
                          <div className="font-medium">
                            {stations.find(s => s.id === bookingDetails.destination)?.name}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Departure</div>
                          <div className="font-medium">{bookingDetails.departureTime}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Arrival</div>
                          <div className="font-medium">{bookingDetails.arrivalTime}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 mb-4">
                      <div className="text-sm font-medium gradient-text mb-2">PASSENGER DETAILS</div>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">{bookingDetails.passengerName}</div>
                          <div className="text-right">{bookingDetails.passengerAge} years</div>
                        </div>
                        
                        {additionalPassengers.map((passenger, index) => (
                          <div key={index} className="grid grid-cols-2 gap-2">
                            <div className="font-medium">{passenger.name}</div>
                            <div className="text-right">{passenger.age} years</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="text-sm text-gray-500">Phone Number</div>
                      <div className="font-medium">{bookingDetails.phoneNumber}</div>
                    </div>
                  </div>
                </div>
                
                <Button onClick={resetForm} className="mt-8 btn-secondary-train">
                  Book Another Ticket
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BookTickets;
