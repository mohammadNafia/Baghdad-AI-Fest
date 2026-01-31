/**
 * Supabase Mock for Testing
 */

export const createMockSupabase = () => {
  const mockData: Record<string, any[]> = {
    attendees: [],
    speakers: [],
    partners: [],
    site_settings: [],
    users: [],
  };

  const mockSupabase = {
    from: (table: string) => ({
      select: (columns?: string, options?: any) => {
        if (options?.head && options?.count === 'exact') {
          // Count query
          return {
            data: null,
            count: mockData[table]?.length || 0,
            error: null,
          };
        }
        return {
          data: mockData[table] || [],
          error: null,
          eq: (column: string, value: any) => ({
            data: (mockData[table] || []).filter((item: any) => item[column] === value),
            error: null,
            single: () => {
              const found = (mockData[table] || []).find((item: any) => item[column] === value);
              if (!found) {
                return {
                  data: null,
                  error: { code: 'PGRST116', message: 'No rows found' },
                };
              }
              return { data: found, error: null };
            },
            select: (cols?: string) => ({
              data: (mockData[table] || []).filter((item: any) => item[column] === value),
              error: null,
            }),
          }),
          order: (column: string, options?: any) => ({
            data: [...(mockData[table] || [])].sort((a, b) => {
              if (options?.ascending === false) {
                return a[column] > b[column] ? -1 : 1;
              }
              return a[column] < b[column] ? -1 : 1;
            }),
            error: null,
          }),
        };
      },
      insert: (values: any) => {
        const newItem = {
          ...values,
          id: `mock-id-${Date.now()}-${Math.random()}`,
          created_at: new Date().toISOString(),
        };
        mockData[table].push(newItem);
        return {
          data: [newItem],
          error: null,
          select: () => ({
            data: [newItem],
            error: null,
            single: () => ({ data: newItem, error: null }),
          }),
        };
      },
      update: (values: any) => ({
        data: null,
        error: null,
        eq: (column: string, value: any) => {
          const index = (mockData[table] || []).findIndex((item: any) => item[column] === value);
          if (index !== -1) {
            mockData[table][index] = { ...mockData[table][index], ...values };
            return {
              data: [mockData[table][index]],
              error: null,
              select: () => ({
                data: [mockData[table][index]],
                error: null,
                single: () => ({ data: mockData[table][index], error: null }),
              }),
            };
          }
          return {
            data: null,
            error: { code: 'PGRST116', message: 'No rows found' },
          };
        },
      }),
      upsert: (values: any, options?: any) => {
        const existingIndex = (mockData[table] || []).findIndex(
          (item: any) => item.key === values.key
        );
        const newItem = {
          ...values,
          updated_at: new Date().toISOString(),
        };
        if (existingIndex !== -1) {
          mockData[table][existingIndex] = newItem;
        } else {
          mockData[table].push(newItem);
        }
        return {
          data: [newItem],
          error: null,
          select: () => ({
            data: [newItem],
            error: null,
            single: () => ({ data: newItem, error: null }),
          }),
        };
      },
    }),
    auth: {
      signInWithPassword: async (credentials: { email: string; password: string }) => {
        const user = mockData.users.find(
          (u: any) => u.email === credentials.email && u.password === credentials.password
        );
        if (user) {
          return {
            data: { user: { id: user.id, email: user.email } },
            error: null,
          };
        }
        return {
          data: { user: null },
          error: { message: 'Invalid login credentials' },
        };
      },
      signOut: async () => ({ error: null }),
      getUser: async () => ({
        data: { user: null },
        error: null,
      }),
      getSession: async () => ({
        data: { session: null },
        error: null,
      }),
      onAuthStateChange: () => ({
        data: { subscription: null },
        unsubscribe: () => {},
      }),
    },
  };

  return {
    mockSupabase,
    mockData,
    reset: () => {
      Object.keys(mockData).forEach((key) => {
        mockData[key] = [];
      });
    },
  };
};
