import { GoogleGenerativeAI } from '@google/generative-ai';
import { randomUUID } from 'crypto';

// Warning severity enum (duplicated from frontend types)
const WarningSeverity = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
};

// Generate trip plan - currently uses sample data
// Can be extended to integrate with external APIs for real trip generation
export async function generateTripPlan(origin, destination, vacationWants) {
  // Optional: Integrate with Gemini API or other services for AI-powered trip generation
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  
  if (geminiApiKey) {
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `Generate a detailed road trip plan from ${origin} to ${destination}. ${vacationWants ? `Requirements: ${vacationWants}` : ''}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      // TODO: Parse AI response and convert to TripResult format
      // For now, fall back to sample data
    } catch (error) {
      console.error('Gemini API error:', error);
      // Fall back to sample data
    }
  }
  
  // Sample trip data (can be replaced with AI-generated or database-stored templates)
  const waypoints = [
    {
      id: randomUUID(),
      name: 'Las Vegas, NV',
      attractions: [
        { 
          id: randomUUID(), 
          name: 'The Strip', 
          category: 'Sightseeing', 
          rating: 4.8, 
          description: 'The iconic street with casinos, hotels, and entertainment.', 
          deals: [{
            id: randomUUID(),
            provider: 'Vegas Fun',
            title: '2-for-1 Show Tickets',
            description: 'Get two tickets for the price of one for select shows.',
            action: { type: 'url', displayText: 'Claim Deal', target: '#' }
          }]
        },
        { 
          id: randomUUID(), 
          name: 'High Roller', 
          category: 'Experience', 
          rating: 4.7, 
          description: 'The world\'s tallest observation wheel.' 
        },
      ],
      warnings: [
        { 
          id: randomUUID(), 
          title: 'Extreme Heat', 
          type: 'Weather', 
          severity: WarningSeverity.Medium, 
          description: 'Temperatures can exceed 100°F. Stay hydrated.' 
        },
      ],
      deals: [
        { 
          id: randomUUID(), 
          provider: 'Vegas Fun', 
          title: '2-for-1 Show Tickets', 
          description: 'Get two tickets for the price of one for select shows.', 
          action: { type: 'url', displayText: 'Claim Deal', target: '#' } 
        },
        { 
          id: randomUUID(), 
          provider: 'City Eats', 
          title: '15% off at Celebrity Chef Restaurants', 
          description: 'Enjoy a discount at participating restaurants.', 
          action: { type: 'skill', displayText: 'See Restaurants', target: 'show_restaurants_list' } 
        },
      ],
      hotels: [
        { 
          id: randomUUID(), 
          name: 'The Bellagio', 
          rating: 4.7, 
          pricePerNight: 350, 
          action: { type: 'url', displayText: 'Book Now', target: '#' }, 
          expertHelpAction: { type: 'skill', displayText: 'Expert Help', target: 'contact_hotel_expert' }, 
          amenities: ['Pool', 'Spa', 'Free WiFi', 'Casino'] 
        },
        { 
          id: randomUUID(), 
          name: 'Caesars Palace', 
          rating: 4.6, 
          pricePerNight: 300, 
          action: { type: 'url', displayText: 'Book Now', target: '#' }, 
          expertHelpAction: { type: 'skill', displayText: 'Expert Help', target: 'contact_hotel_expert' }, 
          amenities: ['Pool', 'Restaurant', 'Free WiFi', 'Casino'] 
        },
        { 
          id: randomUUID(), 
          name: 'Excalibur Hotel & Casino', 
          rating: 3.5, 
          pricePerNight: 95, 
          action: { type: 'url', displayText: 'Book Now', target: '#' }, 
          expertHelpAction: { type: 'skill', displayText: 'Expert Help', target: 'contact_hotel_expert' }, 
          amenities: ['Pool', 'Pet-Friendly', 'Casino'] 
        },
      ],
    },
    {
      id: randomUUID(),
      name: 'Grand Canyon National Park, AZ',
      attractions: [
        { 
          id: randomUUID(), 
          name: 'South Rim Trail', 
          category: 'Hiking', 
          rating: 4.9, 
          description: 'A scenic trail with breathtaking views of the canyon.' 
        },
      ],
      warnings: [
        { 
          id: randomUUID(), 
          title: 'Wildlife Sighting', 
          type: 'Animal', 
          severity: WarningSeverity.Low, 
          description: 'Elk and deer are common. Do not feed wildlife.' 
        },
      ],
      deals: [
        { 
          id: randomUUID(), 
          provider: 'Canyon Adventures', 
          title: '10% Off Mule Tours', 
          description: 'Book a mule tour of the canyon rim and save 10%.', 
          action: { type: 'url', displayText: 'Book Tour', target: '#' } 
        },
      ],
      hotels: [
        { 
          id: randomUUID(), 
          name: 'El Tovar Hotel', 
          rating: 4.5, 
          pricePerNight: 400, 
          action: { type: 'url', displayText: 'Book Now', target: '#' }, 
          expertHelpAction: { type: 'skill', displayText: 'Expert Help', target: 'contact_hotel_expert' }, 
          amenities: ['Restaurant', 'Historic', 'Free WiFi'] 
        },
        { 
          id: randomUUID(), 
          name: 'Yavapai Lodge', 
          rating: 3.8, 
          pricePerNight: 220, 
          action: { type: 'url', displayText: 'Book Now', target: '#' }, 
          expertHelpAction: { type: 'skill', displayText: 'Expert Help', target: 'contact_hotel_expert' }, 
          amenities: ['Restaurant', 'Pet-Friendly', 'Free Breakfast'] 
        },
      ],
    }
  ];

  return {
    origin,
    destination,
    totalDistance: '580 miles',
    totalDuration: '9 hours 30 mins',
    waypoints,
    steps: [
      `Start from ${origin}.`,
      'Take I-15 N towards Las Vegas.',
      'Arrive at Las Vegas, NV.',
      'From Las Vegas, take US-93 S to I-40 E.',
      'Take AZ-64 N to Grand Canyon Village.',
      `Arrive at Grand Canyon National Park, AZ.`,
      `Continue on AZ-64 E and other routes towards ${destination}.`,
      `Arrive at your destination: ${destination}.`
    ],
  };
}

