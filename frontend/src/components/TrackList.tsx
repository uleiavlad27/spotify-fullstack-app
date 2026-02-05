import { type Track } from "../types/Track";
import { ExternalLink } from "lucide-react";

interface TrackListProps {
    tracks: Track[];
}

export default function TrackList({ tracks }: TrackListProps) {
    return (
        <div className="w-full max-w-2xl mx-auto mt-10 px-4">
            <h2 className="text-2xl font-bold text-white mb-6 text-center tracking-wide">
                Top {tracks.length} Tracks
            </h2>

            <div className="space-y-3">
                {tracks.map((track, index) => (
                    <div
                        key={index}
                        className="group flex items-center bg-neutral-900/60 hover:bg-neutral-800 p-3 rounded-lg transition-all border border-transparent hover:border-neutral-700 hover:scale-[1.01]"
                    >
                        <span className="text-neutral-500 font-mono w-8 text-center text-lg group-hover:text-green-500 font-bold">
                            {index + 1}
                        </span>

                        <a
                            href={track.spotifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center flex-1 min-w-0 cursor-pointer group/link"
                        >
                            <div className="relative">
                                <img
                                    src={track.imageUrl || 'https://via.placeholder.com/150'}
                                    alt={track.name}
                                    className="w-12 h-12 rounded shadow-md mx-4 object-cover"
                                />
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <p className="text-white font-semibold truncate transition-colors group-hover:text-green-400">
                                    {track.name}
                                </p>
                                <p className="text-neutral-400 text-sm truncate">
                                    {track.artist} <span className="text-neutral-500">{track.album}</span>
                                </p>
                            </div>
                        </a>

                        <div className="px-3">
                            <a
                                href={track.spotifyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-neutral-700 hover:scale-110 active:scale-95 text-neutral-600 group-hover:text-white"
                                title="Open in Spotify"
                            >
                                <ExternalLink size={24} strokeWidth={1.5} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}