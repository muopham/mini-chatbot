export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-[#FFF9E6] font-body text-[#1E1C11]">
      <main className="flex w-full max-w-md flex-col items-center px-6 text-center">
        {/* Robot */}
        <div className="animate-jitter relative mb-10">
          <div className="flex h-48 w-40 flex-col items-center justify-center border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {/* Antenna */}
            <div className="absolute -top-10 flex flex-col items-center">
              <span className="material-symbols-outlined fill text-5xl text-orange-500">
                bolt
              </span>
            </div>

            {/* Face */}
            <div className="flex h-full w-full flex-col gap-4 border-[3px] border-black bg-yellow-300 p-4">
              {/* Eyes */}
              <div className="mt-2 flex w-full justify-between">
                <div className="relative h-8 w-8 overflow-hidden rounded-full border-[3px] border-black bg-white">
                  <div className="absolute left-1 top-0.5 h-4 w-4 rounded-full bg-black"></div>
                </div>
                <div className="relative h-8 w-8 overflow-hidden rounded-full border-[3px] border-black bg-white">
                  <div className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full bg-black"></div>
                </div>
              </div>

              {/* Mouth */}
              <div className="mt-4 flex flex-col gap-1.5">
                <div className="h-1.5 w-full bg-black"></div>
                <div className="h-1.5 w-full bg-black opacity-30"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="mb-8">
          <h1 className="mb-1 text-3xl font-black uppercase tracking-tighter">
            MONOLITH INITIALIZING
          </h1>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-black/50">
            HIGH VOLTAGE SYNC
          </p>
        </div>

        {/* Progress */}
        <div className="w-full">
          <div className="relative h-10 w-full border-4 border-black bg-white p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div
              className="h-full border-r-4 border-black bg-orange-500 transition-all duration-300"
              style={{ width: "68%" }}
            />
          </div>

          <div className="mt-4 flex justify-center">
            <span className="bg-black px-3 py-1 text-xs font-black uppercase tracking-widest text-white">
              Connecting... 68%
            </span>
          </div>
        </div>
      </main>

      {/* Corners */}
      <div className="fixed left-6 top-6 h-8 w-8 border-l-4 border-t-4 border-black"></div>
      <div className="fixed right-6 top-6 h-8 w-8 border-r-4 border-t-4 border-black"></div>
      <div className="fixed bottom-6 left-6 h-8 w-8 border-b-4 border-l-4 border-black"></div>
      <div className="fixed bottom-6 right-6 h-8 w-8 border-b-4 border-r-4 border-black"></div>
    </div>
  );
}
