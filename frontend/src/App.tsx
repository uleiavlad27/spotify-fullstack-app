import { useEffect, useState } from "react";
import { type SpotifyUser } from "./types/SpotifyUser";
import { getCurrentUser } from "./services/api";
import UserProfile from "./components/UserProfile";


function App() {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [loading, setLoading] = useState(true);

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

  if(loading) {
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
            <UserProfile user = { user } />
            <div className="text-center mt-12 text-neutral-500">
              You will see your fav songs here
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;