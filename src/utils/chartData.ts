import { AttendeeFormData, SpeakerFormData, PartnerFormData, DailySubmissionData, CategoryCountData, OccupationDistributionData } from '@/types';

export const getDailySubmissionCounts = (
  attendees: AttendeeFormData[],
  speakers: SpeakerFormData[],
  partners: PartnerFormData[]
): DailySubmissionData[] => {
  const allSubmissions = [
    ...attendees.map(a => ({ date: a.dateSubmitted, type: 'attendees' as const })),
    ...speakers.map(s => ({ date: s.dateSubmitted, type: 'speakers' as const })),
    ...partners.map(p => ({ date: p.dateSubmitted, type: 'partners' as const }))
  ];

  const groupedByDate: Record<string, { count: number; attendees: number; speakers: number; partners: number }> = {};

  allSubmissions.forEach(sub => {
    const date = new Date(sub.date).toISOString().split('T')[0];
    if (!groupedByDate[date]) {
      groupedByDate[date] = { count: 0, attendees: 0, speakers: 0, partners: 0 };
    }
    groupedByDate[date].count++;
    if (sub.type === 'attendees') groupedByDate[date].attendees++;
    if (sub.type === 'speakers') groupedByDate[date].speakers++;
    if (sub.type === 'partners') groupedByDate[date].partners++;
  });

  return Object.entries(groupedByDate)
    .map(([date, counts]) => ({
      date,
      ...counts
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const getTopPartnershipCategories = (partners: PartnerFormData[]): CategoryCountData[] => {
  const categories: Record<string, number> = {};
  
  partners.forEach(p => {
    const category = p.category || 'Other';
    categories[category] = (categories[category] || 0) + 1;
  });

  return Object.entries(categories)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
};

export const getOccupationDistribution = (attendees: AttendeeFormData[]): OccupationDistributionData[] => {
  const occupations: Record<string, number> = {};
  
  attendees.forEach(a => {
    const occupation = a.occupation || 'Other';
    occupations[occupation] = (occupations[occupation] || 0) + 1;
  });

  return Object.entries(occupations)
    .map(([occupation, count]) => ({ occupation, count }))
    .sort((a, b) => b.count - a.count);
};

