import PageHeader from "@/components/layout/PageHeader";
import ListDetailsPage from "@/webpages/lists/ListDetailsPage";

type Props = {
  params: {
    id: string;
  };
};

const ListDetails = async ({ params: { id } }: Props) => {
  return (
    <div>
      <PageHeader title="List Details" />
      <ListDetailsPage id={id} />
    </div>
  );
};

export default ListDetails;
