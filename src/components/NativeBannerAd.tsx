import React, { useEffect, useRef } from 'react';

export default function NativeBannerAd() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bannerRef.current && !bannerRef.current.querySelector('script')) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl29757926.effectivecpmnetwork.com/68b73149e7de25ff3315c3e23b6b85ef/invoke.js';
      
      bannerRef.current.append(script);
    }
  }, []);

  return (
    <div className="flex justify-center w-full my-6">
      <div 
        id="container-68b73149e7de25ff3315c3e23b6b85ef" 
        ref={bannerRef}
        className="w-full max-w-4xl min-h-[100px] bg-slate-900/30 rounded-xl flex items-center justify-center"
      >
        {/* Adsterra Native Banner will load here */}
      </div>
    </div>
  );
}
