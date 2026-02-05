import { useEffect, useState, type ChangeEvent } from 'react';
import { type Track } from '../types/Track';
import { getUserTopTracks } from '../services/api';
import TrackList from '../components/TrackList';
import { ChevronDown, Loader2 } from 'lucide-react';

export default function TopTracks() {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [activeRange, setActiveRange] = useState('short_term');
    const [batchSize, setBatchSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const ranges = [
        { label: 'Last Month', value: 'short_term' },
        { label: 'Last 6 Months', value: 'medium_term' },
        { label: 'All Time', value: 'long_term' }
    ];

    useEffect(() => {
        setTracks([]);
        setHasMore(true);
        loadTracks(0, batchSize, activeRange, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeRange]);

    const loadTracks = async (offset: number, limit: number, range: string, isReset: boolean) => {
        setLoading(true);
        try {
            const newTracks = await getUserTopTracks(range, limit, offset);
            if(newTracks.length < limit) {
                setHasMore(false);
            }

            if(isReset) {
                setTracks(newTracks);
            } else {
                setTracks(prev => [...prev, ...newTracks]);
            }
        } catch (error) {
            console.error("Error fetching tracks", error);
        } finally {
            setLoading(false);
        }
    }

    const handleLoadMore = () => {
        const currentOffset = tracks.length;
        loadTracks(currentOffset, batchSize, activeRange, false);
    }

    const handleBatchChange = (e: ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = 5;
        if( val > 50) val = 50;
        setBatchSize(val);
    }



    return (
        <div className="w-full animate-fade-in-up pb-20">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8 mt=6">
                <div className="flex bg-neutral-900 p-1 rounded-full border border-neutral-800">
                    {ranges.map((range) => (
                        <button
                            key={range.value}
                            onClick={() => setActiveRange(range.value)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${activeRange === range.value ? 'bg-green-500 text-black shadow-lg' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3 bg-neutral-900 px-4 py-2 rounded-lg border border-neutral-800" title="Enter number">
                    <span className="text-neutral-500 text-sm font-bold uppercase tracking-wider">Show:</span>
                    <input  
                        type="number"
                        min="1"     
                        max="50" 
                        value={batchSize} 
                        onChange={handleBatchChange} 
                        className="bg-transparent text-white font-bold text-center w-12 border-b-2 border-neutral-600
                                 focus:border-green-500 focus:outline-none transition-colors" />
                    <span className="text-neutral-400 text-sm">more</span>
                </div>
            </div>

           
            {tracks.length > 0 ? (
                <>
                    <TrackList tracks={tracks} />

                    {hasMore && (
                        <div className='flex justify-center mt-8'>
                            <button
                                onClick={handleLoadMore}
                                disabled={loading}
                                className='flex items-center gap-2 px-8 py-3 bg-neutral-800 hover:bg-neutral-700
                                         text-white font-bold rounded-full transition-all hover:scale-105 active:scale-95
                                           disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {loading ? (
                                    <>
                                        <Loader2  className='animate-spin' size={20}/> Loading
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown size={20} /> Load More
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center mt-10 text-neutral-500">Loading... </div>
            )}
        </div>
    );
}