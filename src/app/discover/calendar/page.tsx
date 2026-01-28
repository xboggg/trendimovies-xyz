import { Metadata } from "next";
import Link from "next/link";
import { BackToTop } from "./BackToTop";
import { BackToDiscover } from "@/components/common/BackToDiscover";

export const metadata: Metadata = {
  title: "Release Calendar 2026-2027 | TrendiMovies",
  description: "Complete movie release schedule for 2026 and 2027. Find out when your favorite films hit theaters.",
};

export const revalidate = 86400; // Revalidate daily

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Curated list of major theatrical releases for 2026
const SCHEDULE_2026: Record<string, { date: string; title: string; type: "wide" | "limited" | "streaming" }[]> = {
  "January": [
    { date: "January 2", title: "The Plague", type: "limited" },
    { date: "January 2", title: "The Mother and the Bear", type: "limited" },
    { date: "January 2", title: "We Bury the Dead", type: "limited" },
    { date: "January 8", title: "Is This Thing On?", type: "limited" },
    { date: "January 9", title: "All That's Left of You", type: "limited" },
    { date: "January 9", title: "The Chronology of Water", type: "limited" },
    { date: "January 9", title: "Greenland 2: Migration", type: "wide" },
    { date: "January 9", title: "Primate", type: "limited" },
    { date: "January 9", title: "My Neighbor Adolf", type: "limited" },
    { date: "January 9", title: "People We Meet on Vacation", type: "wide" },
    { date: "January 16", title: "28 Years Later: The Bone Temple", type: "wide" },
    { date: "January 16", title: "Charlie the Wonderdog", type: "limited" },
    { date: "January 16", title: "Hamnet", type: "limited" },
    { date: "January 16", title: "All You Need Is Kill", type: "wide" },
    { date: "January 16", title: "Killer Whale", type: "limited" },
    { date: "January 16", title: "A Useful Ghost", type: "limited" },
    { date: "January 23", title: "Clika", type: "limited" },
    { date: "January 23", title: "H is for Hawk", type: "limited" },
    { date: "January 23", title: "Mercy", type: "wide" },
    { date: "January 23", title: "Return to Silent Hill", type: "wide" },
    { date: "January 23", title: "The Testament of Ann Lee", type: "limited" },
    { date: "January 28", title: "The Wrecking Crew", type: "streaming" },
    { date: "January 30", title: "Send Help", type: "limited" },
    { date: "January 30", title: "Shelter", type: "limited" },
    { date: "January 30", title: "Worldbreaker", type: "limited" },
    { date: "January 30", title: "Iron Lung", type: "wide" },
    { date: "January 30", title: "The Love That Remains", type: "limited" },
  ],
  "February": [
    { date: "February 6", title: "Dracula", type: "wide" },
    { date: "February 6", title: "Scarlet", type: "limited" },
    { date: "February 6", title: "The Strangers: Chapter 3", type: "wide" },
    { date: "February 6", title: "Buffalo Kids", type: "limited" },
    { date: "February 6", title: "Jimpa", type: "limited" },
    { date: "February 13", title: "Cold Storage", type: "wide" },
    { date: "February 13", title: "Broken Bird", type: "limited" },
    { date: "February 13", title: "Crime 101", type: "limited" },
    { date: "February 13", title: "GOAT", type: "wide" },
    { date: "February 13", title: "Wuthering Heights", type: "limited" },
    { date: "February 13", title: "The Mortuary Assistant", type: "limited" },
    { date: "February 20", title: "How to Make a Killing", type: "wide" },
    { date: "February 20", title: "I Can Only Imagine 2", type: "wide" },
    { date: "February 20", title: "Psycho Killer", type: "limited" },
    { date: "February 27", title: "Scream 7", type: "wide" },
    { date: "February 27", title: "Dreams", type: "limited" },
    { date: "February 27", title: "Man on the Run", type: "limited" },
  ],
  "March": [
    { date: "March 6", title: "The Bride!", type: "wide" },
    { date: "March 6", title: "Hoppers", type: "wide" },
    { date: "March 6", title: "Dolly", type: "limited" },
    { date: "March 6", title: "Peaky Blinders: The Immortal Man", type: "wide" },
    { date: "March 6", title: "Youngblood", type: "limited" },
    { date: "March 13", title: "The Breadwinner", type: "limited" },
    { date: "March 13", title: "Reminders of Him", type: "wide" },
    { date: "March 20", title: "Project Hail Mary", type: "wide" },
    { date: "March 20", title: "The Pout-Pout Fish", type: "wide" },
    { date: "March 20", title: "Touch Me", type: "limited" },
    { date: "March 27", title: "Ready or Not 2", type: "wide" },
    { date: "March 27", title: "They Will Kill You", type: "limited" },
    { date: "March 27", title: "Alpha", type: "wide" },
    { date: "March 27", title: "Fantasy Life", type: "wide" },
  ],
  "April": [
    { date: "April 3", title: "The Drama", type: "limited" },
    { date: "April 3", title: "The Super Mario Galaxy Movie", type: "wide" },
    { date: "April 3", title: "A Great Awakening", type: "limited" },
    { date: "April 3", title: "The Third Parent", type: "limited" },
    { date: "April 10", title: "You, Me & Tuscany", type: "limited" },
    { date: "April 10", title: "The Yeti", type: "wide" },
    { date: "April 17", title: "The Mummy", type: "wide" },
    { date: "April 17", title: "Normal", type: "limited" },
    { date: "April 24", title: "Michael", type: "wide" },
    { date: "April 24", title: "Apex", type: "limited" },
    { date: "April 24", title: "Mother Mary", type: "limited" },
  ],
  "May": [
    { date: "May 1", title: "Animal Farm", type: "wide" },
    { date: "May 1", title: "The Devil Wears Prada 2", type: "wide" },
    { date: "May 8", title: "Mortal Kombat II", type: "wide" },
    { date: "May 8", title: "The Sheep Detectives", type: "wide" },
    { date: "May 15", title: "Is God Is", type: "limited" },
    { date: "May 15", title: "Obsession", type: "limited" },
    { date: "May 22", title: "I Love Boosters", type: "limited" },
    { date: "May 22", title: "The Mandalorian and Grogu", type: "wide" },
    { date: "May 29", title: "Passenger", type: "wide" },
  ],
  "June": [
    { date: "June 5", title: "Animal Friends", type: "wide" },
    { date: "June 5", title: "Masters of the Universe", type: "wide" },
    { date: "June 5", title: "Power Ballad", type: "limited" },
    { date: "June 12", title: "Disclosure Day", type: "wide" },
    { date: "June 12", title: "Scary Movie 6", type: "wide" },
    { date: "June 19", title: "Girls Like Girls", type: "limited" },
    { date: "June 19", title: "Toy Story 5", type: "wide" },
    { date: "June 26", title: "Jackass 5", type: "wide" },
    { date: "June 26", title: "Supergirl", type: "wide" },
  ],
  "July": [
    { date: "July 1", title: "Minions 3", type: "wide" },
    { date: "July 3", title: "Shiver", type: "limited" },
    { date: "July 3", title: "Young Washington", type: "wide" },
    { date: "July 10", title: "Moana Live-Action", type: "wide" },
    { date: "July 17", title: "Cut Off", type: "limited" },
    { date: "July 17", title: "The Odyssey", type: "wide" },
    { date: "July 24", title: "Evil Dead Burn", type: "wide" },
    { date: "July 31", title: "Spider-Man: Brand New Day", type: "wide" },
  ],
  "August": [
    { date: "August 7", title: "Once Upon A Time in A Cinema", type: "limited" },
    { date: "August 7", title: "Super Troopers 3", type: "wide" },
    { date: "August 14", title: "Flowervale Street", type: "wide" },
    { date: "August 14", title: "PAW Patrol 3: The Dino Movie", type: "wide" },
    { date: "August 21", title: "Mutiny", type: "limited" },
    { date: "August 21", title: "Thread: An Insidious Tale", type: "wide" },
    { date: "August 28", title: "Cliffhanger 2", type: "wide" },
    { date: "August 28", title: "Coyote vs. Acme", type: "wide" },
    { date: "August 28", title: "The Dog Stars", type: "limited" },
  ],
  "September": [
    { date: "September 4", title: "How to Rob a Bank", type: "wide" },
    { date: "September 11", title: "Clayface", type: "wide" },
    { date: "September 11", title: "Sense and Sensibility", type: "limited" },
    { date: "September 18", title: "Practical Magic 2", type: "wide" },
    { date: "September 18", title: "Resident Evil", type: "wide" },
    { date: "September 25", title: "Charlie Harper", type: "limited" },
    { date: "September 25", title: "Forgotten Island", type: "limited" },
  ],
  "October": [
    { date: "October 2", title: "Digger", type: "limited" },
    { date: "October 2", title: "Verity", type: "wide" },
    { date: "October 9", title: "Other Mommy", type: "limited" },
    { date: "October 9", title: "The Social Reckoning", type: "wide" },
    { date: "October 9", title: "Avatar: The Last Airbender", type: "wide" },
    { date: "October 16", title: "Street Fighter", type: "wide" },
    { date: "October 16", title: "Whalefall", type: "limited" },
    { date: "October 23", title: "Remain", type: "limited" },
    { date: "October 30", title: "Shaun the Sheep: The Beast of Mossy Bottom", type: "wide" },
  ],
  "November": [
    { date: "November 6", title: "Archangel", type: "limited" },
    { date: "November 6", title: "Dr. Seuss' The Cat in the Hat", type: "wide" },
    { date: "November 6", title: "Godzilla Minus Zero 2", type: "wide" },
    { date: "November 6", title: "Jimmy", type: "limited" },
    { date: "November 13", title: "Ebenezer: A Christmas Carol", type: "wide" },
    { date: "November 20", title: "The Hunger Games: Sunrise on the Reaping", type: "wide" },
    { date: "November 25", title: "Hexed", type: "limited" },
    { date: "November 25", title: "Meet the Parents 4", type: "wide" },
    { date: "November 26", title: "Narnia", type: "wide" },
  ],
  "December": [
    { date: "December 4", title: "Violent Night 2", type: "wide" },
    { date: "December 11", title: "Jumanji 3", type: "wide" },
    { date: "December 18", title: "Avengers: Doomsday", type: "wide" },
    { date: "December 18", title: "Dune: Part Three", type: "wide" },
    { date: "December 23", title: "The Angry Birds Movie 3", type: "wide" },
    { date: "December 25", title: "Werwulf", type: "wide" },
  ],
};

