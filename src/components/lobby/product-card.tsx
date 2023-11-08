"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import { Product } from "@/db/schema";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { AddItemInCartAction } from "@/actions/carts/add-item-in-cart";
import { IconCart, IconLoading, IconView } from "@/components/ui/icons";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

type ProductCardProps = {
  product: Omit<Product, "createdAt">;
};

export default function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function addToCart() {
    setIsLoading((val) => !val);
    await AddItemInCartAction({ id: product.id, qty: 1 })
      .then(() => {
        toast.success("Success add item to cart.");
      })
      .finally(() => {
        setIsLoading((val) => !val);
      });
  }

  const parsedImageUrl = JSON.parse(product.image as string)[0].fileUrl;

  return (
    <div className="group relative h-80 w-full border rounded cursor">
      <div className="absolute z-[2] top-2 right-2 rounded px-2 py-1 bg-foreground text-white font-semibold">
        <p className="text-xs">{formatCurrency(Number(product.price))}</p>
      </div>
      <Link href={`/product/${product.id}`}>
        <div className="relative h-4/6 overflow-hidden">
          <Image
            src={parsedImageUrl}
            fill
            alt={product.name as string}
            className="w-full h-full object-cover rounded-t transition duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="h-2/6 border-t p-2">
        <p className="font-semibold">{product.name}</p>
        <p className="text-sm text-gray-400 truncate">{product.description}</p>
        <div className="inline-flex w-full gap-2 justify-between mt-2">
          <Link
            className={buttonVariants({
              size: "sm",
              variant: "outline",
              class: "w-full inline-flex gap-1",
            })}
            href={`/quickview-product/${product.id}`}
          >
            <IconView />
            Quick View
          </Link>
          <Button
            onClick={addToCart}
            size={"sm"}
            className="inline-flex w-full gap-1"
            disabled={isLoading}
          >
            {isLoading ? <IconLoading /> : <IconCart />}
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
}
