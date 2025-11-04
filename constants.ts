// FIX: Removed invalid file headers.
// FIX: Defining and exporting sample data and mock trip generation logic.
import { v4 as uuidv4 } from 'uuid';
import type { SampleProfile, Trip, TripResult, Waypoint } from './types';
import { WarningSeverity } from './types';

export const SAMPLE_PROFILES: SampleProfile[] = [
    { id: '1', name: 'Adventure Seeker', description: 'Loves hiking, climbing, and exploring the outdoors.', iconName: 'mountain' },
    { id: '2', name: 'Beach Lover', description: 'Enjoys relaxing on sandy shores and swimming.', iconName: 'beach-umbrella' },
    { id: '3', name: 'Family Vacationer', description: 'Looks for kid-friendly activities and accommodations.', iconName: 'family' },
    { id: '4', name: 'Cultural Explorer', description: 'Interested in museums, history, and local culture.', iconName: 'building-columns' },
];

export const UPCOMING_TRIPS: Trip[] = [
    { id: 't1', name: 'California Coast Road Trip', dates: 'Sep 15-25, 2024', plannedProgress: 0.8, iconName: 'map' },
    { id: 't2', name: 'NYC Culinary Tour', dates: 'Oct 5-10, 2024', plannedProgress: 1.0, iconName: 'fork-knife' },
    { id: 't3', name: 'National Parks Discovery', dates: 'Nov 1-15, 2024', plannedProgress: 0.4, iconName: 'bookmark' },
];

export const generateMockTripResult = (origin: string, destination: string, vacationWants: string): TripResult => {
    const waypoints: Waypoint[] = [
        {
            id: uuidv4(),
            name: 'Las Vegas, NV',
            attractions: [
                { id: uuidv4(), name: 'The Strip', category: 'Sightseeing', rating: 4.8, description: 'The iconic street with casinos, hotels, and entertainment.', deals: [ { id: uuidv4(), provider: 'Vegas Fun', title: '2-for-1 Show Tickets', description: 'Get two tickets for the price of one for select shows.', action: { type: 'url', displayText: 'Claim Deal', target: '#' } }] },
                { id: uuidv4(), name: 'High Roller', category: 'Experience', rating: 4.7, description: 'The world\'s tallest observation wheel.' },
            ],
            warnings: [
                { id: uuidv4(), title: 'Extreme Heat', type: 'Weather', severity: WarningSeverity.Medium, description: 'Temperatures can exceed 100°F. Stay hydrated.' },
            ],
            deals: [
                { id: uuidv4(), provider: 'Vegas Fun', title: '2-for-1 Show Tickets', description: 'Get two tickets for the price of one for select shows.', action: { type: 'url', displayText: 'Claim Deal', target: '#' } },
                { id: uuidv4(), provider: 'City Eats', title: '15% off at Celebrity Chef Restaurants', description: 'Enjoy a discount at participating restaurants.', action: { type: 'skill', displayText: 'See Restaurants', target: 'show_restaurants_list' } },
            ],
            hotels: [
                { id: uuidv4(), name: 'The Bellagio', rating: 4.7, pricePerNight: 350, action: { type: 'url', displayText: 'Book Now', target: '#' }, expertHelpAction: { type: 'skill', displayText: 'Expert Help', target: 'contact_hotel_expert' }, amenities: ['Pool', 'Spa', 'Free WiFi', 'Casino'] },
                { id: uuidv4(), name: 'Caesars Palace', rating: 4.6, pricePerNight: 300, action: { type: 'url', displayText: 'Book Now', target: '#' }, expertHelpAction: { type: 'skill', displayText: 'Expert Help', target: 'contact_hotel_expert' }, amenities: ['Pool', 'Restaurant', 'Free WiFi', 'Casino'] },
                { id: uuidv4(), name: 'Excalibur Hotel & Casino', rating: 3.5, pricePerNight: 95, action: { type: 'url', displayText: 'Book Now', target: '#' }, expertHelpAction: { type: 'skill', displayText: 'Expert Help', target: 'contact_hotel_expert' }, amenities: ['Pool', 'Pet-Friendly', 'Casino'] },
            ],
        },
        {
            id: uuidv4(),
            name: 'Grand Canyon National Park, AZ',
            attractions: [
                { id: uuidv4(), name: 'South Rim Trail', category: 'Hiking', rating: 4.9, description: 'A scenic trail with breathtaking views of the canyon.' },
            ],
            warnings: [
                { id: uuidv4(), title: 'Wildlife Sighting', type: 'Animal', severity: WarningSeverity.Low, description: 'Elk and deer are common. Do not feed wildlife.' },
            ],
            deals: [
                { id: uuidv4(), provider: 'Canyon Adventures', title: '10% Off Mule Tours', description: 'Book a mule tour of the canyon rim and save 10%.', action: { type: 'url', displayText: 'Book Tour', target: '#' } },
            ],
            hotels: [
                { id: uuidv4(), name: 'El Tovar Hotel', rating: 4.5, pricePerNight: 400, action: { type: 'url', displayText: 'Book Now', target: '#' }, expertHelpAction: { type: 'skill', displayText: 'Expert Help', target: 'contact_hotel_expert' }, amenities: ['Restaurant', 'Historic', 'Free WiFi'] },
                { id: uuidv4(), name: 'Yavapai Lodge', rating: 3.8, pricePerNight: 220, action: { type: 'url', displayText: 'Book Now', target: '#' }, expertHelpAction: { type: 'skill', displayText: 'Expert Help', target: 'contact_hotel_expert' }, amenities: ['Restaurant', 'Pet-Friendly', 'Free Breakfast'] },
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
};