export default function CardItem() {
  // Mock card data (future API-ready)
  const cards = [
    {
      id: "card-001",
      name: "Platinum Credit Card",
      limit: "₹3,00,000",
      available: "₹1,85,000",
    },
    {
      id: "card-002",
      name: "Gold Credit Card",
      limit: "₹1,50,000",
      available: "₹90,000",
    },
  ];

  return (
    <div className="row">
      {cards.map((card) => (
        <div className="col-md-6 mb-3" key={card.id}>
          <div className="user-card p-3 shadow-sm rounded">
            <h5 className="mb-1">{card.name}</h5>
            <p className="mb-0 text-muted">Limit: {card.limit}</p>
            <p className="mb-0 text-success">
              Available: {card.available}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
