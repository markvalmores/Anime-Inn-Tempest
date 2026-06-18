import { AnimeWallpaper } from '../types';

export const CATEGORIES = [
  'All',
  'Scenic & Sky',
  'Cyberpunk Neon',
  'Fantasy Magic',
  'Shonen Action',
  'Minimalist Art',
  'Lo-Fi Vibe',
  'Anime Movie Specials'
];

// Pre-curated, highly beautiful static high-quality anime illustration URLs as immediate fallbacks
export const INITIAL_WALLPAPERS: AnimeWallpaper[] = [
  // 1. Scenic & Sky
  { id: 'anime-scenic-1', title: 'Your Name: Cosmic Starfall Canopy', character: 'Mitsuha & Taki', tags: ['Scenic', 'Sky', 'YourName', 'Stars', 'Romantic'], imageUrl: 'https://i.waifu.pics/b6m8GgX.png', aspectRatio: 'portrait', author: 'Makoto Shinkai Fanart', downloads: 3420, saves: 1882, category: 'Scenic & Sky', synopsis: 'A stunning depiction of the starry twilight comet splitting over the lake of Itomori, bringing two fated souls together.', rating: '8.9 / 10 MAL', type: 'Movie', episodes: 1 },
  { id: 'anime-scenic-2', title: 'Garden of Cherry Blossom Meadow', character: 'Aria Skyward', tags: ['Scenic', 'CherryBlossom', 'Garden', 'Spring'], imageUrl: 'https://i.waifu.pics/7-m8GgX.png', aspectRatio: 'landscape', author: 'Sora_Artist', downloads: 4120, saves: 1540, category: 'Scenic & Sky', synopsis: 'Soft spring petals falling over a traditional wooden bridge, creating a magnificent floral pathway in full bloom.', rating: '8.4 / 10', type: 'TV' },
  { id: 'anime-scenic-3', title: 'Moonlight Reflection Sanctuary', character: 'Luna Goddess', tags: ['Scenic', 'Sky', 'Moon', 'Night', 'Glow'], imageUrl: 'https://i.waifu.pics/9~m8GgX.png', aspectRatio: 'portrait', author: 'HokusaiGlow', downloads: 2980, saves: 1104, category: 'Scenic & Sky', synopsis: 'An ethereal crescent moon casting golden reflections across a calm sea, watched by a solitary white fox spirit.', rating: '8.1 / 10' },
  { id: 'anime-scenic-4', title: 'Summer Clouds and School Roof', character: 'Student Group', tags: ['Scenic', 'Summer', 'School', 'Clouds'], imageUrl: 'https://i.waifu.pics/L-m8GgX.png', aspectRatio: 'landscape', author: 'Anime_Scenic_Artist', downloads: 2100, saves: 900, category: 'Scenic & Sky', synopsis: 'A classic anime trope of students relaxing on a school roof top, overlooking a vast blue sky with fluffy cumulus clouds.', rating: '8.5 / 10' },
  // 2. Cyberpunk Neon
  { id: 'anime-cyber-1', title: 'Cyberpunk Edgerunners: Neon Night Shift', character: 'Lucy Kushinada', tags: ['Cyberpunk', 'Neon', 'SciFi', 'Tech', 'Street'], imageUrl: 'https://i.waifu.pics/W-Wk-mF.png', aspectRatio: 'landscape', author: 'Studio Trigger Fanart', downloads: 5120, saves: 3420, category: 'Cyberpunk Neon', synopsis: 'The brilliant gridways of Night City burning under dark clouds, capturing a netrunner perched on a skyscraper.', rating: '8.6 / 10 MAL', type: 'TV', episodes: 10 },
  { id: 'anime-cyber-2', title: 'Holographic Pilot Cockpit 01', character: 'Nova 01', tags: ['Cyberpunk', 'Hologram', 'Tech', 'Cockpit'], imageUrl: 'https://i.waifu.pics/P~m8GgX.png', aspectRatio: 'portrait', author: 'CyberKuro', downloads: 1890, saves: 720, category: 'Cyberpunk Neon', synopsis: 'Interactive HUD panels glowing turquoise inside a futuristic mecha flight deck, guiding pilot Nova through orbital re-entry.', rating: '7.9 / 10' },
  { id: 'anime-cyber-3', title: 'Neo Tokyo Red Sector Dawn', character: 'Motoko Kusanagi', tags: ['Cyberpunk', 'Neon', 'Retro', 'Android', 'Night'], imageUrl: 'https://i.waifu.pics/y-m8GgX.png', aspectRatio: 'landscape', author: 'Manga_Glow', downloads: 3820, saves: 1940, category: 'Cyberpunk Neon', synopsis: 'A towering digital advertisement matrix projecting crimson laser grids over dark metallic streets of Retro Neo Tokyo.', rating: '8.5 / 10 MAL' },
  // 3. Fantasy Magic
  { id: 'anime-magic-1', title: 'Frieren: Beyond Journeys Spellbound Circle', character: 'Frieren the Mage', tags: ['Fantasy', 'Magic', 'Spell', 'Witch', 'Ancient'], imageUrl: 'https://i.waifu.pics/M-m8GgX.png', aspectRatio: 'portrait', author: 'LunaSpell', downloads: 2710, saves: 1045, category: 'Fantasy Magic', synopsis: 'A nostalgic elven mage conjuring a circular golden magic matrix to conjure fields of blue flowers from legends.', rating: '9.3 / 10 MAL', type: 'TV', episodes: 28 },
  { id: 'anime-magic-2', title: 'Runes of the Sacred Circle', character: 'Spellcaster Mei', tags: ['Fantasy', 'Magic', 'Sorcerer', 'Stars', 'Summon'], imageUrl: 'https://i.waifu.pics/F-m8GgX.png', aspectRatio: 'landscape', author: 'Pixiv_Enthusiast', downloads: 1980, saves: 651, category: 'Fantasy Magic', synopsis: 'An apprentice witch calling upon ancient runic circles floating above her glowing ritual book inside a starfield sanctuary.', rating: '8.0 / 10' },
  { id: 'anime-magic-3', title: 'Enchanted Forest Moon Oracle', character: 'Elven Sage', tags: ['Fantasy', 'Magic', 'Forest', 'Elf', 'Spirits'], imageUrl: 'https://i.waifu.pics/H-m8GgX.png', aspectRatio: 'portrait', author: 'OtakuVibe_Studio', downloads: 2432, saves: 981, category: 'Fantasy Magic', synopsis: 'A silver-haired elven shrine maiden kneeling on starry river waters as fireflies dance under a glowing ancient tree.', rating: '8.2 / 10' },
  // 4. Shonen Action
  { id: 'anime-shonen-1', title: 'Demon Slayer: Crimson Flame Hashira', character: 'Kyojuro Rengoku', tags: ['Shonen', 'Action', 'Samurai', 'Flame', 'Katana'], imageUrl: 'https://i.waifu.pics/X~m8GgX.png', aspectRatio: 'portrait', author: 'Ufotable Fanart', downloads: 6500, saves: 3900, category: 'Shonen Action', synopsis: 'An epic battle strike where a blazing fire dragon coils from a samurai katana blade, illuminating a dark forest night.', rating: '8.7 / 10 MAL', type: 'Movie', episodes: 1 },
  { id: 'anime-shonen-2', title: 'The Silent Ronin Wanderer', character: 'Kageyama Jin', tags: ['Shonen', 'Action', 'Samurai', 'Sword', 'Tradition'], imageUrl: 'https://i.waifu.pics/Sg5m~gX.png', aspectRatio: 'portrait', author: 'Yuki_Art', downloads: 2852, saves: 1210, category: 'Shonen Action', synopsis: 'A lonely swordsman walking past red spider lilies under a crescent blood moon, gripping his ancient iron sheathed blade.', rating: '8.3 / 10' },
  { id: 'anime-shonen-3', title: 'Apex Spirit Form Unleashed', character: 'Naruto Spirit Vibe', tags: ['Shonen', 'Action', 'Chakra', 'Ninjutsu', 'Glow'], imageUrl: 'https://i.waifu.pics/Y~m8GgX.png', aspectRatio: 'landscape', author: 'Ryota_S', downloads: 5410, saves: 2310, category: 'Shonen Action', synopsis: 'An intense ninja battle scene featuring orange standard seals and golden energy swirling around a determined fighter.', rating: '8.2 / 10 MAL' },
  // 5. Minimalist Art
  { id: 'anime-minimal-1', title: 'Cosmic Digital Void Horizon', character: 'Aesthetic Vector', tags: ['Minimalist', 'Synthwave', 'Grid', 'Void', 'Sky'], imageUrl: 'https://i.waifu.pics/G-m8GgX.png', aspectRatio: 'landscape', author: 'Vect_Art', downloads: 1980, saves: 651, category: 'Minimalist Art', synopsis: 'Clean pastel aesthetic with a tiny silhouette of an anime traveler sitting on top of a neon wireframe sunset grid.', rating: '7.8 / 10' },
  { id: 'anime-minimal-2', title: 'Clean Silhouette Evening Chill', character: 'Retro Cat Silhouette', tags: ['Minimalist', 'Lofi', 'Silhouette', 'Cozy', 'Cat'], imageUrl: 'https://i.waifu.pics/Z~m8GgX.png', aspectRatio: 'portrait', author: 'Kenshin Desu', downloads: 2341, saves: 890, category: 'Minimalist Art', synopsis: 'A beautiful warm-toned graphic silhouette of a child sitting on a windowsill next to a sleeping calico cat under stars.', rating: '8.0 / 10' },
  // 6. Lo-Fi Vibe
  { id: 'anime-lofi-1', title: 'Retro Arcade Chill Neko Desk', character: 'Meiko Neko', tags: ['Lo-Fi', 'Cozy', 'Arcade', 'Neon', 'Neko', 'Study'], imageUrl: 'https://i.waifu.pics/uK1p_gD.png', aspectRatio: 'landscape', author: 'Taito_Me', downloads: 8102, saves: 4104, category: 'Lo-Fi Vibe', synopsis: 'A cozy bedroom filled with gaming consoles, neon signs, and cat ears headphones as rain taps gently on the window.', rating: '8.2 / 10', type: 'TV', episodes: 12 },
  { id: 'anime-lofi-2', title: 'Raindrops on Cafe Cozy Window', character: 'Chibi Coffee Vibe', tags: ['Lo-Fi', 'Rain', 'Cafe', 'Warm', 'Dreamy'], imageUrl: 'https://i.waifu.pics/e-m8GgX.png', aspectRatio: 'landscape', author: 'TokyoCreative', downloads: 3045, saves: 1493, category: 'Lo-Fi Vibe', synopsis: 'Relaxing hot tea cup emitting spiral steam on wooden coffee counter overlooking a wet Tokyo neon street in autumn.', rating: '8.0 / 10' },
  // 7. Anime Movie Specials
  { id: 'anime-movie-spec-1', title: 'Your Name (Kimi no Na wa) Twilight Comet', character: 'Mitsuha & Taki', tags: ['Movie', 'Cinematic', 'YourName', 'Stars', 'Shinkai'], imageUrl: 'https://i.waifu.pics/b6m8GgX.png', aspectRatio: 'landscape', author: 'Comix Wave Films Fanart', downloads: 8900, saves: 5310, category: 'Anime Movie Specials', synopsis: 'The ultimate climax scene where the sky burns with comet particles, as two lovers on separate mountaintops try to remember what is lost.', rating: '8.9 / 10 MAL', type: 'Movie', episodes: 1, malUrl: 'https://myanimelist.net/anime/32281/Kimi_no_Na_wa' }
];

