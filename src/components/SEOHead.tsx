import Script from 'next/script';

export default function SEOHead() {
  return (
    <>
      {/* 結構化數據 */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "SKIN CAKE 肌膚蛋糕",
            "url": "https://skincake.tw",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://skincake.tw/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
    </>
  );
}