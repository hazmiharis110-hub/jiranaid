import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto my-20 p-8 sm:p-10 text-center space-y-6 bg-white rounded-3xl border-3 border-black shadow-[6px_6px_0px_#000]">
      <div className="w-16 h-16 rounded-2xl bg-[#ff90e8] text-black border-2 border-black flex items-center justify-center mx-auto shadow-[3px_3px_0px_#000]">
        <Wrench className="w-8 h-8 stroke-[2.5]" />
      </div>
      <h1 className="text-5xl font-black font-mono text-black">404</h1>
      <h2 className="text-xl font-black text-black">Page Not Found</h2>
      <p className="text-xs sm:text-sm text-neutral-700 font-medium leading-relaxed">
        The tool or page you're searching for does not seem to exist in this neighborhood circle.
      </p>
      <div className="pt-2 flex items-center justify-center gap-3">
        <Link
          to="/"
          className="jn-btn inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black text-white text-xs sm:text-sm font-black border-2 border-black shadow-[3px_3px_0px_#ff90e8] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:bg-neutral-800 transition-all cursor-pointer"
        >
          <Home className="w-4 h-4 stroke-[2.5]" />
          <span>Go Home</span>
        </Link>
        <Link
          to="/items"
          className="jn-btn inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-black bg-[#ffc900] text-black text-xs sm:text-sm font-black hover:bg-[#ffbe00] shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
        >
          <span>Explore Tools</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
