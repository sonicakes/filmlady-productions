export default function DecreePanel() {
  return (
    <section className="relative w-screen h-screen flex-shrink-0 flex items-center justify-center bg-void-2 overflow-hidden">

      {/* Section counter — top right, same position across all panels */}
      <div className="absolute top-10 right-12 font-cinzel text-[0.65rem]
        tracking-[0.25em] text-gold-dim flex flex-col items-center gap-1">
        <span className="text-gold text-[0.8rem]">♛</span>
        <span>I · УКАЗ</span>
      </div>

      {/* Parallax background word — speed and position set via data-speed,
          picked up by the useHorizontalScroll parallax loop */}
      <span
        className="parallax-word absolute font-cormorant font-light
          pointer-events-none select-none whitespace-nowrap
          text-[8rem] text-gold/[0.03] [-webkit-text-stroke:1px_rgba(201,168,76,0.04)]"
        data-speed="0.3"
        style={{ top: '10%', left: '-2%' }}
      >
        МАНИФЕСТ
      </span>

      {/* Two-column grid — stacks to single column on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 w-[85vw] max-w-[1200px] gap-16 md:gap-24 items-center">

        {/* ── Left: manifesto text ── */}
        <div className="relative">
          {/* Large decorative numeral behind the heading */}
          <span className="absolute -top-12 -left-8 font-cormorant font-light
            text-[clamp(5rem,12vw,10rem)] leading-none select-none
            text-void-3 [-webkit-text-stroke:1px_rgba(201,168,76,0.15)]">
            I
          </span>

          <p className="relative font-cinzel text-[0.6rem] tracking-[0.4em] text-gold mb-6">
            The Royal Decree
          </p>

          <h2 className="relative font-cormorant font-light text-parchment leading-[1.2] mb-6"
            style={{ fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)' }}>
            A Pretentious Fake-Royalty<br />
            <em className="italic text-gold">Exiled Russian</em><br />
            Film Critic
          </h2>

          <div className="gold-rule" />

          <p className="font-garamond text-[1.05rem] leading-[1.85] text-parchment-dim">
            Once of St. Petersburg. Now in exile.{' '}
            <strong className="text-parchment font-medium">Film Lady Productions</strong>{' '}
            is a creative platform built on the sacred trinity of criticism,
            performance, and obsessive cinephilia.<br /><br />
            The persona is the criticism. The criticism is the art. Gothic horror,
            prestige drama, and the films that wound you — reviewed with the theatrical
            grandeur they deserve.
          </p>
        </div>

        {/* ── Right: trinity cards ── */}
        <div className="flex flex-col gap-6">
          {[
            {
              pillar: 'Pillar I',
              title:  'The Cinefile Blog',
              desc:   'Written criticism, long-form reviews, the printed word',
            },
            {
              pillar: 'Pillar II',
              title:  'Kino Royale Podcast',
              desc:   'The spoken court, episodic deep dives, audio theatre',
            },
            {
              pillar: 'Pillar III',
              title:  'The Royal Simulator',
              desc:   'Interactive horror scenarios, audience as participant',
            },
          ].map(({ pillar, title, desc }) => (
            <div
              key={pillar}
              data-hoverable
              className="trinity-card border-l border-gold-dim pl-6 py-4"
            >
              <p className="font-cinzel text-[0.55rem] tracking-[0.35em] text-gold-dim mb-1">
                ✦ &nbsp; {pillar}
              </p>
              <p className="font-cormorant text-[1.3rem] text-parchment">
                {title}
              </p>
              <p className="font-garamond text-[0.9rem] italic text-parchment-dim mt-1">
                {desc}
              </p>
            </div>
          ))}

          <div className="gold-rule" />

          <p className="font-garamond text-[0.85rem] italic text-parchment-dim leading-[1.7]">
            "One title. Three formats. The Unholy Trinity."
          </p>
        </div>
      </div>
    </section>
  )
}
