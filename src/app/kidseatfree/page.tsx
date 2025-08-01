'use client';

import { CitySelector } from "@/components/city-selector";
import { DaySelector } from "@/components/day-selector";
import DealsList from "@/components/deals-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

export default function KidsEatFreePage() {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('');

  // Listen for city changes from localStorage
  useEffect(() => {
    const savedCityStr = localStorage.getItem('selected-city');
    if (savedCityStr) {
      try {
        const savedCity = JSON.parse(savedCityStr);
        setSelectedCity(savedCity.slug);
      } catch (e) {
        console.error('Error parsing saved city:', e);
      }
    }
  }, []);

  // Listen for day changes from localStorage
  useEffect(() => {
    const savedDay = localStorage.getItem('selectedDay');
    if (savedDay) {
      setSelectedDay(savedDay);
    }
  }, []);

  // Listen for localStorage changes to sync state
  useEffect(() => {
    function handleStorageChange() {
      const savedCityStr = localStorage.getItem('selected-city');
      const savedDay = localStorage.getItem('selectedDay');

      if (savedCityStr) {
        try {
          const savedCity = JSON.parse(savedCityStr);
          setSelectedCity(savedCity.slug);
        } catch (e) {
          console.error('Error parsing saved city:', e);
        }
      }

      if (savedDay) {
        setSelectedDay(savedDay);
      }
    }

    // Check for updates every second to catch localStorage changes
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Budget Triad
            </Link>
          </Button>
        </div>

        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Kids Eat Free
          </h1>
          <p className="text-muted-foreground">
            Find today&apos;s kids eat free deals in your city
          </p>
        </header>

        <main>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CitySelector />
              <DaySelector />
            </div>

            {/* Always show deals list */}
            <div className="mt-8">
              <DealsList city={selectedCity} day={selectedDay} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
