declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

declare module "*.css";
declare module "*.scss";
declare module "*.sass";

declare const process: {
  env: {
    URL_BACK?: string;
  };
};