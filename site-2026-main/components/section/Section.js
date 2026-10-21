import { Fragment } from 'react';
import MileSign from '@/mile-sign';

// variant="road": Direction A home-page section (halftone ground, mile sign above the title; tone="navy" for a dark band).
// Without a variant it renders exactly as before (used by contact-us and sponsor-us).
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
	const textColor = color === 'theme' ? 'text-white' : 'text-primary-brown';
	// const width = wide ? 'w-10/12 lg:w-4/4' : 'w-10/12 lg:w-3/4 max-w-screen-xl';

	return (
		<div className={`w-full ${bgColor} relative lg:py-5 md:py-3 py-1 text-center`}>
			<div className="absolute -top-24 lg:-top-20" id={id}></div> {/* So that the scroll goes to the right place */}
			<div className={`flex flex-col justify-center mx-auto grad pb-5`}>
				{title && <h2 className={`${textColor} text-3xl mt-5 font-bold mx-auto font-montserrat`}>{title}</h2>}
				{title && <hr className="my-5 w-16 mx-auto" />}
				{children}
			</div>
		</div>
	);
}
