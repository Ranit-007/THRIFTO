SELECT 
  p.name as product_name,
  pv.size,
  pv.color,
  pv.stock,
  pv.available,
  pv.sku
FROM "ProductVariant" pv
JOIN "Product" p ON pv."productId" = p.id
ORDER BY p.name, pv.color, pv.size
LIMIT 20;
