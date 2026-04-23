import { useState, useEffect } from "react";

type Pokemon = {
  id: number;
  name: string;
  img: string;
  type: {
    type: {
      name: string;
    };
  }[];
};

type PokemonAPIListItem = {
  name: string;
  url: string;
};

type Variant = {
  fire: string;
  water: string;
  grass: string;
  electric: string;
  psychic: string;
  flying: string;
  ice: string;
  dragon: string;
  poison: string;
  ghost: string;
  rock: string;
  bug: string;
  normal: string;
  ground: string;
  fighting: string;
  fairy: string;
  steel: string;
  dark: string;
};

type PokeList = {
  type: {
    name: string;
  };
};

const variantStyles: Variant = {
  fire: "bg-fire-type/30 border-fire-type text-amber-100",
  water: "bg-water-type/30 border-water-type text-amber-100",
  grass: "bg-grass-type/30 border-grass-type text-amber-100",
  electric: "bg-electric-type/30 border-electric-type text-amber-100",
  psychic: "bg-psychic-type/30 border-psychic-type text-amber-100",
  ice: "bg-ice-type/30 border-ice-type text-amber-100",
  dragon: "bg-dragon-type/30 border-dragon-type text-amber-100",
  poison: "bg-poison-type/30 border-poison-type text-amber-100",
  ghost: "bg-ghost-type/30 border-ghost-type text-amber-100",
  rock: "bg-mid/30 border-mid text-amber-100",
  flying: "bg-ghost-type/15 border-ghost-type text-amber-100",
  bug: "bg-grass-type/40 border-grass-type text-amber-100",
  normal: "bg-gray-950/10 border-gray-950 text-amber-100",
  ground: "bg-stone-950/25 border-stone-950 text-amber-100",
  fighting: "bg-red-950/30 border-red-950/50 text-amber-100",
  fairy: "bg-psychic-type/30 border-psychic-type text-amber-100",
  steel: "bg-gray-500/50 border-gray-500 text-amber-100",
  dark: "bg-gray-950/50 border-gray-950 text-amber-100 text-amber-100",
};

export default function App() {
  const [search, setSearch] = useState("");
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=151`,
        );

        if (!response.ok) {
          throw new Error();
        }
        const data = await response.json();

        const fullPokemonInfo = await Promise.all(
          data.results.map(async (pokemon: PokemonAPIListItem) => {
            const res = await fetch(pokemon.url);
            const dadosCompletos = await res.json();
            return {
              name: pokemon.name,
              img: dadosCompletos.sprites.front_default,
              type: dadosCompletos.types,
              id: dadosCompletos.id,
            };
          }),
        );
        setPokemonList(fullPokemonInfo);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  const filteredList: Pokemon[] = pokemonList.filter((pokemon: Pokemon) =>
    pokemon.name
      .toLowerCase()
      .trim()
      .includes(search.toLocaleLowerCase().trim()),
  );

  return (
    <main className=" mx-auto flex flex-col items-center">
      <span className="flex gap-1">
        Powered by:
        <a
          href="https://pokeapi.co/"
          className="text-blue-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          PokeAPI
        </a>
      </span>
      <h1 className="font-bold text-6xl mb-10">Pokedex</h1>
      <input
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        type="text"
        placeholder="digite o nome do pokemon... Ex.bulbassauro"
        className="w-100 py-2 px-5 border-2 border-rule ring-1 ring-fire outline-none"
      />
      <span className="font-bold">
        {filteredList.length}/151 pokemons encontrados
      </span>

      {loading ? (
        <h1>Carregando Pokedex...</h1>
      ) : (
        <ul className="flex flex-wrap gap-4 mt-5 items-center justify-center">
          {filteredList.map((pokeList: Pokemon) => {
            const primaryType: keyof Variant = pokeList.type[0]?.type
              .name as keyof Variant;
            return (
              <li
                key={pokeList.id}
                className={`${variantStyles[primaryType]} border-2  rounded-lg p-3 flex flex-col items-center cursor-pointer hover:shadow-2xl transform min-w-50`}
              >
                <span className="font-mono">
                  #{pokeList.id.toString().padStart(3, "0")}
                </span>
                <img
                  src={pokeList.img}
                  alt={pokeList.name}
                  className="hover:animate-bounce transition ease-linear w-full"
                />
                <p className="text-base capitalize">{pokeList.name}</p>

                <div className="flex gap-1">
                  {pokeList.type.map((type: PokeList, index: number) => (
                    <span
                      key={index}
                      className={`${variantStyles[type.type.name as keyof Variant]} border text-[14px]  rounded-sm px-2 capitalize`}
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
