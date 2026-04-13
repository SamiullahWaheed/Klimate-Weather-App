import { Card, CardContent } from "./ui/card";
import {
  ArrowDown,
  ArrowUp,
  Droplets,
  Eye,
  Gauge,
  MapPin,
  Wind,
} from "lucide-react";
import type { WeatherData, GeocodingResponse } from "@/api/types";
import { format } from "date-fns";

interface CurrentWeatherProps {
  data: WeatherData;
  locationName?: GeocodingResponse;
}

export function CurrentWeather({ data, locationName }: CurrentWeatherProps) {
  const {
    weather: [currentWeather],
    main: { temp, feels_like, temp_min, temp_max, humidity, pressure },
    wind: { speed, gust },
    coord,
    visibility,
  } = data;

  // Format temperature
  const formatTemp = (temp: number) => `${Math.round(temp)}°`;

  return (
    <Card className="overflow-hidden border-border/70 bg-gradient-to-br from-sky-100/80 via-indigo-100/70 to-cyan-100/80 shadow-sm backdrop-blur-xl dark:border-white/10 dark:from-indigo-500/30 dark:via-sky-500/20 dark:to-cyan-500/20">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Current Conditions
              </p>
              <div>
                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  {locationName?.name ?? data.name}
                  {locationName?.state ? `, ${locationName.state}` : ""}
                </h2>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {locationName?.country ?? data.sys.country} -{" "}
                  {format(new Date(data.dt * 1000), "EEEE, MMM d")}
                </p>
              </div>
              <div className="inline-flex rounded-full border border-sky-300/60 bg-white/70 px-3 py-1 text-sm capitalize text-slate-700 dark:border-white/15 dark:bg-black/20 dark:text-white/90">
                {currentWeather.description}
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-black/20 dark:text-white/90">
              <Eye className="h-4 w-4 text-cyan-300" />
              Visibility {(visibility / 1000).toFixed(1)} km
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
            <div className="space-y-4">
              <div className="flex items-end gap-3">
                <p className="text-7xl font-bold leading-none tracking-tighter md:text-8xl">
                  {formatTemp(temp)}
                </p>
                <div className="space-y-2 pb-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Feels like {formatTemp(feels_like)}
                  </p>
                  <div className="flex gap-3 text-sm font-medium">
                    <span className="flex items-center gap-1 text-blue-300">
                      <ArrowDown className="h-3 w-3" />
                      {formatTemp(temp_min)}
                    </span>
                    <span className="flex items-center gap-1 text-rose-300">
                      <ArrowUp className="h-3 w-3" />
                      {formatTemp(temp_max)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                <div className="rounded-xl border border-slate-200/80 bg-white/65 p-3 dark:border-white/10 dark:bg-black/20">
                  <p className="text-xs text-muted-foreground">Humidity</p>
                  <p className="mt-1 flex items-center gap-1 text-sm font-medium">
                    <Droplets className="h-4 w-4 text-cyan-300" />
                    {humidity}%
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-white/65 p-3 dark:border-white/10 dark:bg-black/20">
                  <p className="text-xs text-muted-foreground">Wind</p>
                  <p className="mt-1 flex items-center gap-1 text-sm font-medium">
                    <Wind className="h-4 w-4 text-cyan-300" />
                    {speed.toFixed(1)} m/s
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-white/65 p-3 dark:border-white/10 dark:bg-black/20">
                  <p className="text-xs text-muted-foreground">Wind Gust</p>
                  <p className="mt-1 text-sm font-medium">
                    {gust ? `${gust.toFixed(1)} m/s` : "N/A"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-white/65 p-3 dark:border-white/10 dark:bg-black/20">
                  <p className="text-xs text-muted-foreground">Pressure</p>
                  <p className="mt-1 flex items-center gap-1 text-sm font-medium">
                    <Gauge className="h-4 w-4 text-cyan-300" />
                    {pressure} hPa
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Coordinates: {coord.lat.toFixed(2)}, {coord.lon.toFixed(2)}
              </p>
            </div>

            <div className="mx-auto flex w-full max-w-[200px] items-center justify-center">
              <img
                src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
                alt={currentWeather.description}
                className="h-full w-full object-contain drop-shadow-[0_0_25px_rgba(125,211,252,0.35)]"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
