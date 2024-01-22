import Link from "next/link";
import { db } from "@/db/core";
import { stores } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { UserObjectCustomized } from "@/types";
import { AddStoreIcon } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import DashboardStoreCard from "@/components/dashboard/stores/store-card";

export default async function DashboardStoresPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const userPrivateMetadata = (user as UserObjectCustomized).privateMetadata;
  const userStores =
    userPrivateMetadata.storeId.length > 0
      ? await db
          .select()
          .from(stores)
          .where(
            inArray(
              stores.id,
              userPrivateMetadata.storeId.map((item) => {
                return Number(item);
              }),
            ),
          )
      : [];

  return (
    <div className="h-1/2 w-full">
      <div className="w-full inline-flex">
        <div className="w-full">
          <h1 className="font-bold text-2xl w-[75%]">Stores</h1>
          <p className="w-[75%] text-gray-500">
            Manage your stores or create a new one.
          </p>
        </div>
        <div className="flex-1">
          <Link
            className={buttonVariants({ class: "w-max flex gap-2" })}
            href={"stores/new-store"}
          >
            New Store
            <AddStoreIcon />
          </Link>
        </div>
      </div>
      <Separator />
      {userStores.length > 0 ? (
        <div className="h-full w-full grid grid-cols-3 mt-6 gap-4">
          {userStores.map((store) => {
            return <DashboardStoreCard store={store} key={store.id} />;
          })}
        </div>
      ) : (
        <div className="mt-6">
          <p>
            You dont have any store to manage,{" "}
            <span className="font-semibold">try create a new one.</span>
          </p>
        </div>
      )}
    </div>
  );
}
