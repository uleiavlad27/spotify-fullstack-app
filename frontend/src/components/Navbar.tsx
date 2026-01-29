import { Link } from "react-router-dom";
import { logoutUser } from "../services/api";

export default function Navbar() {

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.log("Logout failed", error);
        } finally {
            window.location.href = '/';
        }
    };


    return (
        <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto border-b border-white/10 mb-8">
            <Link to="/" className="text-2xl font-bold cursor-pointer hover:scale-105 transition">
                <span className="text-green-500 text-3xl">stats</span>ify
            </Link>

            <div className="flex items-center gap-6">
                <Link to="/" className=" text-neutral-400 hover:text-white font-medium transition">Top Tracks</Link>
                <Link to="/top-artists" className=" text-neutral-400 hover:text-white font-medium transition">Top Artists</Link>
                <Link to="/albums" className=" text-neutral-400 hover:text-white font-medium transition">Top Albums</Link>
                <button
                    onClick={handleLogout}
                    className="text-sm font-semibold text-black bg-white px-4 py-2 rounded-full hover:bg-neutral-200 transition"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}