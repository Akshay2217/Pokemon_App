"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonDetails {
  id: number;
  name: string;
  sprites: {
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
    fetchPokemons(0); // Fetch first batch of Pokémon
  }, []);

  useEffect(() => {
    const filtered = posts.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchTerm, posts]);

  return (
    <div className="bg-blue-500 min-h-screen p-6">
      <h1 className="text-4xl font-extrabold text-center text-white mb-6">
        Pokémon List
      </h1>

      {isLoading && <p className="text-white text-center">Loading Pokémon...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <input
        type="text"
        placeholder="Search Pokémon"
        className="w-full p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="flex flex-wrap justify-center gap-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((pokemon, index) => (
            <Link key={index} href={`/pokemon/${pokemon.id}`} style={{ textDecoration: 'none' }}>
              <div className="size-40 bg-white/30 backdrop-blur-lg shadow-lg border border-white/20 rounded-lg p-4 flex flex-col items-center">
                <h2 className="text-2xl font-bold text-white capitalize">{pokemon.name}</h2>
                <img className="w-24 h-24" src={pokemon.sprites.front_default} alt={pokemon.name} />
              </div>
            </Link>
          ))
        ) : (
          !isLoading && !error && <p className="text-white text-center">No Pokémon found.</p>
        )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            className="px-6 py-2 bg-yellow-500 text-white font-bold rounded hover:bg-yellow-600 disabled:opacity-50"
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
