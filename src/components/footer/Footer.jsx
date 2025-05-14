import React from 'react';

const Footer = () => {
    

    return (
        <footer className="bg-black text-gray-400 py-4 relative overflow-hidden">
            {/* Glassy blur accent */}
            <div className="absolute top-0 left-1/3 w-80 h-80 bg-purple-500 opacity-10 blur-3xl rounded-full -z-10"></div>

            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                {/* Branding / About */}
                <div className="text-center md:text-left">
                    <h3 className="text-xl font-semibold text-white mb-2">Bookify</h3>
                    <p className="text-sm">Your trusted partner in hotel booking.</p>
                </div>

                {/* Links */}
                <div className="flex gap-6 text-sm">
                    <a href="/terms" className="hover:text-white transition-colors">Terms</a>
                    <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy</a>
                </div>

                {/* Social Icons */}
                
            </div>

            <p className="mt-8 text-center text-md text-gray-500">&copy; {new Date().getFullYear()} Bookify. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
