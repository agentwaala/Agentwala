import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Navigation, Star, Phone, BadgeCheck, Crown, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const nearbyAgents = [
  {
    id: 1,
    name: "Rajesh Kumar",
    domain: "Real Estate",
    rating: 4.9,
    location: "Koramangala, Bangalore",
    distance: "1.2 km",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    isOnline: true,
    isVerified: true,
    isPremium: true,
  },
  {
    id: 2,
    name: "Priya Sharma",
    domain: "Clothes",
    rating: 4.8,
    location: "HSR Layout, Bangalore",
    distance: "2.4 km",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    isOnline: true,
    isVerified: true,
    isPremium: false,
  },
  {
    id: 3,
    name: "Amit Patel",
    domain: "Tiles",
    rating: 4.7,
    location: "BTM Layout, Bangalore",
    distance: "3.8 km",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    isOnline: false,
    isVerified: true,
    isPremium: false,
  },
  {
    id: 4,
    name: "Sunita Reddy",
    domain: "Beauty Products",
    rating: 5.0,
    location: "Indiranagar, Bangalore",
    distance: "4.5 km",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    isOnline: true,
    isVerified: true,
    isPremium: true,
  },
];

// Indian States with their Districts
const statesWithDistricts: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati", "Kakinada", "Rajahmundry", "Kadapa", "Anantapur", "Eluru"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro", "Bomdila", "Along", "Tezu", "Changlang", "Roing"],
  "Assam": ["Guwahati", "Jorhat", "Silchar", "Dibrugarh", "Tezpur", "Nagaon", "Tinsukia", "Bongaigaon", "Barpeta", "Goalpara"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Arrah", "Begusarai", "Katihar", "Munger"],
  "Chhattisgarh": ["Raipur", "Bilaspur", "Durg", "Bhilai", "Korba", "Rajnandgaon", "Raigarh", "Jagdalpur", "Ambikapur", "Dhamtari"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim", "Curchorem", "Canacona", "Quepem", "Sanguem"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Anand", "Mehsana"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal", "Sonipat", "Rohtak", "Hisar", "Bhiwani", "Sirsa"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Manali", "Kullu", "Solan", "Mandi", "Hamirpur", "Bilaspur", "Una", "Kangra"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh", "Giridih", "Ramgarh", "Dumka", "Chaibasa"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davangere", "Bellary", "Shimoga", "Tumkur"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kannur", "Kollam", "Palakkad", "Alappuzha", "Malappuram", "Kottayam"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Satna", "Rewa", "Ratlam", "Dewas"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Amravati", "Nanded"],
  "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Kakching", "Ukhrul", "Senapati", "Tamenglong", "Chandel", "Jiribam"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh", "Williamnagar", "Baghmara", "Resubelpara", "Mairang", "Nongstoin", "Khliehriat"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib", "Lawngtlai", "Mamit", "Saiha", "Saitual", "Khawzawl"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Phek", "Mon", "Kiphire", "Longleng"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada", "Jharsuguda"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot", "Hoshiarpur", "Moga", "Firozpur"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bhilwara", "Alwar", "Sikar", "Pali"],
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Rangpo", "Singtam", "Jorethang", "Ravangla", "Pakyong", "Soreng"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Dindigul"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Belonia", "Ambassa", "Khowai", "Teliamura", "Sabroom", "Sonamura"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Prayagraj", "Meerut", "Ghaziabad", "Noida", "Bareilly", "Aligarh"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Rishikesh", "Nainital", "Haldwani", "Roorkee", "Rudrapur", "Kashipur", "Mussoorie", "Almora"],
  "West Bengal": ["Kolkata", "Howrah", "Darjeeling", "Siliguri", "Asansol", "Durgapur", "Kharagpur", "Haldia", "Malda", "Burdwan"],
  "Delhi": ["New Delhi", "Central Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "North West Delhi", "South West Delhi", "North East Delhi", "Shahdara"],
  "Chandigarh": ["Chandigarh"],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"],
};

// Localities based on district (sample data for major cities)
const districtLocalities: Record<string, string[]> = {
  "Bangalore": ["Koramangala", "HSR Layout", "BTM Layout", "Indiranagar", "Whitefield", "Electronic City", "Marathahalli", "Jayanagar", "JP Nagar", "Hebbal"],
  "Mumbai": ["Andheri", "Bandra", "Powai", "Thane", "Malad", "Goregaon", "Borivali", "Kurla", "Chembur", "Dadar"],
  "Delhi": ["Connaught Place", "Karol Bagh", "Dwarka", "Rohini", "Saket", "Lajpat Nagar", "Janakpuri", "Rajouri Garden", "Pitampura", "Vasant Kunj"],
  "Hyderabad": ["Hitech City", "Gachibowli", "Madhapur", "Banjara Hills", "Jubilee Hills", "Secunderabad", "Kukatpally", "Kondapur", "Ameerpet", "Begumpet"],
  "Chennai": ["T Nagar", "Anna Nagar", "Adyar", "Velachery", "OMR", "Porur", "Tambaram", "Guindy", "Nungambakkam", "Mylapore"],
  "Pune": ["Koregaon Park", "Viman Nagar", "Hinjewadi", "Kothrud", "Baner", "Wakad", "Hadapsar", "Aundh", "Magarpatta", "Shivajinagar"],
  "Kolkata": ["Salt Lake", "Park Street", "New Town", "Ballygunge", "Behala", "Tollygunge", "Howrah", "Dum Dum", "Jadavpur", "Alipore"],
  "Ahmedabad": ["Satellite", "SG Highway", "Navrangpura", "Vastrapur", "Bodakdev", "Maninagar", "Chandkheda", "Bopal", "Prahlad Nagar", "Thaltej"],
  "Jaipur": ["Malviya Nagar", "Vaishali Nagar", "Mansarovar", "C Scheme", "Raja Park", "Tonk Road", "Sodala", "Jagatpura", "Bani Park", "Vidhyadhar Nagar"],
  "Lucknow": ["Hazratganj", "Gomti Nagar", "Aliganj", "Indira Nagar", "Mahanagar", "Chowk", "Aminabad", "Alambagh", "Vikas Nagar", "Jankipuram"],
};

const distances = ["Within 2 km", "Within 5 km", "Within 10 km", "Within 25 km"];
const sortOptions = ["Nearest first", "Highest rated", "Verified first", "Available now"];

export function NearYouSection() {
  const [selectedState, setSelectedState] = useState("Karnataka");
  const [selectedDistrict, setSelectedDistrict] = useState("Bangalore");
  const [selectedLocality, setSelectedLocality] = useState("");
  const [selectedDistance, setSelectedDistance] = useState("Within 5 km");
  const [selectedSort, setSelectedSort] = useState("Nearest first");
  const [pincode, setPincode] = useState("");

  const availableDistricts = statesWithDistricts[selectedState] || [];
  const availableLocalities = districtLocalities[selectedDistrict] || [];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Navigation className="h-4 w-4" />
            Location Based
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Agents <span className="text-primary">Near You</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find trusted agents in your locality for faster, reliable service
          </p>
        </div>

        {/* Location Filters */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 mb-10 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Select value={selectedState} onValueChange={(value) => {
              setSelectedState(value);
              setSelectedDistrict(statesWithDistricts[value]?.[0] || "");
              setSelectedLocality("");
            }}>
              <SelectTrigger className="h-12 rounded-xl">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(statesWithDistricts).map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDistrict} onValueChange={(value) => {
              setSelectedDistrict(value);
              setSelectedLocality("");
            }}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent>
                {availableDistricts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLocality} onValueChange={setSelectedLocality}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Select Locality" />
              </SelectTrigger>
              <SelectContent>
                {availableLocalities.length > 0 ? (
                  availableLocalities.map((locality) => (
                    <SelectItem key={locality} value={locality}>
                      {locality}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="all" disabled>No localities available</SelectItem>
                )}
              </SelectContent>
            </Select>

            <Input
              placeholder="Enter Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select value={selectedDistance} onValueChange={setSelectedDistance}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Distance" />
              </SelectTrigger>
              <SelectContent>
                {distances.map((distance) => (
                  <SelectItem key={distance} value={distance}>
                    {distance}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSort} onValueChange={setSelectedSort}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button className="h-12 rounded-xl">
              <Navigation className="h-4 w-4 mr-2" />
              Use My Location
            </Button>
          </div>
        </div>

        {/* Nearby Agents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {nearbyAgents.map((agent) => (
            <Link
              key={agent.id}
              to={`/agents/${agent.id}`}
              className="group"
            >
              <div className="bg-card border border-border/50 rounded-2xl p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                {/* Agent Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={agent.image}
                      alt={agent.name}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    {/* Online Status Indicator */}
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${
                      agent.isOnline ? "bg-green-500" : "bg-muted-foreground/50"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="font-semibold truncate">{agent.name}</h3>
                      {agent.isVerified && (
                        <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
                      )}
                      {agent.isPremium && (
                        <Crown className="h-4 w-4 text-amber-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-primary font-medium">{agent.domain}</p>
                  </div>
                </div>

                {/* Location & Distance */}
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate">{agent.location}</span>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-semibold">{agent.rating}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                    <Navigation className="h-3 w-3" />
                    {agent.distance}
                  </span>
                </div>

                {/* Availability Status */}
                <div className={`mt-3 text-center py-2 rounded-lg text-sm font-medium ${
                  agent.isOnline 
                    ? "bg-green-500/10 text-green-600" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {agent.isOnline ? "Available Now" : "Currently Unavailable"}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-10">
          <Link to="/agents">
            <Button variant="outline" size="lg" className="rounded-xl">
              View All Agents in {selectedDistrict}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}