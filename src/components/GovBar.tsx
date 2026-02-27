const GovBar = () => {
  return (
    <div className="w-full bg-gov-bar text-gov-bar-foreground">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-1 font-bold tracking-wide">
          <span className="text-gov-bar-foreground">GOV</span>
          <span className="text-navy-gold">.BR</span>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-xs uppercase tracking-wider">
          <a href="#" className="hover:underline">Acesso à Informação</a>
          <a href="#" className="hover:underline">Participe</a>
          <a href="#" className="hover:underline">Serviços</a>
        </nav>
      </div>
    </div>
  );
};

export default GovBar;