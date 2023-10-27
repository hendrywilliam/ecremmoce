"use server";
import { cookies } from "next/headers";
import { db } from "@/db/core";
import { carts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CartItem } from "@/types";
import { revalidatePath } from "next/cache";

export async function deleteCartItemAction(itemId: number) {
  const cartId = cookies().get("cart_id")?.value;

  if (isNaN(Number(cartId))) {
    throw new Error("Invalid cart id.");
  }

  const cartItems = await db
    .select()
    .from(carts)
    .where(eq(carts.id, Number(cartId)));

  const parsedCartItems = JSON.parse(
    cartItems[0].items as string
  ) as CartItem[];

  const isDesiredItemExistInCart = parsedCartItems.find(
    (item) => item.id === itemId
  );

  const filteredItemsInCart =
    isDesiredItemExistInCart &&
    parsedCartItems.filter((item) => item.id !== itemId);

  // Update cart
  await db
    .update(carts)
    .set({
      items: JSON.stringify(filteredItemsInCart),
    })
    .where(eq(carts.id, Number(cartId)));

  revalidatePath("/");
}
