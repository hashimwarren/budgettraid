// Type definitions for consolidated deals API

export interface ConsolidatedDeal {
  restaurant: {
    id: number;
    name: string;
    websiteUrl: string | null;
    lat: number | null;
    lng: number | null;
  };
  city: {
    id: number;
    name: string;
    slug: string;
  };
  cuisines: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  deals: Array<{
    id: number;
    dayOfWeek: string;
    ruleText: string | null;
    verified: boolean;
    verifiedAt: string | null;
  }>;
}

// Legacy deal interface for backward compatibility
export interface Deal {
  id: number;
  dayOfWeek: string;
  ruleText: string | null;
  verified: boolean;
  verifiedAt: string | null;
  restaurant: {
    id: number;
    name: string;
    websiteUrl: string | null;
    lat: number | null;
    lng: number | null;
  };
  city: {
    id: number;
    name: string;
    slug: string;
  };
  cuisines: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}