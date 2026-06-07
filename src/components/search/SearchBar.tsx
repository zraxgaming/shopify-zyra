import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { searchShopifyProducts } from "@/services/shopifyCollections";

interface Result {
  id: string;
  handle: string;
  title: string;
  image: string | null;
  price: { amount: string; currencyCode: string };
}

const SearchBar = () => {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!term.trim()) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await searchShopifyProducts(term);
        setResults(r);
      } catch (e) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [term]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.trim()) navigate(`/shop?search=${encodeURIComponent(term.trim())}`);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-lg">
      <form onSubmit={submit} className="flex w-full">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search products..."
            value={term}
            onChange={(e) => {
              setTerm(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            className="pr-10"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
            aria-label="Search"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </button>
        </div>
      </form>

      {open && term.trim() && (
        <div className="absolute z-50 mt-2 w-full bg-popover border border-border rounded-md shadow-lg max-h-96 overflow-auto">
          {loading && results.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">Searching...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">No products found.</div>
          ) : (
            <ul className="divide-y divide-border">
              {results.map((r) => (
                <li key={r.id}>
                  <button
                    onClick={() => {
                      navigate(`/product/${r.handle}`);
                      setOpen(false);
                      setTerm("");
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-accent text-left"
                  >
                    <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                      {r.image && <img src={r.image} alt={r.title} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{r.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {r.price.currencyCode} {parseFloat(r.price.amount).toFixed(2)}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