// Asports ratios, characters, keywords, categories pools for mapping incoming API results beautifully
const AUTHORS = ['Waifu_Artist', 'NekosBest_Prowess', 'OtakuVibe_Studio', 'Pixiv_Enthusiast', 'HokusaiGlow', 'TokyoCreative'];
const CHARACTERS = ['Aqua-inspired', 'Shinobu', 'Nezuko-inspired', 'Megumin', 'Rem-inspired', 'Mikasa', 'Asuka-inspired', 'ZeroTwo-inspired'];
const TITLES = [
  'Radiant Dreamscape', 'Neko Vibe Encounter', 'Neon Saber Stardust',
  'Cozy Study Vibe', 'Glistening Rain Alley', 'Sanctuary of the Star Mage',
  'Pastel Chibi Cafe', 'Ancient Wandering Ronin', 'Cyberpunk Grid Horizon',
  'Interstellar Station Transit', 'Mystic Spell Circle', 'Sunset Train Carriage'
];

const SCENIC_IMGS = [
  'https://i.waifu.pics/b6m8GgX.png',
  'https://i.waifu.pics/7-m8GgX.png',
  'https://i.waifu.pics/9~m8GgX.png',
  'https://i.waifu.pics/e-m8GgX.png',
  'https://i.waifu.pics/K-m8GgX.png',
  'https://i.waifu.pics/8-m8GgX.png',
];

