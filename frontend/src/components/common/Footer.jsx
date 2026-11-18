import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-900 text-white mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🍳</span>
            </div>
            <span className="font-display text-2xl font-bold text-white">CulinaryHub</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            A community-driven recipe platform where food lovers share their culinary creations. 
            Submit your recipes and inspire others to cook something amazing.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-orange-400 mb-3 uppercase text-xs tracking-wider">Explore</h4>
          <ul className="space-y-2">
            {[['/', 'Home'], ['/recipes', 'Browse Recipes'], ['/register', 'Join Community'], ['/login', 'Sign In']].map(([path, label]) => (
              <li key={path}>
                <Link to={path} className="text-gray-400 hover:text-orange-400 text-sm transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-orange-400 mb-3 uppercase text-xs tracking-wider">Categories</h4>
          <ul className="space-y-2">
            {['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'].map(cat => (
              <li key={cat}>
                <Link to={`/recipes?category=${cat}`} className="text-gray-400 hover:text-orange-400 text-sm transition-colors">{cat}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} CulinaryHub. Built with ❤️ using MERN Stack.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
