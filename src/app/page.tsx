import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Budget Triad
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your guide to saving money in the Triad area
          </p>
        </header>

        <main className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🍽️ Kids Eat Free
              </CardTitle>
              <CardDescription>
                Find restaurants where kids eat free today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/kidseatfree">
                  Browse Deals
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🛍️ Shopping Deals
              </CardTitle>
              <CardDescription>
                Coming soon - Local shopping discounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button disabled className="w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎉 Events
              </CardTitle>
              <CardDescription>
                Coming soon - Free and low-cost events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button disabled className="w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
