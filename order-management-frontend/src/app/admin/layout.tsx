// /app/admin/dashboard/layout.tsx or /app/admin/layout.tsx

export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen w-full bg-white px-6 py-10">
        {children}
      </div>
    );
  }
  