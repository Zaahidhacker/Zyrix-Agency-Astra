"use client";
import { useState } from "react";
import { updateAssembly } from "@/components/three/story-state";
export function AssemblyLab() {
  const [value, setValue] = useState(30);
  return (
    <section id="lab" className="lab section-pad">
      <div className="section-kicker mono">
        <span>03 / THE WAY WE THINK</span>
        <span>ONE SYSTEM. EVERY DETAIL.</span>
      </div>
      <div className="lab-layout">
        <div className="lab-spatial" aria-hidden="true">
          <span className="mono">ASSEMBLY STUDY — 001</span>
          <span className="lab-cross">+</span>
        </div>
        <div className="lab-copy" data-reveal>
          <h2>
            Great websites
            <br />
            don’t happen
            <br />
            <span className="serif">in pieces.</span>
          </h2>
          <p>
            Strategy, design and development belong in the same conversation. We
            bring them together, so your website feels considered from its first
            impression to its last interaction.
          </p>
          <div className="lab-control">
            <label htmlFor="assembly" className="mono">
              EXPLORE THE ASSEMBLY <output>{value}%</output>
            </label>
            <input
              id="assembly"
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => {
                const v = Number(e.target.value);
                setValue(v);
                updateAssembly(v / 100);
              }}
              aria-describedby="assembly-help"
            />
            <p id="assembly-help">
              Move the slider. See how the parts work together.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
