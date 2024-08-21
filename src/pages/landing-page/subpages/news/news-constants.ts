import news1 from "@/assets/images/news1.png";
import news2 from "@/assets/images/news2.png";

export interface NewsCardData {
  id: number;
  image: string;
  category: string;
  date: string;
  title: string;
}
export const NEWS_CARDS_DATA: NewsCardData[] = [
  {
    id: 1,
    image: news1,
    category: "IMOS",
    date: "31.01.24",
    title: "IMOS is working on improving data discoverability",
  },
  {
    id: 2,
    image: news2,
    category: "National Mooring Network",
    date: "16.05.24",
    title: "New National Reference Station deployed in Victoria",
  },
];
