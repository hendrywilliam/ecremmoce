import { db } from "@/db/core";
import Image from "next/image";
import Modal from "@/components/ui/modal";
import ImagePlaceholder from "@/components/image-placeholder";

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

  const parsedImageUrl = JSON.parse(productDetails?.image as string)[0]
    ?.fileUrl;
  return (
    <Modal>
      <div className="bg-background h-full w-full rounded mx-auto">
        <div className="h-full w-full">
          <div className="relative h-full w-full">
            {parsedImageUrl ? (
              <Image
                src={parsedImageUrl}
                fill
                alt={productDetails?.name as string}
                className="object-fill rounded"
              />
            ) : (
              <ImagePlaceholder />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
