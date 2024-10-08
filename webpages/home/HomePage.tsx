import AccountsHomeList from "./AccountsHomeList";
import HomeHeader from "./HomeHeader";
import OrderHomeList from "./OrderHomeList";
import SharedLists from "./SharedLists";

type Props = {};

const HomePage = (props: Props) => {
  return (
    <div className="flex flex-col gap-5">
      <HomeHeader />
      <div className="flex flex-col lg:flex-row gap-5 w-full  ">
        <OrderHomeList />
        <SharedLists />
      </div>{" "}
      <AccountsHomeList />
    </div>
  );
};

export default HomePage;
