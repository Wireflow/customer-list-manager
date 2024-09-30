import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ListWithItems } from "@/types/schema/lists";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  list: ListWithItems;
};

const ListCard = ({ list }: Props) => {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/dashboard/lists/${list.id}`)}
      className="w-full md:w-auto hover:cursor-pointer hover:shadow-lg transition-all duration-500 hover:bg-secondary/15"
    >
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          {list.name}
          {list.favorited && <Badge variant={"outline"}>Favorite</Badge>}
        </CardTitle>
        <CardDescription>{list.items.length} Items</CardDescription>
      </CardHeader>
      <CardFooter className="flex gap-4 justify-end">
        <Button variant={"outline"}>Edit</Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          Send to...
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ListCard;
