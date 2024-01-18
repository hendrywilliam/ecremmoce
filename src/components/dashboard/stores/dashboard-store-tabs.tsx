"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { storeFrontTabs } from "@/config/site";
import { useSearchParams } from "next/navigation";
import type { Product, Store } from "@/db/schema";
import DashboardStoreFrontTab from "@/components/dashboard/stores/store-front-tab";
import DashboardStoreProductTab from "@/components/dashboard/stores/store-product-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardStoreTransactionTab from "@/components/dashboard/stores/store-transaction-tab";

interface DashboardStoreTabsProps {
  store: Store;
  storeProductData: Product[];
  searchParamsTab: string;
  currentPage: number;
  totalPage: number;
}

export default function DashboardStoreTabs({
  searchParamsTab,
  storeProductData,
  store,
  currentPage,
  totalPage,
}: DashboardStoreTabsProps) {
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  return (
    <Tabs
      defaultValue={
        searchParamsTab &&
        storeFrontTabs.find((tab) => tab.value === searchParamsTab)
          ? searchParamsTab
          : "storefront"
      }
      className="w-full"
    >
      <TabsList>
        {storeFrontTabs.map((tab, i) => (
          <TabsTrigger
            value={tab.value}
            key={i}
            onClick={() =>
              push(`${pathname}?${createQueryString("tab", tab.value)}`)
            }
          >
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="storefront">
        <DashboardStoreFrontTab store={store} />
      </TabsContent>
      <TabsContent value="products">
        <DashboardStoreProductTab
          storeProductData={storeProductData}
          currentPage={currentPage}
          totalPage={totalPage}
        />
      </TabsContent>
      <TabsContent value="transaction">
        <DashboardStoreTransactionTab active={store.active} />
      </TabsContent>
    </Tabs>
  );
}
