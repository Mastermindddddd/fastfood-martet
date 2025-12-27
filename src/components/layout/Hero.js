import Right from "@/components/icons/Right"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="px-4 sm:px-6 lg:px-10 py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-br from-orange-50 via-white to-amber-50 shadow-xl border border-orange-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center p-6 sm:p-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-orange-500 shadow-sm">
              Fresh daily • Ready in 15 min
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 leading-tight">
                Kasi comfort food, prepared with{" "}
                <span className="text-orange-500">speed & style.</span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-xl">
                Indulge in flame-grilled kota and township classics crafted by local chefs.
                Hot, hearty, and ready for you before the cravings hit.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button className="flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-base font-semibold uppercase tracking-wide text-white shadow-lg shadow-orange-500/40 transition hover:bg-orange-600">
                Order now
                <Right />
              </button>
              <button className="flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3 text-base font-semibold text-neutral-800 hover:border-neutral-300">
                Learn more
                <Right />
              </button>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-neutral-700">
              <div>
                <p className="text-3xl font-black text-neutral-900">4.9★</p>
                <p className="uppercase text-xs tracking-[0.2em] text-neutral-500">Average rating</p>
              </div>
              <div>
                <p className="text-3xl font-black text-neutral-900">120+</p>
                <p className="uppercase text-xs tracking-[0.2em] text-neutral-500">Local vendors</p>
              </div>
              <div>
                <p className="text-3xl font-black text-neutral-900">15 min</p>
                <p className="uppercase text-xs tracking-[0.2em] text-neutral-500">Avg prep time</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-orange-200/40 shadow-2xl">
              <Image
                src="/kotapic5.png"
                alt="Freshly prepared kota meal"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="absolute -bottom-6 left-6 right-6 flex flex-wrap gap-3 rounded-2xl bg-white px-4 py-3 text-sm shadow-lg shadow-black/10">
              <span className="flex items-center gap-2 font-semibold text-neutral-800">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                Live orders tracking
              </span>
              <span className="flex items-center gap-2 font-semibold text-neutral-800">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                Contactless pickup
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
