import { Button } from "@/components/ui/button";
import {
  CandidatesToBeApprovedType,
  VotersToBeApprovedType,
} from "@/types/types";
import { UserPlus } from "lucide-react";

export default function Section({
  title,
  count,
  items,
  type,
}: {
  title: string;
  count: number;
  items: VotersToBeApprovedType[] | CandidatesToBeApprovedType[];
  type: "voter" | "candidate";
}) {
  return (
    <div className="bg-[#0f1116] border border-[#1d1f2b] rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-sm text-gray-400">{count} pending</span>
      </div>

      {items.length === 0 ? (
        <div className="py-6 text-center text-gray-400">
          No pending {type} applications
        </div>
      ) : (
        <div className="space-y-3 max-h-[50vh] overflow-y-auto hide-scrollbar">
          {items.map((item, idx) => {
            // 🧠 Type narrowing — safely pick address based on type
            const address =
              type === "voter"
                ? (item as VotersToBeApprovedType).voterAddress
                : (item as CandidatesToBeApprovedType).candidateAddress;

            return (
              <div
                key={`${address}-${idx}`}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#0b0c11] border border-[#15151b]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#090912] flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <UserPlus className="sm:w-6 sm:h-6 w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold sm:text-lg text-[14px]">
                      {item.name}
                    </div>
                    <div className="sm:text-xs text-gray-400 font-mono text-[12px]">
                      {address &&
                        `${address.slice(0, 5)}...${address.slice(-5)}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button className="px-3 cursor-pointer py-1 rounded-lg bg-green-500 text-black font-medium hover:bg-green-600 transition disabled:opacity-60">
                    Accept
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
