"use server";

import { db } from "@/db/core";
import { carts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import type { CartItem } from "@/types";

export async function getCartAction() {
  const cartId = cookies().get("cart_id")?.value;

  const cartItems = isNaN(Number(cartId))
    ? []
    : ((
        await db
          .select()
          .from(carts)
          .where(eq(carts.id, Number(cartId)))
          .limit(1)
      )[0].items as string);

  // Get all items from the cart.
  const parsedCartItems = cartItems.length
    ? (JSON.parse(cartItems as string) as CartItem[])
    : [];

  // Get all item details based on the parsedCartItems above.

  return {
    parsedCartItems,
  };
}
