// Site configuration and sample listings.
// Edit SITE with your real contact details before going live.
const SITE = {
  name: 'Realaasti',
  email: 'info@realaasti.com',
  phone: '',      // e.g. '+91 98765 43210'
  whatsapp: '',   // digits only with country code, e.g. '919876543210'
  address: 'Andhra Pradesh & Telangana, India',
};

const CITIES = ['Hyderabad', 'Visakhapatnam', 'Vijayawada', 'Guntur', 'Warangal', 'Tirupati'];

const TYPES = ['Apartment', 'Independent House', 'Villa', 'Plot', 'Commercial'];

const AMENITIES = [
  'Lift', 'Power Backup', 'Car Parking', 'Security', 'Gym', 'Swimming Pool',
  'Children Play Area', 'Gated Community', 'Water Supply 24x7', 'Clubhouse',
  'Vastu Compliant', 'Park', 'Borewell', 'CCTV',
];

const SAMPLE_LISTINGS = [
  {
    id: 'r101', title: '3 BHK Apartment in Gachibowli', purpose: 'sale', type: 'Apartment',
    city: 'Hyderabad', locality: 'Gachibowli', price: 12500000, area: 1650, areaUnit: 'sqft',
    beds: 3, baths: 3, facing: 'East', status: 'Ready to move', postedOn: '2026-10-12', featured: true,
    amenities: ['Lift', 'Power Backup', 'Car Parking', 'Security', 'Gym', 'Swimming Pool', 'Clubhouse'],
    description: 'Spacious east-facing 3 BHK on the 9th floor of a gated community, close to the Financial District, schools and hospitals. Modular kitchen, two covered car parks and a clubhouse with pool.',
  },
  {
    id: 'r102', title: '2 BHK Flat near Beach Road', purpose: 'rent', type: 'Apartment',
    city: 'Visakhapatnam', locality: 'MVP Colony', price: 22000, area: 1150, areaUnit: 'sqft',
    beds: 2, baths: 2, facing: 'North', status: 'Ready to move', postedOn: '2026-10-15', featured: true,
    amenities: ['Lift', 'Power Backup', 'Car Parking', 'Security', 'Water Supply 24x7'],
    description: 'Semi-furnished 2 BHK, a 5-minute drive from RK Beach. Wardrobes, geysers and fans fitted. Family preferred.',
  },
  {
    id: 'r103', title: '200 Sq Yd East-Facing Plot, CRDA Approved', purpose: 'sale', type: 'Plot',
    city: 'Vijayawada', locality: 'Gannavaram', price: 4800000, area: 200, areaUnit: 'sq yd',
    beds: 0, baths: 0, facing: 'East', status: 'Ready to register', postedOn: '2026-10-08', featured: true,
    amenities: ['Gated Community', 'Park', 'Vastu Compliant', 'CCTV'],
    description: 'CRDA-approved layout plot with 40 ft blacktop roads, underground drainage and electricity. Near the airport and the national highway. Clear title, bank loan available.',
  },
  {
    id: 'r104', title: 'G+1 Independent House', purpose: 'sale', type: 'Independent House',
    city: 'Guntur', locality: 'Brodipet', price: 8500000, area: 2200, areaUnit: 'sqft',
    beds: 4, baths: 3, facing: 'North', status: 'Ready to move', postedOn: '2026-09-30',
    amenities: ['Car Parking', 'Borewell', 'Vastu Compliant', 'Water Supply 24x7'],
    description: 'Well-maintained G+1 house on 167 sq yd. Ground floor 2 BHK and first floor 2 BHK — ideal for living plus rental income. Walking distance to the market.',
  },
  {
    id: 'r105', title: 'Luxury 4 BHK Villa with Private Garden', purpose: 'sale', type: 'Villa',
    city: 'Hyderabad', locality: 'Kokapet', price: 42000000, area: 4200, areaUnit: 'sqft',
    beds: 4, baths: 5, facing: 'East', status: 'Under construction', postedOn: '2026-10-02', featured: true,
    amenities: ['Gated Community', 'Clubhouse', 'Swimming Pool', 'Gym', 'Security', 'Power Backup', 'Park', 'CCTV'],
    description: 'Triplex villa in a premium gated community near the Outer Ring Road. Home theatre room, private garden, terrace deck and 3-car parking. Possession December 2027.',
  },
  {
    id: 'r106', title: 'Retail Shop on Main Road', purpose: 'rent', type: 'Commercial',
    city: 'Warangal', locality: 'Hanamkonda', price: 35000, area: 600, areaUnit: 'sqft',
    beds: 0, baths: 1, facing: 'West', status: 'Ready to move', postedOn: '2026-10-10',
    amenities: ['Power Backup', 'Car Parking', 'CCTV'],
    description: 'Ground-floor retail space with a 20 ft frontage on a busy main road. Suitable for showroom, clinic or bank branch.',
  },
  {
    id: 'r107', title: '2 BHK Apartment near Temple Road', purpose: 'sale', type: 'Apartment',
    city: 'Tirupati', locality: 'Tiruchanur', price: 5200000, area: 1180, areaUnit: 'sqft',
    beds: 2, baths: 2, facing: 'East', status: 'Ready to move', postedOn: '2026-10-05',
    amenities: ['Lift', 'Car Parking', 'Security', 'Power Backup'],
    description: 'Brand-new 2 BHK in a 40-unit community, 2 km from Sri Padmavathi Ammavari Temple. Vitrified flooring and good ventilation.',
  },
  {
    id: 'r108', title: '1 BHK for Rent, Working Professionals', purpose: 'rent', type: 'Apartment',
    city: 'Hyderabad', locality: 'Madhapur', price: 18000, area: 650, areaUnit: 'sqft',
    beds: 1, baths: 1, facing: 'South', status: 'Ready to move', postedOn: '2026-10-17',
    amenities: ['Lift', 'Power Backup', 'Security', 'Water Supply 24x7'],
    description: 'Fully furnished 1 BHK near Hitech City metro. AC, fridge, washing machine and bed included. Available immediately.',
  },
  {
    id: 'r109', title: '300 Sq Yd Plot near Bhogapuram Airport', purpose: 'sale', type: 'Plot',
    city: 'Visakhapatnam', locality: 'Bhogapuram', price: 6600000, area: 300, areaUnit: 'sq yd',
    beds: 0, baths: 0, facing: 'North', status: 'Ready to register', postedOn: '2026-09-25',
    amenities: ['Gated Community', 'Park', 'CCTV'],
    description: 'VMRDA-approved layout plot near the upcoming international airport. Excellent appreciation potential, 30 ft internal roads.',
  },
  {
    id: 'r110', title: '3 BHK Independent House for Rent', purpose: 'rent', type: 'Independent House',
    city: 'Vijayawada', locality: 'Benz Circle', price: 28000, area: 1800, areaUnit: 'sqft',
    beds: 3, baths: 3, facing: 'East', status: 'Ready to move', postedOn: '2026-10-14',
    amenities: ['Car Parking', 'Borewell', 'Water Supply 24x7'],
    description: 'Independent duplex house in a quiet residential lane near Benz Circle. Car parking and terrace access. Suitable for families.',
  },
  {
    id: 'r111', title: 'Office Space in IT Corridor', purpose: 'sale', type: 'Commercial',
    city: 'Hyderabad', locality: 'Hitech City', price: 27500000, area: 2500, areaUnit: 'sqft',
    beds: 0, baths: 2, facing: 'North', status: 'Ready to move', postedOn: '2026-09-20',
    amenities: ['Lift', 'Power Backup', 'Car Parking', 'Security', 'CCTV'],
    description: 'Bare-shell office space on the 5th floor of a Grade-A building. Currently leased to an IT firm. Good rental yield.',
  },
  {
    id: 'r112', title: '3 BHK Villa in Gated Layout', purpose: 'sale', type: 'Villa',
    city: 'Warangal', locality: 'Kazipet', price: 9800000, area: 2400, areaUnit: 'sqft',
    beds: 3, baths: 4, facing: 'East', status: 'Ready to move', postedOn: '2026-10-01',
    amenities: ['Gated Community', 'Security', 'Park', 'Children Play Area', 'Vastu Compliant'],
    description: 'Vastu-compliant duplex villa with a garden, in a gated layout with a children’s park. Near the railway station and NIT.',
  },
];
