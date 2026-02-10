import { useState, useEffect, type ChangeEvent } from "react";
import type { Artist } from "../types/Artist";
import { getUserTopArtist } from "../services/api";
import ArtistList from "../components/ArtistList";
import AlbumModal from "../components/AlbumModal";
import { ChevronDown, Loader2 } from "lucide-react";

export default function TopArtists() {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

    const [activeRange, setActiveRange] = useState('short_term');
    const [batchSize, setBatchSize] = useState(10);
    
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const ranges = [
        { label: 'Last Month', value: 'short_term'},
        { label: 'Last 6 Months', value: 'medium_term'},
        { label: 'All Time', value: 'long_term'}
    ];

    useEffect(() => {
        setArtists([]);
        setHasMore(true);
        loadArtists(0, batchSize, activeRange, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeRange]);

    const loadArtists = async (offset: number, limit: number, range: string, isReset: boolean) => {
        setLoading(true);
        try {
            const newArtists = await getUserTopArtist(range, limit, offset);
            
            if (newArtists.length < limit) {
                setHasMore(false);
            }

            if (isReset) {
                setArtists(newArtists);
            } else {
                setArtists(prev => [...prev, ...newArtists]);
            }
        } catch (e) {
            console.error("Error fetching artists", e);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        const currentOffset = artists.length;
        loadArtists(currentOffset, batchSize, activeRange, false);
    };

    const handleBatchChange = (e: ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(e.target.value);
        if(isNaN(val)) val = 5;
        if(val > 50) val = 50;
        setBatchSize(val);
    };

    return(
        <div className="w-full animate-fade-in-up pb-20 p-6 max-w-7xl mx-auto">
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10 mt-6">
                
                <div className="flex bg-neutral-900 p-1 rounded-full border border-neutral-800">
                    {ranges.map((range) => (
                        <button
                            key={range.value}
                            onClick={() => setActiveRange(range.value)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                                activeRange === range.value
                                ? 'bg-green-500 text-black shadow-lg'
                                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                            }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 bg-neutral-900 px-4 py-2 rounded-lg border border-neutral-800">
                    <span className="text-neutral-500 text-sm font-bold uppercase tracking-wider">
                        Load:
                    </span>
                    <input 
                        type="number"
                        min="5"
                        max="50"
                        value={batchSize}
                        onChange={handleBatchChange}
                        className="bg-transparent text-white font-bold text-center w-12 border-b-2 border-neutral-600 focus:border-green-500 focus:outline-none transition-colors"
                    />
                    <span className="text-neutral-400 text-sm">Artists</span>
                </div>
            </div>

            {artists.length > 0 ? (
                <>
                    <ArtistList 
                        artists={artists} 
                        onArtistClick={(artist) => setSelectedArtist(artist)}
                    />

                    {hasMore && (
                        <div className="flex justify-center mt-12">
                            <button
                                onClick={handleLoadMore}
                                disabled={loading}
                                className="flex items-center gap-2 px-8 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-neutral-700 hover:border-green-500/50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} /> Loading...
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown size={20} /> Load More Artists
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center mt-20">
                    {loading ? (
                        <Loader2 className="animate-spin mx-auto text-green-500 h-10 w-10" />
                    ) : (
                        <div className="text-neutral-500">No artists found.</div>
                    )}
                </div>
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