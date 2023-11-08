import { db } from "@/db/core";
import Modal from "@/components/ui/modal";
import Image from "next/image";

export default async function ProductModal({
  params: { productId },
}: {
  params: {
    productId: string;
  };
}) {
  const productDetails = await db.query.products.findFirst({
    where: (products, { eq }) => eq(products.id, Number(productId)),
  });

  const parsedImageUrl = JSON.parse(productDetails?.image as string)[0].fileUrl;
  return (
    <Modal>
      <div className="bg-background h-full w-full rounded mx-auto">
        <div className="h-full w-full">
          <div className="relative h-full w-full">
            <Image
              src={parsedImageUrl}
              fill
              alt={productDetails?.name as string}
              className="object-fill rounded"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
