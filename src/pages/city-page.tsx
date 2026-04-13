import { useParams, useSearchParams } from "react-router-dom";
import { useWeatherQuery, useForecastQuery } from "@/hooks/use-weather";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { CurrentWeather } from "../components/current-weather";
import { HourlyTemperature } from "../components/hourly-temprature";
import { WeatherDetails } from "../components/weather-details";
import { WeatherForecast } from "../components/weather-forecast";
import WeatherSkeleton from "../components/loading-skeleton";
import { FavoriteButton } from "@/components/favorite-button";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CityPage() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  const coordinates = { lat, lon };

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const handleRefresh = () => {
    weatherQuery.refetch();
    forecastQuery.refetch();
  };

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load weather data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-card/70 px-5 py-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <div>
          <Button asChild variant="ghost" className="mb-2 -ml-2">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to my location
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {params.cityName}, {weatherQuery.data.sys.country}
          </h1>
          <p className="text-sm text-muted-foreground">
            Deep-dive weather view for this city
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={handleRefresh}
            disabled={weatherQuery.isFetching || forecastQuery.isFetching}
          >
            <RefreshCw
              className={`h-4 w-4 ${
                weatherQuery.isFetching || forecastQuery.isFetching
                  ? "animate-spin"
                  : ""
              }`}
            />
          </Button>
          <FavoriteButton
            data={{ ...weatherQuery.data, name: params.cityName }}
          />
        </div>
      </div>

      <div className="grid gap-6">
        <CurrentWeather data={weatherQuery.data} />
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] items-start">
          <HourlyTemperature data={forecastQuery.data} />
          <WeatherDetails data={weatherQuery.data} />
        </div>
        <WeatherForecast data={forecastQuery.data} />
      </div>
    </div>
  );
}
