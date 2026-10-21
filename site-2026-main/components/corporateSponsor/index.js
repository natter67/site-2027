import Image from "next/image"

// Logos scale down to fit inside their tile (object-contain). A logo whose file has wide blank
// margins gets its own fit here, so the mark itself is sized like the others (the file is untouched).
const FIT = "h-full w-full object-contain"
const FIT_OVERRIDES = {
  "/assets/sponsors/MTD.png": "h-full w-auto max-w-full aspect-[16/9] object-cover", // square white file; the mark is ~16:9 in the middle
}

export default function CorporateSponsor() {
  const logos_medium = [
    "/assets/sponsors/Abbott.png",
    "/assets/sponsors/Dixon.png",
  ]
  const logos_small = [
    "/assets/sponsors/MTD.png",
    "/assets/sponsors/Allete.png",
    "/assets/sponsors/Beckman.png",
    "/assets/sponsors/Canes.png",
  ]

  const logos_large = [
    "/assets/sponsors/John.PNG",
    "/assets/sponsors/Caterpillar.png",
  ]

  return (
    <div className="w-full flex items-center flex-col px-4">
      <div className="flex flex-wrap justify-center gap-5 p-5 max-w-5xl">
        {logos_large.map((logo, index) => (
          <div
            key={index}
            className="flex items-center justify-center w-72 h-48 rounded-2xl border-2 border-da-navy bg-white p-5"
          >
            {" "}
            {/* Adjust width (w-36) and height (h-36) as needed */}
            <Image
              src={logo}
              className={FIT_OVERRIDES[logo] || FIT}
              alt={`Sponsor Logo ${index + 1}`}
              width={300}
              height={300}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-5 p-5 max-w-5xl">
        {logos_medium.map((logo, index) => (
          <div
            key={index}
            className="flex items-center justify-center w-52 h-32 rounded-2xl border-2 border-da-navy bg-white p-4"
          >
            {" "}
            {/* Adjust width (w-36) and height (h-36) as needed */}
            <Image
              src={logo}
              className={FIT_OVERRIDES[logo] || FIT}
              alt={`Sponsor Logo ${index + 1}`}
              width={250}
              height={250}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-5 p-5 max-w-5xl">
        {logos_small.map((logo, index) => (
          <div
            key={index}
            className="flex items-center justify-center w-36 h-20 rounded-2xl border-2 border-da-navy bg-white p-3"
          >
            {" "}
            {/* Adjust width (w-36) and height (h-36) as needed */}
            <Image
              src={logo}
              className={FIT_OVERRIDES[logo] || FIT}
              alt={`Sponsor Logo ${index + 1}`}
              width={200}
              height={200}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
