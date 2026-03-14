export default function Arrows({ page, total_pages, white, onDecrease, onIncrease, center }) {
	return (
		<div className={`select-none ${center ? "text-center" : "text-left"}`} role="navigation" aria-label="Pagination">
			<button
				type="button"
				className={`inline-block transition rotate-0 bg-transparent border-0 p-0 cursor-pointer ${page === 0
					? 'opacity-50 pointer-events-none'
					: ''} ${white ? 'invert' : ''}`}
				onClick={onDecrease}
				disabled={page === 0}
				aria-label="Previous page"
			>
				<img src="/assets/ui/caret-left.svg" alt="" aria-hidden="true" className="inline-block" />
			</button>
			<div className={`inline-block text-roboto text-sm ${white ? 'text-white' : 'text-gray-600'} italic`}>
				Page {page + 1} of {total_pages}
			</div>
			<button
				type="button"
				className={`inline-block transition rotate-180 bg-transparent border-0 p-0 cursor-pointer ${page === total_pages - 1
					? 'opacity-50 pointer-events-none'
					: ''} ${white ? 'invert' : ''}`}
				onClick={onIncrease}
				disabled={page === total_pages - 1}
				aria-label="Next page"
			>
				<img src="/assets/ui/caret-left.svg" alt="" aria-hidden="true" className="inline-block" />
			</button>
		</div>
	);
}
