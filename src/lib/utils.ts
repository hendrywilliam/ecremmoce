import type {
  CartLineDetailedItems,
  UploadData,
  ProductWithQuantity,
} from "@/types";
import { z } from "zod";
import { toast } from "sonner";
import { baseUrl } from "@/config/site";
import { twMerge } from "tailwind-merge";
import { UTApi } from "uploadthing/server";
import { User } from "@clerk/nextjs/server";
import { type ClassValue, clsx } from "clsx";
import { isClerkAPIResponseError, useUser } from "@clerk/nextjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function catchError(err: unknown) {
  const unknownError = "Something went wrong please try again later.";
  if (isClerkAPIResponseError(err)) {
    return toast.error(err.errors[0].longMessage ?? unknownError);
  }
  if (err instanceof z.ZodError) {
    return toast.error(err.issues[0].message);
  }
  if (err instanceof Error) {
    return toast.error(err.message);
  }
  return toast.error(unknownError);
}

export function formatCurrency(amount: number) {
  const formatAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
  }).format(amount);

  const dollar = formatAmount.split(".")[0];
  return dollar;
}

export function truncate(word: string, maxLength: number = 10) {
  return word.length >= maxLength ? word.slice(0, maxLength) + "..." : word;
}

export function slugify(value: string) {
  return value
    .replace(/[^A-Za-z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
}

export function getPrimaryEmail(user: User) {
  return user.emailAddresses[0].emailAddress;
}

export function getAbsoluteUrl(href: string) {
  return `${baseUrl}${href}`;
}

export function unixToDateString(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString("us-US", {
    dateStyle: "full",
  });
}

export function isStoreOwner() {}

export function beautifyId(id: string) {
  return id.split("_")[1];
}

export function calculateOrderAmounts(
  checkoutItems: CartLineDetailedItems[] | ProductWithQuantity[],
) {
  const PLATFORM_FEE_IN_DECIMAL = 0.01;
  const CENTS_UNIT_IN_DOLLAR = 100;
  const total =
    checkoutItems.reduce(
      (total, item) => total + item.qty * Number(item.price),
      0,
    ) * CENTS_UNIT_IN_DOLLAR;
  const fee = total * PLATFORM_FEE_IN_DECIMAL;

  return {
    totalAmount: total,
    feeAmount: fee,
  };
}

export function parse_to_json<TParsedData>(data: string): TParsedData {
  return JSON.parse(data);
}

export async function delete_existing_images(images: UploadData[]) {
  const utapi = new UTApi();
  const imageFileKeys = images.map((image) => image.key);
  return await utapi.deleteFiles(imageFileKeys);
}

// Type utils
export type OmitAndExtend<T, U extends keyof T, V extends {}> = Omit<T, U> & V;
// Omit is not giving us any hint, because the second generic parameter (K) is accepting "any" instead of key from (T).
export type TweakedOmit<T, U extends keyof T> = Omit<T, U>;
export type Extends<T extends any, U extends any> = T & U;