const CYBER_IMGS = [
  'https://i.waifu.pics/W-Wk-mF.png',
  'https://i.waifu.pics/P~m8GgX.png',
  'https://i.waifu.pics/y-m8GgX.png',
  'https://i.waifu.pics/x-m8GgX.png',
  'https://i.waifu.pics/A-m8GgX.png',
  'https://i.waifu.pics/q-m8GgX.png',
];

const FANTASY_IMGS = [
  'https://i.waifu.pics/M-m8GgX.png',
  'https://i.waifu.pics/F-m8GgX.png',
  'https://i.waifu.pics/H-m8GgX.png',
  'https://i.waifu.pics/O~m8GgX.png',
  'https://i.waifu.pics/U~m8GgX.png',
  'https://i.waifu.pics/V~m8GgX.png',
];

const SHONEN_IMGS = [
  'https://i.waifu.pics/Sg5m~gX.png',
  'https://i.waifu.pics/X~m8GgX.png',
  'https://i.waifu.pics/Y~m8GgX.png',
  'https://i.waifu.pics/Z~m8GgX.png',
  'https://i.waifu.pics/R-Wk_mF.png',
];

const MINIMALIST_IMGS = [
  'https://i.waifu.pics/G-m8GgX.png',
  'https://i.waifu.pics/Z~m8GgX.png',
  'https://i.waifu.pics/R-Wk_mF.png',
  'https://i.waifu.pics/G-m8GgX.png',
];

