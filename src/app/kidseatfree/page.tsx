import { CitySelector } from "@/components/city-selector";
import { DaySelector } from "@/components/day-selector";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function KidsEatFreePage() {
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
            Find today's kids eat free deals in your city
          </p>
        </header>

        <main>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CitySelector />
              <DaySelector />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
