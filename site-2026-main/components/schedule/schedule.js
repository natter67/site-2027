import { Icon } from '@iconify/react';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Modal } from './modal.js';
import Fuse from 'fuse.js';
import { strapiSwrFetcher, strapiUrl } from '@utilities/strapi';

dayjs.extend(utc);
dayjs.extend(timezone);


// What days are EOH on
const DAY_ONE = 9;
const DAY_TWO = 10;

const slotGradients = {
  0: 'bg-red-700',
  1: 'bg-yellow-500',
  2: 'bg-blue-800',
  3: 'bg-pink-400',
  4: 'bg-gray-700',
  5: 'bg-green-700',
};

const timeMsPerSlot = 1000 * 60 * 30;
const timeMs8Hrs = 1000 * 60 * 60 * 8.5;
// What days are EOH on
const dayOneMs = dayjs.tz('2027-04-09 00:00', 'America/Chicago').valueOf();
const dayTwoMs = dayjs.tz('2027-04-10 00:00', 'America/Chicago').valueOf();

// Shared with layouts/SchedulePreview (same SWR key, so the data is fetched once).
export const SCHEDULE_EVENTS_URL = strapiUrl('/api/events?populate=occurences&pagination[pageSize]=40&populate=picture');

// Strapi times were entered in European time; this turns one into Champaign time.
export const toChampaignTime = (iso) => dayjs.utc(iso).tz('Europe/Vienna').tz('America/Chicago', true);

const genTimeSlots = () => {
  const totalSlots = 26;

  let dayOneSlots = [];
  for (let i = 0; i < totalSlots + 1; i++) {
    dayOneSlots.push(dayOneMs + timeMs8Hrs + i * timeMsPerSlot);
  }

  let dayTwoSlots = [];
  for (let i = 0; i < totalSlots + 1 - 9; i++) {
    dayTwoSlots.push(dayTwoMs + timeMs8Hrs + i * timeMsPerSlot);
  }

  return {
    DAY_ONE: dayOneSlots,
    DAY_TWO: dayTwoSlots,
  };
};

