import { CitySelector } from "@/components/city-selector";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Kids Eat Free
          </h1>
          <p className="text-muted-foreground">
            Find today's kids eat free deals in your city
          </p>
        </header>

        <main>
          <CitySelector />
        </main>
      </div>
    </div>
  );
}
