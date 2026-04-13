import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Sunrise,
  Sunset,
  Compass,
  Gauge,
  Cloud,
  Eye,
  Waves,
  Mountain,
} from "lucide-react";
import { format } from "date-fns";
import type { WeatherData } from "@/api/types";

interface WeatherDetailsProps {
  data: WeatherData;
}

export function WeatherDetails({ data }: WeatherDetailsProps) {
  const { wind, main, sys, clouds, visibility } = data;

  // Format time using date-fns
  const formatTime = (timestamp: number) => {
    return format(new Date(timestamp * 1000), "h:mm a");
  };

  // Convert wind degree to direction
  const getWindDirection = (degree: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index =
      Math.round(((degree %= 360) < 0 ? degree + 360 : degree) / 45) % 8;
    return directions[index];
  };

  const details = [
    {
      title: "Sunrise",
      value: formatTime(sys.sunrise),
      icon: Sunrise,
      color: "text-orange-500",
    },
    {
      title: "Sunset",
      value: formatTime(sys.sunset),
      icon: Sunset,
      color: "text-blue-500",
    },
    {
      title: "Wind Direction",
      value: `${getWindDirection(wind.deg)} (${wind.deg}°)`,
      icon: Compass,
      color: "text-green-500",
    },
    {
      title: "Pressure",
      value: `${main.pressure} hPa`,
      icon: Gauge,
      color: "text-purple-500",
    },
    {
      title: "Cloud Cover",
      value: `${clouds.all}%`,
      icon: Cloud,
      color: "text-cyan-500",
    },
    {
      title: "Visibility",
      value: `${(visibility / 1000).toFixed(1)} km`,
      icon: Eye,
      color: "text-emerald-500",
    },
    {
      title: "Sea Level",
      value: main.sea_level ? `${main.sea_level} hPa` : "N/A",
      icon: Waves,
      color: "text-indigo-500",
    },
    {
      title: "Ground Level",
      value: main.grnd_level ? `${main.grnd_level} hPa` : "N/A",
      icon: Mountain,
      color: "text-amber-500",
    },
  ];

  return (
    <Card className="border-border/70 bg-card/70 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      <CardHeader>
        <CardTitle>Atmospheric Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {details.map((detail) => (
            <div
              key={detail.title}
              className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 p-4 dark:border-white/10 dark:bg-black/20"
            >
              <detail.icon className={`h-5 w-5 ${detail.color}`} />
              <div>
                <p className="text-sm font-medium leading-none">
                  {detail.title}
                </p>
                <p className="text-sm text-muted-foreground">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
