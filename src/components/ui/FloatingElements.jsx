'use client';

export default function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute top-20 right-[15%] w-24 h-24 rounded-full bg-[#929D75]/8 animate-float-slow"
        style={{ animationDelay: '0s' }}
      />
      <div
        className="absolute top-[40%] left-[8%] w-16 h-16 rounded-full bg-[#C96858]/6 animate-float"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="absolute bottom-[30%] right-[10%] w-20 h-20 rounded-full bg-[#F5C875]/10 animate-float-slow"
        style={{ animationDelay: '4s' }}
      />
      <div className="absolute top-[25%] left-[20%] w-3 h-3 rounded-full bg-[#929D75]/15 animate-gentle-pulse" />
      <div className="absolute top-[60%] right-[25%] w-2 h-2 rounded-full bg-[#C96858]/15 animate-gentle-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-[20%] left-[30%] w-4 h-4 rounded-full bg-[#EBCFA9]/30 animate-gentle-pulse" style={{ animationDelay: '3s' }} />
      <div 
        className="absolute top-[15%] right-[5%] w-32 h-[1px] bg-[#EBCFA9]/30 animate-float-slow"
        style={{ transform: 'rotate(45deg)', animationDelay: '1s' }}
      />
      <div 
        className="absolute bottom-[25%] left-[5%] w-24 h-[1px] bg-[#929D75]/15 animate-float"
        style={{ transform: 'rotate(-30deg)', animationDelay: '2.5s' }}
      />
    </div>
  );
}
