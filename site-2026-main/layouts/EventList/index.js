import { DraftingCompass, Heart, Rocket, Ruler, Zap } from "lucide-react"

const colors = ['blue-800', 'pink-700', 'yellow-600', 'red-700', 'purple-600', 'green-600']

const EventCard = (e) => {
    const EventIcon = e.icon
    return (
        <a className="da-card da-card--lift flex w-full flex-col gap-3 p-6 text-left sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]" href={e.link} key={e.title}>
            <EventIcon aria-hidden="true" className="h-10 w-10 text-da-orange" strokeWidth={2.25} />
            <h2 className="font-display text-2xl uppercase leading-tight">{e.title}</h2>
            {e.subtitle && <p className="font-label text-xs font-bold uppercase tracking-[0.1em] text-da-orange-text">{e.subtitle}</p>}
            <p className="leading-relaxed">{e.blurb}</p>
            {e.link && <p className="mt-auto font-bold underline decoration-da-orange decoration-2 underline-offset-4">Learn more</p>}
        </a>
    )
}

// Also used by layouts/Highlights (home page teasers)
export const FEATURED_EVENTS = [
    {
        "title": "Middle School Design Competition",
        "subtitle": "April 10th at 11:30 AM",
        "blurb": "Middle school students in teams of 3 or 4 compete around a central theme",
        "link": '/msdc',
        "icon": Ruler
    },
    {
        "title": "High School Design Competition",
        "subtitle": "April 10th at 11:00 AM",
        "blurb": "High school students in teams of 3-5 members compete around a central theme",
        "link": '/hsdc',
        "icon": DraftingCompass
    },
    {
        "title": "EOH x Mom's Weekend",
        "subtitle": "",
        "blurb": "We would like to invite all Grainger Engineering Moms to explore the unique features of EOH that have been organized in celebration.",
        "link": '/schools/moms-weekend',
        "icon": Heart
    },
    // Can add research showcase but don't habe a matching card image
    {
        "title": "Startup Showcase",
        "subtitle": "April 10th at 11 AM, CIF",
        "blurb": "Come visit startup booths and experience demos, giveaways, and much more!",
        "link": '/showcase.pdf',
        "icon": Rocket
    },
    {
        "title": "Tesla Coil Concert",
        "subtitle": "Sponsored by Chevron",
        "blurb": "Just as dark falls, visit the Bardeen Quad to see an electrifying display of light and sound. Starts Friday at 8:30 PM",
        "icon": Zap
    },
]

export default function EventList() {

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-wrap justify-center gap-6 px-4">
            {FEATURED_EVENTS.map(e => EventCard(e))}
        </div>
    )
}
