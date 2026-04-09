import { Icon } from "@iconify/react"
import { useState } from "react"
import useSWR from "swr"
import { useStringQueryParam } from "@utilities/useStringQueryParam"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import Fuse from "fuse.js"
dayjs.extend(utc)
dayjs.extend(timezone)

var strapi_key = process.env.NEXT_PUBLIC_STRAPI_KEY

const colorGradients = [
  'from-orange-500 to-red-600',
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-purple-500 to-violet-600',
  'from-amber-500 to-orange-600',
  'from-cyan-500 to-blue-600',
];

const ErrorMessageBox = ({ message, onRetry }) => (
  <div className="m-5 p-5 bg-red-100 text-red-800 rounded-md text-center">
    <p>{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-2 px-4 py-2 bg-white text-black rounded shadow hover:bg-gray-100"
      >
        Retry
      </button>
    )}
  </div>
)

const SpecialEventCard = ({ event, idx, toggleFavorite }) => {
  const [expanded, setExpanded] = useState(false);
  const gradient = colorGradients[idx % colorGradients.length];

  return (
    <button
      key={idx}
      className="group cursor-pointer transition-all hover:scale-[1.02] relative border-0 bg-transparent p-0 text-left md:w-96 w-full"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Spark particles on hover */}
      <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping pointer-events-none"></div>
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping pointer-events-none" style={{ animationDelay: '0.1s' }}></div>
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping pointer-events-none" style={{ animationDelay: '0.2s' }}></div>
      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-orange-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping pointer-events-none" style={{ animationDelay: '0.15s' }}></div>

      <div className={`bg-gradient-to-br ${gradient} rounded-3xl p-6 shadow-xl border-2 border-white/30 relative overflow-hidden`}>
        {/* Metal texture overlay */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%),
              repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.05) 3px),
              repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.05) 3px)
            `,
            backgroundSize: '200% 100%, 3px 3px, 3px 3px'
          }}
        ></div>

        {/* Diagonal stripe pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
          }}
        ></div>

        {/* Metallic shine effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-3xl group-hover:from-white/60 transition-all"></div>

        {/* Industrial rivets */}
        <div className="absolute top-3 left-3 w-2 h-2 bg-white/30 rounded-full border border-white/50 shadow-inner"></div>
        <div className="absolute top-3 right-3 w-2 h-2 bg-white/30 rounded-full border border-white/50 shadow-inner"></div>
        <div className="absolute bottom-3 left-3 w-2 h-2 bg-white/30 rounded-full border border-white/50 shadow-inner"></div>
        <div className="absolute bottom-3 right-3 w-2 h-2 bg-white/30 rounded-full border border-white/50 shadow-inner"></div>

        <div className={`relative flex flex-col gap-3 overflow-hidden transition-all duration-300 ${expanded ? '' : 'h-64'}`}>
          {/* Header row with title and favorite button */}
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-bold text-white text-center flex-1">{event.title}</h2>
            <button
              className="w-8 h-8 flex items-center justify-center flex-shrink-0"
              onClick={(e) => { e.stopPropagation(); toggleFavorite(event.id); }}
            >
              <Icon
                icon="ic:round-star"
                className={`text-2xl duration-200 ${event.favorite ? 'text-yellow-300' : 'text-white/40'}`}
              />
            </button>
          </div>

          {/* Location & Time */}
          <div className="flex flex-col gap-1">
            {event.location && (
              <span className="flex flex-row gap-2 items-center">
                <Icon icon="carbon:location-filled" className="text-xl text-white/80" />
                <span className="text-white/90">{event.location}</span>
              </span>
            )}
            <span className="flex flex-row gap-2 items-center">
              <Icon icon="mingcute:time-line" className="text-xl text-white/80" />
              <span className="text-white/90">Click to see times!</span>
            </span>
          </div>

          {/* Description */}
          <div className={`text-white/90 leading-relaxed my-1 ${expanded ? '' : 'line-clamp-4'}`}>
            <div dangerouslySetInnerHTML={{ __html: event.description }} />
          </div>

          {/* Event Times (expanded only) */}
          {expanded && (
            <div className="flex flex-col w-full gap-2">
              <h3 className="font-bold text-white">Event Times</h3>
              <ul className="flex flex-col gap-1">
                {event.slots.map((slot) => (
                  <li key={slot.display} className="text-white/90 text-sm">{slot.display}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Expand icon */}
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/25 backdrop-blur border border-white/30 group-hover:bg-white/40 transition-all">
              <Icon
                className="text-white text-xl"
                icon={expanded ? 'material-symbols:expand-less' : 'material-symbols:expand-more'}
              />
            </div>
          </div>
        </div>

        {/* Bottom heated metal accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:via-yellow-300/70 transition-all"></div>
      </div>
    </button>
  );
};

const SpecialEvents = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useStringQueryParam("sq", "");
  const [searchBoxText, setSearchBoxText] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const itemsPerPage = 30

  const fetcher = (url) => fetch(url, {
    headers: {
      'Authorization': `Bearer ${strapi_key}`
    }
  }).then((res) => res.json());

  const { data, error } = useSWR(
    `https://loved-vitality-4672033e09.strapiapp.com/api/events?populate=occurences&pagination[pageSize]=100`,
    fetcher
  )

  if (error) return <ErrorMessageBox message="Failed to load. Please try again." onRetry={() => window.location.reload()} />
  if (!data) return (
    <div className="flex w-full justify-center items-center flex-col">
      <p className="font-bold text-xl m-4">Loading...</p>
      <img src="/assets/logo/gear1.gif" alt="loading" className="w-20" />
    </div>
  )

  const items = data.data.map((event, idx) => {
    const occurences = event.occurences.map((occ) => ({
      startTime: dayjs.utc(occ.startTime).tz('Europe/Vienna').tz('America/Chicago', true),
      endTime: dayjs.utc(occ.endTime).tz('Europe/Vienna').tz('America/Chicago', true),
      colIndex: idx,
    })).map((slot) => {
      return { display: `${slot.startTime.format("dddd")}, ${slot.startTime.format("h:mm")} to ${slot.endTime.format("h:mm a")}` }
    })
    return {
      id: idx,
      title: event.title || "",
      location: event.location || "",
      description: event.description || "",
      slots: occurences,
      favorite: false,
      picture: event.picture?.url || "",
      shortTitle: event.shortTitle || "",
    }
  })

  const fuseOptions = {
    includeScore: true,
    threshold: 0.35,
    distance: 100,
    minMatchCharLength: 2,
    ignoreLocation: true,
    keys: ['title', 'description', 'location']
  }
  const fuse = new Fuse(items, fuseOptions)
  const trimmedQuery = searchTerm.trim()
  const fuseResults = trimmedQuery ? fuse.search(trimmedQuery) : null
  const filteredItems = fuseResults ? fuseResults.map(res => res.item) : items

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const runSearch = () => {
    setSearchTerm(searchBoxText.trim())
    setSearchBoxText("")
    setSearchOpen(false)
    setCurrentPage(1)
  }

  const EventsContainer = ({ initialItems }) => {
    const [items, setItems] = useState(() => {
      // Load favorited events from localStorage
      const storedFavorites = JSON.parse(localStorage.getItem("favoritedEvents")) || {};
      return initialItems.map(item => ({
          ...item,
          favorite: storedFavorites[item.id] || false, // Apply stored favorite status
      }));
    });

    const toggleFavorite = (id) => {
        setItems((prev) => {
            const updatedItems = prev.map((i) =>
                i.id === id ? { ...i, favorite: !i.favorite } : i
            );

            // Save updated favorite status in localStorage
            const newFavorites = updatedItems.reduce((acc, item) => {
                acc[item.id] = item.favorite;
                return acc;
            }, {});

            localStorage.setItem("favoritedEvents", JSON.stringify(newFavorites));

            return updatedItems;
        });
    };  
    return (
      <div>
        <h1 className="font-heading text-3xl mt-2 md:text-center md:mx-0 m-10">Favorited Events</h1>
        <div className="w-full flex flex-wrap justify-center gap-5 px-4 max-w-screen-xl mx-auto">
          {items.filter(i => i.favorite).map((item, idx) => <SpecialEventCard event={item} idx={idx} key={idx} toggleFavorite={toggleFavorite} />)}
        </div>
        <h1 className="font-heading text-3xl mt-2 md:text-center md:mx-0 m-10">All Events</h1>
        <div className="w-full flex flex-wrap justify-center gap-5 px-4 max-w-screen-xl mx-auto">
          {items.map((item, idx) => <SpecialEventCard event={item} idx={idx} key={idx} toggleFavorite={toggleFavorite} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <span className="flex flex-row justify-between mx-8">
        <h1 className="font-heading text-5xl mt-2 md:text-center md:mx-0">Special Events</h1>
        <button onClick={() => setSearchOpen(!searchOpen)}>
          <Icon icon="bx:search" className="text-3xl" />
        </button>
      </span>

      {searchOpen && (
        <span className="flex flex-row w-full px-5">
          <input
            className="border rounded-l-xl p-2 border-gray-600 duration-300 flex-grow"
            placeholder="Search title, description, or location"
            onChange={(e) => setSearchBoxText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch()}
            value={searchBoxText}
          />
          <button
            className="rounded-r-xl bg-blue-700 p-3 font-semibold text-white"
            onClick={runSearch}
          >
            Go
          </button>
        </span>
      )}

      {searchTerm.length > 0 && (
        <div className="flex flex-row px-5 justify-between items-center">
          <p>Searching for: <span className="font-semibold">{searchTerm}</span></p>
          <button onClick={() => { setSearchTerm(""); setSearchOpen(false) }}>
            <Icon icon="mdi:clear-outline" className="text-black text-3xl" />
          </button>
        </div>
      )}

      <EventsContainer initialItems={filteredItems} />

      <div className="flex flex-row justify-between items-center mx-5">
        <p>Page {currentPage} of {totalPages}</p>
        <div className="flex flex-row gap-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="disabled:text-gray-500">
            <Icon icon="ic:round-navigate-before" className='text-3xl' />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="disabled:text-gray-500">
            <Icon icon="ic:round-navigate-next" className='text-3xl' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SpecialEvents