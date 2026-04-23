import React, { useState, useMemo } from "react";
import { Printer, Copy, Download, RotateCcw, Check, Circle, CircleDot } from "lucide-react";

const LOGO_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAD3CAYAAADBsyrOAAAABmJLR0QA/wD/AP+gvaeTAAAgAElEQVR4nOydeXyU1fX/3+eZJIQdQkBERLBAgogr7lpx37e2qD9bv7W21W7WXXBt3FBxra2tdrO2dbfa1lpX3LVuFDcgARBURCUJO7IkM+f3x00ky0zmuc8yM0nu+/UaIzP3uffMzDPP/TznnnsOOBwOh8PhcDgcDofD4XA4HIWM5NsAh8PhcDgc/llYNbK0D2tGCInhIjKIBEACRFckk9R5nrd00MWLl4ig+ba1O+MElsPhcDgcBUztBeV9KU0eiZc4ANhdkHGIeIgAQoa/axCpUWWWJLwXRBLPD5oyf3Fe30g3wwksh8PhcDgKkNpLBkxS4QwRORyR0mbxJM0iqmOB1epv0zFvgtyXShbfO/jiuZ/l9c11A5zAcjgcDoejgKi7rPcBqonrQHZOK5YshFU7UWb+bgTuFa/ohrLz574fr/fZ1XECy+FwOByOAqK2qtcwGr3bQI7tUCyFF1hNf0mB/DlJ0cVDLpj9eZ7edpfFy7cBDofD4XB0d+ou7nUMDfIOcGzGRpG7RMQDOTUhyZq66ZWnRN17d8d5sBwOh8PhyCNLLyy9RDzviib3FO28UG2ei86D1fIvIN79DZr4/tDz310b8w+hC+I8WA6Hw+FwxEDtBQxD2SLQwcrlEZsDwNDz310rwt+CHOulZGzU9nRVnMByOBwOhyMGastt1IO9OeXQq1YujNicLYUe0omNdN9TpyPIiToH7DkSb/TzJj1+3OLBi0AOuU7bPwIm99vRFiLeJ6SKRuAsYDrQCuwEFgL3AMciOe4u8HNsKnJmqCe4coBzgNvtHs7cTk2VB8YT8f0gqkAdgvQB8Ba7H/NAnAeEHflMMdkDSm0CdQm2vOc3Mv/8C9jT8nXqxpMHT2Hmf9HqVpVuAE4AzibKu/ewM7Mq0HkPgBOANYCMwHTiC9ACNwNcuAY4HegG7g+8APQW8DVSj3GQ3qSoUf/XDm2F2p0HMDME/w+bvNi10UMAwf8LBqxAdRTIXBIGpj6HibVDmP0AAAAAElFTkSuQmCC";

// -- Initial form state --------------------------------------------------
const initialState = {
  projectName: "",
  dateSubmitted: "",
  projectLead: "",
  workType: "",
  background: "",
  objectives: ["", "", ""],
  primaryAudience: "",
  secondaryAudience: "",
  keyMessage: "",
  deliverables: ["", "", ""],
  outOfScope: "",
  toneShould: "",
  toneShouldNot: "",
  timeline: [
    { milestone: "Kickoff meeting", owner: "", date: "" },
    { milestone: "First draft / concepts", owner: "", date: "" },
    { milestone: "Internal review", owner: "", date: "" },
    { milestone: "Revisions", owner: "", date: "" },
    { milestone: "Final delivery", owner: "", date: "" },
    { milestone: "Launch / go-live", owner: "", date: "" },
  ],
  budgetRange: "",
  budgetApproved: "",
  fundingSource: "",
  metrics: ["", "", ""],
  references: "",
  additionalNotes: "",
  uploadedFiles: "",
};

// -- Small components ----------------------------------------------------
const Label = ({ children, required }) => (
  <label className="block text-[11px] uppercase tracking-[0.14em] font-medium text-stone-600 mb-1.5 font-body">
    {children}
    {required && <span className="text-orange-700 ml-1">*</span>}
  </label>
);

const Prompt = ({ children }) => (
  <p className="text-[15px] italic text-stone-500 mb-4 leading-relaxed font-body max-w-2xl">{children}</p>
);

const TextField = ({ value, onChange, placeholder, ...rest }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full px-4 py-2.5 bg-white/60 border border-stone-300/70 rounded-sm text-[15px] text-stone-900 placeholder:text-stone-400 placeholder:italic focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all font-body"
    {...rest}
  />
);

const TextArea = ({ value, onChange, placeholder, rows = 4 }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    className="w-full px-4 py-3 bg-white/60 border border-stone-300/70 rounded-sm text-[15px] text-stone-900 placeholder:text-stone-400 placeholder:italic focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all resize-none font-body leading-relaxed"
  />
);

