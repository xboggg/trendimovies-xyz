"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Film, Award, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface HistoryEvent {
  id: string;
  year: number;
  title: string;
  description: string;
  event_type: "release" | "award" | "milestone" | "birthday";
  tmdb_movie_id?: number;
  tmdb_tv_id?: number;
  image_url?: string;
}

interface ThisDayInHistoryProps {
  events?: HistoryEvent[];
}

const eventTypeIcons = {
  release: Film,
  award: Award,
  milestone: Star,
  birthday: Calendar,
};

const eventTypeColors = {
  release: "bg-blue-500/20 text-blue-400",
  award: "bg-yellow-500/20 text-yellow-400",
  milestone: "bg-purple-500/20 text-purple-400",
  birthday: "bg-pink-500/20 text-pink-400",
};

export function ThisDayInHistory({ events: initialEvents }: ThisDayInHistoryProps) {
  const [events, setEvents] = useState<HistoryEvent[]>(initialEvents || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(!initialEvents);

  const today = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const formattedDate = `${monthNames[today.getMonth()]} ${today.getDate()}`;

  // Fetch events if not provided
  useEffect(() => {
    if (!initialEvents) {
      fetchTodayEvents();
    }
  }, [initialEvents]);

  async function fetchTodayEvents() {
    try {
      const res = await fetch("/api/engagement/history");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function nextEvent() {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  }

  function prevEvent() {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  }

  if (isLoading) {
    return (
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <div className="animate-pulse">
          <div className="h-4 bg-zinc-800 rounded w-1/2 mb-4"></div>
          <div className="h-20 bg-zinc-800 rounded mb-4"></div>
          <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-red-500" />
          <span className="text-sm font-medium text-red-500 uppercase tracking-wider">
            This Day in History
          </span>
        </div>
        <p className="text-zinc-400 text-sm">No events recorded for today yet.</p>
      </div>
    );
  }

  const currentEvent = events[currentIndex];
  const EventIcon = eventTypeIcons[currentEvent.event_type] || Calendar;

  return (
    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-red-500" />
          <span className="text-sm font-medium text-red-500 uppercase tracking-wider">
            This Day in History
          </span>
        </div>
        <span className="text-sm text-zinc-400">{formattedDate}</span>
      </div>

      {/* Event Card */}
      <div className="relative">
        {/* Navigation arrows */}
        {events.length > 1 && (
          <>
            <button
              onClick={prevEvent}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={nextEvent}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </>
        )}

        {/* Event content */}
        <div className="bg-zinc-800/50 rounded-lg p-4">
          {/* Year badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl font-bold text-white">{currentEvent.year}</span>
            <span
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                eventTypeColors[currentEvent.event_type]
              }`}
            >
              <EventIcon className="w-3 h-3" />
              {currentEvent.event_type}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-white mb-2">
            {currentEvent.title}
          </h3>

          {/* Description */}
          <p className="text-zinc-400 text-sm leading-relaxed mb-3">
            {currentEvent.description}
          </p>

          {/* Link to movie if available */}
          {currentEvent.tmdb_movie_id && (
            <Link
              href={`/movies/${currentEvent.tmdb_movie_id}`}
              className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 text-sm font-medium transition-colors"
            >
              <Film className="w-4 h-4" />
              View Movie Details
            </Link>
          )}
          {currentEvent.tmdb_tv_id && (
            <Link
              href={`/tv/${currentEvent.tmdb_tv_id}`}
              className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 text-sm font-medium transition-colors"
            >
              <Film className="w-4 h-4" />
              View Show Details
            </Link>
          )}
        </div>

        {/* Dots indicator */}
        {events.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-red-500 w-4"
                    : "bg-zinc-600 hover:bg-zinc-500"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 text-center">
        <span className="text-xs text-zinc-500">
          {events.length} event{events.length !== 1 ? "s" : ""} on this day
        </span>
      </div>
    </div>
  );
}
