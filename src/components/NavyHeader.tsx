import marinhaLogo from "@/assets/marinha-logo.svg";

const NavyHeader = () => {
  return (
    <div className="w-full bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
        <img src={marinhaLogo} alt="Marinha do Brasil" className="w-14 h-14" />
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy tracking-wide">
            CONCURSO MARINHA DO BRASIL 2026
          </h1>
          <p className="text-sm text-navy-gold font-semibold uppercase tracking-wider">
            Portal de Inscrição
          </p>
        </div>
      </div>
    </div>
  );
};

export default NavyHeader;