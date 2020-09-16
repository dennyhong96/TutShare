import React from "react";

import withUserAuth from "../../components/withUesrAuth";

const User = ({}) => {
  return <p>Hello</p>;
};

export default withUserAuth(User);
