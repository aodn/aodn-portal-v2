import { getSubgroup, ILink } from "@/app/api/ogcCollectionTypes";

// ================== UTILITY FUNCTIONS ==================
export function dataAccessParams(link: ILink): Gtag.CustomParams {
  return {
    title: link.title,
    href: link.href,
    type: link.type,
    rel: link.rel,
    subgroup: getSubgroup(link),
    ai_group: link["ai:group"],
  };
}
