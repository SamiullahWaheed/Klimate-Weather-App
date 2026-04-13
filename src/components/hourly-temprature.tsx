import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import type { ForecastData } from "@/api/types";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Sun,
  SunMedium,
} from "lucide-react";

interface HourlyTemperatureProps {
  data: ForecastData;
}

interface ChartData {
  time: string;
  temp: number;
  feels_like: number;
}

interface DailyPreview {
  date: number;
  temp_min: number;
  temp_max: number;
  main: string;
  description: string;
}

export function HourlyTemperature({ data }: HourlyTemperatureProps) {
  // Get today's forecast data and format for chart

  const chartData: ChartData[] = data.list
    .slice(0, 8) // Get next 24 hours (3-hour intervals)
    .map((item) => ({
      time: format(new Date(item.dt * 1000), "ha"),
      temp: Math.round(item.main.temp),
      feels_like: Math.round(item.main.feels_like),
    }));

  const getWeatherIcon = (main: string, description: string) => {
    const normalizedMain = main.toLowerCase();
    const normalizedDescription = description.toLowerCase();

    if (normalizedMain.includes("thunder")) {
      return <CloudLightning className="mx-auto h-8 w-8 text-violet-300" />;
    }
    if (normalizedMain.includes("drizzle")) {
      return <CloudDrizzle className="mx-auto h-8 w-8 text-cyan-300" />;
    }
    if (normalizedMain.includes("rain")) {
      return <CloudRain className="mx-auto h-8 w-8 text-blue-300" />;
    }
    if (normalizedMain.includes("snow")) {
      return <CloudSnow className="mx-auto h-8 w-8 text-slate-200" />;
    }
    if (
      normalizedMain.includes("mist") ||
      normalizedMain.includes("fog") ||
      normalizedMain.includes("haze") ||
      normalizedDescription.includes("smoke")
    ) {
      return <CloudFog className="mx-auto h-8 w-8 text-slate-300" />;
    }
    if (normalizedMain.includes("cloud")) {
      return <Cloud className="mx-auto h-8 w-8 text-slate-200" />;
    }
    if (normalizedMain.includes("clear")) {
      return <Sun className="mx-auto h-8 w-8 text-amber-300" />;
    }

    return <SunMedium className="mx-auto h-8 w-8 text-amber-200" />;
  };

  const upcomingDays = Object.values(
    data.list.reduce((acc, item) => {
      const dateKey = format(new Date(item.dt * 1000), "yyyy-MM-dd");

      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: item.dt,
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          main: item.weather[0].main,
          description: item.weather[0].description,
        };
      } else {
        acc[dateKey].temp_min = Math.min(acc[dateKey].temp_min, item.main.temp_min);
        acc[dateKey].temp_max = Math.max(acc[dateKey].temp_max, item.main.temp_max);
      }

      return acc;
    }, {} as Record<string, DailyPreview>)
  ).slice(0, 7);

  const sevenDayCards = Array.from({ length: 7 }, (_, index) => upcomingDays[index]);

  return (
    <Card className="flex-1 border-border/70 bg-card/70 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      <CardHeader>
        <CardTitle>24-Hour Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="time"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}°`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Temperature
                            </span>
                            <span className="font-bold">
                              {payload[0].value}°
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Feels Like
                            </span>
                            <span className="font-bold">
                              {payload[1].value}°
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <defs>
                <linearGradient id="tempGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
              <Line
                type="monotone"
                dataKey="temp"
                stroke="url(#tempGlow)"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="feels_like"
                stroke="#cbd5e1"
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {sevenDayCards.map((day, index) => {
            const isToday = index === 0;

            if (!day) {
              return (
                <div
                  key={`placeholder-${index}`}
                  className="rounded-2xl border border-dashed border-border/70 bg-muted/40 p-3 text-center dark:border-white/10 dark:bg-black/10"
                >
                  <p className="text-sm font-medium text-muted-foreground">--</p>
                  <Cloud className="mx-auto h-8 w-8 text-muted-foreground/70" />
                  <p className="text-base font-semibold text-muted-foreground">--</p>
                  <p className="text-sm text-muted-foreground">--</p>
                </div>
              );
            }

            return (
              <div
                key={day.date}
                className={`rounded-2xl border p-3 text-center ${
                  isToday
                    ? "border-sky-300/60 bg-sky-100/70 dark:border-white/20 dark:bg-white/10"
                    : "border-border/70 bg-card/60 dark:border-white/10 dark:bg-black/20"
                }`}
              >
                <p className="text-sm font-medium">
                  {format(new Date(day.date * 1000), "EEE")}
                </p>
                {getWeatherIcon(day.main, day.description)}
                <p className="text-base font-semibold">{Math.round(day.temp_max)}°</p>
                <p className="text-sm text-muted-foreground">
                  {Math.round(day.temp_min)}°
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
