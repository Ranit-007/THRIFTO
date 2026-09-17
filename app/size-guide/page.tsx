import Link from "next/link";
import { brand } from "@/config/brand";
import { SectionHeading } from "@/components/ui/section-heading";
import { TSHIRT_SIZE_GUIDE } from "@/lib/shop-data";

export const metadata = {
  title: `Size Guide | ${brand.name}`,
  description: "Find your perfect fit with our detailed size guide.",
};

export default function SizeGuidePage() {
  return (
    <main className="page-shell">
      <SectionHeading
        eyebrow="SIZE GUIDE"
        title="Find your fit"
        description="Our sizing guide helps you find the perfect fit for our products."
      />

      <div className="size-guide">
        <div className="size-guide__content">
          <p className="size-guide__subtitle">T-Shirt Measurements</p>

          <div className="size-guide__table-wrapper">
            <table className="size-guide__table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest</th>
                  <th>Length</th>
                  <th>Shoulder</th>
                  <th>Sleeve</th>
                </tr>
              </thead>
              <tbody>
                {TSHIRT_SIZE_GUIDE.map((row) => (
                  <tr key={row.size}>
                    <td className="font-semibold">{row.size}</td>
                    <td>{row.chest}</td>
                    <td>{row.length}</td>
                    <td>{row.shoulder}</td>
                    <td>{row.sleeve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="size-guide__notes">
            <h3>How to Measure</h3>
            <ul>
              <li>
                <strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.
              </li>
              <li>
                <strong>Length:</strong> Measure from the highest point of the shoulder to the bottom hem.
              </li>
              <li>
                <strong>Shoulder:</strong> Measure from shoulder seam to shoulder seam across the back.
              </li>
              <li>
                <strong>Sleeve:</strong> Measure from shoulder seam to cuff.
              </li>
            </ul>
          </div>

          <div className="size-guide__tip">
            <p>
              💡 <strong>Tip:</strong> If you&apos;re between sizes, we recommend sizing up for a more relaxed fit.
            </p>
          </div>
        </div>

        <div className="size-guide__actions">
          <Link href="/" className="button button--outline">
            Shop All Products
          </Link>
        </div>
      </div>
    </main>
  );
}