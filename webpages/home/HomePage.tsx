import React from "react";

type Props = {};

const HomePage = (props: Props) => {
  return (
    <div>
      <div>
        <span className="font-bold">TODO:</span> Add home page content
      </div>
      <ul>
        <li>Show number of accounts</li>
        <li>Show number of orders</li>
        <li>Create a new account</li>
        <li>View account</li>
        <li>Send a list</li>
        <li>View orders</li>
      </ul>
    </div>
  );
};

export default HomePage;
