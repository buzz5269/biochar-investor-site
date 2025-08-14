import React from "react";

export const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl shadow-md border border-zinc-200 bg-white p-5 ${className}`}>{children}</div>
);

export const Section = ({ id, title, kicker, children }) => (
  <section id={id} className="max-w-6xl mx-auto px-4 md:px-6 py-12">
    <div className="mb-6">
      {kicker && <p className="uppercase tracking-widest text-xs text-zinc-500 mb-1">{kicker}</p>}
      <h2 className="text-2xl md:text-3xl font-semibold text-zinc-900">{title}</h2>
    </div>
    {children}
  </section>
);

export function Stat({ icon: Icon, label, value, sub }) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-zinc-100"><Icon className="h-5 w-5" /></div>
        <div>
          <div className="text-sm text-zinc-600">{label}</div>
          <div className="text-xl font-semibold">{value}</div>
          {sub && <div className="text-xs text-zinc-500 mt-0.5">{sub}</div>}
        </div>
      </div>
    </Card>
  );
}

export function PillButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full border text-sm transition-colors ${
        active ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50"
      }`}
    >
      {children}
    </button>
  );
}

export function Collapse({ title, children, defaultOpen = false }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <Card>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between text-left">
        <span className="text-base md:text-lg font-medium text-zinc-800">{title}</span>
      </button>
      {open && <div className="mt-4 text-sm md:text-base text-zinc-700 leading-6">{children}</div>}
    </Card>
  );
}