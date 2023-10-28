import { ResultCardContent } from "./ResultCards";

const findResults = () : Array<ResultCardContent> =>  {
    return [
        {
            item: 1,
            uuid: 'uuid1',
            title: 'IMOS - ANMN South Australia (SA) Deep Slope Mooring (SAM1DS)',
            description: 'The data available from this mooring was designed to monitor particular oceanographic phenomena in coastal ocean waters. The mooring is located at Latitude:-36.52, Longitude:136.24',
            imageUrl: 'https://warcontent.com/wp-content/uploads/2021/03/substring-javascript-5.png',
            status: 'Completed'
        },
        {
            item: 2,
            uuid: 'uuid2',
            title: 'IMOS - ACORN - South Australia Gulfs HF ocean radar site - South Australia',
            description: 'The South Australia Gulfs (SAG) HF ocean radar system covers the area of about 40,000 square kilometres bounded by Kangaroo Island to the east and the Eyre Peninsula to the north. This is long',
            imageUrl: 'https://repository-images.githubusercontent.com/193934920/5bc47280-0e47-11eb-8941-b1c02885499e',
            status: 'On going'
        },
        {
            item: 3,
            uuid: 'uuid2',
            title: 'IMOS - ANMN South Australia (SA) Deep Slope Mooring (SAM1DS)',
            description: 'The data available from this mooring was designed to monitor particular oceanographic phenomena in coastal ocean waters. The mooring is located at Latitude:-36.52, Longitude:136.24.',
            imageUrl: 'https://th.bing.com/th/id/OIP.K-4RqDC6zFrpAG31ayDDOgHaHa?pid=ImgDet&rs=1',
            status: 'On going'
        },
        {
            item: 4,
            uuid: 'uuid2',
            title: 'IMOS - ACORN - South Australia Gulfs HF ocean radar site - South Australia',
            description: 'The South Australia Gulfs (SAG) HF ocean radar system covers the area of about 40,000 square kilometres bounded by Kangaroo Island to the east and the Eyre Peninsula to the north. This is long',
            imageUrl: 'https://repository-images.githubusercontent.com/193934920/5bc47280-0e47-11eb-8941-b1c02885499e',
            status: 'On going'
        },
        {
            item: 5,
            uuid: 'uuid2',
            title: 'IMOS - ACORN - South Australia Gulfs HF ocean radar site - South Australia',
            description: 'The South Australia Gulfs (SAG) HF ocean radar system covers the area of about 40,000 square kilometres bounded by Kangaroo Island to the east and the Eyre Peninsula to the north. This is long',
            imageUrl: 'https://repository-images.githubusercontent.com/193934920/5bc47280-0e47-11eb-8941-b1c02885499e',
            status: 'On going'
        },                     
    ];
}

export {
    findResults
}