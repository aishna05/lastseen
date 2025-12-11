// File: pages/api/seller/products/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  const role = (session.user as any).role;
  if (role !== 'SELLER') return res.status(403).json({ error: 'Forbidden' });
  const userId = (session.user as any).id;
  const { id } = req.query;
  const pid = Number(id);

  // verify seller owns product
  const product = await prisma.product.findUnique({ where: { id: pid } });
  if (!product) return res.status(404).json({ error: 'Not found' });
  if (product.sellerId !== Number(userId)) return res.status(403).json({ error: 'Not your product' });

  if (req.method === 'PUT') {
    try {
      const body = req.body;
      const updated = await prisma.product.update({
        where: { id: pid },
        data: {
          title: body.title,
          description: body.description || '',
          price: Number(body.price),
          discount: body.discount ?? 0,
          brand: body.brand || null,
          gender: body.gender || 'UNISEX',
          material: body.material || null,
          fabricCare: body.fabricCare || null,
          occasion: body.occasion || null,
          modelNumber: body.modelNumber || null,
          sku: body.sku || null,
          availableSizes: body.availableSizes ? JSON.stringify(body.availableSizes) : JSON.stringify([]),
          sizeStock: body.sizeStock ? JSON.stringify(body.sizeStock) : JSON.stringify({}),
          colors: body.colors ? JSON.stringify(body.colors) : JSON.stringify([]),
          imageUrls: body.imageUrls ? JSON.stringify(body.imageUrls) : JSON.stringify([]),
          weight: body.weight ?? null,
          dimensions: body.dimensions ?? null,
          returnPolicy: body.returnPolicy ?? null,
          sellerNotes: body.sellerNotes ?? null,
        }
      });
      return res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Update failed' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.product.delete({ where: { id: pid } });
      return res.status(204).end();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Delete failed' });
    }
  }

  if (req.method === 'GET') {
    return res.status(200).json(product);
  }

  return res.status(405).end();
}

