// FIX: Defining all the necessary types for the application.

export interface ActionLink {
    type: 'url' | 'skill';
    displayText: string;
    target: string;
}

export interface Deal {
    id: string;
    provider: string;
    title: string;
    description: string;
    action: ActionLink;
}

export interface Attraction {
    id: string;
    name: string;
    category: string;
    rating: number;
    description: string;
    deals?: Deal[];
}

export enum WarningSeverity {
    Low = 'low',
    Medium = 'medium',
    High = 'high',
}

export interface Warning {
    id: string;
    title: string;
    type: string;
    severity: WarningSeverity;
    description: string;
}

export interface Hotel {
    id: string;
    name: string;
    rating: number;
    pricePerNight: number;
    action: ActionLink;
    expertHelpAction?: ActionLink;
    amenities: string[];
}

export interface Waypoint {
    id: string;
    name: string;
    attractions: Attraction[];
    warnings: Warning[];
    deals: Deal[];
    hotels: Hotel[];
}

export interface TripResult {
    origin: string;
    destination: string;
    totalDistance: string;
    totalDuration: string;
    waypoints: Waypoint[];
    steps: string[];
}

export interface SampleProfile {
    id: string;
    name: string;
    description: string;
    iconName: string;
}

export interface Trip {
    id: string;
    name: string;
    dates: string;
    plannedProgress: number;
    iconName: string;
}

export interface ChatMessage {
    id: string;
    sender: 'ai' | 'user';
    text: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    profilePictureUrl?: string;
}
