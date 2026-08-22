import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function WelcomeTour({ onDismiss }: { onDismiss: () => void }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "O que é o Spectre Hub?",
      content: (
        <>
          Automatize suas <span className="text-[#99aab5]">Discord Quests</span> em segundo plano — assista vídeos e "jogue" sem esforço, ganhando <span className="text-[#34d399]">Orbs</span> e recompensas exclusivas. Totalmente client-side, seu token nunca sai criptografado do seu navegador.
        </>
      ),
      button: "começar tour →",
    },
    {
      title: "Identidade de Elite",
      content: (
        <>
          Com o <span className="text-[#4DA09E]">Nicks-Gun</span>, você monitora e captura usernames raros de 2 e 3 letras instantaneamente. Seja o primeiro a garantir nomes que definem status.
        </>
      ),
      button: "próximo →",
    },
    {
      title: "Tudo sob controle",
      content: (
        <>
          Gerencie múltiplos servidores, clone estruturas inteiras e automatize farms com precisão técnica. A Spectre fornece a infraestrutura, você fornece a estratégia.
        </>
      ),
      button: "finalizar →",
    },
  ];

  const next = () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
    } else {
      onDismiss();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-300">
        <div className="overflow-hidden rounded-none border border-white/10 bg-[#050505] shadow-2xl shadow-black/80">
          <div className="absolute right-4 top-4">
            <button 
              onClick={onDismiss}
              className="rounded-full p-1 text-white/40 hover:bg-white/5 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-8 pb-6">
            <div className="mb-4 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#4DA09E]">
              <span className="text-white/40">$</span> Bem-Vindo
            </div>
            
            <h2 className="mb-4 font-display text-2xl font-bold tracking-tight text-white">
              {steps[step].title.includes('Spectre Hub') ? (
                <>
                  O que é o <span className="text-white">Spectre<span className="text-[#4DA09E]">hub</span></span>?
                </>
              ) : steps[step].title}
            </h2>

            <p className="text-[14px] leading-relaxed text-[#8a8a8a]">
              {steps[step].content}
            </p>

            <div className="mt-8 space-y-4">
              <button
                onClick={next}
                className="w-full rounded-none bg-[#4DA09E] py-3 text-[13px] font-bold text-white shadow-lg shadow-[#4DA09E]/10 hover:bg-[#4DA09E]/90 transition-all uppercase tracking-widest"
              >
                {steps[step].button}
              </button>
              
              <button
                onClick={onDismiss}
                className="w-full text-[10px] font-bold uppercase tracking-[0.2em] text-[#4a4a4a] hover:text-[#8a8a8a] transition-colors"
              >
                PULAR →
              </button>
            </div>

            <div className="mt-6 flex justify-center gap-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === step ? "w-6 bg-[#4DA09E]" : "w-1.5 bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
