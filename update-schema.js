const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

const newModels = `
model Category {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?   @db.Text
  image       String?
  published   Boolean   @default(true)
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Collection {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?   @db.Text
  image       String?
  published   Boolean   @default(true)
  span        String?   @default("standard")
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Product {
  id               String       @id @default(cuid())
  slug             String       @unique
  name             String
  description      String       @db.Text
  shortDescription String?      @db.Text
  price            Int          // in paise
  compareAtPrice   Int?         // in paise
  
  categoryId       String?
  category         Category?    @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  
  collectionId     String?
  collection       Collection?  @relation(fields: [collectionId], references: [id], onDelete: SetNull)
  
  images           String[]
  colors           Json?
  sizes            String[]
  
  badge            String?
  stockStatus      String       @default("in_stock")
  featured         Boolean      @default(false)
  bestSeller       Boolean      @default(false)
  newArrival       Boolean      @default(false)
  
  rating           Float?
  reviewCount      Int?         @default(0)
  
  material         String?
  gsm              Int?
  fit              String?
  care             String[]
  tags             String[]
  
  published        Boolean      @default(true)
  
  variants         ProductVariant[]
  
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt
  
  @@index([slug])
  @@index([categoryId])
  @@index([collectionId])
}

model ProductVariant {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  size        String
  color       String
  colorHex    String
  
  price       Int?     // specific price in paise, otherwise fallback to product price
  stock       Int      @default(0)
  sku         String   @unique
  available   Boolean  @default(true)
  images      String[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([productId])
  @@index([sku])
}
`;

if (!schema.includes('model Category')) {
  schema += newModels;
  fs.writeFileSync('prisma/schema.prisma', schema);
  console.log('Schema updated successfully');
} else {
  console.log('Models already exist');
}
