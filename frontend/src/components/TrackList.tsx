import { type Track } from "../types/Track";

interface TrackListProps {
    tracks: Track[];
}


export default function TrackList({ tracks }: TrackListProps){
    return(
        <div className="w-full max-w-2xl mx-auto mt-10 px-4">
            <h2 className="text-2xl font-bold text-white mb-6 text-center tracking-wide">
                Top {tracks.length} Tracks
            </h2>

            <div className="space-y-3">
                {tracks.map((track, index) => (
                    <a
                        key={index}
                        href={track.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center bg-neutral-900/60 hover:bg-neutral-800 p-3 rounded-lg transition-all border border-transparent hover:border-neutral-700 hover:scale-[1.01] cursor-pointer"
                    >
                        <span className="text-neutral-500 font-mono w-8 text-center text-lg group-hover:text-green-500 font-bold">
                            {index + 1}
                        </span>

                        <img 
                            src={track.imageUrl}
                            alt={track.name}
                            className="w-12 h-12 rounded shadow-md mx-4 object-cover"
                        />

                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <p className="text-white font-semibold truncate group-hover:text-green-400 transition-colors">
                                {track.name}
                            </p>
                            <p className="text-neutral-400 text-sm truncate">
                                {track.artist} <span className="text-neutral-500">{track.album}</span>
                            </p>
                        </div>
                        <div className="px-3">
                            <svg className="w-6 h-6 text-neutral-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}