export default function Login() {
    const LOGIN_URL = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/spotify`;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-2xl animate-fade-in-up">
                <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-green-800 pb-2">
                    The Stats you worked for
                </h1>

                <p className="text-neutral-400 text-lg md:text-xl font-light">
                    Let us show you the real you.
                </p>

                <a
                    href={LOGIN_URL}
                    className="group relative px-10 py-4 bg-green-500 hover:bg-green-400 text-black font-bold rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]"
                >
                    <span className="relative z-10">Connect with Spotify</span>
                </a>
            </div>
        </div>
    );
}