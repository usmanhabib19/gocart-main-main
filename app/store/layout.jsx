import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "Nexu. - Store Dashboard",
    description: "Nexu. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
