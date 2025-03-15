"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonDetails {
  id: number;
  name: string;
  sprites: {
    other: any;
    front_default: string;
  };
}

export default function Home() {
  const [posts, setPosts] = useState<PokemonDetails[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PokemonDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_POKEMON_API_BASE;
  const LIMIT = 50;

  const fetchPokemons = async (newOffset: number) => {
    if (!hasMore) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/pokemon?limit=${LIMIT}&offset=${newOffset}`);
      const data: { results: Pokemon[] } = await res.json();

      if (!data.results || data.results.length === 0) {
        setHasMore(false);
        setIsLoading(false);
        return;
      }

      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          try {
            const pokemonIdOrName = pokemon.url.split("/").slice(-2, -1)[0];
            const res = await fetch(`${API_BASE_URL}/pokemon/${pokemonIdOrName}`);
            return (await res.json()) as PokemonDetails;
          } catch (err) {
            console.error(`Error fetching ${pokemon.name}:`, err);
            return null;
          }
        })
      );

      const validPokemons = pokemonDetails.filter(Boolean) as PokemonDetails[];
      setPosts((prev) => [...prev, ...validPokemons]);
      setFilteredPosts((prev) => [...prev, ...validPokemons]);
      setOffset(newOffset + LIMIT);
    } catch (error) {
      setError("Failed to load Pokemon data.");
      console.error("Error fetching Pokemon:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons(0); 
  }, []);

  useEffect(() => {
    const filtered = posts.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchTerm, posts]);

  return (
    <div className="bg-gradient-to-b from-blue-500 to-indigo-900 min-h-screen p-6">
      <h1 className="text-4xl font-extrabold text-center text-white mb-6">
        Pokemon List
      </h1>

      {isLoading && <p className="text-white text-center">Loading Pokemon...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <input
        type="text"
        placeholder="Search Pokémon"
        className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="flex flex-wrap justify-center gap-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((pokemon, index) => (
            <Link key={index} href={`/pokemon/${pokemon.id}`} style={{ textDecoration: "none" }}>
              <div className="relative size-40 bg-white/30 backdrop-blur-lg shadow-lg border border-white/20 rounded-lg p-4 flex flex-col items-center
                transition-transform duration-300 hover:scale-110 hover:shadow-xl hover:border-white/40 hover:bg-white/40">
                
                <h2 className="text-2xl font-bold text-white capitalize">{pokemon.name}</h2>

                <div className="relative w-32 h-32 mt-2">
                  <Image
                    src={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}
                    alt={pokemon.name}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-10 rounded-lg transition-opacity"></div>
              </div>
            </Link>
          ))
        ) : (
          !isLoading && !error && <p className="text-white text-center">No Pokemon found.</p>
        )}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            className="px-6 py-2 bg-yellow-500 text-white font-bold rounded transition-all duration-300
              hover:bg-yellow-600 hover:scale-105 active:scale-95 disabled:opacity-50"
            onClick={() => fetchPokemons(offset)}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
