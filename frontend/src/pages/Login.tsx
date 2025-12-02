export default function Login() {

    const LOGIN_URL = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/spotify`;

    return(
        <div className="flex flex-col items-center justify-content mt-20 text-center space-y-8 max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-br from-green-400 to-green-800 pb-2">
              The Stats you worked for
            </h1>

            <p className="text-neutral-400 text-lg px-4">
              Let us show you the real you.
            </p>

            <a
              href={LOGIN_URL}
              className="px-10 py-4 bg-green-500 hover:bg-green-400 text-black font-bold rounded-full text-lg transition transform hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
            >
              Connect with Spotify
            </a>
          </div>
    );
}