export function Schedule() {
  const nullSlot = {
    colIndex: null,
    duration: null,
    rowIndex: null,
    date: null,
    startMs: null,
    endMs: null,
  };

  const [hoverSlot, setHoverSlot] = useState(nullSlot);
  const [modalColIdx, setModalColIdx] = useState(null);
  const [onDayOne, setDayOne] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [itinerary, setItinerary] = useState([]);
  const [showItinerary, setShowItinerary] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedItinerary = localStorage.getItem('itinerary');
    if (savedItinerary) {
      setItinerary(JSON.parse(savedItinerary));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('itinerary', JSON.stringify(itinerary));
  }, [itinerary]);

  const toggleItineraryItem = (colIndex, rowIndex, date) => {
    const slotIdentifier = `${colIndex}-${rowIndex}-${date}`;
    setItinerary((prev) =>
      prev.includes(slotIdentifier)
        ? prev.filter((item) => item !== slotIdentifier)
        : [...prev, slotIdentifier]
    );
  };

  const { data, error, isLoading } = useSWR(SCHEDULE_EVENTS_URL, strapiSwrFetcher);

  if (error) return 'An error has occurred.';
  if (isLoading) return 'Loading...';

  const slots = genTimeSlots();

  const rawEvents = Array.isArray(data?.data) ? data.data : [];

  const scheduleData = rawEvents.map((event, idx) => {
    const occList = Array.isArray(event?.occurences) ? event.occurences : [];
    const occurences = occList
      .filter((occ) => occ?.startTime && occ?.endTime)
      .map((occ) => {
      // This is my fix because I entered the data in European timezone
      const start = toChampaignTime(occ.startTime);
      const end = toChampaignTime(occ.endTime);
      const date = start.date() === DAY_ONE ? DAY_ONE : DAY_TWO; // Change this line to reflect the day EOH is on!
      const duration = end.diff(start) / timeMsPerSlot;
      const rowIndex =
        (start.valueOf() -
          (date === DAY_ONE ? dayOneMs : dayTwoMs) -
          timeMs8Hrs) /
        timeMsPerSlot;
      // console.log(start.format(), rowIndex);
      return {
        colIndex: idx,
        duration,
        rowIndex,
        date,
        startMs: start.valueOf(),
        endMs: end.valueOf(),
        day: start.format("dddd"),
        display: `${start.format('h:mm')} to ${end.format('h:mm')}`,
      };
    });

    return {
      col: idx,
      title: event.title,
      location: event.location,
      picture: event.picture,
      shortTitle: event.shortTitle,
      description: event.description,
      slots: occurences,
      timeDisplay: occurences.map(o => `${o.day}, ${o.display}`).join(', '),
    };
  });

  const allSlots = scheduleData.map((item) => item.slots).flat();
  const dayOneSlots = allSlots.filter((o) => o.date === DAY_ONE);
  const dayTwoSlots = allSlots.filter((o) => o.date === DAY_TWO);

  const fuse = new Fuse(scheduleData, {
    keys: ['title', 'location', 'description'],
    threshold: 0.4,
  });

  const filteredEvents = searchQuery
    ? fuse.search(searchQuery).map((r) => r.item)
    : scheduleData;

  const filteredColIndices = new Set(filteredEvents.map((e) => e.col));

  const visibleSlots = (onDayOne ? dayOneSlots : dayTwoSlots).filter(
    (slot) =>
      (!showItinerary ||
        itinerary.includes(`${slot.colIndex}-${slot.rowIndex}-${slot.date}`)) &&
      filteredColIndices.has(slot.colIndex)
  );

  const activeStyles =
    'border-2 border-b-0 border-da-navy bg-da-navy text-white';
  const inactiveStyles =
    'border-2 border-b-0 border-da-navy bg-white text-da-navy hover:bg-da-peach';

  return (
    <>
      <Modal
        event={modalColIdx != null ? scheduleData[modalColIdx] : null}
        close={() => setModalColIdx(null)}
        toggleItineraryItem={toggleItineraryItem}
      />

<div className="flex justify-end px-6 mb-2">
                <button
                    className="da-pill da-pill--sm da-pill--navy"
                    onClick={() => setShowItinerary(!showItinerary)}
                >
                    {showItinerary ? "Hide My Itinerary" : "View My Itinerary"}
                </button>
            </div>
            <span className='flex flex-row justify-start gap-1 mt-3 mx-4 md:mx-8'>
                <button
                    onClick={() => setDayOne(true)}
                    className={`p-3 md:p-5 px-5 md:px-7 font-bold font-montserrat rounded-t-xl
                    ${onDayOne ? activeStyles : inactiveStyles}`}>Friday, April 9th</button>
                <button
                    onClick={() => setDayOne(false)}
                    className={`p-3 md:p-5 px-5 md:px-7 font-bold font-montserrat rounded-t-xl 
                    ${onDayOne ? inactiveStyles : activeStyles}`}>Saturday, April 10th</button>
            </span>
            
             <div className="max-h-128 overflow-x-hidden p-4 da-card flex flex-col">
                <div className="flex flex-row gap-0">
                    <div className="flex flex-col">
                        <div className='h-24 flex items-end justify-center'>
                            <Icon icon="ion:arrow-down" className="text-3xl text-gray-400 mb-4" />
                            <Icon icon="ion:arrow-down" className="text-3xl text-gray-400 -rotate-90 self-center" />
                        </div>
                        {slots[(onDayOne ? 'DAY_ONE' : 'DAY_TWO')].map(slot =>
                            <div className={`text-lg h-8 w-24 font-montserrat text-right pr-2 ${slot >= hoverSlot.startMs && slot < hoverSlot.endMs ? 'font-bold' : ''}`} key={slot}>
                                {dayjs(slot).tz('America/Chicago').format('h:mm A')}
                            </div>
                        )}
                        <div className='h-24 flex items-start justify-center'>
                            <Icon icon="ion:arrow-up" className="text-3xl text-gray-400 mt-4" />
                            <Icon icon="ion:arrow-up" className="text-3xl text-gray-400 rotate-90 self-center" />
                        </div>
                    </div>
                    <div className="relative overflow-x-scroll w-full overflow-y-hidden">
                        <div className="flex flex-row pb-4 items-end h-24">
                        {scheduleData.map(event => (
    <div key={event.col} className="w-[96px] min-w-[96px] pr-2 pl-1 text-center">
        <button
            className={`font-montserrat text-sm break-words ${hoverSlot.colIndex === event.col ? 'font-bold' : 'font-semibold'}`}
            onClick={() => setModalColIdx(event.col)}
        >
            {event.title}
        </button>
    </div>
))}

                        </div>
                        
                        {visibleSlots.map(slot => (
    <div
        className={`absolute w-[96px] min-w-[96px] ${slotGradients[slot.colIndex % Object.keys(slotGradients).length]}
                    cursor-pointer duration-300 rounded-lg border border-white
                    text-xs flex items-center justify-center text-white select-none glowing 
                    shadow-md transition-transform transform hover:scale-105`}
        style={{
            top: `${slot.rowIndex * 32 + 96}px`,
            height: `${slot.duration * 32}px`,
            left: `${slot.colIndex * 96}px`
        }}
        key={`${slot.rowIndex}-${slot.colIndex}`}
        onMouseEnter={() => { setHoverSlot(slot) }}
        onMouseLeave={() => { setHoverSlot(nullSlot) }}
        onClick={() => setModalColIdx(slot.colIndex)}
    >
        {slot.duration > 1 ?
            <div className='flex flex-col gap-1 text-center p-0.5'>
                <p>{scheduleData[slot.colIndex].title.length > 25 ? `${scheduleData[slot.colIndex].title.substring(0, 25)}...` : scheduleData[slot.colIndex].title}</p>
                <p>{slot.display}</p>
            </div>
            :
            <div className='overflow-hidden'>
                <p className='text-xs'>
                    {slot.display}
                </p>
            </div>
        }
        {/* Toggle button to add/remove from itinerary */}
        <button
            className={`text-sm mt-1 ${
                itinerary.includes(`${slot.colIndex}-${slot.rowIndex}-${slot.date}`) ? 'text-yellow-400' : 'text-gray-500'
            }`}
            onClick={(e) => {
                e.stopPropagation(); // Prevent event from bubbling to parent elements
                toggleItineraryItem(slot.colIndex, slot.rowIndex, slot.date);
            }}
            style={{ position: 'absolute', top: '1px', right: '4px', fontSize: '25px' }}
        >
            {itinerary.includes(`${slot.colIndex}-${slot.rowIndex}-${slot.date}`) ? '★' : '☆'}
        </button>
    </div>
))}
       
                        <div className="absolute flex flex-row py-4 items-start h-28 bottom-0">
                            {scheduleData.map(event => {
                                return (<button className={`font-montserrat w-[96px] min-w-[96px] pr-2 pl-1 text-sm break-words ${hoverSlot.colIndex == event.col ? 'font-bold' : 'font-semibold'}`} key={event.col}
                                    onClick={() => setModalColIdx(event.col)}>
                                    {event.title}
                                </button>);
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
