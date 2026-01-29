import { useState, type ChangeEvent } from "react";
import { useEffect } from "react";
import type { Artist } from "../types/Artist";
import { getUserTopArtist } from "../services/api";
import ArtistList from "../components/ArtistList";
import AlbumModal from "../components/AlbumModal";

export default function TopArtists() {

    const [artists, setArtists] = useState<Artist[]>([]);
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
    const [activeRange, setActiveRange] = useState('short_term');
    const [activeLimit, setActiveLimit] = useState(10);

    const ranges = [
        { label: 'Last Month', value: 'short_term'},
        { label: 'Last 6 Months', value: 'medium_term'},
        { label: 'All Time', value: 'long_term'}
    ];

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if(activeLimit > 0 && activeLimit <= 50){
                try {
                    const data = await getUserTopArtist(activeRange, activeLimit);
                    setArtists(data);
                } catch (e) {
                    console.log("Error fetching artists", e);
                }
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [activeRange, activeLimit]);

    const handleLimitChange = (e: ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(e.target.value);
        if(isNaN(val)) val = 0;
        if(val > 50) val = 50;
        setActiveLimit(val);
    }

    return(
        <div className="w-full animate-fade-in-up pb-20 p-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Top Artists
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10">
                <div className="flex bg-neutral-900 p-1 rounded-full border border-neutral-800">
                    {ranges.map((range) => (
                        <button
                            key={range.value}
                            onClick={() => setActiveRange(range.value)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                                activeRange === range.value
                                ? 'bg-green-500 text-black shadow-lg'
                                : 'text-neutral-400 hover:text-white hover:bg-netural-800'
                            }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3 bg-neutral-900 px-4 py-2 rounded-lg border border-neutral-800">
                    <span className="text-neutral-500 text-sm font-bold uppercase tracking-wider">
                        Show:
                    </span>
                    <input 
                        type="number"
                        min="1"
                        max="50"
                        value={activeLimit}
                        onChange={handleLimitChange}
                        className="bg-transparent text-white font-bold text-center w-12 border-b-2 border-neutral-600 focus:border-green-500 focus:outline-none transition-colors"
                    />
                    <span className="text-neutral-400 text-sm">Artists</span>
                </div>
            </div>

            {artists.length > 0 ? (
                <ArtistList 
                    artists={artists} 
                    onArtistClick={(artist) => setSelectedArtist(artist)}
                />
            ) : (
                <div className="text-center mt-20 text-neutral-500 animate-pulse">Loading...</div>
            )}

            {selectedArtist && (
                <AlbumModal 
                    artistId={selectedArtist.id}
                    artistName={selectedArtist.name}
                    onClose={() => setSelectedArtist(null)}
                />
            )}
        </div>
    );
}