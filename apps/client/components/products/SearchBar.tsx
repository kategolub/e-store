'use client';
import { useState, useRef, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from '../../hooks/useSearch';
import { Input } from "@/@shop/shared/components/ui/input";
import Link from 'next/link';

export default function SearchBar() {
    const router = useRouter();
    const { value, setValue, results, isLoading } = useSearch();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (value.trim().length >= 2) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && value.trim().length >= 2) {
          setIsOpen(false);
          startTransition(() => {
            router.push(`/search?search=${encodeURIComponent(value)}`);
          });
        }

        if (event.key === 'Escape') {
          setIsOpen(false);
        }
    };

    const handleSeeAll = () => {
        setIsOpen(false);
        startTransition(() => {
            router.push(`/search?search=${encodeURIComponent(value)}`);
        });
    };

    const handleResultClick = () => {
        setIsOpen(false);
        setValue('');
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <Input
                type="text"
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => results.length > 0 && setIsOpen(true)}
                placeholder="Search products..."
                className={`w-full h-10 border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}
            />

            {isLoading && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">
                  Searching...
                </span>
            )}

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    {results.length === 0 ? (
                        <p className="px-4 py-3 text-sm text-zinc-400">
                            No results for &quot;{value}&quot;
                        </p>
                    ) : (
                        <>
                            <ul>
                                {results.map(product => (
                                <li key={product._id}>
                                    <Link
                                    href={`/products/${product.slug}`}
                                    onClick={handleResultClick}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors"
                                    >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                        {product.name}
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                        ${product.price.toFixed(2)}
                                        </p>
                                    </div>
                                    </Link>
                                </li>
                                ))}
                            </ul>

                            <button
                                onClick={handleSeeAll}
                                className="w-full px-1 py-3 text-sm font-medium text-center border-t border-zinc-100 hover:bg-zinc-50 transition-colors hover:cursor-pointer"
                            >
                                See all results for &quot;{value}&quot;
                            </button>
                        </>
                    )}


                </div>
            )}
            </div>
    );
}