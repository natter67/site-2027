import React from 'react';
import useSWR from 'swr';
import { useState } from 'react';
import dayjs from 'dayjs';
import Link from 'next/link';

import { EVENT_FACTS } from '@utilities/eventConfig';
import rawFaqs from './faqs.json';

const colors = ['bg-[#13294b] text-white', 'bg-[#ff5f05] text-da-navy'] // navy text on orange for contrast

// const ErrorMessageBox = ({ message, onRetry }) => (
//   <div style={{ margin: '20px', padding: '20px', backgroundColor: '#ffcccc', color: '#cc0000', borderRadius: '5px', textAlign: 'center' }}>
//     <p>{message}</p>
//     {onRetry && (
//       <button onClick={onRetry} style={{ marginTop: '10px', padding: '10px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#f2f2f2', border: 'none', borderRadius: '5px' }}>
//         Retry
//       </button>
//     )}
//   </div>
// )

// Answers are HTML (links allowed) and can use {dates} and {hours}, filled from utilities/eventConfig.js
// so the FAQ always shows the same dates as the rest of the site. Facts that a page owns (parking lots,
// shuttle stops, bus directions) aren't repeated here: the answer links to that page instead.
const fill = (str) => str.replace(/\{(dates|hours)\}/g, (_, key) => EVENT_FACTS[key]);

const normalizeFaqs = (faqs) => {
  return faqs.reduce((acc, faq) => {
    const { id, Category, Question, Answer } = faq;

    const categoryKey = `${Category} FAQs`;

    const faqItem = {
      id,
      title: Question,
      content: fill(Answer),
    };

    if (!acc[categoryKey]) {
      acc[categoryKey] = [faqItem];
    } else {
      acc[categoryKey].push(faqItem);
    }

    return acc;
  }, {});
};


// `only` (optional): category names to show, e.g. ['Parking FAQs']
const Faqs = ({ only }) => {
  // const fetcher = (url) => fetch(url).then((res) => res.json());
  const [expandedId, setExpandedId] = useState(null);

  // const { data, error, isLoading } = useSWR(
  //   `https://n11.eohillinois.org/api/faqs?sort=updatedAt:desc`,
  //   fetcher
  // );

  const categories = normalizeFaqs(rawFaqs);


  // This is the code when grabbing FAQs from Strapi
  // React.useEffect(() => {
  //   if (data && data.data) {
  //     const sortedFaqs = data.data.reduce((acc, faq) => {
  //       const { Category, Question, Description } = faq;
  //       const faqItem = { id: Question, title: Question, content: Description };
  //       if (!acc[Category]) {
  //         acc[Category] = [faqItem];
  //       } else {
  //         acc[Category].push(faqItem);
  //       }
  //       return acc;
  //     }, {});

  //     setCategories(sortedFaqs);
  //   }
  // }, [data]);

  const categoryOrder = ['Event FAQs', 'Parking FAQs', 'Food FAQs', 'Field Trip FAQs', 'Emergency FAQs', 'Miscellaneous FAQs'];

  const replaceWithBr = (str) => {
    return str.replace(/\n/g, "<br />")
  }

  // if (error) {
  //   return <ErrorMessageBox message="failed to load, retry" onRetry={() => window.location.reload()} />;
  // }

  // if (!data) return <div style={{ textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="mt-15 md:mt-18 flex flex-col justify-between">
      {(only || categoryOrder).map((category, idx) => {
        const faqs = categories[category] || [];
        return (
          <div key={category} id={category.toLowerCase().replace(/\s+/g, "-")} className="mb-8 scroll-mt-24 lg:scroll-mt-32">
            <h2 className="font-display text-2xl uppercase mb-4">{category}</h2>
            <div className="flex flex-col gap-4 ">
              {faqs.map((faq) => {
                const open = expandedId === faq.id;
                // The question is the button; the answer sits outside it so it can hold links
                return (
                  <div key={faq.id} className={`${colors[idx % colors.length]} rounded-2xl border-2 border-da-navy`}>
                    <h3 className="font-semibold text-lg md:text-xl text-left">
                      <button type="button"
                        className="w-full rounded-2xl p-5 text-left hover:underline"
                        aria-expanded={open}
                        aria-controls={`faq-answer-${faq.id}`}
                        id={`faq-question-${faq.id}`}
                        onClick={() => setExpandedId(open ? null : faq.id)}
                      >
                        {faq.title}
                      </button>
                    </h3>
                    <div id={`faq-answer-${faq.id}`} hidden={!open}
                      className="-mt-2 px-5 pb-5 text-sm text-left [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2"
                      dangerouslySetInnerHTML={{ __html: replaceWithBr(faq.content) }}></div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

}

export default Faqs;