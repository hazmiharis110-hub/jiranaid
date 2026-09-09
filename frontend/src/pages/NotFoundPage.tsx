import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto my-20 p-8 text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-[#ede7db] text-[#c86d51] flex items-center justify-center mx-auto">
        <Wrench className="w-8 h-8 stroke-[1.8]" />
      </div>
      <h1 className="text-3xl font-black text-[#24211d]">404</h1>
      <h2 className="text-lg font-bold text-[#4e4a43]">Page Not Found</h2>
      <p className="text-xs sm:text-sm text-[#67635c] leading-relaxed">
        The tool or page you're searching for does not seem to exist in this neighborhood circle.
      </p>
      <div className="pt-2 flex items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#24211d] text-white text-xs font-bold shadow-xs hover:bg-black transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Go Home</span>
        </Link>
        <Link
          to="/items"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-[#24211d] text-xs font-bold hover:bg-[#f4efe6] transition-all"
        >
          <span>Explore Tools</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
