import { Icon } from "@iconify/react";
import { useEffect, useRef } from "react";

const SCHEDULE_MODAL_TITLE_ID = "schedule-modal-title";

export const Modal = ({ close, event }) => {
	const closeButtonRef = useRef(null);

	useEffect(() => {
		if (event == null) return;
		closeButtonRef.current?.focus();
		const onKeyDown = (e) => {
			if (e.key === "Escape") close();
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [event, close]);

	if (event == null) return null;
	const picture = event?.picture?.formats?.medium?.url;

	return (
		<div
			className="fixed top-0 right-0 w-screen h-screen bg-blue-400/40 z-30 flex items-center justify-center backdrop-blur-sm"
			onClick={close}
			role="dialog"
			aria-modal="true"
			aria-labelledby={SCHEDULE_MODAL_TITLE_ID}
		>
			<div
				className="bg-white rounded-xl mx-5 w-full md:w-1/2 h-1/2 p-8 overflow-y-auto"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex flex-col gap-3">
					<div className="flex flex-row justify-between">
						<h2 id={SCHEDULE_MODAL_TITLE_ID} className="font-heading text-lg">{event.title}</h2>
						<button
							ref={closeButtonRef}
							type="button"
							onClick={close}
							aria-label="Close event details"
						>
							<Icon icon="maki:cross" className="text-2xl" aria-hidden="true" />
						</button>
					</div>
					<span className="flex flex-row gap-2">
						<Icon
							icon="carbon:location-filled"
							className="text-xl text-blue-800"
							aria-hidden="true"
						/>
						<span>{event.location}</span>
					</span>
					<div>
						<p className="whitespace-pre-line">{event.description}</p>
						<br></br>
						<p>{event.timeDisplay}</p>
					</div>
					{picture && (
						<img
							src={picture}
							alt=""
							className="rounded-lg"
						/>
					)}
				</div>
			</div>
		</div>
	);
};