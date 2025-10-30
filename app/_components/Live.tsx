import { ListFeaturesType } from "@/types/types";

export default function Live() {
  const list: ListFeaturesType[] = [
    { id: 1, color: "#3cac69", name: "Network Active" },
    { id: 2, color: "#5998e6", name: "Smart Contract Live" },
    { id: 3, color: "#be83fa", name: "Votes Being Processed" },
  ];

  return (
    <div className="w-full py-10 text-slate-100">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Live Voting Activity</h1>
        <p className="text-slate-400 text-base">Real-time blockchain status updates</p>
      </div>

     <div className="flex flex-wrap justify-center gap-8  mx-auto">
        {list.map((l) => (
          <div
            key={l.id}
            className="flex items-center space-x-4 bg-[#111120] border border-[#19192e] rounded-xl px-6 py-4 w-[280px] hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            <div
              className="w-4 h-4 rounded-full animate-pulse"
              style={{
                backgroundColor: l.color,
                boxShadow: `0 0 10px ${l.color}`,
              }}
            ></div>

            <h3 className="font-semibold text-slate-200">{l.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
