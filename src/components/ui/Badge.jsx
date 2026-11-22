export default function Badge({ children, variant = 'neutral', className = '' }) {
  const variants = {
    sage: 'bg-[#929D75]/20 text-[#54603B] border border-[#929D75]/40',
    yellow: 'bg-[#F5C875]/30 text-[#855B10] border border-[#F5C875]/60',
    terracotta: 'bg-[#C96858]/20 text-[#8A3729] border border-[#C96858]/40',
    beige: 'bg-[#EBCFA9]/40 text-[#6B4B32] border border-[#EBCFA9]/70',
    neutral: 'bg-stone-200/60 text-stone-700 border border-stone-300',
  };

  const selectedVariant = variants[variant] || variants.neutral;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${selectedVariant} ${className}`}
    >
      {children}
    </span>
  );
}
