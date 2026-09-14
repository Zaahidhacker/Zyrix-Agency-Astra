const steps = [
  [
    "Find the focus.",
    "We get to know your business, your audience and what your website needs to achieve. You get a clear brief, scope and direction.",
    "DISCOVERY",
  ],
  [
    "Make it yours.",
    "We turn the strategy into content, structure and a distinctive visual direction. You see and shape the design before we build.",
    "DESIGN",
  ],
  [
    "Build it properly.",
    "We develop the website, connect the systems and test across devices. Performance and accessibility are part of the work.",
    "DEVELOPMENT",
  ],
  [
    "Launch. Then evolve.",
    "We put your website live, hand over the tools and show you how to use them. Ongoing improvements are scoped around your needs.",
    "LAUNCH & CARE",
  ],
];
export function Process() {
  return (
    <section id="studio" className="process section-pad">
      <div className="section-kicker mono">
        <span>04 / HOW WE GET THERE</span>
        <span>NO BLACK BOXES.</span>
      </div>
      <div className="process-heading" data-reveal>
        <h2>
          Ambitious work.
          <br />
          <span className="serif">A human process.</span>
        </h2>
        <p>
          You work with the people doing the work.
          <br />
          Clear stages. Honest conversations.
          <br />A website you’re proud to put your name on.
        </p>
      </div>
      <div className="process-steps">
        {steps.map(([title, description, label], i) => (
          <article key={title} data-reveal>
            <div className="process-number">
              0{i + 1}
              <span>↗</span>
            </div>
            <span className="mono">{label}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
      <div className="process-promise mono">
        <span>YOUR CODE. YOUR CONTENT. YOUR WEBSITE.</span>
        <span>BUILT TO BE HANDED OVER.</span>
      </div>
    </section>
  );
}
