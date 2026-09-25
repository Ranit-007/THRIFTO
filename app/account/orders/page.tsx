export const metadata = {
  title: "Orders — Nocturne Studio",
};

export default function OrdersPage() {
  return (
    <section>
      <h2 className="account-heading">Order History</h2>

      <div className="empty-state" style={{ textAlign: "center", padding: "4rem 1.5rem" }}>
        <h3 className="empty-state__title">No orders yet</h3>
        <p className="empty-state__description">
          Your order history will appear here once you start shopping with your account.
        </p>
      </div>
    </section>
  );
}