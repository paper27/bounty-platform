import { type Contract } from "~/common/constants";

export const isNumeric = (val: any) =>
  (typeof val === "number" || (typeof val === "string" && val.trim() !== "")) &&
  !isNaN(val as number); // https://stackoverflow.com/a/58550111

export const destructureContractType = (params: Contract | undefined) => {
  const args = params?.args !== undefined ? params.args : [];
  const enabled = params?.enabled !== undefined ? params.enabled : true;
  const watch = params?.watch !== undefined ? params.watch : false;

  return { args, enabled, watch };
};
