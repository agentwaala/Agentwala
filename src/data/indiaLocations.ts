export const INDIA_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Chandigarh',
  'Puducherry',
] as const;

export const STATE_DISTRICTS: Record<string, string[]> = {
  'Maharashtra': [
    'Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 
    'Solapur', 'Kolhapur', 'Sangli', 'Satara', 'Ahmednagar', 'Raigad'
  ],
  'Karnataka': [
    'Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Mangaluru', 
    'Hubballi-Dharwad', 'Belagavi', 'Kalaburagi', 'Ballari'
  ],
  'Tamil Nadu': [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
    'Tirunelveli', 'Erode', 'Vellore', 'Thoothukudi'
  ],
  'Gujarat': [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar',
    'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand'
  ],
  'Rajasthan': [
    'Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner',
    'Alwar', 'Bharatpur', 'Sikar', 'Bhilwara'
  ],
  'Uttar Pradesh': [
    'Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj', 
    'Meerut', 'Ghaziabad', 'Noida', 'Bareilly', 'Gorakhpur'
  ],
  'West Bengal': [
    'Kolkata', 'Howrah', 'Darjeeling', 'Siliguri', 'Asansol',
    'Durgapur', 'Bardhaman', 'Malda', 'Kharagpur'
  ],
  'Kerala': [
    'Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 
    'Kollam', 'Kannur', 'Alappuzha', 'Palakkad', 'Malappuram'
  ],
  'Telangana': [
    'Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 
    'Khammam', 'Mahbubnagar', 'Rangareddy', 'Medak'
  ],
  'Andhra Pradesh': [
    'Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 
    'Nellore', 'Kurnool', 'Kakinada', 'Rajahmundry', 'Kadapa'
  ],
  'Punjab': [
    'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda',
    'Mohali', 'Pathankot', 'Hoshiarpur', 'Moga'
  ],
  'Haryana': [
    'Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal',
    'Sonipat', 'Rohtak', 'Hisar', 'Yamunanagar'
  ],
  'Delhi': [
    'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi',
    'North East Delhi', 'North West Delhi', 'South Delhi',
    'South East Delhi', 'South West Delhi', 'West Delhi'
  ],
  'Bihar': [
    'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga',
    'Purnia', 'Bihar Sharif', 'Arrah', 'Begusarai'
  ],
  'Madhya Pradesh': [
    'Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain',
    'Sagar', 'Dewas', 'Satna', 'Rewa'
  ],
  'Jharkhand': [
    'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh',
    'Deoghar', 'Giridih', 'Ramgarh'
  ],
  'Chhattisgarh': [
    'Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg',
    'Rajnandgaon', 'Jagdalpur', 'Raigarh'
  ],
  'Odisha': [
    'Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 
    'Sambalpur', 'Puri', 'Balasore', 'Bhadrak'
  ],
  'Assam': [
    'Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon',
    'Tinsukia', 'Tezpur', 'Bongaigaon'
  ],
  'Chandigarh': ['Chandigarh'],
  'Goa': ['North Goa', 'South Goa'],
  'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
  'Himachal Pradesh': [
    'Shimla', 'Dharamshala', 'Manali', 'Solan', 'Mandi',
    'Kullu', 'Kangra', 'Una'
  ],
  'Uttarakhand': [
    'Dehradun', 'Haridwar', 'Rishikesh', 'Haldwani', 'Roorkee',
    'Nainital', 'Mussoorie', 'Rudrapur'
  ],
};

export const AGENT_CATEGORIES = [
  'Real Estate',
  'Textiles & Clothing',
  'Medicine (MR)',
  'Fruits & Vegetables',
  'Crop Seeds & Agriculture',
  'Footwear',
  'Beauty Products',
  'Tiles & Flooring',
  'Second-hand Vehicles',
  'Tours & Travel',
  'Electronics',
  'Furniture',
  'Jewellery',
  'Home Appliances',
  'Building Materials',
] as const;
