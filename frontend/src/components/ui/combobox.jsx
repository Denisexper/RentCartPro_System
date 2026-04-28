import { useState, useRef, useEffect } from "react";

export function Combobox({ options, value, onChange, placeholder = "Buscar...", maxResults = 6 }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const selected = options.find((o) => o.value === value);

  const filtered = options
    .filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    .slice(0, maxResults);

  function handleSelect(option) {
    onChange(option.value);
    setQuery("");
    setOpen(false);
  }

  function handleInputChange(e) {
    setQuery(e.target.value);
    onChange("");
    setOpen(true);
  }

  function handleFocus() {
    setOpen(true);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={selected && !open ? selected.label : query}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        className="h-8 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
      />

      {open && (
        <ul className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-card shadow-lg overflow-hidden">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">Sin resultados</li>
          ) : (
            filtered.map((o) => (
              <li
                key={o.value}
                onMouseDown={() => handleSelect(o)}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-muted transition-colors"
              >
                {o.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
