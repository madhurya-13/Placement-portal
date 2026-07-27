// src/components/ui/PageHeader.tsx
export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold text-ink-50">{title}</h2>
      {subtitle && <p className="text-sm text-ink-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}