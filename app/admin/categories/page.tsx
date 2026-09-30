import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories — Admin",
};

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
      </div>
      
      <div className="bg-white border border-line rounded-sm p-6 text-center text-ink/60">
        <p>Categories management will be implemented here.</p>
      </div>
    </div>
  );
}
