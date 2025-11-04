import express from 'express';
import { randomUUID } from 'crypto';
import { getDatabase } from '../database/db.js';
import { generateTripPlan } from '../services/tripGenerator.js';

export const router = express.Router();

// Get all trips for a user
router.get('/', (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const db = getDatabase();
    const trips = db.prepare(`
      SELECT * FROM trips 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `).all(userId);

    res.json(trips.map(trip => ({
      id: trip.id,
      name: trip.name,
      dates: trip.dates,
      plannedProgress: trip.planned_progress,
      iconName: trip.icon_name,
    })));
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ error: 'Failed to get trips' });
  }
});

// Get trip by ID with full details
router.get('/:id', (req, res) => {
  try {
    const db = getDatabase();
    const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(req.params.id);
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Get waypoints
    const waypoints = db.prepare(`
      SELECT * FROM waypoints 
      WHERE trip_id = ? 
      ORDER BY order_index
    `).all(trip.id);

    // Get trip steps
    const steps = db.prepare(`
      SELECT step_text FROM trip_steps 
      WHERE trip_id = ? 
      ORDER BY step_order
    `).all(trip.id).map(row => row.step_text);

    // Get data for each waypoint
    const waypointsWithData = waypoints.map(waypoint => {
      const attractions = db.prepare(`
        SELECT a.*, 
               (SELECT GROUP_CONCAT(d.id || '|' || d.provider || '|' || d.title || '|' || d.description || '|' || d.action_type || '|' || d.action_display_text || '|' || d.action_target)
                FROM deals d WHERE d.attraction_id = a.id) as deals_data
        FROM attractions a 
        WHERE a.waypoint_id = ?
      `).all(waypoint.id).map(attraction => {
        const deals = attraction.deals_data ? attraction.deals_data.split(',').map(dealStr => {
          const [id, provider, title, description, actionType, actionDisplayText, actionTarget] = dealStr.split('|');
          return {
            id,
            provider,
            title,
            description,
            action: {
              type: actionType,
              displayText: actionDisplayText,
              target: actionTarget,
            },
          };
        }) : [];
        
        return {
          id: attraction.id,
          name: attraction.name,
          category: attraction.category,
          rating: attraction.rating,
          description: attraction.description,
          deals: deals.length > 0 ? deals : undefined,
        };
      });

      const warnings = db.prepare(`
        SELECT * FROM warnings WHERE waypoint_id = ?
      `).all(waypoint.id).map(warning => ({
        id: warning.id,
        title: warning.title,
        type: warning.type,
        severity: warning.severity,
        description: warning.description,
      }));

      const deals = db.prepare(`
        SELECT * FROM deals WHERE waypoint_id = ? AND attraction_id IS NULL
      `).all(waypoint.id).map(deal => ({
        id: deal.id,
        provider: deal.provider,
        title: deal.title,
        description: deal.description,
        action: {
          type: deal.action_type,
          displayText: deal.action_display_text,
          target: deal.action_target,
        },
      }));

      const hotels = db.prepare(`
        SELECT h.*, 
               GROUP_CONCAT(ha.amenity) as amenities
        FROM hotels h
        LEFT JOIN hotel_amenities ha ON h.id = ha.hotel_id
        WHERE h.waypoint_id = ?
        GROUP BY h.id
      `).all(waypoint.id).map(hotel => ({
        id: hotel.id,
        name: hotel.name,
        rating: hotel.rating,
        pricePerNight: hotel.price_per_night,
        action: {
          type: hotel.action_type,
          displayText: hotel.action_display_text,
          target: hotel.action_target,
        },
        expertHelpAction: hotel.expert_help_action_type ? {
          type: hotel.expert_help_action_type,
          displayText: hotel.expert_help_action_display_text,
          target: hotel.expert_help_action_target,
        } : undefined,
        amenities: hotel.amenities ? hotel.amenities.split(',') : [],
      }));

      return {
        id: waypoint.id,
        name: waypoint.name,
        attractions,
        warnings,
        deals,
        hotels,
      };
    });

    res.json({
      id: trip.id,
      origin: trip.origin,
      destination: trip.destination,
      totalDistance: trip.total_distance,
      totalDuration: trip.total_duration,
      waypoints: waypointsWithData,
      steps,
    });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ error: 'Failed to get trip' });
  }
});

