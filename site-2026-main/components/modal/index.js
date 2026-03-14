import { Icon } from "@iconify/react";
import { useEffect, useRef } from "react";

const MODAL_TITLE_ID = "modal-title";

export const Modal = ({ open, setOpen, title, children }) => {
	const closeButtonRef = useRef(null);

	useEffect(() => {
		if (!open) return;
		closeButtonRef.current?.focus();
		const onKeyDown = (e) => {
			if (e.key === "Escape") setOpen(false);
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [open, setOpen]);

	if (!open) return null;
	return (
		<div
			className="fixed top-0 right-0 w-screen h-screen bg-blue-400/40 z-30 flex items-center justify-center backdrop-blur-sm"
			onClick={() => setOpen(false)}
			role="dialog"
			aria-modal="true"
			aria-labelledby={MODAL_TITLE_ID}
		>
			<div
				className="bg-white rounded-xl mx-5 w-full md:w-1/2 h-2/3 p-8 overflow-y-auto"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex flex-col gap-3">
					<div className="flex flex-row justify-between">
						<h2 id={MODAL_TITLE_ID} className="font-heading text-xl">{title}</h2>
						<button
							ref={closeButtonRef}
							type="button"
							onClick={() => setOpen(false)}
							aria-label="Close modal"
						>
							<Icon icon="maki:cross" className="text-2xl" aria-hidden="true" />
						</button>
					</div>
					{children}
				</div>
			</div>
		</div>
	);
};