// Curated list of major theatrical releases for 2027
const SCHEDULE_2027: Record<string, { date: string; title: string; type: "wide" | "limited" | "streaming" }[]> = {
  "January": [
    { date: "January 15", title: "Children of Blood and Bone", type: "wide" },
  ],
  "February": [
    { date: "February 5", title: "Ice Age: Boiling Point", type: "wide" },
    { date: "February 12", title: "K-Pop Movie", type: "wide" },
    { date: "February 12", title: "The Nightingale", type: "wide" },
    { date: "February 19", title: "Star Wars: A New Hope (50th Anniversary)", type: "wide" },
    { date: "February 26", title: "CoComelon: The Movie", type: "wide" },
  ],
  "March": [
    { date: "March 5", title: "Pixar's Gatto", type: "wide" },
    { date: "March 5", title: "The Thomas Crown Affair", type: "wide" },
    { date: "March 12", title: "Buds", type: "wide" },
    { date: "March 19", title: "Sonic the Hedgehog 4", type: "wide" },
    { date: "March 26", title: "Godzilla x Kong: Supernova", type: "wide" },
    { date: "March 26", title: "The Resurrection of the Christ: Part One", type: "wide" },
  ],
  "April": [
    { date: "April 23", title: "F.A.S.T. Movie", type: "wide" },
  ],
  "May": [
    { date: "May 6", title: "The Resurrection of the Christ: Part Two", type: "wide" },
    { date: "May 7", title: "The Legend of Zelda", type: "wide" },
    { date: "May 21", title: "Bad Fairies", type: "wide" },
    { date: "May 28", title: "Star Wars: Starfighter", type: "wide" },
  ],
  "June": [
    { date: "June 11", title: "How to Train Your Dragon 2 [Live-Action]", type: "wide" },
    { date: "June 18", title: "Spider-Man: Beyond the Spider-Verse", type: "wide" },
    { date: "June 30", title: "Shrek 5", type: "wide" },
  ],
  "July": [
    { date: "July 9", title: "Man of Tomorrow", type: "wide" },
    { date: "July 23", title: "A Minecraft Movie 2", type: "wide" },
    { date: "July 30", title: "A Quiet Place Part III", type: "wide" },
  ],
  "August": [
    { date: "August 6", title: "Bluey: The Movie", type: "wide" },
    { date: "August 6", title: "Miami Vice", type: "wide" },
  ],
  "September": [
    { date: "September 3", title: "The Simpsons Movie 2", type: "wide" },
    { date: "September 17", title: "Teenage Mutant Ninja Turtles: Mutant Mayhem 2", type: "wide" },
  ],
  "October": [
    { date: "October 1", title: "The Batman Part II", type: "wide" },
  ],
  "November": [
    { date: "November 5", title: "Margie Clause", type: "wide" },
    { date: "November 19", title: "The Daniels New Movie", type: "wide" },
    { date: "November 19", title: "Gremlins 3", type: "wide" },
    { date: "November 24", title: "Frozen III", type: "wide" },
  ],
  "December": [
    { date: "December 17", title: "Avengers: Secret Wars", type: "wide" },
    { date: "December 17", title: "The Lord of the Rings: The Hunt for Gollum", type: "wide" },
  ],
};

