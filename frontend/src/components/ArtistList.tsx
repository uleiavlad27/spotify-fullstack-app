import type { Artist } from "../types/Artist";


interface ArtistListProps {
    artists: Artist[];
    onArtistClick: (artist: Artist) => void;
}

export default function ArtistList({ artists, onArtistClick } : ArtistListProps){
    return(
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {artists.map((artist, index) => (
                <div 
                    key={artist.id}
                    onClick={() => onArtistClick(artist)}
                    className=" cursor-pointer bg-neutral-900/50 p-4 rounded-xl hover:bg-neutral-800 transition duration-300 group border border-transparent hover:border-green-500/20">
                    <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-lg shadow-lg">
                        <img 
                            src={artist.imageUrl || 'https://spotify.com'}
                            alt={artist.name}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                            {index + 1}
                        </div> 
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white truncate group-hover:text-green-400 transition">
                            {artist.name}
                        </h3>
                        <p className="text-neutral-400 text-sm truncate capitalize">
                            {artist.genres.slice(0, 2).join(', ') || 'Artist'}
                        </p>
                    </div>
                    <a
                        href={artist.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-4 text-center py-2 text-xs font-bold text-black bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    >
                        Spotify
                    </a>
                </div>
            ))}
        </div>
    );
}