import { Film } from "lucide-react";

interface PlaceholderImageProps {
  title: string;
  category?: string;
  className?: string;
}

export default function PlaceholderImage({ title, category, className = "" }: PlaceholderImageProps) {
  // Generate a consistent color based on category
  const getCategoryColor = (cat?: string) => {
    switch (cat?.toLowerCase()) {
      case "movies":
        return "from-red-900 to-red-700";
      case "tv":
        return "from-blue-900 to-blue-700";
      case "streaming":
        return "from-purple-900 to-purple-700";
      case "celebrity":
        return "from-amber-900 to-amber-700";
      default:
        return "from-zinc-800 to-zinc-700";
    }
  };

  return (
    <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(category)} flex flex-col items-center justify-center ${className}`}>
      <Film className="w-16 h-16 text-white/30 mb-3" />
      <p className="text-white/50 text-sm text-center px-4 line-clamp-2 max-w-[80%]">
        {title}
      </p>
    </div>
  );
}
