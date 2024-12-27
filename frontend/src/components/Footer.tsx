const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-2xl font-bold text-primary-400">
            Google Map Downloader
          </div>
          <p className="text-gray-400 text-center max-w-2xl">
            A powerful tool to download and manage Google Maps business data.
            Perfect for market research, lead generation, and business analysis.
          </p>
          <div className="text-sm text-gray-400">
            Supported by{' '}
            <a
              href="https://twohundredk.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 transition"
            >
              TwoHundredK Community
            </a>
          </div>
          <div className="text-xs text-gray-500 mt-4">
            © {new Date().getFullYear()} Google Map Downloader. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 