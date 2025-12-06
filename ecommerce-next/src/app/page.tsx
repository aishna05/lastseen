import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    include: { seller: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6">
      <h1 className="text-3xl font-semibold mb-4">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p) => {
          const finalPrice = p.discount
            ? p.price * (1 - p.discount / 100)
            : p.price;
          return (
            <div key={p.id} className="border rounded p-4 space-y-2">
              {p.imageUrl && (
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="w-full h-40 object-cover rounded"
                />
              )}
              <h2 className="font-medium text-lg">{p.title}</h2>
              <p className="text-sm text-gray-600">{p.description}</p>
              <p className="text-sm text-gray-500">
                Seller: {p.seller.name}
              </p>
              <div className="flex items-center gap-2">
                {p.discount ? (
                  <>
                    <span className="line-through text-sm text-gray-500">
                      ₹{p.price}
                    </span>
                    <span className="font-semibold">₹{finalPrice}</span>
                    <span className="text-xs text-green-600">
                      {p.discount}% OFF
                    </span>
                  </>
                ) : (
                  <span className="font-semibold">₹{p.price}</span>
                )}
              </div>
              <button className="mt-2 w-full py-2 rounded bg-black text-white text-sm font-medium">
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}
