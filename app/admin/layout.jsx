import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "Nexu. - Admin",
    description: "Nexu. - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
