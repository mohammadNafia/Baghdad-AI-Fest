// API Simulation Layer for Admin

import { formsAPI } from '@/api/forms';

export const adminAPI = {
  async getAllSubmissions() {
    const [attendees, speakers, partners] = await Promise.all([
      formsAPI.getAttendees(),
      formsAPI.getSpeakers(),
      formsAPI.getPartners()
    ]);

    // Create activity log
    const activityLog = [
      ...attendees.data.map(item => ({
        type: 'attendee',
        name: item.name,
        email: item.email,
        timestamp: item.dateSubmitted,
        id: item.id
      })),
      ...speakers.data.map(item => ({
        type: 'speaker',
        name: item.name,
        email: item.email,
        timestamp: item.dateSubmitted,
        id: item.id
      })),
      ...partners.data.map(item => ({
        type: 'partner',
        name: item.organization || item.companyName,
        email: item.email,
        timestamp: item.dateSubmitted,
        id: item.id
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return {
      success: true,
      data: {
        attendees: attendees.data,
        speakers: speakers.data,
        partners: partners.data,
        activityLog
      }
    };
  },

  async getAnalytics() {
    const data = await this.getAllSubmissions();
    
    // Calculate most common occupation
    const occupations = data.data.attendees.map(a => a.occupation).filter(Boolean);
    const occupationCounts = {};
    occupations.forEach(occ => {
      occupationCounts[occ] = (occupationCounts[occ] || 0) + 1;
    });
    const mostCommonOccupation = Object.entries(occupationCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Calculate top partnership category
    const categories = data.data.partners.map(p => p.category || p.partnershipType).filter(Boolean);
    const categoryCounts = {};
    categories.forEach(cat => {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    const topCategory = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return {
      success: true,
      data: {
        totalAttendees: data.data.attendees.length,
        totalSpeakers: data.data.speakers.length,
        totalPartners: data.data.partners.length,
        mostCommonOccupation,
        topPartnershipCategory: topCategory
      }
    };
  }
};

