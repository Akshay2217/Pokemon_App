"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from 'next/image';

type Pokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Array<{ type: { name: string } }>;
  abilities: Array<{ ability: { name: string }; is_hidden: boolean }>;
  stats: Array<{ base_stat: number; stat: { name: string } }>;
  moves: Array<{ move: { name: string } }>;
  sprites: { other: { "official-artwork": { front_default: string } }; front_default: string };
};

export default function PokemonDetail() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_POKEMON_API_BASE ; 

  const fetchPokemon = useCallback(async () => {
    if (!id) return;  

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/pokemon/${id}`);
      if (!res.ok) throw new Error("Failed to fetch Pokémon data");
      const data = await res.json();
      setPokemon(data);
    } catch (err) {
      setError("Failed to load Pokémon details.");
      console.error("Error fetching Pokémon:", err);
    } finally {
      setIsLoading(false);
    }
  }, [id, API_BASE_URL]);

  useEffect(() => {
    fetchPokemon(); 
  }, [fetchPokemon]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );

  if (error || !pokemon)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <h1 className="text-2xl font-bold mb-4">Pokemon Not Found</h1>
        <button
          className="px-4 py-2 bg-white/30 backdrop-blur-lg text-white rounded-lg transition-all duration-300 hover:bg-white/40 hover:scale-105"
          onClick={() => router.push("/")}
        >
          Return to Pokemon List
        </button>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-600 to-indigo-900 p-6">
      <div className="w-full max-w-3xl">
        <div className="w-full flex justify-start mb-4">
          <button
            className="px-4 py-2 bg-white/30 backdrop-blur-lg text-white rounded-lg shadow-lg transition-all duration-300 hover:bg-white/40 hover:scale-110"
            onClick={() => router.push("/")}
          >
            Back
          </button>
        </div>
      </div>

      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-white/20 text-white">
        <div className="flex flex-col md:flex-row items-center">
          <Image
            src={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}
            alt={pokemon.name}
            width={250}
            height={250}
            priority 
            className="object-contain w-48 h-48 transition-transform duration-300 hover:scale-105"
          />

          <div className="md:ml-8 text-center md:text-left">
            <h1 className="text-4xl font-extrabold capitalize">{pokemon.name}</h1>
            <p className="text-lg font-semibold">#{pokemon.id.toString().padStart(3, "0")}</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <p>Height: {(pokemon.height / 10).toFixed(1)} m</p>
              <p>Weight: {(pokemon.weight / 10).toFixed(1)} kg</p>
              <div>
                <p className="font-semibold">Abilities:</p>
                <ul className="list-disc ml-4">
                  {pokemon.abilities.map(({ ability, is_hidden }) => (
                    <li key={ability.name} className="capitalize">
                      {ability.name.replace("-", " ")} {is_hidden && <span className="text-gray-300">(Hidden)</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mt-6">Stats</h2>
        <div className="space-y-2">
          {pokemon.stats.map(({ base_stat, stat }) => (
            <div
              key={stat.name}
              className="flex justify-between bg-white/20 backdrop-blur-md p-2 rounded transition-all duration-300 hover:scale-105 hover:bg-white/30 hover:shadow-md"
            >
              <p className="capitalize font-medium">{stat.name.replace("-", " ")}</p>
              <p className="font-medium">{base_stat}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mt-6">Moves</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
          {pokemon.moves.slice(0, 20).map(({ move }) => (
            <div
              key={move.name}
              className="bg-white/20 backdrop-blur-md p-2 rounded text-center capitalize text-sm transition-all duration-300 hover:scale-105 hover:bg-white/30 hover:shadow-md"
            >
              {move.name.replace("-", " ")}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
