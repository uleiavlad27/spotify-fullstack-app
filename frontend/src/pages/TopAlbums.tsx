import { Trophy, Loader2, Disc3 } from "lucide-react";
import { getUserTopAlbums } from "../services/api";
import type { AlbumStats } from "../types/AlbumStats";
import { useState, useEffect } from "react";
import AlbumList from "../components/AlbumList";

export default function TopAlbums() {
    const [albums, setAlbums] = useState<AlbumStats[]>([]);
    const [activeRange, setActiveRange] = useState('short_term');
    const [loading, setLoading] = useState(true);

    const ranges = [
       { label: 'Last Month', value: 'short_term'},
       { label: 'Last 6 Months', value: 'medium_term'},
       { label: 'All Time', value: 'long_term'},
    ];

    useEffect(() => {
        getUserTopAlbums(activeRange)
        .then(data => {
            setAlbums(data);
        }).catch(err => {
            console.error("Error fetching albums: ", err);
        }).finally(() => {
            setLoading(false);
        });
    }, [activeRange]);

    const handleRangeChange = (newRange: string) => {
        if(newRange === activeRange) return;

        setLoading(true);
        setActiveRange(newRange); 
    }

    return(
        <div className="w-full max-w-6xl mx-auto mt-10 px-4 animate-fade-in-up pb-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 flex items-center justify-center gap-3 tracking-tight">
                    <Trophy size={32} className="text-yellow-500" />
                    Top Albums
                </h2>

                <div className="inline-flex bg-neutral-900 p-1 rounded-full border border-neutral-800 shadow-lg">
                    {ranges.map((range) => (
                        <button
                            key={range.value}
                            onClick={() => handleRangeChange(range.value)}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${activeRange === range.value 
                                        ? 'bg-green-500 text-black shadow-md transform scale-105'
                                        : 'text-neutral-400 hover:text-white hover:bg-neutral0-800'}`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>

                <p className="text-neutral-500 text-sm mt-4 max-w-lg mx-auto">
                    Calculated based on the freq of tracks in your top list
                </p>
            </div>

            {loading ? (
                <div>
                    <Loader2 className="animate-spin text-green-500 h-12 w-12" />
                </div>
            ) : albums.length > 0 ? (
                <div>
                    <AlbumList albums={albums}/>
                </div>
            ) : (
                <div className="text-center py-20 bg-neutral-900/30 rounded-2xl border border-neutral-800 border-dashed">
                    <Disc3 className="mx-auto h-12 w-12 text-neutral-600 mb-4" />
                    <h3 className="text-lg font-medium text-white">No Albums found</h3>
                </div>
            )}
        </div>
    );
}