// Get release type label
function getReleaseLabel(type: "wide" | "limited" | "streaming") {
  switch (type) {
    case "wide": return { text: "Wide", color: "text-green-500 font-bold" };
    case "limited": return { text: "Limited", color: "text-yellow-500" };
    case "streaming": return { text: "Streaming", color: "text-blue-500" };
  }
}

export default async function CalendarPage() {
  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <BackToDiscover />
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            2026 SCHEDULE
          </h1>
          <p className="text-zinc-400 text-sm">
            Official release schedule for all upcoming films in the year 2026. We always check & update this list to make sure dates are 100% accurate.
            We also list both wide & limited releases and streaming debuts. If you find any discrepancies or missing films, let us know.
          </p>
        </div>

        {/* Year Navigation */}
        <div className="flex items-center gap-4 mb-6 text-lg">
          <span className="text-zinc-500">2025</span>
          <span className="text-zinc-500">|</span>
          <a href="#year-2026" className="text-red-500 font-bold hover:underline">2026</a>
          <span className="text-zinc-500">|</span>
          <a href="#year-2027" className="text-zinc-400 hover:text-white hover:underline">2027</a>
        </div>

        {/* Month Quick Navigation */}
        <div className="flex flex-wrap gap-x-2 gap-y-1 mb-6 text-sm">
          {MONTHS.map((month, i) => (
            <span key={month}>
              <a href={`#2026-${month}`} className="text-blue-400 hover:text-blue-300 hover:underline">
                {month.slice(0, 3)}
              </a>
              {i < 11 && <span className="text-zinc-600 mx-1">•</span>}
            </span>
          ))}
        </div>

        {/* Legend */}
        <div className="mb-8 text-sm text-zinc-400">
          <span className="text-green-500 font-bold">Bold</span> = Nationwide Release
          <span className="text-zinc-600 mx-2">|</span>
          <span className="text-zinc-400">Non-Bold</span> = Limited or Streaming
        </div>

        <p className="text-xs text-zinc-500 mb-8 italic">
          Release dates subject to change. Click each title for movie info / or a trailer (if available).
        </p>

        {/* 2026 Schedule */}
        <section id="year-2026" className="mb-16">
          {MONTHS.map(month => {
            const movies = SCHEDULE_2026[month];
            if (!movies || movies.length === 0) return null;

            // Group by date
            const groupedByDate: Record<string, typeof movies> = {};
            movies.forEach(movie => {
              if (!groupedByDate[movie.date]) groupedByDate[movie.date] = [];
              groupedByDate[movie.date].push(movie);
            });

            return (
              <div key={month} id={`2026-${month}`} className="mb-8">
                <h2 className="text-red-500 font-bold text-xl mb-4 uppercase">
                  {month} 2026
                </h2>

                {Object.entries(groupedByDate).map(([date, dateMovies]) => {
                  // Get day of week
                  const dateObj = new Date(date + ", 2026");
                  const dayOfWeek = dateObj.toLocaleDateString("en-US", { weekday: "long" });

                  return (
                    <div key={date} className="mb-4">
                      <h3 className="text-white font-semibold mb-1">
                        {date} ({dayOfWeek})
                      </h3>
                      <div className="pl-4 space-y-0.5">
                        {dateMovies.map((movie, idx) => {
                          const label = getReleaseLabel(movie.type);
                          return (
                            <div key={idx} className="text-sm">
                              <Link
                                href={`/search?q=${encodeURIComponent(movie.title)}`}
                                className={`hover:underline ${label.color}`}
                              >
                                {movie.title}
                              </Link>
                              {movie.type !== "wide" && (
                                <span className="text-zinc-500 text-xs ml-1">
                                  ({movie.type === "limited" ? "Limited" : "Streaming"})
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </section>

        {/* Divider */}
        <div className="border-t border-zinc-800 my-12"></div>

        {/* 2027 Schedule */}
        <section id="year-2027">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            2027 SCHEDULE
          </h1>

          <p className="text-zinc-400 text-sm mb-6">
            Official release schedule for all upcoming films in the year 2027. More titles will be added as they are announced.
          </p>

          {/* 2027 Month Quick Navigation */}
          <div className="flex flex-wrap gap-x-2 gap-y-1 mb-8 text-sm">
            {MONTHS.map((month, i) => {
              const hasMovies = SCHEDULE_2027[month] && SCHEDULE_2027[month].length > 0;
              return (
                <span key={month}>
                  {hasMovies ? (
                    <a href={`#2027-${month}`} className="text-blue-400 hover:text-blue-300 hover:underline">
                      {month.slice(0, 3)}
                    </a>
                  ) : (
                    <span className="text-zinc-600">{month.slice(0, 3)}</span>
                  )}
                  {i < 11 && <span className="text-zinc-600 mx-1">•</span>}
                </span>
              );
            })}
          </div>

          {MONTHS.map(month => {
            const movies = SCHEDULE_2027[month];
            if (!movies || movies.length === 0) return null;

            // Group by date
            const groupedByDate: Record<string, typeof movies> = {};
            movies.forEach(movie => {
              if (!groupedByDate[movie.date]) groupedByDate[movie.date] = [];
              groupedByDate[movie.date].push(movie);
            });

            return (
              <div key={month} id={`2027-${month}`} className="mb-8">
                <h2 className="text-red-500 font-bold text-xl mb-4 uppercase">
                  {month} 2027
                </h2>

                {Object.entries(groupedByDate).map(([date, dateMovies]) => {
                  const dateObj = new Date(date + ", 2027");
                  const dayOfWeek = dateObj.toLocaleDateString("en-US", { weekday: "long" });

                  return (
                    <div key={date} className="mb-4">
                      <h3 className="text-white font-semibold mb-1">
                        {date} ({dayOfWeek})
                      </h3>
                      <div className="pl-4 space-y-0.5">
                        {dateMovies.map((movie, idx) => {
                          const label = getReleaseLabel(movie.type);
                          return (
                            <div key={idx} className="text-sm">
                              <Link
                                href={`/search?q=${encodeURIComponent(movie.title)}`}
                                className={`hover:underline ${label.color}`}
                              >
                                {movie.title}
                              </Link>
                              {movie.type !== "wide" && (
                                <span className="text-zinc-500 text-xs ml-1">
                                  ({movie.type === "limited" ? "Limited" : "Streaming"})
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </section>
      </div>

      {/* Back to Top Button */}
      <BackToTop />
    </main>
  );
}
