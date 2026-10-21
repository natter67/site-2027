export default function Sponsors() {

	const STRIPE_DONATE_LINK = 'https://buy.stripe.com/7sIg2U042455aT6000'
	const UIF_SPONSOR_LINK = '/sponsor-us' // /sponsor-us

	return (
		<div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 px-4">
			<p className="da-card px-6 py-4 text-lg">Engineering Open House would not be possible without our generous patrons. <br /> Thank you for your contributions.</p>
			<div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
				<div className="da-card flex flex-col items-center gap-3 p-6">
					<p className="text-lg">I'm a</p>
					<h3 className="font-display text-3xl uppercase leading-none">Student or Visitor</h3>
					<a className="da-pill da-pill--primary mt-3 w-64 text-2xl" href={STRIPE_DONATE_LINK}>
						Donate
					</a>
					<p className="font-label text-sm uppercase tracking-[0.1em]">via Stripe</p>
				</div>
				<div className="da-card flex flex-col items-center gap-3 p-6">
					<p className="text-lg">I'm a</p>
					<h3 className="font-display text-3xl uppercase leading-none">Company Representative</h3>
					<a className="da-pill da-pill--secondary mt-3 w-64 text-2xl" href={UIF_SPONSOR_LINK}>
						Sponsor
					</a>
					<p className="font-label text-sm uppercase tracking-[0.1em]">via UIF</p>
				</div>
			</div>
		</div>
	)
}
