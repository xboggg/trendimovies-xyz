"use client";

import Image from "next/image";
import { ExternalLink, Tv, ShoppingCart, DollarSign } from "lucide-react";
import { Section } from "@/components/ui/section";
import type { WatchProviders as WatchProvidersType } from "@/types";

interface WatchProvidersProps {
  providers: WatchProvidersType;
  title: string;
}

export function WatchProviders({ providers, title }: WatchProvidersProps) {
  // Default to US, but could be made dynamic based on user location
  const countryData = providers.results?.US || providers.results?.GB;

  if (!countryData) return null;

  const { flatrate, rent, buy, free, ads, link } = countryData;

  const hasProviders = flatrate || rent || buy || free || ads;

  if (!hasProviders) return null;

  const ProviderSection = ({
    title,
    providers,
    icon: Icon,
  }: {
    title: string;
    providers?: { provider_id: number; provider_name: string; logo_path: string }[];
    icon: typeof Tv;
  }) => {
    if (!providers || providers.length === 0) return null;

    return (
      <div className="mb-6">
        <h4 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {title}
        </h4>
        <div className="flex flex-wrap gap-3">
          {providers.map((provider) => (
            <a
              key={provider.provider_id}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              title={`Watch on ${provider.provider_name}`}
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-800 ring-2 ring-transparent group-hover:ring-red-500 transition-all">
                <Image
                  src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                  alt={provider.provider_name}
                  width={56}
                  height={56}
                  className="object-cover"
                />
              </div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-zinc-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {provider.provider_name}
              </span>
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Section title="Where to Watch" className="mt-12">
      <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
        <div className="flex items-center justify-between mb-6">
          <p className="text-zinc-400 text-sm">
            Available streaming options for <span className="text-white">{title}</span>
          </p>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-400 transition-colors"
            >
              View All Options
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProviderSection title="Stream" providers={flatrate} icon={Tv} />
          <ProviderSection title="Free with Ads" providers={ads || free} icon={Tv} />
          <ProviderSection title="Rent" providers={rent} icon={DollarSign} />
          <ProviderSection title="Buy" providers={buy} icon={ShoppingCart} />
        </div>

        <p className="text-xs text-zinc-500 mt-6 pt-4 border-t border-zinc-800">
          Streaming availability data provided by JustWatch. Availability may vary by region.
        </p>
      </div>
    </Section>
  );
}
