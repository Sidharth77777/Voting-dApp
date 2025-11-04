export default function StatCard({ title, value, icon }: { title: string; value: number; icon?: React.ReactNode }) {
    return (
        <div className="bg-[#0f1116] border border-[#1d1f2b] rounded-2xl p-4 w-full shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm text-gray-400">{title}</div>
                    <div className="text-2xl font-semibold mt-1">{value}</div>
                </div>
                <div className="text-2xl">{icon}</div>
            </div>
        </div>
    )
}