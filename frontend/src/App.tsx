import { useEffect, useState} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { type SpotifyUser } from "./types/SpotifyUser";
import { getCurrentUser } from "./services/api";

import Login from "./pages/Login";
import TopTracks from "./pages/TopTracks";
import Navbar from "./components/Navbar";
import UserProfile from "./components/UserProfile";

function App() {

  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [loading, setLoading] = useState(true);

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

  

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-content">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500 selection:black">
      <BrowserRouter>
        {!user ? (
          <Login />
        ) : (
          <>
            <Navbar />
            <main className="container mx-auto px-4">
              <div className="mb-10">
                <UserProfile user={user} />
              </div>

              <Routes>
                <Route path="/" element={<TopTracks />} />
                <Route path="/artists" element={<TopTracks />} />
                <Route path="/albums" element={<TopTracks />} />
              </Routes>
            </main>
          </>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;