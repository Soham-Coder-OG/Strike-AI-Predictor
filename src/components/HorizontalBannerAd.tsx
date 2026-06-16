import React, { useEffect, useRef } from 'react';

export default function HorizontalBannerAd() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if the ad script has already been added to prevent duplicates on re-renders
    if (bannerRef.current && !bannerRef.current.firstChild) {
      const conf = document.createElement('script');
      const script = document.createElement('script');

      conf.type = 'text/javascript';
      conf.innerHTML = `atOptions = {
        'key' : '75a6bf83b0bc64d0e98b4aeafad6096c',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };`;

      script.type = 'text/javascript';
      script.src = 'https://www.highperformanceformat.com/75a6bf83b0bc64d0e98b4aeafad6096c/invoke.js';

      bannerRef.current.append(conf);
      bannerRef.current.append(script);
    }
  }, []);

  return (
    <div className="flex justify-center w-full overflow-hidden my-6">
      <div ref={bannerRef} className="min-w-[728px] min-h-[90px] bg-slate-900/50 rounded flex items-center justify-center border border-slate-800/50">
        {/* Ad will load here */}
      </div>
    </div>
  );
}
