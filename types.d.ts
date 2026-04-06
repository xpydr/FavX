declare module "*.svg" {
  const content: React.FC<React.SVGProps<SVGSVGElement> & { height?: number | string; width?: number | string }>;
  export default content;
}
