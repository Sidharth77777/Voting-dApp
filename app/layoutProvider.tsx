import Header from "./_components/Header";

export default function LayoutProvider({children}: {children: React.ReactNode}) {
    return (
        <div>
            <Header />
            {children}
        </div>
    )
}