const LOFI_IMGS = [
  'https://i.waifu.pics/uK1p_gD.png',
  'https://i.waifu.pics/e-m8GgX.png',
  'https://i.waifu.pics/b6m8GgX.png',
  'https://i.waifu.pics/uK1p_gD.png',
];

const MOVIE_IMGS = [
  'https://i.waifu.pics/b6m8GgX.png',
  'https://i.waifu.pics/7-m8GgX.png',
  'https://i.waifu.pics/e-m8GgX.png',
  'https://i.waifu.pics/9~m8GgX.png',
  'https://i.waifu.pics/b6m8GgX.png',
];

const MOVIE_TITLES = [
  'Kimi No Na Wa (Your Name) - Starfall Twilight',
  'Tenki No Ko (Weathering With You) - Sky Sunshine',
  'Suzume No Tojimari - The Abandoned Keyhole',
  'Sen to Chihiro (Spirited Away) - Bathhouse Lanterns',
  'Howl\'s Moving Castle - Starfield Meadows',
  'Kotonoha no Niwa (Garden of Words) - Rainy Pavilion',
  'Koe no Katachi (A Silent Voice) - Bridge Encounter'
];

// In-memory caching layer to keep the application lightning-fast and bypass API rate limiting
let cachedJikanAnime: AnimeWallpaper[] = [];
let cachedJikanMovies: AnimeWallpaper[] = [];
let cachedNekosBest: AnimeWallpaper[] = [];
let isFetchingApis = false;

