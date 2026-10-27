import { Fragment } from 'react';
import MileSign from '@/mile-sign';

// variant="road": Direction A home-page section (halftone ground, mile sign above the title; tone="navy" for a dark band).
// Without a variant it renders exactly as before (used by sponsor-us).
export default function Section({ color, title, wide, children, id, variant, mile, tone }) {
	if (variant === 'road') {
		const navy = tone === 'navy';
		return (
			<div className={`relative w-full py-12 text-center font-body md:py-16 ${navy ? 'bg-da-navy text-white' : 'da-ground text-da-navy'}`}>
				<div className="absolute -top-24 lg:-top-20" id={id}></div> {/* So that the scroll goes to the right place */}
				<div className="mx-auto flex flex-col justify-center pb-5">
					{mile && <MileSign tone={navy ? 'white' : 'navy'} className="mx-auto">{mile}</MileSign>}
					{title && <h2 className={`mx-auto mb-8 mt-3 px-4 font-display text-4xl uppercase leading-none md:text-5xl ${navy ? 'text-white' : 'text-da-navy'}`}>{title}</h2>}
					{children}
				</div>
			</div>
		);
	}

	const bgColor = color === undefined ? 'bg-transparent' : color;
	const textColor = color === 'theme' ? 'text-white' : 'text-da-navy';
	// const width = wide ? 'w-10/12 lg:w-4/4' : 'w-10/12 lg:w-3/4 max-w-screen-xl';

	return (
		<div className={`w-full ${bgColor} relative lg:py-5 md:py-3 py-1 text-center`}>
			<div className="absolute -top-24 lg:-top-20" id={id}></div> {/* So that the scroll goes to the right place */}
			<div className={`flex flex-col justify-center mx-auto grad pb-5`}>
				{title && <h2 className={`${textColor} mx-auto mt-5 px-4 font-display text-3xl uppercase leading-none md:text-4xl`}>{title}</h2>}
				{title && <hr className="mx-auto my-5 h-1 w-16 rounded-full border-0 bg-da-orange" />}
				{children}
			</div>
		</div>
	);
}
