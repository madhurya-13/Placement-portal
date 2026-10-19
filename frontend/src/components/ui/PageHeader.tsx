// src/components/ui/PageHeader.tsx
// Section heading shared by every dashboard and landing section — the
// gradient treatment is what keeps the shader theme uniform page to page.
export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-300 via-white to-orange-400 bg-clip-text text-transparent">
        {title}
      </h2>
      {subtitle && <p className="text-sm text-ink-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}