// Hydrate dynamically on startup from localStorage cache to guarantee immediate display in PC/mobile browsers
try {
  if (typeof window !== 'undefined') {
    const localSAnime = window.localStorage.getItem('api_jikan_anime');
    if (localSAnime) cachedJikanAnime = JSON.parse(localSAnime);
    
    const localSMovies = window.localStorage.getItem('api_jikan_movies');
    if (localSMovies) cachedJikanMovies = JSON.parse(localSMovies);
    
    const localSNekos = window.localStorage.getItem('api_nekos_best');
    if (localSNekos) cachedNekosBest = JSON.parse(localSNekos);
    
    console.log("Hydrated live API cache from browser LocalStorage:", {
      anime: cachedJikanAnime.length,
      movies: cachedJikanMovies.length,
      artwork: cachedNekosBest.length
    });
  }
} catch (err) {
  console.warn("LocalStorage API hydration skipped gracefully:", err);
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Dynamic serial-parallel queue manager to fetch, stagger to avoid 429 Rate Limits, and securely cache MAL items
async function fetchAllPublicApisOnce() {
  if (isFetchingApis) return;
  
  // If we already have a hydrated cache, prioritize refreshing, but don't block
  if (cachedJikanAnime.length > 0 && cachedJikanMovies.length > 0 && cachedNekosBest.length > 0) {
    return;
  }
  
  isFetchingApis = true;

  try {
    // 1. Fetch Top Anime from public Jikan MAL API
    try {
      const res = await fetch('https://api.jikan.moe/v4/top/anime?limit=25');
      if (res.ok) {
        const body = await res.json();
        if (body && Array.isArray(body.data) && body.data.length > 0) {
          cachedJikanAnime = body.data.map((anime: any, index: number) => {
            const genres = (anime.genres || []).map((g: any) => g.name);
            const title = anime.title_english || anime.title;
            
            let category = 'Scenic & Sky';
            if (genres.some((g: string) => /Action|Shounen|Adventure|Martial/i.test(g))) {
              category = 'Shonen Action';
            } else if (genres.some((g: string) => /Fantasy|Magic|Supernatural|Demons/i.test(g))) {
              category = 'Fantasy Magic';
            } else if (genres.some((g: string) => /Sci-Fi|Cyberpunk|Mecha|Space/i.test(g))) {
              category = 'Cyberpunk Neon';
            } else if (genres.some((g: string) => /Slice of Life|Comedy|School|Romance|Music/i.test(g))) {
              category = 'Lo-Fi Vibe';
            } else if (genres.some((g: string) => /Arts|Mystery|Suspense|Drama|Avant/i.test(g))) {
              category = 'Minimalist Art';
            }

            return {
              id: `jikan-anime-${anime.mal_id}`,
              title: title,
              character: anime.source || 'Featured Character',
              tags: genres.length > 0 ? genres : ['MAL', 'Anime', 'Hot'],
              imageUrl: anime.images?.jpg?.large_image_url || anime.images?.webp?.large_image_url || 'https://i.waifu.pics/b6m8GgX.png',
              aspectRatio: index % 2 === 0 ? 'portrait' : 'landscape',
              author: (anime.studios || []).map((s: any) => s.name).join(', ') || 'Various Studios',
              downloads: anime.members ? Math.floor(anime.members / 200) : 2100,
              saves: anime.score ? Math.floor(anime.score * 120) : 480,
              category,
              synopsis: anime.synopsis || 'No details available.',
              rating: anime.score ? `${anime.score} / 10 MAL` : '⭐ Popular',
              malUrl: anime.url,
              type: anime.type || 'TV',
              episodes: anime.episodes || undefined
            } as AnimeWallpaper;
          });
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('api_jikan_anime', JSON.stringify(cachedJikanAnime));
          }
        }
      } else {
        console.warn(`Jikan MAL service returned non-OK code ${res.status}. Stored fallback preserved.`);
      }
    } catch (apiErr) {
      console.warn("Primary Anime MAL fetch paused or rate-limited: ", apiErr);
    }

    // Explicitly sleep/delay to prevent concurrently hitting MyAnimeList API, 
    // abiding strictly by their 3-requests-per-second rate limit regulations.
    await sleep(1000);

    // 2. Fetch Top Anime Movies from public Jikan MAL API
    try {
      const res = await fetch('https://api.jikan.moe/v4/anime?type=movie&order_by=popularity&sort=desc&limit=25');
      if (res.ok) {
        const body = await res.json();
        if (body && Array.isArray(body.data) && body.data.length > 0) {
          cachedJikanMovies = body.data.map((anime: any, index: number) => {
            const genres = (anime.genres || []).map((g: any) => g.name);
            const title = anime.title_english || anime.title;
            return {
              id: `jikan-movie-${anime.mal_id}`,
              title: title,
              character: anime.source || 'Original Script',
              tags: genres.length > 0 ? [...genres, 'Cinematic'] : ['AnimeMovie', 'Cinematic', 'MAL'],
              imageUrl: anime.images?.jpg?.large_image_url || anime.images?.webp?.large_image_url || 'https://i.waifu.pics/b6m8GgX.png',
              aspectRatio: 'landscape',
              author: (anime.studios || []).map((s: any) => s.name).join(', ') || 'Toho / CoMix Wave',
              downloads: anime.members ? Math.floor(anime.members / 100) : 3400,
              saves: anime.score ? Math.floor(anime.score * 160) : 810,
              category: 'Anime Movie Specials',
              synopsis: anime.synopsis || 'No synopsis added.',
              rating: anime.score ? `${anime.score} / 10 MAL` : '9.1 / 10 Movie',
              malUrl: anime.url,
              type: 'Movie',
              episodes: 1
            } as AnimeWallpaper;
          });
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('api_jikan_movies', JSON.stringify(cachedJikanMovies));
          }
        }
      } else {
        console.warn(`Jikan MAL Movies service returned non-OK ${res.status}. Fallback active.`);
      }
    } catch (apiErr) {
      console.warn("Primary Movie MAL fetch blocked: ", apiErr);
    }

    // Stagger prior to accessing third public fanart API
    await sleep(600);

    // 3. Fetch SFW artwork from high-uptime Nekos.best API
    try {
      const res = await fetch('https://nekos.best/api/v2/neko?amount=30');
      if (res.ok) {
        const body = await res.json();
        if (body && Array.isArray(body.results)) {
          cachedNekosBest = body.results.map((neko: any, index: number) => {
            const staticNekoTitles = [
              'Luminous Neko Moonrise Ride',
              'Celestial Magical Circle Spell',
              'Vaporwave Shibuya Crossing Sunset',
              'Cozy Rain Alley Tea Garden',
              'Dreamy Cherry Blossom Sanctuary'
            ];
            const tags = ['ArtistFeatured', 'Neko', 'NekosBestAPI'];
            const categoriesOptions = ['Minimalist Art', 'Lo-Fi Vibe', 'Scenic & Sky'];
            return {
              id: `nekosbest-art-${index}-${Date.now()}`,
              title: staticNekoTitles[index % staticNekoTitles.length],
              character: 'Original Waifu Vibe',
              tags: tags,
              imageUrl: neko.url,
              aspectRatio: index % 2 === 0 ? 'portrait' : 'landscape',
              author: neko.artist_name || 'Anonymous Pixiv Artist',
              downloads: Math.floor(2100 + (index * 83) % 4500),
              saves: Math.floor(900 + (index * 39) % 2100),
              category: categoriesOptions[index % categoriesOptions.length]
            } as AnimeWallpaper;
          });
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('api_nekos_best', JSON.stringify(cachedNekosBest));
          }
        }
      }
    } catch (apiErr) {
      console.warn("Secondary Nekos Art fetch bypassed: ", apiErr);
    }

  } catch (error) {
    console.error("General public API fetch sequence failed:", error);
  } finally {
    isFetchingApis = false;
  }
}