const SectionHeader = ({ number, title }) => (
  <div className="flex items-baseline gap-5 mb-5 print:mb-3">
    <span className="font-display text-2xl md:text-3xl font-bold text-orange-700 leading-none tabular-nums">
      {String(number).padStart(2, "0")}
    </span>
    <h2 className="font-display text-3xl md:text-[40px] font-bold text-stone-900 leading-tight">
      {title}
    </h2>
  </div>
);

const Section = ({ number, title, children, id }) => (
  <section id={id} className="scroll-mt-24 py-10 md:py-12 border-t border-stone-300/60 first:border-t-0 first:pt-0 print:py-6 print:break-inside-avoid">
    <SectionHeader number={number} title={title} />
    <div className="md:pl-[84px]">{children}</div>
  </section>
);

// -- Main component ------------------------------------------------------
export default function BrightPromisesBrief() {
  const [data, setData] = useState(initialState);
  const [copied, setCopied] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const update = (field, value) => setData((d) => ({ ...d, [field]: value }));
  const updateArr = (field, idx, value) =>
    setData((d) => ({ ...d, [field]: d[field].map((x, i) => (i === idx ? value : x)) }));
  const updateTimeline = (idx, key, value) =>
    setData((d) => ({ ...d, timeline: d.timeline.map((r, i) => (i === idx ? { ...r, [key]: value } : r)) }));

  const completion = useMemo(() => {
    const checks = [
      data.projectName, data.dateSubmitted, data.requestedBy, data.projectLead,
      data.background, data.objectives.some(Boolean), data.primaryAudience,
      data.keyMessage, data.deliverables.some(Boolean), data.toneShould,
      data.timeline.some((t) => t.date), data.budgetRange, data.finalApprover,
      data.metrics.some(Boolean),
    ];
    const filled = checks.filter((v) => (typeof v === "string" ? v.trim() : v)).length;
    return Math.round((filled / checks.length) * 100);
  }, [data]);

  const toMarkdown = () => {
    const lines = [];
    lines.push("# Project Brief — Bright Promises Foundation\n");
    lines.push("**Project:** " + (data.projectName || "—") + "  ");
    lines.push("**Date:** " + (data.dateSubmitted || "—") + "  ");
    lines.push("**Requested by:** " + (data.requestedBy || "—") + "  ");
    lines.push("**Program / dept.:** " + (data.program || "—") + "  ");
    lines.push("**Project lead:** " + (data.projectLead || "—") + "  ");
    lines.push("**Type of work:** " + (data.workType || "—") + "\n");
    lines.push("## Background & Context\n" + (data.background || "—") + "\n");
    lines.push("## Objectives");
    data.objectives.forEach((o, i) => o && lines.push((i + 1) + ". " + o));
    lines.push("\n## Target Audience");
    lines.push("**Primary:** " + (data.primaryAudience || "—"));
    if (data.secondaryAudience) lines.push("**Secondary:** " + data.secondaryAudience);
    lines.push("\n## Key Message\n" + (data.keyMessage || "—") + "\n");
    lines.push("## Scope & Deliverables");
    data.deliverables.forEach((d) => d && lines.push("- " + d));
    if (data.outOfScope) lines.push("\n**Out of scope:** " + data.outOfScope);
    lines.push("\n## Tone, Voice & Style");
    lines.push("**Should feel:** " + (data.toneShould || "—"));
    lines.push("**Should NOT feel:** " + (data.toneShouldNot || "—") + "\n");
    lines.push("## Mandatories");
    data.mandatories.forEach((m) => m && lines.push("- " + m));
    lines.push("\n## Timeline");
    lines.push("| Milestone | Owner | Date |");
    lines.push("|---|---|---|");
    data.timeline.forEach((t) => lines.push("| " + t.milestone + " | " + (t.owner || "—") + " | " + (t.date || "—") + " |"));
    lines.push("\n## Budget");
    lines.push("- **Range:** " + (data.budgetRange || "—"));
    lines.push("- **Approved:** " + (data.budgetApproved || "—"));
    lines.push("- **Funding source:** " + (data.fundingSource || "—") + "\n");
    lines.push("## Success Metrics");
    data.metrics.forEach((m) => m && lines.push("- " + m));
    if (data.references) lines.push("\n## References & Inspiration\n" + data.references);
    if (data.additionalNotes) lines.push("\n## Additional Notes\n" + data.additionalNotes);
    return lines.join("\n");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(toMarkdown());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = () => {
    const md = toMarkdown();
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safe = (data.projectName || "project-brief").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    a.href = url;
    a.download = "bright-promises-brief_" + safe + ".md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => window.print();
  const handleReset = () => { setData(initialState); setShowReset(false); };

  return (
    <div className="min-h-screen font-body text-stone-900" style={{ background: "#FBF5E9" }}>
      <style>{`
        @font-face { font-family: 'Brother1816'; src: url('/fonts/Brother1816-Book.otf') format('opentype'); font-weight: 300; font-style: normal; font-display: swap; }
        @font-face { font-family: 'Brother1816'; src: url('/fonts/Brother1816-Regular.otf') format('opentype'); font-weight: 400; font-style: normal; font-display: swap; }
        @font-face { font-family: 'Brother1816'; src: url('/fonts/Brother1816-Bold.otf') format('opentype'); font-weight: 700; font-style: normal; font-display: swap; }
        @font-face { font-family: 'Brother1816'; src: url('/fonts/Brother1816-Black.otf') format('opentype'); font-weight: 900; font-style: normal; font-display: swap; }
        .font-display { font-family: 'Brother1816', sans-serif; }
        .font-body { font-family: 'Brother1816', sans-serif; }
        .grain::before {
          content: "";
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3CfeColorMatrix values='0 0 0 0 0.7 0 0 0 0 0.5 0 0 0 0 0.2 0 0 0 0.08 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.5; mix-blend-mode: multiply;
        }
        @media print {
          body, html { background: white !important; }
          .no-print { display: none !important; }
          .grain::before { display: none; }
          main { padding: 0 !important; max-width: 100% !important; }
          section { page-break-inside: avoid; }
          input, textarea {
            border: none !important; background: transparent !important;
            padding: 2px 0 !important; border-bottom: 1px solid #ccc !important;
            border-radius: 0 !important;
          }
          textarea { min-height: auto; }
        }
      `}</style>

      <div className="grain" />

      <header className="no-print sticky top-0 z-20 backdrop-blur-md border-b border-stone-300/60" style={{ background: "rgba(251, 245, 233, 0.85)" }}>
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-3 flex items-center gap-6">
          <img src={LOGO_SRC} alt="Bright Promises Foundation" className="h-8 w-auto" />
          <div className="hidden md:flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-stone-600">
            <div className="w-24 h-[3px] bg-stone-200 rounded-full overflow-hidden">
              <div className="h-full bg-orange-600 transition-all duration-500" style={{ width: `${completion}%` }} />
            </div>
            <span className="tabular-nums font-medium">{completion}% complete</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ActionBtn onClick={handleCopy} icon={copied ? Check : Copy} label={copied ? "Copied" : "Copy"} active={copied} />
            <ActionBtn onClick={handleDownload} icon={Download} label="Download" />
            <ActionBtn onClick={handlePrint} icon={Printer} label="Print / PDF" primary />
            <button onClick={() => setShowReset(true)} className="p-2 text-stone-500 hover:text-stone-900 transition-colors" title="Reset" aria-label="Reset form">
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="mb-12 md:mb-16 print:mb-8">
          <img src={LOGO_SRC} alt="Bright Promises Foundation" className="h-14 md:h-16 w-auto mb-10 hidden print:block" />
          <div className="flex items-center gap-3 mb-5">
            <div className="h-[2px] w-12 bg-orange-600" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-orange-700 font-semibold">Creative & Consulting Request</span>
          </div>
          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight text-stone-900 mb-6 whitespace-nowrap">
            Project Brief<span className="text-orange-600">.</span>
          </h1>
          <p className="text-stone-600 text-[15px] leading-relaxed max-w-xl font-body">
            This brief helps us collaborate with creative and consulting partners. The more specific you can
            be, the better the outcome. If a section doesn't apply, note "N/A" rather than leaving it blank.
          </p>
        </div>

        <Section number={1} title="Project Basics" id="basics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Label required>Project name</Label>
              <TextField value={data.projectName} onChange={(v) => update("projectName", v)} placeholder="e.g., 2026 Spring Donor Campaign" />
            </div>
            <div>
              <Label>Date submitted</Label>
              <TextField value={data.dateSubmitted} onChange={(v) => update("dateSubmitted", v)} placeholder="MM / DD / YYYY" />
            </div>
            <div>
              <Label>Type of work</Label>
              <TextField value={data.workType} onChange={(v) => update("workType", v)} placeholder="Creative · Consulting · Strategy · Other" />
            </div>


            <div className="md:col-span-2">
              <Label>Project lead</Label>
              <TextField value={data.projectLead} onChange={(v) => update("projectLead", v)} placeholder="Day-to-day point of contact" />
            </div>
          </div>
        </Section>

        <Section number={2} title="Background & Context" id="background">
          <Prompt>What's prompting this project? Share any relevant history, prior work, or internal context a partner should understand before starting.</Prompt>
          <TextArea value={data.background} onChange={(v) => update("background", v)} placeholder="Start typing…" rows={6} />
        </Section>

        <Section number={3} title="Objectives" id="objectives">
          <Prompt>What does success look like? List 2–4 specific outcomes — the clearer, the better.</Prompt>
          <div className="space-y-3">
            {data.objectives.map((obj, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="font-display text-lg text-orange-600 w-5 flex-shrink-0">{i + 1}.</span>
                <TextField value={obj} onChange={(v) => updateArr("objectives", i, v)} placeholder={"Objective " + (i + 1)} />
              </div>
            ))}
          </div>
        </Section>

        <Section number={4} title="Target Audience" id="audience">
          <Prompt>Who are we trying to reach? Consider demographics, giving history, relationship to the foundation, and what they currently know or believe.</Prompt>
          <div className="space-y-5">
            <div>
              <Label required>Primary audience</Label>
              <TextArea value={data.primaryAudience} onChange={(v) => update("primaryAudience", v)} placeholder="Who matters most?" rows={3} />
            </div>
            <div>
              <Label>Secondary audience</Label>
              <TextArea value={data.secondaryAudience} onChange={(v) => update("secondaryAudience", v)} placeholder="Optional — any secondary groups" rows={2} />
            </div>
          </div>
        </Section>

        <Section number={5} title="Key Message" id="message">
          <Prompt>In one or two sentences, what do we most need the audience to understand, feel, or do? If we could only say one thing, what would it be?</Prompt>
          <TextArea value={data.keyMessage} onChange={(v) => update("keyMessage", v)} placeholder="The one thing…" rows={4} />
        </Section>

        <Section number={6} title="Scope & Deliverables" id="scope">
          <Prompt>List every tangible item the partner should produce. Include quantities, formats, and specs where known.</Prompt>
          <div className="space-y-3 mb-6">
            {data.deliverables.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-orange-600 font-bold flex-shrink-0 w-5 text-center">&bull;</span>
                <TextField value={d} onChange={(v) => updateArr("deliverables", i, v)} placeholder={"Deliverable " + (i + 1) + " — format, quantity, specs"} />
              </div>
            ))}
          </div>
          <div>
            <Label>Out of scope</Label>
            <Prompt>Anything explicitly NOT included? Noting this upfront prevents scope creep.</Prompt>
            <TextArea value={data.outOfScope} onChange={(v) => update("outOfScope", v)} placeholder="What we're not asking for…" rows={2} />
          </div>
        </Section>

        <Section number={7} title="Tone, Voice & Style" id="tone">
          <Prompt>How should this feel? Be specific — "warm" means different things to different people.</Prompt>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label>Should feel</Label>
              <TextArea value={data.toneShould} onChange={(v) => update("toneShould", v)} placeholder="hopeful, warm, urgent, direct, playful…" rows={3} />
            </div>
            <div>
              <Label>Should NOT feel</Label>
              <TextArea value={data.toneShouldNot} onChange={(v) => update("toneShouldNot", v)} placeholder="corporate, pity-driven, saccharine…" rows={3} />
            </div>
          </div>
        </Section>


        <Section number={8} title="Timeline & Key Milestones" id="timeline">
          <Prompt>Note the final deadline first, then work backward. Flag any fixed dates (events, board meetings, mailings).</Prompt>
          <div className="border border-stone-300/70 rounded-sm overflow-hidden bg-white/40">
            <div className="grid grid-cols-12 bg-orange-700 text-white text-[11px] uppercase tracking-[0.14em] font-semibold">
              <div className="col-span-6 px-4 py-2.5">Milestone</div>
              <div className="col-span-3 px-4 py-2.5">Owner</div>
              <div className="col-span-3 px-4 py-2.5">Date</div>
            </div>
            {data.timeline.map((row, i) => (
              <div key={i} className={"grid grid-cols-12 border-t border-stone-200 " + (i % 2 === 0 ? "" : "bg-white/30")}>
                <div className="col-span-6 px-4 py-2">
                  <input type="text" value={row.milestone} onChange={(e) => updateTimeline(i, "milestone", e.target.value)} className="w-full bg-transparent text-[14px] font-medium focus:outline-none" />
                </div>
                <div className="col-span-3 px-4 py-2 border-l border-stone-200">
                  <input type="text" value={row.owner} onChange={(e) => updateTimeline(i, "owner", e.target.value)} placeholder="—" className="w-full bg-transparent text-[14px] text-stone-600 focus:outline-none placeholder:text-stone-400" />
                </div>
                <div className="col-span-3 px-4 py-2 border-l border-stone-200">
                  <input type="text" value={row.date} onChange={(e) => updateTimeline(i, "date", e.target.value)} placeholder="—" className="w-full bg-transparent text-[14px] text-stone-600 focus:outline-none placeholder:text-stone-400" />
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section number={9} title="Budget" id="budget">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <Label>Budget range</Label>
              <TextField value={data.budgetRange} onChange={(v) => update("budgetRange", v)} placeholder="$ — to — $" />
            </div>
            <div>
              <Label>Budget approved?</Label>
              <TextField value={data.budgetApproved} onChange={(v) => update("budgetApproved", v)} placeholder="Yes / No / Pending" />
            </div>
            <div>
              <Label>Funding source</Label>
              <TextField value={data.fundingSource} onChange={(v) => update("fundingSource", v)} placeholder="e.g., general operating" />
            </div>
          </div>
        </Section>


        <Section number={10} title="How We'll Measure Success" id="metrics">
          <Prompt>How will we know this project worked? Pair each objective above with a metric where possible.</Prompt>
          <div className="space-y-3">
            {data.metrics.map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <Circle size={10} className="text-orange-600 fill-orange-600 flex-shrink-0" />
                <TextField value={m} onChange={(v) => updateArr("metrics", i, v)} placeholder={"Metric " + (i + 1) + " — target number or outcome"} />
              </div>
            ))}
          </div>
        </Section>

        <Section number={11} title="References & Inspiration" id="references">
          <Prompt>Share links, examples, or past work that capture the direction — and note what you like about each. "Anti-examples" (what to avoid) are just as helpful.</Prompt>
          <TextArea value={data.references} onChange={(v) => update("references", v)} placeholder="Links and notes…" rows={5} />
          <div className="mt-4">
            <Label>Upload files</Label>
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-stone-300/80 rounded-sm cursor-pointer bg-white/40 hover:bg-white/60 hover:border-orange-400 transition-all group">
              <div className="flex flex-col items-center gap-1 text-stone-400 group-hover:text-stone-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span className="text-[13px]">Click to upload or drag &amp; drop</span>
                <span className="text-[11px] text-stone-400">Images, PDFs, or any file type</span>
              </div>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  const names = Array.from(e.target.files).map(f => f.name).join(", ");
                  update("uploadedFiles", names);
                }}
              />
            </label>
            {data.uploadedFiles && (
              <p className="mt-2 text-[13px] text-stone-600 font-body">{data.uploadedFiles}</p>
            )}
          </div>
        </Section>

        <Section number={12} title="Anything Else?" id="notes">
          <Prompt>Risks, sensitivities, accessibility needs, past partner feedback, or anything else a collaborator should know.</Prompt>
          <TextArea value={data.additionalNotes} onChange={(v) => update("additionalNotes", v)} placeholder="Anything we haven't covered…" rows={4} />
        </Section>

        <footer className="pt-12 mt-8 border-t border-stone-300/60 flex items-center justify-between text-[12px] text-stone-500 font-body">
          <div className="flex items-center gap-3">
            <div className="h-[3px] w-8 bg-yellow-400" />
            <span>Bright Promises Foundation</span>
          </div>
          <span className="italic">Brief template · internal use</span>
        </footer>
      </main>

      {showReset && (
        <div className="no-print fixed inset-0 z-30 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm" onClick={() => setShowReset(false)}>
          <div className="bg-white rounded-sm shadow-2xl p-7 max-w-sm mx-4 border border-stone-200" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl font-semibold mb-2">Reset this brief?</h3>
            <p className="text-[14px] text-stone-600 mb-5 leading-relaxed">This will clear all fields. This can't be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowReset(false)} className="px-4 py-2 text-[13px] text-stone-700 hover:text-stone-900 font-medium">Cancel</button>
              <button onClick={handleReset} className="px-4 py-2 text-[13px] bg-stone-900 text-white rounded-sm hover:bg-stone-800 font-medium">Clear form</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionBtn({ onClick, icon: Icon, label, primary, active }) {
  const base = "inline-flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium rounded-sm transition-all";
  const styles = primary
    ? "bg-orange-700 text-white hover:bg-orange-800 shadow-sm"
    : active
    ? "bg-green-50 text-green-700 border border-green-200"
    : "bg-white/70 text-stone-700 hover:bg-white border border-stone-300/70";
  return (
    <button onClick={onClick} className={`${base} ${styles}`}>
      <Icon size={14} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
