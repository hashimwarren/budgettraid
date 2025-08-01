'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin } from 'lucide-react';

interface Deal {
  id: number;
  dayOfWeek: string;
  ruleText: string;
  verified: boolean;
  verifiedAt: string | null;
  restaurant: {
    id: number;
    name: string;
    websiteUrl: string | null;
    lat: number;
    lng: number;
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

interface DealsListProps {
  city?: string;
  day?: string;
}

export default function DealsList({ city, day }: DealsListProps) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDeals() {
      try {
        setLoading(true);
        setError(null);

        // Build query parameters
        const params = new URLSearchParams();
        if (city) params.append('city', city);
        if (day) params.append('day', day);

        const response = await fetch(`/api/deals?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to fetch deals');
        }

        const data = await response.json();
        setDeals(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchDeals();
  }, [city, day]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-red-600 mb-4">Error loading deals: {error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </Card>
    );
  }

  if (deals.length === 0) {
    let message = "No kids eat free deals found";
    if (city && day) {
      message = `No kids eat free deals available for ${day} in ${city.charAt(0).toUpperCase() + city.slice(1).replace('-', ' ')}.`;
    } else if (city) {
      message = `No kids eat free deals available in ${city.charAt(0).toUpperCase() + city.slice(1).replace('-', ' ')}.`;
    } else if (day) {
      message = `No kids eat free deals available for ${day}.`;
    }

    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
        <p className="text-gray-600">
          {message}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {deals.length} deal{deals.length === 1 ? '' : 's'}
          {city && day ? ` for ${day} in ${city.charAt(0).toUpperCase() + city.slice(1).replace('-', ' ')}` :
           city ? ` in ${city.charAt(0).toUpperCase() + city.slice(1).replace('-', ' ')}` :
           day ? ` for ${day}` :
           ' available'}
        </h2>
      </div>

      <div className="space-y-3">
        {deals.map((deal) => (
          <Card key={deal.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              {/* Restaurant name and verified badge */}
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-medium text-gray-900 flex-1">
                  {deal.restaurant.name}
                </h3>
                {deal.verified && (
                  <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                    Verified
                  </Badge>
                )}
              </div>

              {/* Cuisines, city, and day badge */}
              <div className="flex items-center gap-2 flex-wrap">
                {deal.cuisines.map((cuisine) => (
                  <span key={cuisine.id} className="text-sm text-gray-600">
                    {cuisine.name}
                  </span>
                ))}
                {deal.cuisines.length > 0 && <span className="text-gray-400">•</span>}
                {!city && (
                  <>
                    <span className="text-sm text-gray-600">
                      {deal.city.name}
                    </span>
                    <span className="text-gray-400">•</span>
                  </>
                )}
                <Badge variant="outline" className="text-xs">
                  {deal.dayOfWeek}
                </Badge>
              </div>

              {/* Deal rule */}
              {deal.ruleText && (
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                  {deal.ruleText}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                {deal.restaurant.websiteUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex items-center gap-1"
                  >
                    <a
                      href={deal.restaurant.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Website
                    </a>
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex items-center gap-1"
                >
                  <a
                    href={`https://maps.google.com/?q=${deal.restaurant.lat},${deal.restaurant.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="w-3 h-3" />
                    Directions
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
