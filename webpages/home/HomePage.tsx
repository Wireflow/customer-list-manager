import React from "react";
import HomeHeader from "./HomeHeader";
import SharedLists from "./SharedLists";
import AccountsList from "@/components/features/accounts/AccountsList";
import AccountsHomeList from "./AccountsHomeList";
import OrderHomeList from "./OrderHomeList";

type Props = {};

const HomePage = (props: Props) => {
  return (
    <div className="flex flex-col gap-5">
      <HomeHeader />
      <div className="flex flex-col lg:flex-row gap-5 w-full  ">
        <SharedLists />
        <AccountsHomeList />
      </div>{" "}
      <OrderHomeList />
    </div>
  );
};

export default HomePage;
