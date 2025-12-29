import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Navigation, Star, BadgeCheck, Crown, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NearbyAgent {
  id: string;
  full_name: string;
  categories: string[] | null;
  avatar_url: string | null;
  city: string | null;
  area: string | null;
  state: string | null;
  pincode: string | null;
  available: boolean | null;
  verified: boolean | null;
  premium: boolean | null;
  avgRating: number;
}

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

// India bounding box coordinates
const INDIA_BOUNDS = {
  north: 35.513327,
  south: 6.753516,
  east: 97.395561,
  west: 68.186249,
};

const isLocationInIndia = (lat: number, lng: number): boolean => {
  return (
    lat >= INDIA_BOUNDS.south &&
    lat <= INDIA_BOUNDS.north &&
    lng >= INDIA_BOUNDS.west &&
    lng <= INDIA_BOUNDS.east
  );
};

export function NearYouSection() {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");
  const [selectedDistance, setSelectedDistance] = useState("Within 5 km");
  const [selectedSort, setSelectedSort] = useState("Nearest first");
  const [pincode, setPincode] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [agents, setAgents] = useState<NearbyAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const availableDistricts = selectedState ? statesWithDistricts[selectedState] || [] : [];
  const availableLocalities = selectedDistrict ? districtLocalities[selectedDistrict] || [] : [];

  // Fetch agents from database
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from("agents")
          .select("*")
          .eq("profile_complete", true)
          .order("premium", { ascending: false })
          .order("available", { ascending: false })
          .limit(4);

        // Apply filters
        if (selectedState) {
          query = query.ilike("state", `%${selectedState}%`);
        }
        if (selectedDistrict) {
          query = query.ilike("city", `%${selectedDistrict}%`);
        }
        if (selectedLocality) {
          query = query.ilike("area", `%${selectedLocality}%`);
        }
        if (pincode) {
          query = query.eq("pincode", pincode);
        }

        const { data: agentsData, error } = await query;

        if (error) throw error;

        if (agentsData && agentsData.length > 0) {
          // Fetch reviews for ratings
          const agentIds = agentsData.map((a) => a.id);
          const { data: reviewsData } = await supabase
            .from("reviews")
            .select("agent_id, stars")
            .in("agent_id", agentIds);

          const agentsWithRatings = agentsData.map((agent) => {
            const agentReviews = reviewsData?.filter((r) => r.agent_id === agent.id) || [];
            const avgRating = agentReviews.length > 0
              ? agentReviews.reduce((sum, r) => sum + r.stars, 0) / agentReviews.length
              : 0;
            return {
              ...agent,
              avgRating: Math.round(avgRating * 10) / 10,
            };
          });

          // Apply sorting
          if (selectedSort === "Highest rated") {
            agentsWithRatings.sort((a, b) => b.avgRating - a.avgRating);
          } else if (selectedSort === "Verified first") {
            agentsWithRatings.sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0));
          } else if (selectedSort === "Available now") {
            agentsWithRatings.sort((a, b) => (b.available ? 1 : 0) - (a.available ? 1 : 0));
          }

          setAgents(agentsWithRatings);
        } else {
          setAgents([]);
        }
      } catch (error) {
        console.error("Error fetching nearby agents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [selectedState, selectedDistrict, selectedLocality, pincode, selectedSort]);

  // Reverse geocoding to get state and district from coordinates
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      const data = await response.json();
      
      if (data.address) {
        const { state, city, town, village, county, state_district } = data.address;
        
        // Find matching state in our data
        const detectedState = Object.keys(statesWithDistricts).find(
          (s) => state?.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(state?.toLowerCase() || "")
        );
        
        if (detectedState) {
          setSelectedState(detectedState);
          
          // Find matching district
          const districts = statesWithDistricts[detectedState];
          const locationName = city || town || village || county || state_district || "";
          const detectedDistrict = districts.find(
            (d) => locationName.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(locationName.toLowerCase())
          );
          
          if (detectedDistrict) {
            setSelectedDistrict(detectedDistrict);
            
            // Check for locality
            const localities = districtLocalities[detectedDistrict] || [];
            const suburb = data.address.suburb || data.address.neighbourhood || "";
            const detectedLocality = localities.find(
              (l) => suburb.toLowerCase().includes(l.toLowerCase()) || l.toLowerCase().includes(suburb.toLowerCase())
            );
            if (detectedLocality) {
              setSelectedLocality(detectedLocality);
            }
          } else {
            setSelectedDistrict(districts[0] || "");
          }
          
          toast({
            title: "Location detected",
            description: `Found: ${detectedState}${detectedDistrict ? `, ${detectedDistrict}` : ""}`,
          });
        } else {
          throw new Error("Could not match your location to a known Indian state");
        }
      }
    } catch (error) {
      throw new Error("Failed to detect your location details");
    }
  }, [toast]);

  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      toast({
        title: "Not supported",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    setIsLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Check if location is within India
        if (!isLocationInIndia(latitude, longitude)) {
          setIsLocating(false);
          setLocationError("This service is only available in India");
          toast({
            title: "Location outside India",
            description: "Agentwaala is currently available only in India. Please select your location manually.",
            variant: "destructive",
          });
          return;
        }

        try {
          await reverseGeocode(latitude, longitude);
        } catch (error) {
          setLocationError("Could not detect your exact location. Please select manually.");
          toast({
            title: "Detection failed",
            description: "Could not detect your exact location. Please select manually.",
            variant: "destructive",
          });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        let message = "Unable to retrieve your location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            message = "Location request timed out.";
            break;
        }
        
        setLocationError(message);
        toast({
          title: "Location error",
          description: message,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  }, [reverseGeocode, toast]);

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
          {/* GPS Detection Button */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 pb-6 border-b border-border/50">
            <Button
              onClick={handleUseMyLocation}
              disabled={isLocating}
              className="h-12 rounded-xl w-full sm:w-auto"
              variant={locationError ? "outline" : "default"}
            >
              {isLocating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Detecting Location...
                </>
              ) : (
                <>
                  <Navigation className="h-4 w-4 mr-2" />
                  Auto-detect My Location
                </>
              )}
            </Button>
            {locationError && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{locationError}</span>
              </div>
            )}
            {!locationError && !isLocating && (
              <span className="text-sm text-muted-foreground">
                Works only within India
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Select 
              value={selectedState} 
              onValueChange={(value) => {
                if (value === "all") {
                  setSelectedState("");
                  setSelectedDistrict("");
                  setSelectedLocality("");
                } else {
                  setSelectedState(value);
                  setSelectedDistrict(statesWithDistricts[value]?.[0] || "");
                  setSelectedLocality("");
                }
              }}
            >
              <SelectTrigger className="h-12 rounded-xl">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {Object.keys(statesWithDistricts).map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={selectedDistrict} 
              onValueChange={(value) => {
                if (value === "all") {
                  setSelectedDistrict("");
                  setSelectedLocality("");
                } else {
                  setSelectedDistrict(value);
                  setSelectedLocality("");
                }
              }}
              disabled={!selectedState}
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="All Districts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {availableDistricts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={selectedLocality} 
              onValueChange={(value) => {
                if (value === "all") {
                  setSelectedLocality("");
                } else {
                  setSelectedLocality(value);
                }
              }}
              disabled={!selectedDistrict || availableLocalities.length === 0}
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="All Localities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Localities</SelectItem>
                {availableLocalities.map((locality) => (
                  <SelectItem key={locality} value={locality}>
                    {locality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Enter Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>
        </div>

        {/* Nearby Agents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card border border-border/50 rounded-2xl p-5">
                <div className="flex items-start gap-4 mb-4">
                  <Skeleton className="w-14 h-14 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-3 w-full mb-3" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))
          ) : agents.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No agents found in this location. Try adjusting your filters.
            </div>
          ) : (
            agents.map((agent) => (
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
                        src={agent.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"}
                        alt={agent.full_name}
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                      {/* Online Status Indicator */}
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${
                        agent.available ? "bg-green-500" : "bg-muted-foreground/50"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h3 className="font-semibold truncate">{agent.full_name}</h3>
                        {agent.verified && (
                          <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
                        )}
                        {agent.premium && (
                          <Crown className="h-4 w-4 text-amber-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-primary font-medium">
                        {agent.categories?.[0] || "General"}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">
                      {[agent.area, agent.city, agent.state].filter(Boolean).join(", ") || "India"}
                    </span>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-semibold">{agent.avgRating || "New"}</span>
                    </div>
                    {agent.pincode && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                        {agent.pincode}
                      </span>
                    )}
                  </div>

                  {/* Availability Status */}
                  <div className={`mt-3 text-center py-2 rounded-lg text-sm font-medium ${
                    agent.available 
                      ? "bg-green-500/10 text-green-600" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {agent.available ? "Available Now" : "Currently Unavailable"}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-10">
          <Link to="/agents">
            <Button variant="outline" size="lg" className="rounded-xl">
              View All Agents {selectedDistrict ? `in ${selectedDistrict}` : selectedState ? `in ${selectedState}` : ""}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}