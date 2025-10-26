import Header from "./_components/Header";
import { ToastProvider } from "./_components/Toast";

export default function LayoutProvider({children}: {children: React.ReactNode}) {
    return (
        <div>
            <ToastProvider>
            <Header />
            {children}
            </ToastProvider>
        </div>
    )
}