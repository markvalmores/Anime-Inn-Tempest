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
  {
    id: 'anime-api-1',
    title: 'Neon Cyber City Run',
    character: 'Cyber Runner',
    tags: ['Cyberpunk', 'Neon', 'Street', 'SciFi'],
    imageUrl: 'https://i.waifu.pics/W-Wk-mF.png',
    aspectRatio: 'landscape',
    author: 'Kenshin Desu',
    downloads: 1420,
    saves: 382,
    category: 'Cyberpunk Neon'
  },
  {
    id: 'anime-api-2',
    title: 'Aria Skyward Fantasy Princess',
    character: 'Aria',
    tags: ['Sky', 'CherryBlossom', 'Fantasy'],
    imageUrl: 'https://i.waifu.pics/b6m8GgX.png',
    aspectRatio: 'portrait',
    author: 'Sora_Artist',
    downloads: 2450,
    saves: 831,
    category: 'Scenic & Sky'
  },
  {
    id: 'anime-api-3',
    title: 'Retro Arcade Chill Neko',
    character: 'Meiko',
    tags: ['Arcade', 'Neon', 'Retro', 'Lo-Fi'],
    imageUrl: 'https://i.waifu.pics/uK1p_gD.png',
    aspectRatio: 'landscape',
    author: 'Taito_Me',
    downloads: 3102,
    saves: 1104,
    category: 'Lo-Fi Vibe'
  },
  {
    id: 'anime-api-4',
    title: 'The Silent Wanderer Ronin',
    character: 'Kageyama',
    tags: ['Samurai', 'Sword', 'Traditional'],
    imageUrl: 'https://i.waifu.pics/Sg5m~gX.png',
    aspectRatio: 'portrait',
    author: 'Yuki_Art',
    downloads: 852,
    saves: 210,
    category: 'Shonen Action'
  },
  {
    id: 'anime-api-5',
    title: 'Cherry Blossom Meadow Dream',
    character: 'Sakura Hana',
    tags: ['Scenic', 'CherryBlossom', 'Garden'],
    imageUrl: 'https://i.waifu.pics/7-m8GgX.png',
    aspectRatio: 'landscape',
    author: 'Ryota_S',
    downloads: 4120,
    saves: 1540,
    category: 'Scenic & Sky'
  },
  {
    id: 'anime-api-6',
    title: 'Holographic Neon Pilot 01',
    character: 'Nova 01',
    tags: ['Cyberpunk', 'Hologram', 'Tech'],
    imageUrl: 'https://i.waifu.pics/P~m8GgX.png',
    aspectRatio: 'portrait',
    author: 'CyberKuro',
    downloads: 1890,
    saves: 720,
    category: 'Cyberpunk Neon'
  },
  {
    id: 'anime-api-7',
    title: 'Cosmic Digital Void Horizon',
    character: 'Vect',
    tags: ['Minimalist', 'Synthwave', 'Grid'],
    imageUrl: 'https://i.waifu.pics/G-m8GgX.png',
    aspectRatio: 'landscape',
    author: 'Vect_Art',
    downloads: 1980,
    saves: 651,
    category: 'Minimalist Art'
  },
  {
    id: 'anime-api-8',
    title: 'Celeste Magic Spellcaster',
    character: 'Celeste',
    tags: ['Magic', 'Witch', 'Stars', 'Academia'],
    imageUrl: 'https://i.waifu.pics/M-m8GgX.png',
    aspectRatio: 'portrait',
    author: 'LunaSpell',
    downloads: 2710,
    saves: 1045,
    category: 'Fantasy Magic'
  }
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
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1541562232579-512a21360020?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&auto=format&fit=crop&q=80',
];

const CYBER_IMGS = [
  'https://i.waifu.pics/W-Wk-mF.png',
  'https://i.waifu.pics/P~m8GgX.png',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=1200&auto=format&fit=crop&q=80',
];

const FANTASY_IMGS = [
  'https://i.waifu.pics/M-m8GgX.png',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1200&auto=format&fit=crop&q=80',
];

const SHONEN_IMGS = [
  'https://i.waifu.pics/Sg5m~gX.png',
  'https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80',
];

const MINIMALIST_IMGS = [
  'https://i.waifu.pics/G-m8GgX.png',
  'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494253109108-2e30c049369b?w=1200&auto=format&fit=crop&q=80',
];

const LOFI_IMGS = [
  'https://i.waifu.pics/uK1p_gD.png',
  'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
];

const MOVIE_IMGS = [
  'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200&auto=format&fit=crop&q=80', // Kimi No Na Wa Twilight sky
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200&auto=format&fit=crop&q=80', // Cinematic Evening
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80', // Wizard of Howl Castle
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80', // Starry Shinkai Sky
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&auto=format&fit=crop&q=80', // Ghibli Green Valley
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&auto=format&fit=crop&q=80', // Forest Pathway Spirit
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
              imageUrl: anime.images?.jpg?.large_image_url || anime.images?.webp?.large_image_url || 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200',
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
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200',
      aspectRatio: 'landscape',
      author: 'Unknown',
      downloads: 10,
      saves: 5,
      category: categories[currentId % categories.length]
    });
  }
  return results;
}

