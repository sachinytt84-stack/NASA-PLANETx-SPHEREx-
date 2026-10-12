import React, { useState } from 'react';
import { Shield, Sparkles, Layers, ThermometerSnowflake, Eye, Cpu } from 'lucide-react';

export const TelescopeVisualizer: React.FC<{ plainEnglishMode: boolean }> = () => {
  const [selectedPart, setSelectedPart] = useState<string>('shields');

  const parts = [
    {
      id: 'shields',
      name: 'Triple Photon Shields',
      analogy: 'Three Nested Beach Umbrellas',
      icon: Shield,
      temperature: '-350°F (-210°C) passively',
      description: 'Three concentric conical aluminum shields that reflect away heat radiation from the Sun and Earth, maintaining cryogenic temperatures without heavy liquid helium tanks.',
      plainEnglish: 'Three giant shiny cones shield the camera like nested umbrellas at the beach. They bounce sunlight and Earth warmth straight into empty space, keeping the telescope freezing cold for free!'
    },
    {
      id: 'filters',
      name: '102-Color Rainbow Filters',
      analogy: 'A Prism with 102 Colors',
      icon: Eye,
      temperature: '80 Kelvin (-315°F)',
      description: 'Linear Variable Filters (LVF) mounted on two focal plane arrays with six Hawaii-2RG detectors, splitting infrared light from 0.75 to 5.0 micrometers.',
      plainEnglish: 'Special glass filters that gradually change shades like a rainbow. When infrared light hits them, the telescope measures 102 specific colors, creating chemical fingerprints of water, ice, and star dust.'
    },
    {
      id: 'optics',
      name: '20cm Wide-Angle Telescope',
      analogy: 'Ultra-Wide Panoramic Camera',
      icon: Layers,
      temperature: 'All-aluminum cryogenic mirror',
      description: 'A wide-field all-aluminum off-axis reflective telescope (20 cm aperture, 3.5° x 11.3° field of view) optimized for wide sky scans rather than narrow point-and-stare observing.',
      plainEnglish: 'While telescopes like James Webb zoom into a tiny pinprick of space, SPHEREx uses an ultra-wide angle mirror to photograph giant swaths of the sky at once, scanning the entire cosmos in two years.'
    },
    {
      id: 'radiator',
      name: 'V-Groove Thermal Radiators',
      analogy: 'Cosmic Heat Reflectors',
      icon: ThermometerSnowflake,
      temperature: 'Deep Space Heat Sink',
      description: 'V-shaped specular aluminum thermal fins that intercept residual spacecraft bus heat and bounce it directly into dark space.',
      plainEnglish: 'Special V-shaped mirrors that catch any warmth escaping from the spacecraft computers and bounce it harmlessly out into the black void of space before it can warm up the camera.'
    },
    {
      id: 'bus',
      name: 'Spacecraft Bus & Solar Wing',
      analogy: 'The Spacecraft Body & Power Plant',
      icon: Cpu,
      temperature: 'Room temperature electronics',
      description: 'Built by BAE Systems Space & Mission Systems (formerly Ball Aerospace), providing reaction wheel stabilization, high-rate Ka-band communications, and continuous solar power.',
      plainEnglish: 'The computer, radio, batteries, and solar panels that power the observatory and keep it pointing safely at the sky, always positioned so the solar wings face the Sun while the telescope looks outward.'
    }
  ];

  const active = parts.find(p => p.id === selectedPart) || parts[0];
  const IconComponent = active.icon;

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase text-sky-800 tracking-wider">
            Spacecraft Anatomy
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-950 mt-1">
            Inside the SPHEREx Space Observatory
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Click any component to inspect how it works
        </span>
      </div>

      {/* Selector pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {parts.map(p => {
          const isSelected = p.id === selectedPart;
          const PIcon = p.icon;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPart(p.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-50 border border-slate-200 shadow-2xs'
              }`}
            >
              <PIcon className="w-3.5 h-3.5" />
              <span>{p.name}</span>
            </button>
          );
        })}
      </div>

      {/* Part Details Box */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 rounded-2xl bg-slate-50/80 border border-slate-200">
        <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200/90 text-center space-y-3 shadow-2xs">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
            <IconComponent className="w-8 h-8" />
          </div>
          <div>
            <div className="font-mono text-xs text-amber-800 font-bold">
              Everyday Nickname:
            </div>
            <div className="text-sm font-bold text-slate-950 mt-0.5">
              "{active.analogy}"
            </div>
          </div>
          <div className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-700 font-semibold">
            {active.temperature}
          </div>
        </div>

        <div className="md:col-span-8 space-y-4">
          <div>
            <h4 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
              {active.name}
            </h4>
            <div className="text-xs text-slate-500 font-mono mt-0.5">
              Caltech / JPL / BAE Systems Flight Hardware
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200/80 text-amber-950 space-y-1 shadow-2xs">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              In Simple Everyday Words:
            </span>
            <p className="text-xs sm:text-sm leading-relaxed text-amber-950 font-medium">
              {active.plainEnglish}
            </p>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-900">Technical Spec: </strong>
            {active.description}
          </p>
        </div>
      </div>
    </div>
  );
};