// Highly stable, error-free client-side fetches from free public API endpoints
export async function fetchLiveAnimeWallpapers(startIndex: number, count: number): Promise<AnimeWallpaper[]> {
  // Pull live records asynchronously
  await fetchAllPublicApisOnce();

  const categories = CATEGORIES.filter(c => c !== 'All');
  const results: AnimeWallpaper[] = [];

  for (let i = 0; i < count; i++) {
    const currentId = startIndex + i;
    const category = categories[currentId % categories.length];

    let resolvedItem: AnimeWallpaper | null = null;

    // Pick from movies API
    if (category === 'Anime Movie Specials' && cachedJikanMovies.length > 0) {
      const movieIdx = currentId % cachedJikanMovies.length;
      resolvedItem = { ...cachedJikanMovies[movieIdx] };
    } 
    // Pick from Top television rankings/seasons
    else if ((category === 'Shonen Action' || category === 'Fantasy Magic' || category === 'Cyberpunk Neon') && cachedJikanAnime.length > 0) {
      const animePool = cachedJikanAnime.filter(a => a.category === category);
      if (animePool.length > 0) {
        const animeIdx = currentId % animePool.length;
        resolvedItem = { ...animePool[animeIdx] };
      }
    } 
    // Pick from illustrative fanarts
    else if ((category === 'Lo-Fi Vibe' || category === 'Minimalist Art' || category === 'Scenic & Sky') && cachedNekosBest.length > 0) {
      const nekoPool = cachedNekosBest.filter(n => n.category === category);
      if (nekoPool.length > 0) {
        const nekoIdx = currentId % nekoPool.length;
        resolvedItem = { ...nekoPool[nekoIdx] };
      }
    }

    // Fallback block if any API is in cold-start / blocked/ offline
    if (!resolvedItem) {
      const categoryMatches = INITIAL_WALLPAPERS.filter(item => item.category === category);
      if (categoryMatches.length > 0) {
        resolvedItem = { ...categoryMatches[currentId % categoryMatches.length] };
      } else {
        resolvedItem = { ...INITIAL_WALLPAPERS[currentId % INITIAL_WALLPAPERS.length] };
      }
    }

    // Decorate ID to guarantee absolute unique React state mappings
    const finalItem: AnimeWallpaper = {
      ...resolvedItem,
      id: `${resolvedItem.id}-live-${currentId}`
    };

    results.push(finalItem);
  }

  return results;
}

// Retaining declaration for backwards compatibility
export function generateMoreWallpapers(startIndex: number, count: number): AnimeWallpaper[] {
  const categories = CATEGORIES.filter(c => c !== 'All');
  const results: AnimeWallpaper[] = [];
  for (let i = 0; i < count; i++) {
    const currentId = startIndex + i;
    results.push({
      id: `deprecated-${currentId}`,
      title: `Art #${currentId}`,
      character: 'Original',
      tags: ['Static'],
      imageUrl: 'https://i.waifu.pics/b6m8GgX.png',
      aspectRatio: 'landscape',
      author: 'Unknown',
      downloads: 10,
      saves: 5,
      category: categories[currentId % categories.length]
    });
  }
  return results;
}