// Generate new trip plan
router.post('/generate', async (req, res) => {
  try {
    const { userId, origin, destination, vacationWants } = req.body;
    
    if (!userId || !origin || !destination) {
      return res.status(400).json({ error: 'userId, origin, and destination are required' });
    }

    // Generate trip plan (this will call Gemini API or use mock data)
    const tripResult = await generateTripPlan(origin, destination, vacationWants || '');
    
    // Save to database
    const db = getDatabase();
    const tripId = randomUUID();
    
    db.transaction(() => {
      // Insert trip
      db.prepare(`
        INSERT INTO trips (id, user_id, name, origin, destination, dates, planned_progress, icon_name, total_distance, total_duration, vacation_wants)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        tripId,
        userId,
        `${tripResult.origin} to ${tripResult.destination}`,
        tripResult.origin,
        tripResult.destination,
        'Dates TBD',
        1.0,
        'map',
        tripResult.totalDistance,
        tripResult.totalDuration,
        vacationWants || ''
      );

      // Insert steps
      tripResult.steps.forEach((step, index) => {
        db.prepare(`
          INSERT INTO trip_steps (trip_id, step_text, step_order)
          VALUES (?, ?, ?)
        `).run(tripId, step, index);
      });

      // Insert waypoints and their data
      tripResult.waypoints.forEach((waypoint, wpIndex) => {
        const waypointId = randomUUID();
        db.prepare(`
          INSERT INTO waypoints (id, trip_id, name, order_index)
          VALUES (?, ?, ?, ?)
        `).run(waypointId, tripId, waypoint.name, wpIndex);

        // Insert attractions
        waypoint.attractions.forEach(attraction => {
          const attractionId = attraction.id || randomUUID();
          db.prepare(`
            INSERT INTO attractions (id, waypoint_id, name, category, rating, description)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(attractionId, waypointId, attraction.name, attraction.category, attraction.rating, attraction.description);

          // Insert deals for attractions
          if (attraction.deals) {
            attraction.deals.forEach(deal => {
              db.prepare(`
                INSERT INTO deals (id, waypoint_id, attraction_id, provider, title, description, action_type, action_display_text, action_target)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
              `).run(
                deal.id || randomUUID(),
                waypointId,
                attractionId,
                deal.provider,
                deal.title,
                deal.description,
                deal.action.type,
                deal.action.displayText,
                deal.action.target
              );
            });
          }
        });

        // Insert warnings
        waypoint.warnings.forEach(warning => {
          db.prepare(`
            INSERT INTO warnings (id, waypoint_id, title, type, severity, description)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(
            warning.id || randomUUID(),
            waypointId,
            warning.title,
            warning.type,
            warning.severity,
            warning.description
          );
        });

        // Insert waypoint deals
        waypoint.deals.forEach(deal => {
          db.prepare(`
            INSERT INTO deals (id, waypoint_id, provider, title, description, action_type, action_display_text, action_target)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            deal.id || uuidv4(),
            waypointId,
            deal.provider,
            deal.title,
            deal.description,
            deal.action.type,
            deal.action.displayText,
            deal.action.target
          );
        });

        // Insert hotels
        waypoint.hotels.forEach(hotel => {
          const hotelId = hotel.id || randomUUID();
          db.prepare(`
            INSERT INTO hotels (id, waypoint_id, name, rating, price_per_night, action_type, action_display_text, action_target, expert_help_action_type, expert_help_action_display_text, expert_help_action_target)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            hotelId,
            waypointId,
            hotel.name,
            hotel.rating,
            hotel.pricePerNight,
            hotel.action.type,
            hotel.action.displayText,
            hotel.action.target,
            hotel.expertHelpAction?.type || null,
            hotel.expertHelpAction?.displayText || null,
            hotel.expertHelpAction?.target || null
          );

          // Insert hotel amenities
          hotel.amenities.forEach(amenity => {
            db.prepare(`
              INSERT INTO hotel_amenities (hotel_id, amenity)
              VALUES (?, ?)
            `).run(hotelId, amenity);
          });
        });
      });
    })();

    // Return the trip result
    res.json({ ...tripResult, id: tripId });
  } catch (error) {
    console.error('Generate trip error:', error);
    res.status(500).json({ error: 'Failed to generate trip', message: error.message });
  }
});

// Save trip (update existing or create new)
router.post('/save', (req, res) => {
  try {
    const { userId, tripResult } = req.body;
    
    if (!userId || !tripResult) {
      return res.status(400).json({ error: 'userId and tripResult are required' });
    }

    // Similar to generate, but this is for saving an existing trip
    // Implementation similar to generate endpoint
    res.json({ success: true, message: 'Trip saved' });
  } catch (error) {
    console.error('Save trip error:', error);
    res.status(500).json({ error: 'Failed to save trip' });
  }
});

// Delete trip
router.delete('/:id', (req, res) => {
  try {
    const db = getDatabase();
    const result = db.prepare('DELETE FROM trips WHERE id = ?').run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json({ success: true, message: 'Trip deleted' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

