import { Icon } from '@iconify/react';
import { useState } from 'react';
import useSWR from 'swr';
import Fuse from 'fuse.js';
import { useStringQueryParam } from '@utilities/useStringQueryParam';

var strapi_key = process.env.NEXT_PUBLIC_STRAPI_KEY

const ErrorMessageBox = ({ message, onRetry }) => (
  <div style={{ margin: '20px', padding: '20px', backgroundColor: '#ffcccc', color: '#cc0000', borderRadius: '5px', textAlign: 'center' }}>
    <p>{message}</p>
    {onRetry && (
      <button onClick={onRetry} style={{ marginTop: '10px', padding: '10px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#f2f2f2', border: 'none', borderRadius: '5px' }}>
        Retry
      </button>
    )}
  </div>
)

const colorGradients = [
  'from-orange-500 to-red-600',
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-purple-500 to-violet-600',
  'from-amber-500 to-orange-600',
  'from-cyan-500 to-blue-600',
];

const ExhibitCard = ({ exhibit, idx }) => {
  const [expanded, setExpanded] = useState(false);
  const gradient = colorGradients[idx % colorGradients.length];

  // LLMed the frontend using what was generated from Nathan's Figma
  return (
    <button
      className={`group cursor-pointer transition-all hover:scale-[1.02] relative border-0 bg-transparent p-0 text-left md:w-96 w-full`}
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
          {/* Header row */}
          <div className="flex items-center gap-2">
            <span className="bg-white/25 text-white backdrop-blur border border-white/30 px-2 py-0.5 rounded-full text-xs font-medium">
              {exhibit.id}
            </span>
            <h2 className="font-bold text-white">{exhibit.title}</h2>
          </div>

          {/* Location & Affiliation */}
          <div className="flex flex-col gap-1">
            <span className="flex flex-row gap-2 items-center">
              <Icon icon="carbon:location-filled" className="text-xl text-white/80" />
              <span className="text-white/90">{exhibit.building}</span>
              <span className="text-white/70 italic">{exhibit.location}</span>
            </span>
            <span className="flex flex-row gap-2 items-center">
              <Icon icon="codicon:organization" className="text-xl text-white/80" />
              <span className="text-white/90">{exhibit.affiliation}</span>
            </span>
          </div>

          {/* Tags */}
          {exhibit.tags?.length > 0 && (
            <div className="flex flex-row flex-wrap gap-2">
              {exhibit.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="bg-white/20 text-white backdrop-blur border border-white/30 px-2 py-0.5 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className={`text-white/90 leading-relaxed whitespace-pre-line my-1 ${expanded ? '' : 'h-24 line-clamp-4'}`}>
            {exhibit.content}
          </div>

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
  )
}

const Exhibits = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useStringQueryParam("q", "");
  const [searchBoxText, setSearchBoxText] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const itemsPerPage = 24

  const fetcher = (url) => fetch(url, {
    headers: {
      'Authorization': `Bearer ${strapi_key}`
    }
  }).then((res) => res.json());
  const { data, error, isLoading } = useSWR(
    `https://loved-vitality-4672033e09.strapiapp.com/api/exhibits?populate=Tags&pagination[pageSize]=1000`,
    fetcher
  );

  if (error) {
    console.log(error)
    return <ErrorMessageBox message="failed to load, retry" onRetry={() => window.location.reload()} />;
  }

  if (!data)
    return (
      <div className="flex w-full justify-center items-center flex-col">
        <p className="font-bold text-xl m-4">
          Loading...
        </p>
        <img
          src="/assets/logo/gear1.gif"
          alt="loading"
          className="w-20"
        />
      </div>);
  const runSearch = () => {
    setSearchTerm(searchBoxText.trim());
    setSearchBoxText('');
    setSearchOpen(false);
    setCurrentPage(1);
  };

  // console.log("Data: ", data)

  const items = (data.data ?? [])
    .map(exhibit => {
      return {
        id: exhibit['Exhibit_Number'],
        title: exhibit['Exhibit_Name'],
        content: exhibit['VisGuide_Description'] ?? [],
        building: exhibit['Exhibit_Building'] ?? [],
        location: exhibit['Exhibit_Location'] ?? [],        // was Building_Location
        affiliation: exhibit['Exhibit_Organization'] ?? [],
        department: exhibit['Department'] ?? [],
        intendedAudience: exhibit['Intended_Audience'] ?? [],
        tags: exhibit.Tags ? Object.values(exhibit.Tags).slice(1) : [] // default to empty array if missing
      }
    });

  const fuseOptions = {
    includeScore: true,
    threshold: 0.2,
    distance: 200,
    minMatchCharLength: 1,
    ignoreLocation: true,
    keys: ['title', 'content', 'building', 'affiliation', 'location', 'department', 'tags']
  };

  const fuse = new Fuse(items, fuseOptions);
  const trimmedQuery = searchTerm.trim();
  const fuseResults = trimmedQuery ? fuse.search(trimmedQuery) : null;

  const filteredItems = fuseResults
    ? fuseResults.map(result => result.item)
    : items;

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-5">

      <span className="flex flex-row justify-between mx-8">
        <h1 className="font-heading text-5xl mt-2 md:text-center md:mx-0">Exhibits</h1>
        <button onClick={() => setSearchOpen(!searchOpen)}>
          <Icon icon="bx:search" className='text-3xl' />
        </button>
      </span>

      {searchOpen &&
        <span className="flex flex-row w-full px-5">
          <input
            className="border rounded-l-xl p-2 border-gray-600 duration-300 flex-grow"
            placeholder="Building, category, department, etc."
            onChange={(e) => setSearchBoxText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') runSearch();
            }}
            value={searchBoxText}
          />
          <button className="rounded-r-xl bg-blue-700 p-3 font-semibold text-white" onClick={runSearch}>Go</button>
        </span>
      }

      {
        searchTerm.length > 0 &&
        <div className="flex flex-row px-8 justify-between items-center">
          <p>Searching for {searchTerm}</p>
          <button onClick={() => {
            setSearchTerm('')
            setSearchOpen(false)
          }}>
            <Icon icon="mdi:clear-outline" className='text-black text-3xl' />
          </button>
        </div>
      }

      <div className="w-full flex flex-wrap justify-center gap-5 px-4">
        {paginatedItems.map((item, idx) => (
          <ExhibitCard exhibit={item} idx={idx} key={idx} />
        ))}
      </div>
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
    </div >
  );
}

export default Exhibits;