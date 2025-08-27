import news1 from "@/assets/images/news1.jpg";
import news2 from "@/assets/images/news2.png";
import news3 from "@/assets/images/news3.jpg";

export interface NewsCardData {
  id: number;
  image: string;
  subheading: string;
  date: string;
  title: string;
  link: string;
}
export const NEWS_CARDS_DATA: NewsCardData[] = [
  {
    id: 1,
    image: news1,
    subheading: "Satellite Remote Sensing",
    date: "01/01/2008 >>",
    title: "Satellite Altimetry Calibration and Validation",
    link: `${window.location.origin}/details/78d588ed-79dd-47e2-b806-d39025194e7e?tab=summary`,
  },
  {
    id: 2,
    image: news2,
    subheading: "Coastal Wave Buoys",
    date: "14/01/2018 >>",
    title: " Wave buoys Observations - Australia - near real-time",
    link: `${window.location.origin}/details/b299cdcd-3dee-48aa-abdd-e0fcdbb9cadc?tab=summary`,
  },
  {
    id: 3,
    image: news3,
    subheading: "Ships of Opportunity",
    date: "01/01/2011 >>",
    title: "Fisheries vessels real-time data collection",
    link: `${window.location.origin}/details/0015db7e-e684-7548-e053-08114f8cd4ad?tab=summary`,
  },
];
