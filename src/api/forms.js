// API Simulation Layer for Forms

export const formsAPI = {
  // Attendees
  async submitAttendee(data) {
    const existing = JSON.parse(localStorage.getItem('attendees') || '[]');
    const newEntry = {
      ...data,
      id: Date.now().toString(),
      dateSubmitted: new Date().toISOString()
    };
    const updated = [...existing, newEntry];
    localStorage.setItem('attendees', JSON.stringify(updated));
    return { success: true, data: newEntry };
  },

  async getAttendees() {
    const data = JSON.parse(localStorage.getItem('attendees') || '[]');
    return { success: true, data };
  },

  // Speakers
  async submitSpeaker(data) {
    const existing = JSON.parse(localStorage.getItem('speakers') || '[]');
    const newEntry = {
      ...data,
      id: Date.now().toString(),
      dateSubmitted: new Date().toISOString()
    };
    const updated = [...existing, newEntry];
    localStorage.setItem('speakers', JSON.stringify(updated));
    return { success: true, data: newEntry };
  },

  async getSpeakers() {
    const data = JSON.parse(localStorage.getItem('speakers') || '[]');
    return { success: true, data };
  },

  // Partners
  async submitPartner(data) {
    const existing = JSON.parse(localStorage.getItem('partners') || '[]');
    const newEntry = {
      ...data,
      id: Date.now().toString(),
      dateSubmitted: new Date().toISOString()
    };
    const updated = [...existing, newEntry];
    localStorage.setItem('partners', JSON.stringify(updated));
    return { success: true, data: newEntry };
  },

  async getPartners() {
    const data = JSON.parse(localStorage.getItem('partners') || '[]');
    return { success: true, data };
  }
};

