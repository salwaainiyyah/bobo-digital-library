export default function Alert({ title, children, variant = 'info', className = '', action }) {
  const styles = {
    info: 'bg-[#EBCFA9]/30 border-[#EBCFA9] text-[#79543D]',
    warning: 'bg-[#F5C875]/25 border-[#F5C875] text-[#855B10]',
    danger: 'bg-[#C96858]/15 border-[#C96858] text-[#8A3729]',
    success: 'bg-[#929D75]/20 border-[#929D75] text-[#54603B]',
  };

  return (
    <div
      className={`rounded-2xl border p-4 transition-all shadow-xs ${styles[variant] || styles.info} ${className}`}
      role="alert"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          {title && <h4 className="font-semibold text-sm mb-1">{title}</h4>}
          <div className="text-xs sm:text-sm leading-relaxed">{children}</div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
