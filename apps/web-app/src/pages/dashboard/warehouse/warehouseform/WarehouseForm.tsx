/* eslint-disable */

import WarehouseCreateForm from "./WarehouseCreateForm";
import WarehouseUpdateForm from "./WarehouseUpdateForm";

export default function WarehouseForm(props: any) {

  return (
    <>
      <WarehouseCreateForm {...props} />
      <WarehouseUpdateForm {...props} />
    </>
  );

}