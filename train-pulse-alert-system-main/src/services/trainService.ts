
// Types for our train data
export interface TrainStation {
  id: string;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
}

export interface Train {
  id: string;
  number: string;
  name: string;
  source: TrainStation;
  destination: TrainStation;
  intermediateStations: TrainStation[];
  departureTime: string;
  arrivalTime: string;
  duration: string;
}

export interface TrainTicket {
  id: string;
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  passengerName: string;
  passengerAge: number;
  departureTime: string;
  arrivalTime: string;
  ticketNumber: string;
  paymentStatus: 'Paid' | 'Pending';
  seatNumber?: string;
  coach?: string;
  phoneNumber: string;
  passengers?: Array<{name: string; age: number; seatNumber?: string}>;
  numberOfTickets: number;
}

// Mock data for train stations
const trainStations: TrainStation[] = [
  { id: 'sta_1', name: 'New Delhi Railway Station', code: 'NDLS', latitude: 28.6419, longitude: 77.2194 },
  { id: 'sta_2', name: 'Mumbai Central', code: 'MMCT', latitude: 18.9712, longitude: 72.8246 },
  { id: 'sta_3', name: 'Chennai Central', code: 'MAS', latitude: 13.0827, longitude: 80.2707 },
  { id: 'sta_4', name: 'Howrah Junction', code: 'HWH', latitude: 22.5986, longitude: 88.3425 },
  { id: 'sta_5', name: 'Bangalore City Junction', code: 'SBC', latitude: 12.9784, longitude: 77.5731 },
  { id: 'sta_6', name: 'Jaipur Junction', code: 'JP', latitude: 26.9172, longitude: 75.8152 },
  { id: 'sta_7', name: 'Ahmedabad Junction', code: 'ADI', latitude: 23.0330, longitude: 72.5678 },
  { id: 'sta_8', name: 'Hyderabad Deccan', code: 'HYB', latitude: 17.3845, longitude: 78.4799 },
  { id: 'sta_9', name: 'Pune Junction', code: 'PUNE', latitude: 18.5285, longitude: 73.8740 },
  { id: 'sta_10', name: 'Lucknow Charbagh', code: 'LKO', latitude: 26.8333, longitude: 80.9167 }
];

// Mock data for trains
const trains: Train[] = [
  {
    id: 'trn_1',
    number: '12301',
    name: 'Rajdhani Express',
    source: trainStations[0], // New Delhi
    destination: trainStations[1], // Mumbai
    intermediateStations: [trainStations[6], trainStations[8]], // Ahmedabad, Pune
    departureTime: '16:25',
    arrivalTime: '08:15',
    duration: '15h 50m'
  },
  {
    id: 'trn_2',
    number: '12259',
    name: 'Shatabdi Express',
    source: trainStations[0], // New Delhi
    destination: trainStations[5], // Jaipur
    intermediateStations: [],
    departureTime: '06:05',
    arrivalTime: '10:35',
    duration: '4h 30m'
  },
  {
    id: 'trn_3',
    number: '12622',
    name: 'Tamil Nadu Express',
    source: trainStations[0], // New Delhi
    destination: trainStations[2], // Chennai
    intermediateStations: [trainStations[7], trainStations[4]], // Hyderabad, Bangalore
    departureTime: '22:30',
    arrivalTime: '06:45',
    duration: '32h 15m'
  },
  {
    id: 'trn_4',
    number: '12802',
    name: 'Purushottam Express',
    source: trainStations[0], // New Delhi
    destination: trainStations[9], // Lucknow
    intermediateStations: [],
    departureTime: '21:25',
    arrivalTime: '06:45',
    duration: '9h 20m'
  },
  {
    id: 'trn_5',
    number: '12314',
    name: 'Sealdah Rajdhani',
    source: trainStations[0], // New Delhi
    destination: trainStations[3], // Howrah
    intermediateStations: [trainStations[9]], // Lucknow
    departureTime: '16:30',
    arrivalTime: '10:10',
    duration: '17h 40m'
  },
  {
    id: 'trn_6',
    number: '12951',
    name: 'Mumbai Rajdhani',
    source: trainStations[1], // Mumbai
    destination: trainStations[0], // New Delhi
    intermediateStations: [trainStations[6], trainStations[5]], // Ahmedabad, Jaipur
    departureTime: '17:00',
    arrivalTime: '08:35',
    duration: '15h 35m'
  },
  {
    id: 'trn_7',
    number: '12028',
    name: 'Shatabdi Express',
    source: trainStations[1], // Mumbai
    destination: trainStations[8], // Pune
    intermediateStations: [],
    departureTime: '05:50',
    arrivalTime: '08:40',
    duration: '2h 50m'
  },
  {
    id: 'trn_8',
    number: '12657',
    name: 'Chennai Mail',
    source: trainStations[2], // Chennai
    destination: trainStations[7], // Hyderabad
    intermediateStations: [],
    departureTime: '23:00',
    arrivalTime: '13:15',
    duration: '14h 15m'
  },
  {
    id: 'trn_9',
    number: '12246',
    name: 'Duronto Express',
    source: trainStations[3], // Howrah
    destination: trainStations[0], // New Delhi
    intermediateStations: [],
    departureTime: '20:05',
    arrivalTime: '13:30',
    duration: '17h 25m'
  },
  {
    id: 'trn_10',
    number: '22691',
    name: 'Rajdhani Express',
    source: trainStations[4], // Bangalore
    destination: trainStations[7], // Hyderabad
    intermediateStations: [],
    departureTime: '20:30',
    arrivalTime: '07:10',
    duration: '10h 40m'
  }
];

// Storage keys for local storage
const TICKETS_STORAGE_KEY = 'train_app_tickets';

// Train search service
export const searchTrains = (
  sourceQuery?: string,
  destinationQuery?: string,
  trainNameQuery?: string,
  trainNumberQuery?: string
): Train[] => {
  let filteredTrains = [...trains];

  // Filter by source
  if (sourceQuery && sourceQuery.trim() !== '') {
    const query = sourceQuery.toLowerCase();
    filteredTrains = filteredTrains.filter(train => 
      train.source.name.toLowerCase().includes(query) ||
      train.source.code.toLowerCase().includes(query)
    );
  }

  // Filter by destination
  if (destinationQuery && destinationQuery.trim() !== '') {
    const query = destinationQuery.toLowerCase();
    filteredTrains = filteredTrains.filter(train => 
      train.destination.name.toLowerCase().includes(query) ||
      train.destination.code.toLowerCase().includes(query)
    );
  }

  // Filter by train name
  if (trainNameQuery && trainNameQuery.trim() !== '') {
    const query = trainNameQuery.toLowerCase();
    filteredTrains = filteredTrains.filter(train => 
      train.name.toLowerCase().includes(query)
    );
  }

  // Filter by train number
  if (trainNumberQuery && trainNumberQuery.trim() !== '') {
    const query = trainNumberQuery.toLowerCase();
    filteredTrains = filteredTrains.filter(train => 
      train.number.toLowerCase().includes(query)
    );
  }

  return filteredTrains;
};

// Get train by number
export const getTrainByNumber = (number: string): Train | undefined => {
  return trains.find(train => train.number === number);
};

// Get all stations
export const getAllStations = (): TrainStation[] => {
  return trainStations;
};

// Train booking service
export const bookTicket = (ticketData: Omit<TrainTicket, 'id' | 'ticketNumber'>): TrainTicket => {
  const newTicket: TrainTicket = {
    ...ticketData,
    id: `ticket_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    ticketNumber: `TRN${Math.floor(Math.random() * 900000) + 100000}`,
  };

  // Get existing tickets
  const tickets = getBookedTickets();
  tickets.push(newTicket);
  
  // Save updated tickets
  localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
  
  return newTicket;
};

// Get all booked tickets
export const getBookedTickets = (): TrainTicket[] => {
  const ticketsStr = localStorage.getItem(TICKETS_STORAGE_KEY);
  return ticketsStr ? JSON.parse(ticketsStr) : [];
};

// Get booked tickets for a specific user (by phone number)
export const getTicketsByPhone = (phoneNumber: string): TrainTicket[] => {
  const tickets = getBookedTickets();
  return tickets.filter(ticket => ticket.phoneNumber === phoneNumber);
};

// Generate train route for tracking (mock coordinates between stations)
export const generateTrainRoute = (train: Train): {lat: number; lng: number}[] => {
  const route = [];
  
  // Add source station
  route.push({lat: train.source.latitude, lng: train.source.longitude});
  
  // Add intermediate stations in order
  for (const station of train.intermediateStations) {
    route.push({lat: station.latitude, lng: station.longitude});
  }
  
  // Add destination station
  route.push({lat: train.destination.latitude, lng: train.destination.longitude});
  
  // Generate additional points between stations for smoother movement
  const detailedRoute = [];
  
  for (let i = 0; i < route.length - 1; i++) {
    const start = route[i];
    const end = route[i + 1];
    
    // Add starting point
    detailedRoute.push(start);
    
    // Add 5 points between each station
    for (let j = 1; j <= 5; j++) {
      const fraction = j / 6;
      detailedRoute.push({
        lat: start.lat + (end.lat - start.lat) * fraction,
        lng: start.lng + (end.lng - start.lng) * fraction
      });
    }
  }
  
  // Add final destination
  detailedRoute.push(route[route.length - 1]);
  
  return detailedRoute;
};

