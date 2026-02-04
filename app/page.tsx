"use client";

import { useMemo, useState } from "react";

export default function Home() {
  const images = useMemo(
    () => [
      "/gallery/1.jpg",
      "/gallery/2.jpg",
      "/gallery/3.jpg",
      "/gallery/4.jpg",
      "/gallery/5.jpg",
      "/gallery/6.jpg",
      "/gallery/7.jpg",
      "/gallery/8.jpg",
    ],
    []
  );

  const IMAGES_PER_PAGE = 3;
  const [page, setPage] = useState(0);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const totalPages = Math.max(
    1,
    Math.ceil(images.length / IMAGES_PER_PAGE)
  );

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () =>
    setPage((p) => Math.min(totalPages - 1, p + 1));

  const visible = images.slice(
    page * IMAGES_PER_PAGE,
    page * IMAGES_PER_PAGE + IMAGES_PER_PAGE
  );

  const openLightbox = (src: string) => {
    const idx = images.indexOf(src);
    setLightboxIndex(idx >= 0 ? idx : 0);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const lightboxPrev = () =>
    setLightboxIndex((i) => (i - 1 + images.length) % images.length);

  const lightboxNext = () =>
    setLightboxIndex((i) => (i + 1) % images.length);

  return (
    <main className="min-h-screen">
      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl"
            onClick={closeLightbox}
          >
            ×
          </button>

          <button
            className="absolute left-4 text-white text-3xl px-3 py-2 bg-black/40 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              lightboxPrev();
            }}
          >
            ‹
          </button>

          <img
            src={images[lightboxIndex]}
            alt="Expanded gallery"
            className="max-h-[85vh] max-w-[92vw] object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />

          <button
            className="absolute right-4 text-white text-3xl px-3 py-2 bg-black/40 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              lightboxNext();
            }}
          >
            ›
          </button>
        </div>
      )}

      {/* Title + Gallery */}
      <section className="py-28 px-6 max-w-6xl mx-auto text-center animate-fadeIn">
        <h1
          className="text-5xl md:text-7xl font-bold mb-4 tracking-[0.18em]"
          style={{ color: "white", fontFamily: "var(--font-heading)" }}
        >
          EBS BARBERS
        </h1>

        <p className="text-white/80 mb-6 tracking-wide">
          Clean fades · Sharp beards · Quality cuts
        </p>

        <div className="mx-auto mb-10 h-[2px] w-24 bg-[#e1a730]" />

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            onClick={prev}
            disabled={page === 0}
            className="px-4 py-2 rounded-xl border border-white/15 bg-black/60 text-white/90 disabled:opacity-40"
          >
            Prev
          </button>

          <div className="text-white/70 text-sm">
            {page + 1} / {totalPages}
          </div>

          <button
            onClick={next}
            disabled={page === totalPages - 1}
            className="px-4 py-2 rounded-xl border border-white/15 bg-black/60 text-white/90 disabled:opacity-40"
          >
            Next
          </button>
        </div>

        {/* 3-image portrait gallery */}
        <div className="mx-auto w-full max-w-[820px]">
          <div className="grid grid-cols-3 gap-[12px]">
            {visible.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => openLightbox(src)}
              >
                <img
                  src={src}
                  alt="EBS Barbers gallery"
                  className="w-full aspect-[3/4] object-cover rounded-[24px] border border-white/10"
                  draggable={false}
                />
              </button>
            ))}
          </div>

          <p className="mt-4 text-white/60 text-sm">
            Tap a photo to expand
          </p>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 px-6 max-w-5xl mx-auto">
        <h2
          className="text-3xl font-bold mb-10 text-center text-white tracking-wider"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Services
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">Skin Fade</div>
          <div className="card">Beard Trim</div>
          <div className="card">Kids Cut</div>
        </div>
      </section>

      {/* Location */}
      <section id="location" className="py-24 px-6 max-w-6xl mx-auto">
        <h2
          className="text-3xl font-bold mb-12 text-center text-white tracking-wider"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Visit Us
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="card">
            <h3 className="text-xl font-semibold mb-3">Address</h3>
            <p className="leading-relaxed">
              6 Wrotham Rd<br />
              Borough Green<br />
              Sevenoaks<br />
              TN15 8DB
            </p>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Opening Hours</h3>
            <ul className="space-y-2">
              <li className="flex justify-between"><span>Monday</span><span>9am – 6pm</span></li>
              <li className="flex justify-between"><span>Tuesday</span><span>9am – 6pm</span></li>
              <li className="flex justify-between"><span>Wednesday</span><span>9am – 6pm</span></li>
              <li className="flex justify-between"><span>Thursday</span><span>9am – 6pm</span></li>
              <li className="flex justify-between"><span>Friday</span><span>9am – 7pm</span></li>
              <li className="flex justify-between"><span>Saturday</span><span>8:30am – 5:30pm</span></li>
              <li className="flex justify-between"><span>Sunday</span><span>10am – 4pm</span></li>
            </ul>
          </div>
        </div>

        <div className="card p-0 overflow-hidden">
          <iframe
            title="EBS Barbers Location"
            src="https://www.google.com/maps?q=6%20Wrotham%20Rd,%20Borough%20Green,%20Sevenoaks%20TN15%208DB&output=embed"
            className="w-full h-[420px] border-0"
            loading="lazy"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/70">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-white/60 text-sm">
            <span>© {new Date().getFullYear()} EBS Barbers. All rights reserved.</span>
            <span>
              Designed by <span style={{ color: "#e1a730" }}>Zempotis</span>.
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
