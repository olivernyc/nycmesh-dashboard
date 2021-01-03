import React from "react";
import Button from "../Button2";

import { FilterIcon } from "@primer/octicons-react";

export default function Filters() {
  return (
    <div className="absolute top-0 right-0 ma3">
      <Button title="Filter" icon={<FilterIcon />} />
    </div>
  );
}
