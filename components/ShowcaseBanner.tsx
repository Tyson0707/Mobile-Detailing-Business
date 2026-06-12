export function ShowcaseBanner() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: "3/1" }}
      aria-label="Photo showcase"
    >
      <img
        src="/showcase.jpg"
        alt="Tyson scrubbing the exterior of a vehicle — Clear Line Auto Detail"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Edge fades — keep these for seamless blending */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#080d1a] to-transparent pointer-events-none z-10" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#080d1a] to-transparent pointer-events-none z-10" />
    </section>
  );
}
