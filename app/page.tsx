export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="min-h-screen flex items-center justify-center text-center px-6 bg-black text-white">
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.3em] text-xs opacity-70 mb-4">
            EBS Barbers
          </p>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Clean fades.
            <br />
            Sharp beards.
          </h1>

          <p className="text-base md:text-lg opacity-80 mb-10">
            Premium cuts, attention to detail, and a relaxed barbershop experience.
          </p>

          <a href="#services" className="inline-block px-6 py-3 rounded-md font-semibold bg-amber-300 text-black hover:opacity-90 transition">
            View Services
          </a>
        </div>
      </section>

      <section id="services" className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-10">Services</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl p-6 border border-white/10 bg-white/5">Skin Fade</div>
          <div className="rounded-xl p-6 border border-white/10 bg-white/5">Beard Trim</div>
          <div className="rounded-xl p-6 border border-white/10 bg-white/5">Kids Cut</div>
        </div>
      </section>
    </main>
  );
}
