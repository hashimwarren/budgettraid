'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin } from 'lucide-react';
import { ConsolidatedDeal } from '@/types/deals';

interface DealsListProps {
  city?: string;
  day?: string;
}

export default function DealsList({ city, day }: DealsListProps) {
  const [deals, setDeals] = useState<ConsolidatedDeal[]>([]);
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
          {deals.length} restaurant{deals.length === 1 ? '' : 's'}
          {city && day ? ` for ${day} in ${city.charAt(0).toUpperCase() + city.slice(1).replace('-', ' ')}` :
           city ? ` in ${city.charAt(0).toUpperCase() + city.slice(1).replace('-', ' ')}` :
           day ? ` for ${day}` :
           ' available'}
        </h2>
      </div>

      <div className="space-y-3">
        {deals.map((consolidatedDeal) => {
          // Check if any deal is verified
          const hasVerifiedDeal = consolidatedDeal.deals.some(deal => deal.verified);
          
          return (
            <Card key={consolidatedDeal.restaurant.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                {/* Restaurant name and verified badge */}
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-medium text-gray-900 flex-1">
                    {consolidatedDeal.restaurant.name}
                  </h3>
                  {hasVerifiedDeal && (
                    <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                      Verified
                    </Badge>
                  )}
                </div>

                {/* Cuisines, city, and day badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  {consolidatedDeal.cuisines.map((cuisine) => (
                    <span key={cuisine.id} className="text-sm text-gray-600">
                      {cuisine.name}
                    </span>
                  ))}
                  {consolidatedDeal.cuisines.length > 0 && <span className="text-gray-400">•</span>}
                  {!city && (
                    <>
                      <span className="text-sm text-gray-600">
                        {consolidatedDeal.city.name}
                      </span>
                      <span className="text-gray-400">•</span>
                    </>
                  )}
                  {/* Show day badges for all deals */}
                  {consolidatedDeal.deals.map((deal) => (
                    <Badge key={deal.id} variant="outline" className="text-xs">
                      {deal.dayOfWeek}
                    </Badge>
                  ))}
                </div>

                {/* Deal rules - show all if they differ, or just one if they're all the same */}
                <div className="space-y-2">
                  {(() => {
                    // Get unique rule texts
                    const uniqueRules = Array.from(new Set(
                      consolidatedDeal.deals
                        .filter(deal => deal.ruleText)
                        .map(deal => deal.ruleText)
                    ));

                    if (uniqueRules.length === 0) {
                      return null;
                    }

                    if (uniqueRules.length === 1) {
                      // Single rule applies to all days
                      return (
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                          {uniqueRules[0]}
                        </p>
                      );
                    } else {
                      // Multiple different rules
                      return consolidatedDeal.deals
                        .filter(deal => deal.ruleText)
                        .map((deal) => (
                          <div key={deal.id} className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                            <div className="font-medium text-gray-900 mb-1">{deal.dayOfWeek}:</div>
                            {deal.ruleText}
                          </div>
                        ));
                    }
                  })()}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  {consolidatedDeal.restaurant.websiteUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex items-center gap-1"
                    >
                      <a
                        href={consolidatedDeal.restaurant.websiteUrl}
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
                    disabled={!consolidatedDeal.restaurant.lat || !consolidatedDeal.restaurant.lng}
                  >
                    <a
                      href={consolidatedDeal.restaurant.lat && consolidatedDeal.restaurant.lng 
                        ? `https://maps.google.com/?q=${consolidatedDeal.restaurant.lat},${consolidatedDeal.restaurant.lng}`
                        : '#'
                      }
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
          );
        })}
      </div>
    </div>
  );
}
