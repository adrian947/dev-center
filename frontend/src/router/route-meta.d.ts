import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    navKey?: string;
    public?: boolean;
  }
}
