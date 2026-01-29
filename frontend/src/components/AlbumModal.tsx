    import { useState, useEffect } from "react";
    import type { Album } from "../types/Album";
    import { getArtistsAlbums } from "../services/api";

    interface AlbumModalProps {
        artistId: string;
        artistName: string;
        onClose: () => void;
    }

    export default function AlbumModal({artistId, artistName, onClose}: AlbumModalProps) {
        const [albums, setAlbums] = useState<Album[]>([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const fetchAlbums = async () => {
                try {
                    const data = await getArtistsAlbums(artistId);
                    setAlbums(data);
                } catch (error) {
                    console.log('Failed to fetch albums', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchAlbums();
        }, [artistId]);

        const handleBackdropClick = (e: React.MouseEvent) => {
            if(e.target == e.currentTarget){
                onClose();
            }
        }

        return(
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
                onClick={handleBackdropClick}
            >
                <div className="bg-neutral-900 border border-neutral-700 w-full max-w-3xl max-h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center p-6 border-b border-neutral-800 bg-neutral-900">
                        <h2 className="text-2xl font-bold text-white">
                            Albums by <span className="text-green-500">{artistName}</span>
                        </h2>
                        <button onClick={onClose} className="text-neutral-400 hover:text-white transition">
                            <span className="text-2xl font-bold">&times;</span>
                        </button>
                    </div>

                    <div className="overflow-y-auto p-6 flex-1">
                        {loading ? (
                            <div className="text-center py-10 text-neutral-500"> Loading albums... </div>
                        ) : albums.length === 0 ? (
                            <div className="text-center py-10 text-neutral-500"> No Albums found.</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {albums.map((album) => (
                                    <div key={album.name} className="bg-neutral-800 p-3 rounded-lg hover:bg-neutral-700 transition group">
                                        <div className="aspect-square mb-3 overflow-hidden rounded-md">
                                            <img 
                                                src={album.imageUrl || "https://spotify.com"}
                                                alt={album.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                            />
                                        </div>
                                        <h3 className="font-bold text-white text-sm truncate" title={album.name}> {album.name}</h3>
                                        <p className="text-neutral-400 text-xs mt-1">{album.releaseDate.split('-')[0]}</p>
                                        <a
                                            href={album.spotifyUrl}
                                            target="_blank"
                                            rel="noopener norefferer"
                                            className="text-xs text-green-500 hover:underline mt-2 inline-block"
                                        >
                                            Listen on Spotify
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }