export const ALL_INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

// Mapping of canonical state name -> array of cities & aliases
export const CITY_TO_STATE_MAP: Record<string, string[]> = {
  'Andaman and Nicobar Islands': ['port blair', 'car nicobar', 'havelock', 'diglipur', 'mayabunder'],
  'Andhra Pradesh': [
    'visakhapatnam', 'vizag', 'vijayawada', 'guntur', 'nellore', 'kurnool', 'kakinada',
    'rajahmundry', 'rajamahendravaram', 'tirupati', 'kadapa', 'cuddapah', 'vizianagaram',
    'anantapur', 'eluru', 'ongole', 'nandyal', 'machilipatnam', 'tenali', 'chittoor',
    'hindupur', 'proddatur', 'bhimavaram', 'madanapalle', 'guntakal', 'srikakulam'
  ],
  'Arunachal Pradesh': ['itanagar', 'naharlagun', 'pasighat', 'tawang', 'ziro', 'tezu', 'bomdila'],
  'Assam': [
    'guwahati', 'gauhati', 'silchar', 'dibrugarh', 'jorhat', 'nagaon', 'tinsukia',
    'tezpur', 'bongaigaon', 'dhubri', 'karimganj', 'sivasagar', 'goalpara', 'barpeta'
  ],
  'Bihar': [
    'patna', 'gaya', 'bhagalpur', 'muzaffarpur', 'purnia', 'darbhanga', 'bihar sharif',
    'arrah', 'ara', 'begusarai', 'katihar', 'munger', 'chhapra', 'bettiah', 'saharsa',
    'sasaram', 'hajipur', 'dehri', 'siwan', 'motihari', 'nawada', 'buxar', 'kishanganj', 'samastipur'
  ],
  'Chandigarh': ['chandigarh'],
  'Chhattisgarh': [
    'raipur', 'bhilai', 'bilaspur', 'korba', 'rajnandgaon', 'raigarh', 'jagdalpur',
    'ambikapur', 'durg', 'dhamtari', 'mahasamund', 'chirmiri'
  ],
  'Dadra and Nagar Haveli and Daman and Diu': ['daman', 'diu', 'silvassa'],
  'Delhi': [
    'delhi', 'new delhi', 'north delhi', 'south delhi', 'east delhi', 'west delhi',
    'central delhi', 'dwarka', 'rohini', 'connaught place', 'janakpuri', 'saket', 'pitampura',
    'shahdara', 'vasant kunj', 'laxmi nagar', 'najafgarh'
  ],
  'Goa': ['panaji', 'panjim', 'margao', 'vasco da gama', 'mapusa', 'ponda', 'bicholim', 'curchorem'],
  'Gujarat': [
    'ahmedabad', 'ahmedabad', 'surat', 'vadodara', 'baroda', 'rajkot', 'bhavnagar',
    'jamnagar', 'junagadh', 'gandhinagar', 'anand', 'navsari', 'morbi', 'nadiad',
    'surendranagar', 'bharuch', 'mehsana', 'bhuj', 'porbandar', 'valsad', 'veraval',
    'godhra', 'patan', 'gondal', 'amreli', 'palitana', 'ankleshwar', 'vapi'
  ],
  'Haryana': [
    'gurugram', 'gurgaon', 'faridabad', 'panipat', 'ambala', 'yamunanagar', 'rohtak',
    'hisar', 'karnal', 'sonipat', 'panchkula', 'bhiwani', 'sirsa', 'bahadurgarh',
    'jind', 'thanesar', 'rewari', 'kaithal', 'palwal', 'hansia', 'narnaul'
  ],
  'Himachal Pradesh': [
    'shimla', 'dharamshala', 'dharamsala', 'mandi', 'solan', 'baddi', 'kullu',
    'hamirpur', 'una', 'bilaspur', 'chamba', 'kangra', 'dalhousie', 'manali', 'nahan'
  ],
  'Jammu and Kashmir': [
    'srinagar', 'jammu', 'anantnag', 'baramulla', 'udhampur', 'kathua', 'sopore',
    'punc', 'rajouri', 'pulwama', 'kupwara'
  ],
  'Jharkhand': [
    'ranchi', 'jamshedpur', 'dhanbad', 'bokaro', 'hazaribagh', 'deoghar', 'giridih',
    'ramgarh', 'phusro', 'medininagar', 'daltonganj', 'chaibasa', 'dumka', 'sahibganj'
  ],
  'Karnataka': [
    'bengaluru', 'bangalore', 'mysore', 'mysuru', 'hubli', 'hubballi', 'dharwad',
    'mangalore', 'mangaluru', 'belgaum', 'belagavi', 'gulbarga', 'kalaburagi',
    'davanagere', 'bellary', 'ballari', 'shimoga', 'shivamogga', 'tumkur', 'tumakuru',
    'raichur', 'bidar', 'hospet', 'hosapete', 'hassan', 'gadag', 'udupi', 'kolar', 'mandya'
  ],
  'Kerala': [
    'thiruvananthapuram', 'trivandrum', 'kochi', 'cochin', 'kozhikode', 'calicut',
    'thrissur', 'trichur', 'kollam', 'quilon', 'palakkad', 'palghat', 'alappuzha',
    'alleppey', 'kannur', 'cannapore', 'kottayam', 'malappuram', 'thalassery', 'thiruvalla'
  ],
  'Ladakh': ['leh', 'kargil'],
  'Lakshadweep': ['kavaratti', 'agatti'],
  'Madhya Pradesh': [
    'bhopal', 'indore', 'jabalpur', 'gwalior', 'ujjain', 'sagar', 'dewas', 'satna',
    'ratlam', 'rewa', 'murwara', 'katni', 'singrauli', 'burhanpur', 'khandwa',
    'bhind', 'chhindwara', 'guna', 'shivpuri', 'vidisha', 'chhatarpur', 'damoh',
    'mandsaur', 'khargone', 'neemuch', 'pithampur', 'narmadapuram', 'hoshangabad'
  ],
  'Maharashtra': [
    'mumbai', 'bombay', 'pune', 'nagpur', 'thane', 'nashik', 'aurangabad',
    'chhatrapati sambhajinagar', 'solapur', 'amravati', 'navi mumbai', 'kolhapur',
    'sangli', 'nanded', 'jalgaon', 'akola', 'latur', 'dhule', 'ahmednagar',
    'chandrapur', 'parbhani', 'ichalkaranji', 'jalna', 'bhusawal', 'gondia',
    'satara', 'yavatmal', 'achalpur', 'osmanabad', 'dharashiv', 'panvel', 'mira bhayandar',
    'kalyan', 'dombivli', 'vasai', 'virar', 'ulhasnagar', 'bhiwandi'
  ],
  'Manipur': ['imphal', 'churachandpur', 'thoubal', 'bishnupur'],
  'Meghalaya': ['shillong', 'tura', 'jowai', 'nongpoh'],
  'Mizoram': ['aizawl', 'lunglei', 'saiha', 'champhai'],
  'Nagaland': ['kohima', 'dimapur', 'mokokchung', 'tuensang'],
  'Odisha': [
    'bhubaneswar', 'cuttack', 'rourkela', 'berhampur', 'sambalpur', 'puri',
    'balasore', 'bhadrak', 'baripada', 'jharsuguda', 'bargarh', 'jeypore'
  ],
  'Puducherry': ['puducherry', 'pondicherry', 'karaikal', 'mahe', 'yanam'],
  'Punjab': [
    'ludhiana', 'amritsar', 'jalandhar', 'patiala', 'bathinda', 'mohali',
    'sahibzada ajit singh nagar', 'pathankot', 'hoshiarpur', 'batala', 'moga',
    'abohar', 'khanna', 'phagwara', 'muktsar', 'barnala', 'rajpura', 'firozpur', 'kapurthala'
  ],
  'Rajasthan': [
    'jaipur', 'jodhpur', 'udaipur', 'kota', 'ajmer', 'bikaner', 'kishangarh',
    'bhilwara', 'alwar', 'sikar', 'pali', 'chittorgarh', 'jaisalmer', 'bharatpur',
    'mount abu', 'jhunjhunu', 'tonk', 'beawar', 'nagaur', 'hanumangarh',
    'sri ganganagar', 'barmer', 'dungarpur', 'banswara', 'dholpur', 'sawai madhopur',
    'rajsamand', 'jalore', 'churu', 'bundi', 'jhalawar', 'sirohi', 'karauli'
  ],
  'Sikkim': ['gangtok', 'namchi', 'geyzing', 'mangan'],
  'Tamil Nadu': [
    'chennai', 'madras', 'coimbatore', 'madurai', 'tiruchirappalli', 'trichy',
    'salem', 'tiruppur', 'erode', 'tirunelveli', 'vellore', 'thoothukudi',
    'tuticorin', 'nagercoil', 'thanjavur', 'dindigul', 'cuddalore', 'kanchipuram',
    'tiruvannamalai', 'kumbakonam', 'hosur', 'karur', 'rajapalayam', 'pudukkottai'
  ],
  'Telangana': [
    'hyderabad', 'secunderabad', 'warangal', 'nizamabad', 'karimnagar', 'ramagundam',
    'khammam', 'mahbubnagar', 'nalgonda', 'adilabad', 'suryapet', 'siddipet', 'miryalaguda'
  ],
  'Tripura': ['agartala', 'udaipur', 'dharmanagar', 'kailasahar'],
  'Uttar Pradesh': [
    'lucknow', 'kanpur', 'ghaziabad', 'agra', 'varanasi', 'banaras', 'kashi',
    'meerut', 'prayagraj', 'allahabad', 'bareilly', 'aligarh', 'moradabad',
    'saharanpur', 'gorakhpur', 'noida', 'greater noida', 'firozabad', 'jhansi',
    'muzaffarnagar', 'mathura', 'rampur', 'shahjahanpur', 'farrukhabad',
    'ayodhya', 'faizabad', 'mau', 'hapur', 'etawah', 'mirzapur', 'bulandshahr',
    'sambhal', 'amroha', 'hardoi', 'fatehpur', 'raebareli', 'orai', 'sitapur',
    'bahraich', 'jaunpur', 'unnao', 'lakhimpur', 'badaun', 'hathras', 'banda'
  ],
  'Uttarakhand': [
    'dehradun', 'haridwar', 'roorkee', 'haldwani', 'rudrapur', 'kashipur',
    'rishikesh', 'nainital', 'almora', 'pauri', 'pithoragarh', 'chamoli', 'kotdwar'
  ],
  'West Bengal': [
    'kolkata', 'calcutta', 'howrah', 'asansol', 'siliguri', 'durgapur', 'bardhaman',
    'burdwan', 'malda', 'baharampur', 'habra', 'kharagpur', 'shantipur', 'dankuni',
    'jalpaiguri', 'ranaghat', 'haldia', 'krishnanagar', 'balurghat', 'bankura', 'purulia'
  ],
};

export interface CityValidationResult {
  isValid: boolean;
  message?: string;
  actualState?: string;
}

export function validateCityAndState(city: string, selectedState: string): CityValidationResult {
  if (!city || !selectedState) {
    return { isValid: true };
  }

  const cleanCity = city.trim().toLowerCase();
  const cleanSelectedState = selectedState.trim().toLowerCase();

  // Find if this city exists in our lookup database across any state
  let foundState: string | null = null;

  for (const [stateName, cityList] of Object.entries(CITY_TO_STATE_MAP)) {
    if (cityList.includes(cleanCity)) {
      foundState = stateName;
      break;
    }
  }

  // If city is found in database, check if it matches selected state
  if (foundState) {
    if (foundState.toLowerCase() === cleanSelectedState) {
      return { isValid: true };
    } else {
      return {
        isValid: false,
        actualState: foundState,
        message: `City "${city.trim()}" is located in ${foundState}, not ${selectedState.trim()}. Please select ${foundState} as your state or enter a valid city for ${selectedState.trim()}.`,
      };
    }
  }

  // If city is not in offline list (e.g. smaller town/locality), do not block valid smaller towns
  return { isValid: true };
}
