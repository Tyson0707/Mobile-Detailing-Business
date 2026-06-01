export function ShowcaseBanner() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: "3/1" }}
      aria-label="Photo showcase"
    >
      {/* ── INSERT YOUR MEDIA HERE ────────────────────────────────────────
          Replace the gradient placeholder with your landscape photo or GIF:

          Photo / GIF:
            <img
              src="/showcase.jpg"        ← or /showcase.gif
              alt="Clear Line Auto Detail — professional mobile detailing Calgary"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />

          Looping video clip:
            <video autoPlay muted loop playsInline
              className="absolute inset-0 w-full h-full object-cover object-center">
              <source src="/showcase.mp4" type="video/mp4" />
            </video>

          Then delete the placeholder div below. Keep the edge-fade divs —
          they make the section blend seamlessly with adjacent sections.
      ─────────────────────────────────────────────────────────────────── */}

      {/* Placeholder gradient — remove when media is added */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#060b18] via-[#0d1a35] to-[#060b18]"
      />

      {/* Edge fades — keep these for seamless blending */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#080d1a] to-transparent pointer-events-none z-10" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#080d1a] to-transparent pointer-events-none z-10" />
    </section>
  );
}
