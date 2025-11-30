import { useEffect, useState, type ChangeEvent } from "react";
import { type SpotifyUser } from "./types/SpotifyUser";
import { getCurrentUser, getUserTopTracks } from "./services/api";
import UserProfile from "./components/UserProfile";
import { type Track } from "./types/Track";
import TrackList from "./components/TrackList";


function App() {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeRange, setActiveRange] = useState('short_term');
  const [activeLimit, setActiveLimit] = useState(10);

  const ranges = [
    { label: 'Last Month', value: 'short_term' },
    { label: 'Last 6 Monthes', value: 'medium_term' },
    { label: 'All Time', value: 'long_term' },

  ]

  const LOGIN_URL = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/spotify`;



  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.debug("User not logged in", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (user && activeLimit > 0 && activeLimit <= 50) {
        try {
          const tracksData = await getUserTopTracks(activeRange, activeLimit);
          setTracks(tracksData);
        } catch (error) {
          console.debug("Error fetching tracks", error);
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [user, activeRange, activeLimit]);

  const handleLimitChange = (e : ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 0;
    if (val > 50) val = 50;
    setActiveLimit(val);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-content">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500 selection:text-black">
      <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto">
        <div className="text-2xl font-bold flex items-center gap-2 cursor-pointer">
          <span className="text-green-500 text-3xl">stats</span>ify
        </div>

        {user && (
          <button
            onClick={() => alert("Logout coming soon")}
            className="text-sm font-semibold text-neutral-400 hover:text-white transition border border-neutral-700 px-4 py-2 rounded-full hover:border-white"
          >
            Logout
          </button>
        )}
      </nav>

      <main className="container mx-auto px-4 py-10 flex flex-col items-center">
        {!user ? (
          <div className="flex flex-col items-center justify-content mt-20 text-center space-y-8 max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-br from-green-400 to-green-800 pb-2">
              The Stats you worked for
            </h1>

            <p className="text-neutral-400 text-lg px-4">
              Let us show you the real you.
            </p>

            <a
              href={LOGIN_URL}
              className="px-10 py-4 bg-green-500 hover:bg-green-400 text-black font-bold rounded-full text-lg transition transform hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
            >
              Connect with Spotify
            </a>
          </div>
        ) : (
          <div className="w-full animate-fade-in-up">
            <UserProfile user={user} />

            { /* RANGE */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-12 mb-8">
              <div className="flex bg-neutral-900 p-1 rounded-full border border-neutral-800">
                {ranges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setActiveRange(range.value)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-bold transition-all duration-300
                      ${activeRange === range.value
                        ? 'bg-green-500 text-black shadow-lg'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                      }
                    `}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              {/* Time Limit */}
              
              <div className="flex items-center gap-3 bg-neutral-900 px-4 py-2 rounded-lg border border-neutral-800">
                <span className="text=neutral-500 text-sm font-bold uppercase tracking-wider">Show:</span>

                <input 
                  type="number"
                  min="1"
                  max="50"
                  value={activeLimit}
                  onChange={handleLimitChange}
                  className="bg-transparent text-white font-bold text-center w-12 border-b-2 border-neutral-600 focus:border-green-500 focus:outline-none transition-colors"
                />

                <span className="text-neutral-400 text-sm"> Songs</span>
              </div>
            </div>

            {/* Song List*/}

            {tracks.length > 0 ? (
              <TrackList tracks={tracks}/>
            ) : (
              <div className="text-center mt-10 text-neutral-500">
                {activeLimit > 0 ? "Loading Songs" : "Pick a number greater than 0"}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;