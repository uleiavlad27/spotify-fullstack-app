// src/components/UserProfile.tsx
import { type SpotifyUser } from "../types/SpotifyUser";

interface UserProfileProps {
    user: SpotifyUser;
}

export default function UserProfile ({ user } : UserProfileProps){
    const profileImage = user.images?.[0]?.url;

    return(
        <div className="flex flex-col items-center bg-neutral-900/80 p-8 rounded-2xl shadow-2xl backdrop-blur-md border border-white/10 max-w-sm w-full mx-auto mt-10 transition-all hover: scale-105">
            <div className="relative mb-6 group">
                <div className="absolute -inset-1 bg-linear-to-r from-green-400 to-green-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                { profileImage ? (
                    <img
                        src={profileImage}
                        alt={user.display_name}
                        className="relative w-32 h-32 rounded-full object-cover border-4 border-neutral-900 shadow-lg"
                    />
                ) : (
                    <div className="relative w-32 h-32 rounded-full bg-neutral-700 flex items-center justify-center border-4 border-neutral-900">
                        <span className="text-4xl"> Missing </span>
                    </div>
                )}
            </div>

            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                {user.display_name}
            </h1>

            <div className="flex items-center space-x-2 bg-neutral-x-2 bg-neutral-800 px-4 py-1.5 rounded-full mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-neutral-400 text-sm font-medium">{user.email}</span>
            </div>
        </div>
    );
}