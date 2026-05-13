'use client';
import { useState, useEffect } from 'react';
import { getProducts } from "../services/public/products.service";


export default function Home() {
  const [ products, setProducts ] = useState<any>([]);
  const [error, setError] = useState<string>('');


  useEffect(() => {
    getProducts()
      .then(data => setProducts(data.products))
      .catch(e => setError(e.message));
  }, []);

  if (error) {
    return <p>Error</p>;
  }



  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {products ? products.map((p) => (
          <p key={p._id}>{p.name}</p>
        )) : <p>Nothing</p>}
      </main>
    </div>
  );
}
