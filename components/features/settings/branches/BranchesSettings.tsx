import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import BranchesList from "./BranchesList";
import { useBranches } from "@/hooks/queries/branches/useBranches";
import NoData from "@/components/ui/no-data";
import CreateBranchForm from "./forms/CreateBranchForm";

type Props = {};

const BranchesSettings = (props: Props) => {
  const { data: branches, isLoading, isError } = useBranches();

  if (isLoading)
    return <NoData variant="loading" message="Loading branches..." />;
  if (isError)
    return <NoData variant="error" message="Failed to load branches..." />;

  return (
    <Card>
      <CardHeader>
        <div className="flex md:flex-row flex-col justify-between gap-2 ">
          <div>
            <CardTitle>Branches</CardTitle>
            <CardDescription>View and manage branches</CardDescription>
          </div>
          <CreateBranchForm />
        </div>
      </CardHeader>
      <CardContent>
        <BranchesList branches={branches ?? []} />
      </CardContent>
    </Card>
  );
};

export default BranchesSettings;
