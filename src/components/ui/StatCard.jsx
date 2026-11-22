export default function StatCard({ title, value, subtitle, icon, highlightColor = 'sage' }) {
  const highlights = {
    sage: 'border-l-4 border-l-[#929D75]',
    yellow: 'border-l-4 border-l-[#F5C875]',
    terracotta: 'border-l-4 border-l-[#C96858]',
    beige: 'border-l-4 border-l-[#EBCFA9]',
  };

  return (
    <div
      className={`bg-white/70 backdrop-blur-xs rounded-2xl p-5 shadow-xs border border-[#EBCFA9]/60 transition-transform hover:-translate-y-0.5 ${
        highlights[highlightColor] || highlights.sage
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide uppercase text-[#79543D]/70">{title}</span>
        {icon && <div className="text-[#929D75] p-2 bg-[#929D75]/10 rounded-xl">{icon}</div>}
      </div>
      <div className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-[#79543D]">{value}</div>
      {subtitle && <p className="mt-1 text-xs text-[#79543D]/75">{subtitle}</p>}
    </div>
  );
}
