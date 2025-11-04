// Sample data constants
// Note: Trips are now loaded from the database via the API
// These constants are kept for reference and potential future use

import type { SampleProfile } from './types';

// Sample profiles for future use (e.g., user preferences)
export const SAMPLE_PROFILES: SampleProfile[] = [
    { id: '1', name: 'Adventure Seeker', description: 'Loves hiking, climbing, and exploring the outdoors.', iconName: 'mountain' },
    { id: '2', name: 'Beach Lover', description: 'Enjoys relaxing on sandy shores and swimming.', iconName: 'beach-umbrella' },
    { id: '3', name: 'Family Vacationer', description: 'Looks for kid-friendly activities and accommodations.', iconName: 'family' },
    { id: '4', name: 'Cultural Explorer', description: 'Interested in museums, history, and local culture.', iconName: 'building-columns' },
];