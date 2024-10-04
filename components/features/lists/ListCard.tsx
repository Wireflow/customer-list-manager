import React from "react";
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
import ShareCustomList from "./actions/ShareCustomList";

type Props = {
  list: ListWithItems;
};

const ListCard = ({ list }: Props) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/dashboard/lists/${list.id}`);
  };

  return (
    <Card className="w-full md:w-auto hover:cursor-pointer hover:shadow-lg transition-all duration-500 hover:bg-secondary/15">
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          {list.name}
          {list.favorited && <Badge variant={"purple"}>Favorite</Badge>}
        </CardTitle>
        <CardDescription>{list.items.length} Items</CardDescription>
      </CardHeader>
      <CardFooter className="flex gap-4 justify-end">
        <Button variant={"outline"} onClick={handleCardClick}>
          Edit
        </Button>
        <ShareCustomList listId={list.id} />
      </CardFooter>
    </Card>
  );
};

export default ListCard;
