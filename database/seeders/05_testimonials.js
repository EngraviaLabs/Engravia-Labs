/**
 * SEEDER 05 — Testimonials
 * Creates 12 published customer testimonials
 */
const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: String,
  location: String,
  avatar: Object,
  rating: Number,
  title: String,
  text: String,
  productName: String,
  isPublished: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);

const seedTestimonials = async () => {
  await Testimonial.deleteMany({});

  const testimonials = await Testimonial.insertMany([
    {
      name: 'Rahul Mehra',
      location: 'Mumbai, Maharashtra',
      rating: 5,
      title: 'Absolutely stunning — worth every rupee',
      text: 'The craftsmanship exceeded every single expectation I had. Our family name plate has become the centrepiece of our entrance — every guest who visits stops to admire it. The gold engraving on jet-black marble is breathtaking. Delivery was on time, packaging was impeccable. Will definitely order again.',
      productName: 'Premium Black Marble Family Name Plate',
      isPublished: true,
      displayOrder: 1,
    },
    {
      name: 'Priya Kapoor',
      location: 'New Delhi',
      rating: 5,
      title: 'Our office lobby has never looked more prestigious',
      text: 'I ordered a corporate signage for our new office lobby and the result is extraordinary. The quality is unlike anything I\'ve seen — the gold engraving on black marble commands instant attention and communicates exactly the level of professionalism we wanted. Our clients are always impressed.',
      productName: 'Corporate Black Granite Lobby Signage',
      isPublished: true,
      displayOrder: 2,
    },
    {
      name: 'Anand Sharma',
      location: 'Bengaluru, Karnataka',
      rating: 5,
      title: 'A tribute made with heart and soul',
      text: 'The memorial stone we received for my father was crafted with such care, precision, and sensitivity. It brought tears to our eyes. The engraving was flawless, the stone was beautiful, and the packaging was protective and respectful. Truly a piece made with heart. Thank you, Engravia Labs.',
      productName: 'Memorial Stone Scripture',
      isPublished: true,
      displayOrder: 3,
    },
    {
      name: 'Deepika Nair',
      location: 'Kochi, Kerala',
      rating: 5,
      title: 'Quick turnaround and palace-worthy quality',
      text: 'Ordered a house number plate for our new villa. The turnaround was just 4 days — faster than expected. The packaging was impeccable with protective foam, and the stone itself looks like it belongs in a palace. The gold numbers gleam beautifully in sunlight. Highly recommend!',
      productName: 'Villa Entrance Number & Name Plate',
      isPublished: true,
      displayOrder: 4,
    },
    {
      name: 'Vikram Singh',
      location: 'Noida, Uttar Pradesh',
      rating: 5,
      title: 'Best corporate gifts we have ever given',
      text: 'We ordered 25 award plaques for our annual employee recognition ceremony. Every single piece was identical in quality, beautifully engraved, and delivered on time. The employees were genuinely thrilled — many said it was the best award they had ever received. Engravia Labs is now our go-to for all corporate gifting.',
      productName: 'Corporate Achievement Award Plaque',
      isPublished: true,
      displayOrder: 5,
    },
    {
      name: 'Sunita Reddy',
      location: 'Hyderabad, Telangana',
      rating: 5,
      title: 'The Ganesha shloka plaque is divine',
      text: 'Placed this Ganesha shloka plaque at the entrance of our home. The Devanagari engraving is so precise and beautiful — every character is perfect. The gold fill glows warmly in our entrance lighting. Every visitor who sees it asks where we got it. It has become the most talked-about piece in our home.',
      productName: 'Ganesha Shloka Black Marble Plaque',
      isPublished: true,
      displayOrder: 6,
    },
    {
      name: 'Arjun Malhotra',
      location: 'Chandigarh, Punjab',
      rating: 5,
      title: 'Anniversary gift that made her cry happy tears',
      text: 'Gifted the couple name stone to my wife on our 10th anniversary. The moment she opened the box, she had tears in her eyes. The names and date are engraved so elegantly — it\'s now proudly displayed in our living room. The gift packaging itself was luxurious. Worth every paisa.',
      productName: 'Anniversary Couple Name Stone',
      isPublished: true,
      displayOrder: 7,
    },
    {
      name: 'Dr. Kavitha Iyer',
      location: 'Chennai, Tamil Nadu',
      rating: 5,
      title: 'My clinic looks 10x more professional now',
      text: 'Had a clinic signage made with my name, qualification, and specialty. The result is beyond professional — it looks like it belongs in a five-star hospital. My patients frequently compliment the signage. It builds immediate trust and confidence. Extremely happy with the quality and service.',
      productName: 'Premium Doctor Clinic Signage',
      isPublished: true,
      displayOrder: 8,
    },
    {
      name: 'Rohit Agarwal',
      location: 'Jaipur, Rajasthan',
      rating: 5,
      title: 'Our villa entrance is the talk of the neighbourhood',
      text: 'Got the royal family crest name plate made for our newly built bungalow. The size is grand, the engraving is deep and perfectly proportioned, and the finish is flawless. Multiple neighbours have already asked for the contact. Our entrance looks absolutely palatial.',
      productName: 'Royal Family Crest Name Plate',
      isPublished: true,
      displayOrder: 9,
    },
    {
      name: 'Meera Krishnamurthy',
      location: 'Pune, Maharashtra',
      rating: 4,
      title: 'Beautiful quality, slightly delayed delivery',
      text: 'The name plate quality is superb — the marble is genuinely premium and the engraving is sharp and elegant. Only giving 4 stars because delivery took 2 extra days beyond the promised date. But the product itself deserves 5 stars. Would definitely order again.',
      productName: 'Obsidian Single-Line Name Plate',
      isPublished: true,
      displayOrder: 10,
    },
    {
      name: 'Suresh Nambiar',
      location: 'Thiruvananthapuram, Kerala',
      rating: 5,
      title: 'Perfect housewarming gift',
      text: 'Bought this as a housewarming gift for my sister. She was completely blown away — she had never seen anything like it. The motivational quote we chose is engraved flawlessly, the marble is heavy and premium, and the gift box presentation was extremely elegant. 10/10.',
      productName: 'Motivational Quote Wall Plaque',
      isPublished: true,
      displayOrder: 11,
    },
    {
      name: 'Pooja Bhatia',
      location: 'Gurugram, Haryana',
      rating: 5,
      title: 'Engravia Labs is in a class of its own',
      text: 'I have ordered from 3 different stone engraving companies and Engravia Labs is simply in a different league. The stone quality, the depth of engraving, the finish, the packaging, the communication — everything is premium. This is the only place I will order from now on.',
      productName: 'Premium Black Marble Family Name Plate',
      isPublished: true,
      displayOrder: 12,
    },
  ]);

  return testimonials;
};

module.exports = seedTestimonials;
