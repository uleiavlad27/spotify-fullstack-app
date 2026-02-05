import { Disc3, ExternalLink } from "lucide-react";
import type { AlbumStats } from "../types/AlbumStats";

interface AlbumListProps {
    albums: AlbumStats[];
}


export default function AlbumList({ albums }: AlbumListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lgt:grid-cols-3 xl:grid-cols-4 gap-6">
            {albums.map((album, index) => (
                <a
                    key={index}
                    href={album.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4 flex flex-col 
                                items-center text-center gap-4 hover:bg-netural-800 hover:border-green-500/30
                                transition-all hover:scale-[1.02] hover:shadow-xl group cursor-pointer relative overflow-hidden"
                >
                    <div className="relative w-full aspect-square max-w-[200px] shadow-2xl rounded-lg overflow-hidden">
                        <img
                            src={album.imageUrl}
                            alt={album.albumName}
                            className="w-full h-full object-cover transiotion-transform duration-500 group-hover:scale-110"
                        />
                        <div className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md z-10
                            ${index === 0 ? 'bg-yellow-500 text-black' :
                                index === 1 ? 'bg-gray-300 text-black' :
                                    index === 2 ? 'bg-orange-400 text-black' :
                                        'bg-black/60 text-white backdrop-blur-md border border-white/20'
                            }`}>
                                {index + 1}    
                        </div>
                    </div>

                    <div className="w-full flex flex-col iterms-center">
                            <h3 className="w-full flex flex-col items-center">
                                {album.albumName}
                            </h3>
                            <p className="text-neutral-400 text-sm truncate w-full mb-3">
                                {album.artist}
                            </p>

                            <div className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-400 text-xs px-3 py-1.5 rounded-full border border-green-500/20 font-mono">
                                <Disc3 size={14} />
                                <span className="font-bold">{album.trackCount}</span>
                                <span className="opacity-80">{album.trackCount === 1 ?'song' : 'songs'}</span>
                            </div> 

                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-2 rounded-full backdrop-blur-sm">
                                <ExternalLink size={16} className="text-white" />
                            </div>
                    </div>
                </a>
            ))}
        </div>
    );
}