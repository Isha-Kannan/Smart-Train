
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-train-primary via-train-secondary to-train-accent text-white">
        <div className="container mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              SMART TRAIN
              <br />
              <span className="text-3xl md:text-5xl bg-clip-text text-transparent bg-white">DESTINATION ALERT SYSTEM</span>
            </h1>
            <p className="mt-4 md:mt-6 text-lg md:text-xl text-white/80 max-w-md">
              Never miss your stop again! Get alerts before reaching your destination and track your train in real-time.
            </p>
            <div className="mt-8 flex gap-4">
              <Link to="/login">
                <Button className="btn-secondary-train">Login Now</Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/2 relative">
            <div className="relative z-10 animate-train-move">
              <svg width="320" height="240" viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                <rect x="40" y="140" width="240" height="60" rx="10" fill="white" />
                <rect x="40" y="80" width="240" height="60" rx="5" fill="white" />
                <rect x="60" y="200" width="30" height="30" rx="15" fill="#333" />
                <rect x="230" y="200" width="30" height="30" rx="15" fill="#333" />
                <rect x="110" y="200" width="30" height="30" rx="15" fill="#333" />
                <rect x="180" y="200" width="30" height="30" rx="15" fill="#333" />
                <rect x="70" y="110" width="40" height="20" rx="2" fill="#4CC9F0" />
                <rect x="140" y="110" width="40" height="20" rx="2" fill="#4CC9F0" />
                <rect x="210" y="110" width="40" height="20" rx="2" fill="#4CC9F0" />
                <rect x="70" y="160" width="180" height="10" rx="2" fill="#F72585" />
                <path d="M280 140 L320 140 L300 110 L280 110 Z" fill="white" />
                <path d="M40 140 L0 140 L20 110 L40 110 Z" fill="white" />
              </svg>
              <div className="w-64 h-4 bg-black/10 blur-lg rounded-full mx-auto mt-4"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="gradient-text">Smart Features</span> for Your Journey
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="train-card">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-train-primary">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Search Trains</h3>
              <p className="text-gray-600">
                Find trains by name, number, source or destination station with our powerful search tool.
              </p>
            </div>
            
            <div className="train-card">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-train-secondary">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Track Trains</h3>
              <p className="text-gray-600">
                See your train's real-time location on a map and track its progress along the route.
              </p>
            </div>
            
            <div className="train-card">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-pink-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-train-accent">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <path d="M14 2v6h6"></path>
                  <path d="M16 13H8"></path>
                  <path d="M16 17H8"></path>
                  <path d="M10 9H8"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Book Tickets</h3>
              <p className="text-gray-600">
                Book train tickets with a simple form and get instant confirmation with all journey details.
              </p>
            </div>
            
            <div className="train-card">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-yellow-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-train-warning">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Destination Alerts</h3>
              <p className="text-gray-600">
                Set alerts to notify you before arriving at your destination so you never miss your stop.
              </p>
            </div>
            
            <div className="train-card">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-train-success">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Platform Locator</h3>
              <p className="text-gray-600">
                Find your train's platform number easily to save time at the station (coming soon).
              </p>
            </div>
            
            <div className="train-card">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-cyan-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-train-light">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">User Profile</h3>
              <p className="text-gray-600">
                Manage your account details and view your booking history in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call-to-action Section */}
      <div className="py-16 bg-gradient-to-br from-train-primary/5 to-train-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Smarter Travel?</h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-8">
            Join thousands of travelers who are enjoying a stress-free journey with our smart train alert system.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup">
              <Button className="btn-train">Get Started Now</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-8 bg-gray-800 text-gray-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="font-bold text-2xl text-white">SMART TRAIN</h2>
              <p className="text-sm">DESTINATION ALERT SYSTEM</p>
            </div>
            
            <div className="flex gap-6">
              <Link to="/login" className="hover:text-white">Login</Link>
              <Link to="/signup" className="hover:text-white">Sign Up</Link>
              <a href="#" className="hover:text-white">Help</a>
              <a href="#" className="hover:text-white">Privacy</a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm">
            <p>© {new Date().getFullYear()} Smart Train Destination Alert System. All rights reserved.</p>
            <p className="mt-2 text-gray-400">This is a simulation project and not a real train booking service.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
