const response1 = {
  links: [],
  collections: [
    {
      properties: {
        status: "onGoing",
      },
      id: "b299cdcd-3dee-48aa-abdd-e0fcdbb9cadc",
      title: "Wave buoys Observations - Australia - near real-time",
      description:
        "Buoys provide integral wave parameters. Buoy data from the following organisations contribute to the National Wave Archive: Manly Hydraulics Laboratory (part of the NSW Department of Climate Change, Energy, the Environment and Water (DCCEEW), which has assumed function of the former NSW Office of Environment and Heritage (OEH)); Bureau of Meteorology; Western Australia Department of Transport (DOT); the Queensland Department of Environment and Science (DES); the Integrated Marine Observing System (IMOS); Gippsland Ports; the NSW Nearshore Wave Data Program from the NSW Department of Climate Change, Energy, the Environment and Water (DCCEEW); the University of Western Australia (UWA); Deakin University, Pilbara Ports Authority and Flinders University and South Australian Research and Development Institute (SARDI). \n\nThe data from MHL, BOM, DOT, DES, Gippsland Ports and Pilbara Ports Authority, is gathered by the Waverider system developed by the Dutch company, Datawell. Some older wave data were collected using non-directional Waverider buoys. As technology advanced and directional measuring capabilities were developed in wave buoys, wave buoy networks were gradually upgraded to directional Waverider buoys. Therefore, some older datasets do not have directional information whereas newer datasets have directional information.\n\nThe data from IMOS, the NSW Nearshore Wave Data Program, DCCEEW, UWA, Deakin, Flinders University and SARDI comes from Spotter Wave Buoys, developed by Sofar Ocean Technologies, which collect data similarly to the Waverider system.\n\nBOM, DES, DOT, MHL, IMOS (some) and Gippsland Ports - The wave buoy data is issued in GTS bulletins (which are only available for 24 hours) : IOWK01 (in BUFR format) and SWWE01 (CREX format). The data is collated by the Bureau into a CSV file (containing the last 24 hours of observations) which is updated every hour, at 5 minutes past the hour. This data is provided via WFS to the AODN.\nNote - The Maria Island buoy is currently undergoing repairs, so data is unavailable, we will update when resolved (May 2024).\n\nIMOS (some), DCCEEW, UWA, Deakin, Flinders University + SARDI - The data is updated every hour, at 40 minutes past the hour.\n\nPilbara Ports Authority - The data is uploaded every hour, at 30 minutes past the hour.",
      links: [
        {
          href: "http://www.bom.gov.au/products/IDS65030.shtml",
          rel: "related",
          type: "text/html",
          title: "DownloadableData: [graph] Cape du Couedic Wave Observations",
          "ai:group": "Other",
        },
        {
          href: "http://www.bom.gov.au/products/IDT65014.shtml",
          rel: "related",
          type: "text/html",
          title:
            "DownloadableData: [graph] Cape Sorell Waverider Buoy Observations",
          "ai:group": "Other",
        },
        {
          href: "http://wisupt.bom.gov.au/openwis-user-portal/srv/en/main.home",
          rel: "related",
          type: "text/html",
          title:
            "DownloadableData: [BUFR-IOWK01 or CREX-SWWE01] WMO WIS GTS wavebuoy bulletins",
          "ai:group": "Other",
        },
        {
          href: "http://www.transport.wa.gov.au/imarine/about-wave-data.asp",
          rel: "related",
          type: "text/html",
          title: "WA DOT Wave monitoring sites",
          "ai:group": "Other",
        },
        {
          href: "https://www.qld.gov.au/environment/coasts-waterways/beach/waves-sites",
          rel: "related",
          type: "text/html",
          title:
            "Queensland Department of Environment & Science wave monitoring sites",
          "ai:group": "Other",
        },
        {
          href: "https://auswaves.org/",
          rel: "related",
          type: "text/html",
          title: "AusWaves website",
          "ai:group": "Other",
        },
        {
          href: "https://imos.aodn.org.au/imos123/home?uuid=b299cdcd-3dee-48aa-abdd-e0fcdbb9cadc",
          rel: "related",
          type: "text/html",
          title: "View and download data though the AODN Portal",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/wms",
          rel: "wms",
          type: "",
          title: "aodn:aodn_wave_nrt_v2_timeseries_map",
          "ai:group": "Data Access > wms",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/ows",
          rel: "wfs",
          type: "",
          title: "aodn:aodn_wave_nrt_v2_timeseries_data",
          "ai:group": "Data Access > wfs",
        },
        {
          href: "https://help.aodn.org.au/web-services/ogc-wfs/",
          rel: "related",
          type: "text/html",
          title: "OGC WFS help documentation",
          "ai:group": "Document",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/ows",
          rel: "IMOS:AGGREGATION--bodaac",
          type: "",
          title: "aodn_wave_nrt_v2_timeseries_map#url",
        },
        {
          href: "https://help.aodn.org.au/web-services/ncurllist-service/",
          rel: "related",
          type: "text/html",
          title: "ncUrlList help documentation",
        },
        {
          href: "http://www.bom.gov.au/products/IDT65091.shtml",
          rel: "related",
          type: "text/html",
          title: "DownloadableData: [graph] Maria Island Wave Observations",
          "ai:group": "Other",
        },
        {
          href: "http://www.bom.gov.au/products/IDD65028.shtml",
          rel: "related",
          type: "text/html",
          title: "DownloadableData: [graph] Goodrich Bank Wave Observations",
          "ai:group": "Other",
        },
        {
          href: "http://content.aodn.org.au/?prefix=Documents/AODN/Waves/Instruments_manuals/",
          rel: "related",
          type: "text/html",
          title: "Instrument manuals",
          "ai:group": "Document",
        },
        {
          href: "https://content.aodn.org.au/Documents/IMOS/Conventions/Wave_standards/AODN_wave_buoy_operations_and_data_management_guidelines_v1.0.pdf",
          rel: "related",
          type: "text/html",
          title: "Wave Buoy Operations and Data Management Guidelines Manual",
          "ai:group": "Document",
        },
        {
          href: "https://thredds.aodn.org.au/thredds/catalog/Bureau_of_Meteorology/WAVE-BUOYS/REALTIME/WAVE-PARAMETERS/catalog.html",
          rel: "related",
          type: "text/html",
          title: "NetCDF files via THREDDS catalog (BOM)",
          "ai:group": "Data Access > thredds",
        },
        {
          href: "https://thredds.aodn.org.au/thredds/catalog/Department_of_Environment_and_Science-Queensland/WAVE-BUOYS/REALTIME/WAVE-PARAMETERS/catalog.html",
          rel: "related",
          type: "text/html",
          title: "NetCDF files via THREDDS catalog (DES)",
          "ai:group": "Data Access > thredds",
        },
        {
          href: "https://thredds.aodn.org.au/thredds/catalog/Department_of_Planning_and_Environment-New_South_Wales/WAVE-BUOYS/REALTIME/WAVE-PARAMETERS/catalog.html",
          rel: "related",
          type: "text/html",
          title: "NetCDF files via THREDDS catalog (NSW Government)",
          "ai:group": "Data Access > thredds",
        },
        {
          href: "https://thredds.aodn.org.au/thredds/catalog/Department_of_Planning_and_Environment-New_South_Wales/Manly_Hydraulics_Laboratory/WAVE-BUOYS/REALTIME/WAVE-PARAMETERS/catalog.html",
          rel: "related",
          type: "text/html",
          title: "NetCDF files via THREDDS catalog (MHL)",
          "ai:group": "Data Access > thredds",
        },
        {
          href: "https://thredds.aodn.org.au/thredds/catalog/Department_of_Transport-Western_Australia/WAVE-BUOYS/REALTIME/WAVE-PARAMETERS/catalog.html",
          rel: "related",
          type: "text/html",
          title: "NetCDF files via THREDDS catalog (DoT)",
          "ai:group": "Data Access > thredds",
        },
        {
          href: "https://thredds.aodn.org.au/thredds/catalog/Deakin_University/WAVE-BUOYS/REALTIME/WAVE-PARAMETERS/catalog.html",
          rel: "related",
          type: "text/html",
          title: "NetCDF files via THREDDS catalog (Deakin)",
          "ai:group": "Data Access > thredds",
        },
        {
          href: "https://thredds.aodn.org.au/thredds/catalog/Pilbara_Ports_Authority/WAVE-BUOYS/REALTIME/WAVE-PARAMETERS/catalog.html",
          rel: "related",
          type: "text/html",
          title: "NetCDF files via THREDDS catalog (Pilbara Ports Authority)",
          "ai:group": "Data Access > thredds",
        },
        {
          href: "https://thredds.aodn.org.au/thredds/catalog/Gippsland-Ports-Victoria/WAVE-BUOYS/REALTIME/WAVE-PARAMETERS/catalog.html",
          rel: "related",
          type: "text/html",
          title: "NetCDF files via THREDDS catalog (Gippsland Ports)",
          "ai:group": "Data Access > thredds",
        },
        {
          href: "https://thredds.aodn.org.au/thredds/catalog/Flinders_University/WAVE-BUOYS/REALTIME/WAVE-PARAMETERS/catalog.html",
          rel: "related",
          type: "text/html",
          title: "NetCDF files via THREDDS catalog (Flinders University)",
          "ai:group": "Data Access > thredds",
        },
        {
          href: "https://registry.opendata.aws/aodn_wave_buoy_realtime_nonqc/",
          rel: "related",
          type: "text/html",
          title:
            "Access To AWS Open Data Program registry for the Cloud Optimised version of this dataset",
          "ai:group": "Data Access > aws",
        },
        {
          href: "https://github.com/aodn/aodn_cloud_optimised/blob/main/notebooks/wave_buoy_realtime_nonqc.ipynb",
          rel: "related",
          type: "application/x-ipynb+json",
          title:
            "Access to Jupyter notebook to query Cloud Optimised converted dataset",
          "ai:group": "Python Notebook",
        },
        {
          href: "https://geonetwork.edge.aodn.org.au:443/geonetwork/images/logos/2976cf80-3906-41aa-8916-4adfbc507438.png",
          rel: "icon",
          type: "image/png",
          title: "Suggest icon for dataset",
        },
        {
          href: "https://catalogue-imos.aodn.org.au:443/geonetwork/srv/api/records/b299cdcd-3dee-48aa-abdd-e0fcdbb9cadc",
          rel: "describedby",
          type: "text/html",
          title: "Full metadata link",
        },
        {
          href: "http://i.creativecommons.org/l/by/4.0/88x31.png",
          rel: "license",
          type: "image/png",
        },
        {
          href: "http://creativecommons.org/licenses/by/4.0/",
          rel: "license",
          type: "text/html",
        },
        {
          href: '"https://nbviewer.org/github/aodn/aodn_cloud_optimised/blob/main/notebooks/wave_buoy_realtime_nonqc.ipynb"',
          rel: "related",
          type: "application/x-ipynb+json",
          title: "Python notebook example",
          "ai:group": "Python Notebook",
        },
        {
          href: "http://localhost:8080/api/v1/ogc/collections/b299cdcd-3dee-48aa-abdd-e0fcdbb9cadc/items/summary",
          rel: "summary",
          type: "application/x-parquet",
          title: "Summary",
        },
      ],
      extent: {
        spatial: {
          bbox: [
            [114.0, -43.0, 155.0, -10.0],
            [114.0, -31.0, 115.0, -30.0],
            [115.0, -33.0, 116.0, -31.0],
            [129.0, -11.0, 130.0, -10.0],
            [141.0, -13.0, 142.0, -11.0],
            [145.0, -17.0, 146.0, -16.0],
            [147.0, -20.0, 148.0, -19.0],
            [151.0, -24.0, 152.0, -23.0],
            [152.0, -25.0, 153.0, -24.0],
            [149.0, -22.0, 150.0, -21.0],
            [153.0, -29.0, 155.0, -25.0],
            [153.0, -31.0, 154.0, -30.0],
            [114.0, -34.0, 115.0, -33.0],
            [151.0, -35.0, 152.0, -33.0],
            [150.0, -38.0, 151.0, -37.0],
            [147.0, -38.0, 148.0, -37.0],
            [121.0, -35.0, 122.0, -33.0],
            [136.0, -37.0, 137.0, -36.0],
            [150.0, -36.0, 151.0, -35.0],
            [117.0, -36.0, 118.0, -35.0],
            [145.0, -43.0, 146.0, -42.0],
            [148.0, -43.0, 149.0, -42.0],
          ],
          crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        },
        temporal: {
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {
        status: "onGoing",
      },
      id: "4402cb50-e20a-44ee-93e6-4728259250d2",
      title: "IMOS - Argo Profiles - core data",
      description:
        "Argo Australia aims to undertake real time monitoring of the broad ocean state around Australia by maintaining an array of profiling (Argo) floats that measure temperature, salinity and pressure down to 2000m every 10 days in real time. The data presented here, represent all Australian Argo profiles collected since 2000, and covers the oceans in the southern hemisphere worldwide. A typical Argo float mission is to profile from 2000 m depth to the sea surface every 10 days. On deployment, the float sinks to a depth of 1000 m and drifts with the ocean currents for 9 days. Then the float sinks deeper to its profile depth (usually 2000 m) before starting to ascend through the water column measuring temperature, salinity and pressure as it rises. Once at the surface it transmits location and profile data via satellite to land-based Argo data centres. After transmission the float sinks again and repeats the cycle. Each Argo float is identified by a unique identification number called a WMO ID. WMO (World Meteorological Organisation) ID Numbers are assigned to measurement stations and observing platforms to enable researchers to keep track of, and uniquely identify their floats. The average life of the latest model APEX Argo floats are around 3.7 years or approximately 135 cycles. These statistics are for floats with the standard alkaline battery configuration from an analysis by Kobayashi et al (2009). In the Australian Argo program, the floats are deployed with a combination of lithium and alkaline battery packs which extends float lifetime. The Facility floats usually last 5 years and several floats are approaching their 9th birthday and are still returning good data.\n\nThis data collection only provides access to the core data collected by Argo floats, i.e. temperature, salinity and pressure. To access biogeochemical (BGC) data recorded by selected floats, please access via this data collection - IMOS - Argo Profiles - biogeochemical data, https://catalogue-imos.aodn.org.au/geonetwork/srv/eng/catalog.search#/metadata/2223b7f2-4bac-4ff1-9b1e-aae9ac58deef.",
      links: [
        {
          href: "http://www.argodatamgt.org/Documentation",
          rel: "related",
          type: "text/html",
          title: "Link to Argo User's Manual",
          "ai:group": "Document",
        },
        {
          href: "https://imos.org.au/facility/argo-floats",
          rel: "related",
          type: "text/html",
          title: "Argo page on IMOS website",
          "ai:group": "Other",
        },
        {
          href: "http://thredds.aodn.org.au/thredds/catalog/IMOS/Argo/dac/catalog.html",
          rel: "related",
          type: "text/html",
          title: "NetCDF files via THREDDS catalog",
          "ai:group": "Data Access > thredds",
        },
        {
          href: "https://portal.aodn.org.au/search?uuid=4402cb50-e20a-44ee-93e6-4728259250d2",
          rel: "related",
          type: "text/html",
          title: "View and download data though the AODN Portal",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/wms",
          rel: "wms",
          type: "",
          title: "imos:argo_profile_map",
          "ai:group": "Data Access > wms",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/ows",
          rel: "wfs",
          type: "",
          title: "imos:argo_primary_profile_core_low_res_good_qc_data",
          "ai:group": "Data Access > wfs",
        },
        {
          href: "https://help.aodn.org.au/web-services/ogc-wfs/",
          rel: "related",
          type: "text/html",
          title: "OGC WFS help documentation",
          "ai:group": "Document",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/ows",
          rel: "IMOS:AGGREGATION--bodaac",
          type: "",
          title: "argo_profile_map#url",
        },
        {
          href: "https://help.aodn.org.au/web-services/ncurllist-service/",
          rel: "related",
          type: "text/html",
          title: "ncUrlList help documentation",
        },
        {
          href: "https://geonetwork.edge.aodn.org.au:443/geonetwork/images/logos/2976cf80-3906-41aa-8916-4adfbc507438.png",
          rel: "icon",
          type: "image/png",
          title: "Suggest icon for dataset",
        },
        {
          href: "https://catalogue-imos.aodn.org.au:443/geonetwork/srv/api/records/4402cb50-e20a-44ee-93e6-4728259250d2",
          rel: "describedby",
          type: "text/html",
          title: "Full metadata link",
        },
        {
          href: "https://licensebuttons.net/l/by/4.0/88x31.png",
          rel: "license",
          type: "image/png",
        },
        {
          href: "http://creativecommons.org/licenses/by/4.0/",
          rel: "license",
          type: "text/html",
        },
        {
          href: "uuid:8cc13f98-9897-4193-8ba6-d1f05356d3f2",
          rel: "parent",
          type: "application/json",
          title:
            '{"title":"Argo float : a platform of the IMOS Argo Floats Facility","recordAbstract":"Argo floats have revolutionised our understanding of the broad scale structure of the oceans to 2000 m depth. In the past 10 years more high resolution hydrographic profiles have been provided by Argo floats then from the rest of the observing system put together.\\n\\nEach Argo float is identified by a unique identification number called a WMO ID. WMO (World Meteorological Organisation) ID Numbers are assigned to measurement stations and observing platforms to enable researchers to keep track of, and uniquely identify their floats.\\n\\nArgo floats alter their buoyancy by using a battery pack and motor to drive oil from inside the float to an external bladder. This changes the floats volume and thus its density relative to the surrounding seawater allowing it to move up and down through the water column. \\n\\nA typical Argo float mission is to profile from 2000 m depth to the sea surface every 10 days. On deployment, the float sinks to a depth of 1000 m and drifts with the ocean currents for 9 days. Then the float sinks deeper to its profile depth (usually 2000 m) before starting to ascend through the water column measuring temperature, salinity and pressure as it rises. Once at the surface it transmits location and profile data via satellite to land-based Argo data centres. After transmission the float sinks again and repeats the cycle. \\n\\nThe average life of the latest model APEX Argo floats are around 3.7 years or approximately 135 cycles. These statistics are for floats with the standard alkaline battery configuration from an analysis by Kobayashi et al (2009).In the Australian Argo program, the floats are deployed with a combination of lithium and alkaline battery packs which extends float lifetime. The Facility floats usually last 7 years and several floats are approaching their 9th birthday and are still returning good data."}',
        },
        {
          href: "uuid:76183807-8493-489e-b3d7-d702510bb122",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS Argo - Aggregation (yearly composite) of Argo profiles for the Atlantic, North Pacific, South Pacific and Indian ocean from 1998 to now","recordAbstract":"This dataset contains aggregated Argo profiles collected around the world since 1998.\\n\\nYearly composites for 4 different oceans have been created:\\n - Atlantic Ocean,\\n - North Pacific Ocean,\\n - South Pacific Ocean,\\n - Indian Ocean."}',
        },
        {
          href: "uuid:2223b7f2-4bac-4ff1-9b1e-aae9ac58deef",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Argo Profiles - biogeochemical data","recordAbstract":"The IMOS Biogeochemical Argo sub-facility aims to undertake real time monitoring of the broad ocean state around Australia by deploying Biogeochemical Argo floats in scientifically important areas of Australia\'s Exclusive Economic Zone, surrounding seas and the Southern Ocean. The data presented here, includes all Biogeochemical Argo profiles collected since 2002, and covers the oceans worldwide. In collaboration with the US SOCCOM project, the first IMOS Australia Biogeochemical Argo floats were deployed in the East Australia Current in September 2019. Biogeochemical Argo floats are profiling floats that, in addition to temperature and salinity (this data is provided by the IMOS - Argo Profiles - core data collection, https://catalogue-imos.aodn.org.au/geonetwork/srv/eng/catalog.search#/metadata/4402cb50-e20a-44ee-93e6-4728259250d2), carry sensors to measure any combination of dissolved oxygen, pH, dissolved nitrate, chlorophyll fluorescence, particulate backscatter and incoming solar radiation (data provided for the first 4 variables only).\\n\\nA typical Argo float mission is to profile from 2000 m depth to the sea surface every 10 days. On deployment, the float sinks to a depth of 1000 m and drifts with the ocean currents for 9 days. Then the float sinks deeper to its profile depth (usually 2000 m) before starting to ascend through the water column measuring parameters as it rises. Once at the surface it transmits location and profile data via satellite to land-based Argo data centres. After transmission the float sinks again and repeats the cycle. \\n\\nEach Argo float is identified by a unique identification number called a WMO ID. WMO (World Meteorological Organisation) ID Numbers are assigned to measurement stations and observing platforms to enable researchers to keep track of, and uniquely identify their floats. The average life of the latest model APEX Argo floats are around 3.7 years or approximately 135 cycles. These statistics are for floats with the standard alkaline battery configuration from an analysis by Kobayashi et al (2009). In the Australian Argo program, the floats are deployed with a combination of lithium and alkaline battery packs which extends float lifetime. The Facility floats usually last 5 years."}',
        },
        {
          href: '"https://nbviewer.org/github/aodn/aodn_cloud_optimised/blob/main/notebooks/argo.ipynb"',
          rel: "related",
          type: "application/x-ipynb+json",
          title: "Python notebook example",
          "ai:group": "Python Notebook",
        },
        {
          href: "http://localhost:8080/api/v1/ogc/collections/4402cb50-e20a-44ee-93e6-4728259250d2/items/summary",
          rel: "summary",
          type: "application/x-parquet",
          title: "Summary",
        },
      ],
      extent: {
        spatial: {
          bbox: [
            [-180.0, -90.0, 180.0, 90.0],
            [-180.0, 65.0, -125.0, 80.0],
            [140.0, 55.0, 145.0, 60.0],
            [-105.0, 55.0, -100.0, 60.0],
            [20.0, 10.0, 25.0, 15.0],
            [-180.0, -80.0, 180.0, 90.0],
            [-85.0, -85.0, -80.0, -80.0],
            [-180.0, -90.0, -175.0, -85.0],
          ],
          crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        },
        temporal: {
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {
        status: "onGoing",
      },
      id: "efd8201c-1eca-412e-9ad2-0534e96cea14",
      title: "IMOS - Moorings - Hourly time-series product",
      description:
        "Integrated Marine Observing System (IMOS) have moorings across both it's National Mooring Network and Deep Water Moorings facilities. The National Mooring Network facility comprises a series of national reference stations and regional moorings designed to monitor particular oceanographic phenomena in Australian coastal ocean waters. The Deep Water Moorings facility (formerly known as the Australian Bluewater Observing System) provides the coordination of national efforts in the sustained observation of open ocean properties with particular emphasis on observations important to climate and carbon cycle studies, with selected moorings from its Deep Water Arrays sub-facility providing data to this collection.\nThis collection represents the hourly aggregated time-series product, which combines selected variables measured by all the instruments deployed at a site, binning the values into a fixed one-hour interval. Only good-quality measurements (according to the automated quality-control procedures applied by the National Mooring Network) are included. \nThe parameters are: temperature, salinity, dissolved oxygen, chlorophyll estimates, turbidity, down-welling photosynthetic photon flux (PAR), and current velocity, accompanied by depth and pressure when available. The observations were made using a range of temperature loggers, conductivity-temperature-depth (CTD) instruments, water-quality monitors (WQM), acoustic Doppler current profilers (ADCPs), and single-point current meters.",
      links: [
        {
          href: "http://imos.org.au/nationalmooringnetwork.html",
          rel: "related",
          type: "text/html",
          title: "National Mooring Network facility page on IMOS website",
          "ai:group": "Other",
        },
        {
          href: "http://imos.org.au/facilities/deepwatermoorings/deepwaterarrays/",
          rel: "related",
          type: "text/html",
          title: "Deep Water Arrays sub-facility page on IMOS website",
          "ai:group": "Other",
        },
        {
          href: "http://thredds.aodn.org.au/thredds/catalog/IMOS/ANMN/catalog.html",
          rel: "related",
          type: "text/html",
          title:
            'NetCDF files via THREDDS catalog - "hourly_timeseries? folder inside each site directory (National Mooring Network)',
          "ai:group": "Data Access > thredds",
        },
        {
          href: "http://thredds.aodn.org.au/thredds/catalog/IMOS/DWM/DA/hourly_timeseries/catalog.html",
          rel: "",
          type: "",
          title: "NetCDF files via THREDDS catalog (Deep Water Arrays)",
          "ai:group": "Data Access > thredds",
        },
        {
          href: "https://github.com/aodn/python-aodntools/tree/master/aodntools/timeseries_products",
          rel: "related",
          type: "text/html",
          title:
            "Detailed documentation of the product and the Python code used to produce the files",
          "ai:group": "Document",
        },
        {
          href: "https://github.com/aodn/imos-user-code-library/blob/master/Python/notebooks/ANMN_LTSP_hourlytimeseries_Demo.ipynb",
          rel: "related",
          type: "application/x-ipynb+json",
          title:
            "Notebook on how to manipulate and plot the variables (Python version)",
          "ai:group": "Python Notebook",
        },
        {
          href: "https://github.com/aodn/imos-user-code-library/blob/master/R/notebooks/ANMN_LTSP_hourlytimeseries_Demo.Rmd",
          rel: "related",
          type: "text/html",
          title:
            "Notebook on how to manipulate and plot the variables (R version)",
          "ai:group": "Other",
        },
        {
          href: "https://portal.aodn.org.au/search?uuid=efd8201c-1eca-412e-9ad2-0534e96cea14",
          rel: "related",
          type: "text/html",
          title: "View and download data though the AODN Portal",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/wms",
          rel: "wms",
          type: "",
          title: "imos:moorings_hourly_timeseries_map",
          "ai:group": "Data Access > wms",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/ows",
          rel: "IMOS:AGGREGATION--bodaac",
          type: "",
          title: "moorings_hourly_timeseries_map#url",
        },
        {
          href: "https://help.aodn.org.au/web-services/ncurllist-service/",
          rel: "related",
          type: "text/html",
          title: "ncUrlList help documentation",
        },
        {
          href: "https://registry.opendata.aws/aodn_mooring_hourly_timeseries_delayed_qc/",
          rel: "related",
          type: "text/html",
          title:
            "Access To AWS Open Data Program registry for the Cloud Optimised version of this dataset",
          "ai:group": "Data Access > aws",
        },
        {
          href: "https://github.com/aodn/aodn_cloud_optimised/blob/main/notebooks/mooring_hourly_timeseries_delayed_qc.ipynb",
          rel: "related",
          type: "application/x-ipynb+json",
          title:
            "Access to Jupyter notebook to query Cloud Optimised converted dataset",
          "ai:group": "Python Notebook",
        },
        {
          href: "https://geonetwork.edge.aodn.org.au:443/geonetwork/images/logos/2976cf80-3906-41aa-8916-4adfbc507438.png",
          rel: "icon",
          type: "image/png",
          title: "Suggest icon for dataset",
        },
        {
          href: "https://catalogue-imos.aodn.org.au:443/geonetwork/srv/api/records/efd8201c-1eca-412e-9ad2-0534e96cea14",
          rel: "describedby",
          type: "text/html",
          title: "Full metadata link",
        },
        {
          href: "https://licensebuttons.net/l/by/4.0/88x31.png",
          rel: "license",
          type: "image/png",
        },
        {
          href: "http://creativecommons.org/licenses/by/4.0/",
          rel: "license",
          type: "text/html",
        },
        {
          href: "uuid:f9c151bd-d95b-4af6-8cb7-21c05b7b383b",
          rel: "parent",
          type: "application/json",
          title:
            '{"title":"IMOS - National Mooring Network Facility","recordAbstract":"The National Mooring Network Facility (formerly known as the Australian National Mooring Network (ANMN)), is a series of national reference stations and regional moorings designed to monitor particular oceanographic phenomena in Australian coastal ocean waters. \\n\\nThere are nine current sub-facilities, including five regional sub-facilities. Inactive sub-facilities include: Ningaloo Moorings - WA, Deep Water Waves - Qld, Larval Fish and Acoustic Observatories.\\n\\nThe current sub-facilities are:\\na) Queensland and Northern Australia\\nb) New South Wales\\nc) Southern Australia\\nd) Western Australia\\ne) Victoria\\nf) National Reference Stations (Coordination and Analysis)\\ng) Acidification Moorings\\nh) Wave Buoys\\ni) Marine Microplastics\\n\\nThe National Reference Stations were first established in the 1940’s and are the backbone component of the observing system. Extended by IMOS from three to nine sites around the entire Australian continent, the stations report integrated biological, chemical and physical oceanography time series observations, upon which more intensive local and regional scale studies can be referenced against. The regional moorings monitor the interaction between boundary currents and shelf water masses and their consequent impact upon ocean productivity (e.g. Perth Canyon Upwelling; Kangaroo Island Upwelling) and ecosystem distribution and resilience (e.g. Coral Sea interaction with the Great Barrier Reef ). Operation of the network is distributed between several operators and coordinated nationally.\\n\\nThe Acidification Moorings are co-located (or nearby) at three of the National Reference Stations, and provide key observations to help us understand and address the problem of increasing ocean acidification."}',
        },
        {
          href: "uuid:279a50e3-21a5-4590-85a0-71f963efab82",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Moorings - Gridded time-series product","recordAbstract":"Integrated Marine Observing System (IMOS) have moorings across both it\'s National Mooring Network and Deep Water Moorings facilities. The National Mooring Network facility comprises a series of national reference stations and regional moorings designed to monitor particular oceanographic phenomena in Australian coastal ocean waters. The Deep Water Moorings facility (formerly known as the Australian Bluewater Observing System) provides the coordination of national efforts in the sustained observation of open ocean properties with particular emphasis on observations important to climate and carbon cycle studies, with selected moorings from its Deep Water Array sub-facility providing data to this collection.\\n\\nThis collection represents the gridded time-series product of temperature observations, binned to one-hour intervals and interpolated to a fixed set of target depths for each IMOS mooring site. Only good-quality measurements (according to the automated quality-control procedures applied by the National Mooring Network) are included.\\n\\nThe observations were made using a range of temperature loggers, conductivity-temperature-depth (CTD) instruments, water-quality monitors (WQM), and temperature sensors on acoustic Doppler current profilers (ADCPs)."}',
        },
        {
          href: "uuid:7cd07703-001e-42b6-9876-d6f7c2da6eeb",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - South-East Queensland 400m (SEQ400) Mooring Platform","recordAbstract":"The South-East Queensland 400m mooring (IMOS platform code SEQ400) is part of the East Australian Current (EAC) array. It was initially deployed on the 24/03/2012 at (27.33 S, 153.88 E). The site depth is 404m. This mooring was decommissioned in June 2013.\\n\\nObservations of currents, temperature, pressure and conductivity are measured.\\n\\nIn conjunction with the SEQ200 mooring and the North Stradbroke Island National Reference Station (NRS NSI), this mooring forms the inshore component of the the EAC mooring array. The East Australian Current (EAC) is the major western boundary current of the south Pacific Ocean. It plays a critical role in the ocean re-distribution of global heat from the equator to the midand- high latitudes. The EAC is relatively stable north of Brisbane, but as the current moves south 2-3 large eddies are pinched off every year. These eddies frequently move onto the continental shelf and close inshore and influence the local circulation patterns. At prominent coastal features the EAC moves away from the coast, driving upwelling which draws nutrient-rich water from a depth of 200m or more. \\n\\nManagement of this mooring is undertaken by staff from the National Reference Station (North Stradbroke and Maria Island)."}',
        },
        {
          href: "uuid:6c981d98-d7fb-4120-9ebe-347ef1188ae0",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - National Mooring Network - National Reference Station (NRS) Sub-Facility","recordAbstract":"The IMOS National Reference Station Sub-Facility (NRS) comprises of a series of national reference stations designed to monitor particular oceanographic phenomena in Australian coastal ocean waters. The reference stations increase the number of long term time series observations available to researchers, both in terms of variables recorded, temporal distribution and geographical extent. Data is collected using moored sensors and in monthly water sampling field trips. \\n\\nAs the project progresses NRS moorings will be fitted for telemetry and data will become available in real time from each of the NRS sites around Australia (currently only Darwin and Yongala).\\n\\nThere are 8 current NRS sites: Two in Queensland, one in the Northern Territory, one in Western Australia, one in Tasmania, one in New South Wales, one in South Australia and one in Victoria. There is one former site at Esperance, the mooring was retrieved in December 2013 and not redeployed; and one former site at Ningaloo Reef, with the mooring retrieved in August 2014 and not redeployed. Operation of the NRS sub-facility is distributed between several operators and is coordinated nationally."}',
        },
        {
          href: "uuid:747f3ac7-ad81-46be-b887-ee83d2e4a6ea",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - National Mooring Network - Victoria Mooring Sub-Facility","recordAbstract":"The Victoria Moorings Sub-Facility is part of the National Mooring Network Facility.\\n\\nVictorian Moorings is responsible for a mooring deployed in the Bonney Coast region off Cape Bridgewater (Victoria). This region of the Victorian coastline has strong seasonal upwelling and supports one of the most productive regions of temperate Australian coastal waters. Not only does this region support large populations of migratory whales, fur seals, sharks, and bluefin tuna, it is also an important region from fisheries.\\n\\nVictorian Moorings fill a historical gap in the national backbone or coastal moorings, providing valuable information on the hydrodynamics of upwelling processes that underpin the productivity off the Bonney Coast."}',
        },
        {
          href: "uuid:8964658c-6ee1-4015-9bae-2937dfcc6ab9",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - National Mooring Network Facility - WQM and CTD burst averaged data products","recordAbstract":"The National Mooring Network Facility (formerly known as the Australian National Mooring Network (ANMN)), is a series of national reference stations and regional moorings designed to monitor particular oceanographic phenomena in Australian coastal ocean waters. The Water Quality Meters (WQMs) collect time series of physical and \'biogeochemical\' data: temperature, pressure, salinity, conductivity, depth, dissolved oxygen, chlorophyll, turbidity and fluorescence. The WQMs and some NXIC CTDs at one or more depths collect bursting data and data from the bursts have been cleaned and averaged to create data products. The series of National Reference Stations (NRS) and several regional stations from the \\"Queensland and Northern Australia\\" and \\"New South Wales\\" sub-facilities contribute data to produce the burst averaged data products presented here."}',
        },
        {
          href: "uuid:5be06101-e670-4ad7-89bc-6b58ca5d1637",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - National Mooring Network - Acidification Moorings (AM) Sub-Facility","recordAbstract":"The Acidification Moorings sub-facility is responsible for building an ocean carbon and acidification monitoring network for Australian waters. These moorings provide key observations to help us understand and address the problem of increasing ocean acidification. \\n\\nEach mooring is equipped with surface CO2 systems, using proven and robust technology. Three sensors will determine surface CO2, temperature and salinity. The hydrochemistry sampling at the National Reference Stations will also provide total alkalinity data, as will future pH sensors on the moorings, allowing for a complete determination of the carbonate system and pH. \\n\\nAcidification moorings are co-located at three National Reference Stations:\\n* the Yongala NRS in Queensland (replaced in September 2013 after Tropical Cyclone Yasi) (instrumentation: Battelle Seaology pCO2 monitor, Aanderaa Oxygen Optode and a WETLabs WQM)\\n* the Maria Island NRS in Tasmania (instrumentation: Battelle Seaology pCO2 monitor, Aanderaa Oxygen Optode and Sea-bird Electronics, model SBE16plus V2 SEACAT), and\\n* the Kangaroo Island NRS in South Australia (removed in June 2013, and redeployed in May 2014) (instrumentation: Battelle Seaology pCO2 monitor, Aanderaa Oxygen Optode and Sea-bird Electronics, model SBE16plus V2 SEACAT). \\n\\nA fourth acidification mooring is located adjacent to the Heron Island reef slope in the Wistari channel on the Great Barrier Reef (instrumentation: Battelle Seaology pCO2 monitor, Aanderaa Oxygen Optode and Sea-bird Electronics, model SBE16plus V2 SEACAT). \\n\\nThe Yongala, Wistari and Maria Island acidification moorings are located to characterise changes down the east coast of Australia and the influence of the East Australian Current on CO2 uptake and acidification from the Great Barrier Reef to the Southern Ocean. The Kangaroo Island mooring monitors the deeper waters upwelled on the South Australian shelf which are expected to have higher CO2 and thus could accelerate the exposure of ecosystems to acidification earlier than in other regions."}',
        },
        {
          href: "uuid:ae86e2f5-eaaf-459e-a405-e654d85adb9c",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - National Mooring Network Facility - Current velocity time-series","recordAbstract":"The National Mooring Network Facility (formerly known as the Australian National Mooring Network (ANMN)), is a series of national reference stations and regional moorings designed to monitor particular oceanographic phenomena in Australian coastal ocean waters. This collection contains time-series observations of current velocity from moorings deployed by the facility. The primary parameters are the zonal, meridional and vertical components of the current speed within different bins in the water column, the height above the instrument of each bin, the pressure (when available) and depth at the instrument. Temperature at the instrument is also usually measured. The observations were made using a range of Acoustic Doppler Current Profiler (ADCP) and Acoustic Doppler Current Meter (single point measurement) instruments. We are also producing a gridded product of sea water velocity time-series based on these data. These will be available in a separate collection."}',
        },
        {
          href: "uuid:ae6af5ff-9503-492b-b917-4e3c1a0c19ee",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - National Mooring Network Facility - Temperature gridded data product (superseded)","recordAbstract":"The National Mooring Network Facility (formerly known as the Australian National Mooring Network (ANMN)), is a series of national reference stations and regional moorings designed to monitor particular oceanographic phenomena in Australian coastal ocean waters. The data files represented by this record contain the aggregated, averaged and regridded temperature time-series profiles measured during mooring deployments. The series of National Reference Stations (NRS) and several regional stations from the \\"Queensland and Northern Australia\\", \\"New South Wales\\" and \\"Western Australia\\" sub-facilities contribute data to produce the temperature gridded data product presented here. The products in this collection were an early prototype developed solely by the AODN. They are no longer updated, and have now been archived. \\n\\nThey have been superseded by new gridded products developed in collaboration with technical experts from the IMOS National Mooring Network and Deep-water Moorings facilities as part of the Moorings Time Series Products project. Since February 2020, the new products are available via a new collection (IMOS - Moorings - Gridded time-series product: https://catalogue-imos.aodn.org.au:443/geonetwork/srv/api/records/279a50e3-21a5-4590-85a0-71f963efab82). They will be regularly updated with new data."}',
        },
        {
          href: "uuid:aaebf991-b79d-4670-a1c5-a0de9bf649ce",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - National Mooring Network - Wave time-series","recordAbstract":"The National Mooring Network Facility (formerly known as the Australian National Mooring Network (ANMN)), is a series of national reference stations and regional moorings designed to monitor particular oceanographic phenomena in Australian coastal ocean waters. This collection contains wavetime-series observations from moorings deployed by the facility at the Darwin and Yongala National Reference Stations and the following regional moorings: Beagle Gulf (DARBGF), Heron Island South (GBRHIS) and One Tree East (GBROTE). The primary parameters are temperature, pressure and depth of the instrument, and many wave related parameters. The observations were made using either an acoustic Doppler current profiler (ADCP) or an AWAC ADCP (Acoustic Wave And Current Profiler)."}',
        },
        {
          href: "uuid:a5fd0b05-6ff4-433e-b826-350a30690f26",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - National Mooring Network - South Australia Mooring Sub-Facility","recordAbstract":"The Southern Australia Moorings Sub-Facility is part of the National Mooring Network Facility.\\n\\nThis sub-facility is establishing a national reference transect of moorings and measurements off South Australia, which includes all parameters measured by the IMOS National Reference Stations (NRS).\\n\\nThe South Australia moorings sub-facility is based at the South Australian Research and Development Institute in Adelaide and is responsible for a total of five moorings. These moorings are deployed to continuously monitor the large seasonal coastal upwelling of water that occurs along the region\'s continental shelf during summer. This upwelling brings cold, nutrient rich waters onto the shelf which boosts primary productivity, creating one of the most productive coastal marine ecosystems in Australian waters. The five moorings measure an array of physical and biological properties and are a combination of four regional moorings and a National Reference Station (biological sampling at SAM5CB, SAM8SG, SAMGSV, SAMUSG and NRS).\\n\\nThe regional moorings consist of one shelf mooring located on the same isobath as the NRS and in the path of the upwelled/downwelled exchange, a mooring located near the mouth of Spencer Gulf to measure possible winter outflow of saline rich water, and two moorings situated in Upper Spencer Gulf and Gulf St Vincent. The NRS is located at a convergence point of isobaths and monitors upwelling and outflow events as well as long-term variations in the strength of the coastal current.\\n\\nThere are six discontinued moorings that were once part of this sub-facility, for which data is still available: M1 Deep Slope Mooring (SAM1DS) and M6 Investigator Strait Mooring (SAM6IS) were both discontinued in 2009, M4 Canyon Mooring (SAM4CY) and M2 Cabbage Patch Mooring (SAM2CP) were both discontinued in 2010, and M4 Mid-Slope Mooring (SAM3MS) and M7 Deep-Slope Mooring (SAM7DS) which were discontinued in 2013-2014."}',
        },
        {
          href: "uuid:a5b7dd39-b5cf-4667-9953-beacb51eca7a",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - National Mooring Network - New South Wales (NSW) Mooring Sub-Facility","recordAbstract":"The New South Wales Mooring Sub-Facility is part of the National Mooring Network Facility. \\n\\nThis sub-facility is establishing a transect of moorings and measurements off Sydney, which includes the Port Hacking (Sydney) National Reference Station (NRS). Like the NRS sites at Maria and Rottnest Islands, data has been collected for over 70 years at Port Hacking. The transect consists of three moorings in 65, 100 and 140m of water off Bondi and a mooring in 100m at the Port Hacking NRS, where monthly biogeochemical water sampling is conducted. This region is typically downstream of where the East Australian Current (EAC) separates from the coast, and is often influenced by EAC eddies. Data collection supports research on the marine ecosystems associated with these eddies and, as the sub-facility is located in the most densely populated area of Australia, issues such as water quality, waste disposal, shipping hazards, harmful algal blooms and recreation are also of particular research interest.\\n\\nThe sub-facility has also deployed two moorings across the shelf at Coffs Harbour in the north of NSW, and a pair of moorings at the Bateman\'s Marine Park, off Narooma in the south. These moorings will enhance the ANMN coverage along the coast of south-eastern Australia and also provide long term monitoring of the continental shelf region both upstream and downstream of the EAC separation point."}',
        },
        {
          href: "uuid:7e13b5f3-4a70-4e31-9e95-335efa491c5c",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - National Mooring Network Facility - Temperature and salinity time-series","recordAbstract":"The National Mooring Network Facility (formerly known as the Australian National Mooring Network (ANMN)), is a series of national reference stations and regional moorings designed to monitor particular oceanographic phenomena in Australian coastal ocean waters. This collection contains time-series observations of temperature and salinity from moorings deployed by the facility. The primary parameters are temperature, pressure (when available) and depth of the instrument. A subset of this collection also includes conductivity and salinity. The observations were made using a range of temperature loggers, conductivity-temperature-depth (CTD) instruments, and temperature sensors on acoustic Doppler current profilers (ADCPs). We are also producing a gridded product of temperature time-series profiles based on these data. These will be available in a separate collection."}',
        },
        {
          href: "uuid:bc242169-afdb-410a-ab43-f8db0cd53e4c",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - National Mooring Network - Western Australia (WA) Mooring Sub-Facility","recordAbstract":"The Western Australia Mooring Sub-Facility is part of the National Mooring Network Facility. \\n\\nThe Western Australia moorings sub-facility is responsible for a collection of moorings designed to monitor variability in the Leeuwin Current and continental shelf currents both in terms of along-shore and cross-shore variability. Moorings in the region also monitor processes within the Perth Canyon. The time-series monitoring of physical and biological parameters provided by these moorings supplements past and current research activities in the region based at the CSIRO, the Department of Fisheries WA and Western Australian Universities. The sub-facility currently maintains five regional moorings (four decommissioned) and two National Reference Stations.\\n \\nThe regional moorings are located off Perth, clustered near the Perth Canyon and the Two Rocks Line. The Two Rocks Line contains four moorings which transect the continental shelf north of Perth from the 44m to the 500m isobath (the 50m mooring was decommissioned in May 2013, and the 150m mooring in October 2013). Around the Perth Canyon, there remains one shelf mooring in shallower water at the head of the canyon, formerly two slope moorings were located near the 500m isobath (decommissioned in July 2010 and March 2014), to monitor processes in and around the canyon. Primarily these moorings are thermistor strings allowing the structure of the Leeuwin Current to be determined. Two of the moorings also sample biogeochemical parameters."}',
        },
        {
          href: "uuid:c7e7829a-3573-4485-8799-e396610eed24",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - National Mooring Network - Queensland and Northern Australia (QLD) Mooring Sub-Facility","recordAbstract":"The Queensland and Northern Australia Mooring Sub-Facility is part of the National Mooring Network Facility.\\n\\nThis sub-facility consists of array moorings located in the northern tropics along the Great Barrier Reef (GBR) for Q-IMOS in the east and in the north western parts of Australia for the WAIMOS nodes. The mooring arrays provide near real time and delayed mode observations from oceanographic moorings comprising physical (temperature, salinity, sea level and currents) and on most moorings, water quality measurements (turbidity, fluorescence, dissolved oxygen). \\n\\nThe GBR array (extends an earlier long term observing program) is located along the outer Great Barrier Reef in order to monitor the Western Boundary currents of the Coral Sea comprising the poleward East Australian Current (EAC) and the equator-ward Gulf of Papua Current. Four mooring pairs consist of a continental slope mooring in 70 to 300m of water and its partner on the outer continental shelf within the reef matrix in depths of 30 to 70m. The array is designed to detect any changes in circulation, temperature response, mixed layer depth and ocean-shelf exchanges. \\n\\nWAIMOS observations in the north west of Australia commenced in June 2010 with the roll out of 4 moorings from Joseph Bonaparte Gulf to the Timor slope. These continental shelf moorings complement a deep water array monitoring the Indonesian Throughflow in the Timor Tough and Ombai Strait operated by the Deep Water Moorings Facility (formerly known as the Australian Bluewater Observing System). This array was decommissioned in 2019, and equipment was moved to a new array on the North West Shelf. In early 2012 two more arrays were added off the Kimberley and Pilbara continental shelf regions (these were discontinued in August 2014). The arrays are looking to monitor boundary currents such as the Holloway and Leeuwin Currents. Cross-shelf exchanges are also observed in these high energy macro-tidal and internal wave dominated shelves. \\n\\nIn 2013 in partnership with the Darwin Port Corp, the Northern Territory Government a new real time mooring was located in Beagle Gulf (this mooring was decommissioned in July 2017). The Palm Passage mooring on the GBR was upgraded to near-real-time in February 2013."}',
        },
        {
          href: "uuid:e753c69b-93b6-4011-9e35-758185b427cb",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - South-East Queensland 200m (SEQ200) Mooring Platform","recordAbstract":"The South-East Queensland 200m mooring (IMOS platform code SEQ200) is part of the East Australian Current (EAC) array. It was initially deployed on the 25/03/2012 at (27.34 S, 153.77 E). The site depth is 200m. This mooring was decommissioned in June 2013.\\n\\nObservations of currents, temperature, and conductivity are measured.\\n\\nIn conjunction with the SEQ400 mooring and the North Stradbroke Island National Reference Station (NRS NSI), this mooring forms the inshore component of the the EAC mooring array. The East Australian Current (EAC) is the major western boundary current of the south Pacific Ocean. It plays a critical role in the ocean re-distribution of global heat from the equator to the midand- high latitudes. The EAC is relatively stable north of Brisbane, but as the current moves south 2-3 large eddies are pinched off every year. These eddies frequently move onto the continental shelf and close inshore and influence the local circulation patterns. At prominent coastal features the EAC moves away from the coast, driving upwelling which draws nutrient-rich water from a depth of 200m or more. \\n\\nManagement of this mooring is undertaken by staff from the National Reference Station (North Stradbroke and Maria Island)."}',
        },
        {
          href: "uuid:e850651b-d65d-495b-8182-5dde35919616",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - National Mooring Network - Passive Acoustic Observatories Sub-facility","recordAbstract":"This sub-facility manages the IMOS Passive Acoustic Observatories, each of which consists of two to four moored hydrophones and noise loggers. The noise loggers record sound emitted by natural processes in the ocean and sources of biological origin, such as marine mammals, crustaceans and fish, which have unique acoustic signatures. Through an analysis of these signals, it is possible to discriminate and identify different species and to assess the number of animals present within the range of acoustic observation, which can then be linked to ocean productivity. Large animals can also be located by a horizontal array of sea noise loggers constituting a passive acoustic observatory. IMOS operated acoustic observatories at four sites: 1) Perth Canyon in Western Australia, 2) off Portland in South Australia, 3) near Tuncurry (Forster) in New South Wales, and 4) west of Kangaroo Island in South Australia (these sites were decommissioned in 2017/2018). From 2012 - 2015 the following two sites were sampled, with the support of the West Australian Government: 1) near the Kimberley Coast in Western Australia, and 2) near the Pilbara Coast in Western Australia."}',
        },
        {
          href: '"https://nbviewer.org/github/aodn/aodn_cloud_optimised/blob/main/notebooks/mooring_hourly_timeseries_delayed_qc.ipynb"',
          rel: "related",
          type: "application/x-ipynb+json",
          title: "Python notebook example",
          "ai:group": "Python Notebook",
        },
        {
          href: "http://localhost:8080/api/v1/ogc/collections/efd8201c-1eca-412e-9ad2-0534e96cea14/items/summary",
          rel: "summary",
          type: "application/x-parquet",
          title: "Summary",
        },
      ],
      extent: {
        spatial: {
          bbox: [
            [113.0, -47.0, 156.0, -8.0],
            [125.0, -9.0, 126.0, -8.0],
            [130.0, -10.0, 131.0, -9.0],
            [127.0, -11.0, 128.0, -8.0],
            [130.0, -13.0, 131.0, -12.0],
            [147.0, -20.0, 148.0, -18.0],
            [128.0, -14.0, 129.0, -12.0],
            [145.0, -15.0, 146.0, -14.0],
            [123.0, -15.0, 124.0, -14.0],
            [121.0, -17.0, 122.0, -15.0],
            [119.0, -18.0, 120.0, -17.0],
            [151.0, -21.0, 152.0, -20.0],
            [115.0, -21.0, 117.0, -19.0],
            [114.0, -21.0, 115.0, -20.0],
            [152.0, -22.0, 153.0, -21.0],
            [113.0, -22.0, 114.0, -21.0],
            [151.0, -24.0, 153.0, -22.0],
            [153.0, -28.0, 156.0, -27.0],
            [153.0, -31.0, 154.0, -30.0],
            [152.0, -33.0, 153.0, -32.0],
            [121.0, -34.0, 122.0, -33.0],
            [114.0, -33.0, 116.0, -31.0],
            [137.0, -34.0, 138.0, -33.0],
            [151.0, -35.0, 152.0, -33.0],
            [150.0, -37.0, 151.0, -35.0],
            [135.0, -37.0, 137.0, -34.0],
            [141.0, -39.0, 142.0, -38.0],
            [148.0, -43.0, 149.0, -42.0],
            [142.0, -47.0, 143.0, -46.0],
          ],
          crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        },
        temporal: {
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {
        status: "onGoing",
      },
      id: "78d588ed-79dd-47e2-b806-d39025194e7e",
      title:
        "IMOS - Satellite Remote Sensing - Satellite Altimetry Calibration and Validation Sub-Facility",
      description:
        "Satellite-based altimeters provide fundamental observations of sea surface height that continue to underpin our understanding of the ocean’s role in the Earth’s climate system. Understanding changes in mean sea level at global to regional scales is critical for understanding the response of the ocean to a warming climate – both through the thermal expansion of the ocean and the melting of mountain glaciers and polar ice caps. Sea surface height also provides a lens into ocean dynamic processes at regional to local scales. As with all scientific observations, validation of instrumentation is vital to ensure that measurements are accurate and reliable.\n\nThe IMOS Satellite Altimeter Calibration and Validation Sub-Facility maintains a suite of instrumentation primarily in Bass Strait, providing the only southern hemisphere in situ calibration and validation site that has operated since the launch of the TOPEX/Poseidon mission in 1992. The facility uses Global Navigation Satellite Systems (GNSS) equipped buoys on the ocean surface as well as an array of sub-surface moored oceanographic instrumentation that includes temperature, pressure and salinity sensors and advanced 5-beam acoustic doppler current profilers (ADCPs). Data from this infrastructure is combined to derive a sustained Sea Surface Height (SSH) record that can be directly compared to altimeter measurements. These data provide important contributions to Ocean Surface Topography Science Team (OSTST) and other mission-specific validation teams including those associated with the Sentinel-6 Michael Freilich, Sentinel-3A and 3B, and SWOT missions. For validation of nadir altimeters, the key metric of interest to mission science teams the altimeter absolute bias, the difference between altimeter and in situ measurements of SSH in an absolute reference frame. Analysis of the absolute bias record over time helps ensure data produced from satellite altimeters are accurate and precise on a global scale.\n\nIn addition to the primary site located in Bass Strait, the sub-facility operates some sensors opportunistically at other sites including at the Southern Ocean Flux Station (SOFS) in the Southern Ocean, and at Davies Reef and Yongala in and adjacent to Great Barrier Reef. Data made available from the sub-facility includes:\n\nBass Strait (various locations corresponding to different altimeter comparison points) \n•\tBottom pressure, temperature and salinity (P, T, S)\n•\tWater current (U, V)\n•\tSignificant Wave Height (SWH)\n•\tSea Surface Height (SSH)\n•\tNote different temporal extents and sampling rates are provided on a site-by-site basis deploying on deployments and variable of choice.\n\nSouthern Ocean\n•\tSea Surface Height\n•\tSignificant Wave Height\n•\tNote two different sampling rates are provided. The temporal extent depends on the SOFS deployment.\n\nDavies Reef and Yongala\n•\tBottom pressure, temperature and salinity (P, T, S)\n•\tSea Surface Height\n•\tNote different temporal extents and sampling rates are provided on a site-by-site basis deploying on deployments and variable of choice.",
      links: [
        {
          href: "http://imos.org.au/srscalval.html",
          rel: "related",
          type: "text/html",
          title:
            "Website of the IMOS Satellite Altimetry Calibration and Validation sub-facility",
          "ai:group": "Other",
        },
        {
          href: "http://thredds.aodn.org.au/thredds/catalog/IMOS/SRS/ALTIMETRY/calibration_validation/catalog.html",
          rel: "related",
          type: "text/html",
          title: "NetCDF files via THREDDS catalog",
          "ai:group": "Data Access > thredds",
        },
        {
          href: "https://portal.aodn.org.au/search?uuid=78d588ed-79dd-47e2-b806-d39025194e7e",
          rel: "related",
          type: "text/html",
          title: "View and download data though the AODN Portal",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/wms",
          rel: "wms",
          type: "",
          title: "imos:srs_altimetry_timeseries_map",
          "ai:group": "Data Access > wms",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/ows",
          rel: "wfs",
          type: "",
          title: "imos:srs_altimetry_timeseries_data",
          "ai:group": "Data Access > wfs",
        },
        {
          href: "https://help.aodn.org.au/web-services/ogc-wfs/",
          rel: "related",
          type: "text/html",
          title: "OGC WFS help documentation",
          "ai:group": "Document",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/ows",
          rel: "IMOS:AGGREGATION--bodaac",
          type: "",
          title: "imos:srs_altimetry_timeseries_map#url",
        },
        {
          href: "https://help.aodn.org.au/web-services/ncurllist-service/",
          rel: "related",
          type: "text/html",
          title: "ncUrlList help documentation",
        },
        {
          href: "https://registry.opendata.aws/aodn_mooring_satellite_altimetry_calibration_validation/",
          rel: "related",
          type: "text/html",
          title:
            "Access To AWS Open Data Program registry for the Cloud Optimised version of this dataset",
          "ai:group": "Data Access > aws",
        },
        {
          href: "https://github.com/aodn/aodn_cloud_optimised/blob/main/notebooks/mooring_satellite_altimetry_calibration_validation.ipynb",
          rel: "related",
          type: "application/x-ipynb+json",
          title:
            "Access to Jupyter notebook to query Cloud Optimised converted dataset]",
          "ai:group": "Python Notebook",
        },
        {
          href: "https://geonetwork.edge.aodn.org.au:443/geonetwork/images/logos/2976cf80-3906-41aa-8916-4adfbc507438.png",
          rel: "icon",
          type: "image/png",
          title: "Suggest icon for dataset",
        },
        {
          href: "https://catalogue-imos.aodn.org.au:443/geonetwork/srv/api/records/78d588ed-79dd-47e2-b806-d39025194e7e",
          rel: "describedby",
          type: "text/html",
          title: "Full metadata link",
        },
        {
          href: "https://licensebuttons.net/l/by/4.0/88x31.png",
          rel: "license",
          type: "image/png",
        },
        {
          href: "http://creativecommons.org/licenses/by/4.0/",
          rel: "license",
          type: "text/html",
        },
        {
          href: "uuid:744ac2a9-689c-40d3-b262-0df6863f0327",
          rel: "parent",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing Facility","recordAbstract":"The aim of the Satellite Remote Sensing facility is to provide access to a range of satellite derived marine data products covering the Australian region.\\n\\nThe facility has established a new X-Band reception facility at the Australian Institute of Marine Research near Townsville and upgraded the Tasmanian Earth Resource Satellite Station near Hobart. \\n\\nThese stations and facilities in Perth, Melbourne, Alice Springs and Darwin form a network supplying the facility with near real-time data. These data are combined and processed to a number of products which are placed on disk storage systems in Melbourne, Canberra and Perth.\\n\\nThe Bureau of Meteorology has developed a sea surface temperature (SST) product in GHRSST-PP (http://ghrsst-pp.metoffice.com/) L3P format. The Bureau is developing some other SST products including daily and skin SSTs.\\nThese new products and some \\"ocean colour\\" products from MODIS will gradually become available.\\n\\nScientific users can access these data products are available through OPeNDAP and THREDDS supported technology and also through interfaces provided by AODN and the facility (www.imos.org.au and www.imos.org.au/srs)."}',
        },
        {
          href: "uuid:97b9fe73-ee44-437f-b2ae-5b8613f81042",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - Ocean Colour - Bio Optical Database of Australian Waters","recordAbstract":"Establishment of a bio-optical database of Australian Waters by harvesting all bio-geochemical and bio-optical data from all the IMOS data streams (National Mooring Network, National Reference Stations, Ocean Gliders, Satellite Remote Sensing Ocean Colour - Lucinda Jetty) and from legacy databases (e.g SRFME/WAMSI, Great Barrier Reef Long Term Monitoring Program, Aquafin CRC, Port Hacking transect, Research cruises in the Southern Ocean) it is possible to establish an Australian Database of bio-geochemical and bio-optical data. This Satellite Remote Sensing dataset covers the southern oceans worldwide and Indonesian waters. The Australian Antarctic Division (AAD) and the Australian Institute of Marine Science (AIMS) are providing some of the data to the bio-optical database. This activity aims to collate measurements undertaken prior to the commencement of IMOS by several members of the Australian biological oceanography community. This database is used to assess accuracy of Satellite ocean colour products for current and forthcoming satellite missions for the Australian Waters. The bio-optical database underpins the assessment of ocean colour products in the Australian region (e.g. chlorophyll a concentrations, phytoplankton species composition and primary production). Such a data set is crucial to quantify the uncertainty in the ocean colour products in our region. Further, it is essential to assessing new ocean colour data products generated for the Australian region. The contribution of such a database to international space agencies ensures that the accuracy of global algorithm developed for future sensors will increase for Australian waters as bias towards Northern Hemisphere observation will be reduced. The database contains biooptical data (i.e. HPLC, Chlorophyll by spectrophotometric methods, full spectral absorptions, TSS ) and in situ optical data (Vertical attenuation, water leaving radiance, reflectances, Atmospheric Optical Depth, spectral and single channel absorption and backscattering)."}',
        },
        {
          href: "uuid:8209bf83-0c3c-4fbe-9f36-41f7a5ee9913",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - Ocean colour Sub-Facility","recordAbstract":"The Aqua satellite platform carries a MODIS sensor that observes sunlight reflected from within the ocean surface layer at multiple wavelengths. These multi-spectral measurements are used to infer the concentration of chlorophyll-a (Chl-a), most typically due to phytoplankton, present in the water. \\n\\nThe data are produced from the near real time (nrt) data stream formed by combining data from all the available direct broadcast reception stations in Australia (Alice Springs, Melbourne, Townsville, Perth, Hobart). The data are presented as a sequence of granules, each with a maximum size corresponding to 5 minutes of data, and beginning on UTC-5 minute boundary (eg. 04:05, 04:10, 04:15). The granules have been remapped from satellite projection into a geographic (Latitude/Longitude axes) projection and are formatted as CF-compliant netCDF files. It should be noted that the data are not processed until the definitive spacecraft ephemeris becomes available, usually 12-24 hours after the overpass. This means that the geolocation should be of a uniformly high standard.\\n\\nThere are multiple retrieval algorithms for estimating Chl-a. These data use the OC3 method recommended by the NASA Ocean Biology Processing Group and implemented in the SeaDAS processing software l2gen. The radiometric sensitivity of the MODIS sensor is evolving continuously during its mission and is being monitored regularly. The SeaDAS software uses tables of calibration coefficients that are updated periodically. From time to time upgrades to the algorithms and thand/or the format of the calibration tables are required, in which case a new version of SeaDAS is released. These data are initially being produced using SeaDAS 6.1, then SeaDAS 6.4 and eventually with SeaDAS 7.x. The data processed with each different version can be distinguished by the digits at the end of the root URL for the data; for example l2oc.nrt.61 is level-2 ocean colour (l2oc), using the near real time (nrt) data stream, produced using SeaDAS 6.1."}',
        },
        {
          href: "uuid:c2d47a05-2bb7-4649-ba05-d314e8f2105b",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - Surface Waves Sub-Facility","recordAbstract":"The Surface Waves Sub-Facility, part of the Satellite Remote Sensing Facility, will calibrate, collect and distribute ocean surface wave data from current and next-generation satellite missions.\\n\\nThe Sub-Facility will build Australia’s capability in Satellite Remotely Sensed wave data-streams and deliver global validated, processed wave data streams, with a focused effort in the Australian region. Activities will include:\\n\\n•\\tbuilding on the wave measurements obtained from the Bass Strait altimeter calibration sites for calibration of the current satellite missions in the Australian region,\\n•\\tusing the Southern Ocean Flux Station to validate wave data in the extreme Southern Ocean wave climate,\\n•\\tdelivering historical and near-real-time altimeter-derived significant wave heights to the IMOS OceanCurrent Facility, producing daily maps and animations that will be used by researchers and the broader community,\\n•\\tmanaging the delivery of wind-wave data derived from altimeter and synthetic aperture radar (SAR) satellite platforms to the Australian marine and coastal science community."}',
        },
        {
          href: "uuid:4ac6bf81-cd37-4611-8da8-4d5ae5e2bda3",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - Ocean Colour Sub-Facility - Lucinda Jetty Coastal Observatory (LJCO)","recordAbstract":"The Lucinda Jetty Coastal Observatory (LJCO) is located on the end of the 5.8 km long Lucinda Jetty (18.52 S, 146.39 E) in the coastal waters of the Great Barrier Reef World Heritage Area close to the Herbert River Estuary and the Hinchinbrook Channel in Queensland.\\n\\nThe observatory acquires continuous above and in-water optical measurements with the objective to support satellite ocean colour validation and algorithm development. Data collection and delivery was interrupted in 2011 with tropical cyclone Yasi. Currently, LJCO is the only southern-hemisphere ocean colour validation site integrated into NASA’s AERONET-OC global network of ground-based radiometers and one of a few sites globally that combines the acquisition of both atmospheric and in-water optical measurements. \\n\\nMounted instruments on the LJCO included:\\n- Met Station (Vaisala WXT520)\\n- Above-water radiometry\\n--- CIMEL SeaPRISM\\n--- Satlantic HyperOCR\\n--- DALEC instrument (added in mid-2016 for continuous hyper-spectral radiometric measurements)\\n-Instrument telemetry\\n--- Power supply\\n--- UPS\\n--- NextG Router\\n--- WETLabs DAPCS\\n--- PC controller\\n--- Automated winch\\n- Underwater optics\\n--- WETLabs WQM\\n--- WETLabs Eco Triplet\\n--- WETLabs ac-s\\n--- WETLabs BB9\\n- Campbell Scientific submersible pressure transducer\\n\\nThe above-water measurements collected at LJCO compromise of multi-spectral water-leaving radiance and atmospheric observations for retrieving aerosol optical properties using an autonomous CIMEL SeaPRISM radiometer, in addition to hyper-spectral down-welling radiance\\nmeasurements using the a Satlantic Hyper-OCR. In mid 2016 continuous hyper-spectral radiometric measurements were added using the DALEC instrument.\\n\\nThe in-water optical measurements consist of conductivity, temperature, pressure, dissolved oxygen, chlorophyll fluorescence and turbidity using a WETLabs WQM, coloured dissolved organic matter (CDOM) fluorescence using a WETLabs EcoTriplet, as well as particulate and dissolved spectral absorption and attenuation coefficients using a WETLabs AC-S. Further, total backscattering coefficients are measured using a WETLabs BB9 radiometer. \\n\\nAdditional meteorological and sea state measurements are continuously recorded such as barometric pressure, relative humidity, air emperature, wind speed and direction using a Vaisala WXT520 weather transmitter. Wave height and water temperature are measured with a Campbell Scientific submersible pressure transducer that is used to keep the caged in-water optical instruments at a constant depth.\\n\\nAll data streams are processed in delayed-mode with automatic quality control applied and made publicly available through the AODN portal; and the data presented here is the daily in-water generated products."}',
        },
        {
          href: "uuid:5356744f-10f7-442e-8dd5-8a05f016588d",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - Satellite Sea Surface Temperature (SST) Products Sub-Facility","recordAbstract":"As part of the Integrated Marine Observing System (IMOS), the Australian Bureau of Meteorology produce high-resolution satellite sea surface temperature (SST) products over the Australian region, designed to suit a range of operational and research applications. All these products follow the latest International Group for High Resolution Sea Surface Temperature (GHRSST: www.ghrsst.org) file formats, assisting international data exchange and collaboration.\\nThe highest spatial resolution (1 km x 1 km) data from Advanced Very High Resolution Radiometer (AVHRR) sensors on NOAA polar-orbiting satellites can only be obtained through receiving direct broadcast “HRPT” data from the satellite. In Australia, HRPT data is received by a number of agencies (Bureau of Meteorology, Geoscience Australia, AIMS and CSIRO) and consortia (WASTAC and TERSS) at ground-stations located in Darwin, Townsville, Melbourne, Hobart, Perth and Alice Springs and in Antarctica at Casey and Davis Stations.\\n\\nThe Bureau of Meteorology, in collaboration with CSIRO Marine and Atmospheric Research, is combining raw data from the various ground-stations and producing real-time HRPT AVHRR skin (~ 10 micron depth) SST data files in the GHRSST GDS v2.0 L2P (single swath, geolocated), L3U (single swath, gridded), one and three day daytime/night-time L3C (single sensor, multiple swath, gridded) and one, three and six day daytime/night-time L3S (multiple sensors, multiple swath, gridded) formats. The L2P, L3U, L3C and L3S files for NOAA-15, 17, 18 and 19 satellite data are available through the IMOS FTP server (ftp://aodaac2-cbr.act.csiro.au/imos/GHRSST), IMOS AO-DAAC (http://www.marine.csiro.au/remotesensing/imos/aggregator.html# ) and IMOS Ocean Portal (http://imos.aodn.org.au/webportal/), and will eventually be available through the GHRSST Global Data Assembly Centre (http://ghrsst.jpl.nasa.gov). Archived raw HRPT AVHRR data from Australian and Antarctic ground-stations back to 1992 will be progressively reprocessed into skin SST L2P, L3U, L3C and L3S files and be available to GHRSST and IMOS by June 2013.\\nFor the user, there are several advantages to using GHRSST-format SST products. For each SST value the GHRSST files contain a quality level flag (based on proximity to cloud, satellite zenith angle and day/night) and bias and standard deviation error estimates based on 60 day match-ups with drifting buoy SST data. Note that the closer an SST pixel is to cloud, the higher the standard deviation. Therefore, the presence of these quality level flags and error information enable users to tailor the L2P, L3U, L3C or L3S files for their particular research application by trading SST spatial coverage for accuracy and vice versa. Users have the ability to access L3U, L3C and L3S SST products through IMOS OPeNDAP servers, greatly simplifying data access and extraction. Providing real-time HRPT AVHRR SST files in GHRSST-L2P format enables them to be incorporated into global and regional, gap-free, analyses of L2P SST from multiple satellites such as NASA’s G1SST global 1 km daily SST analysis and the Bureau of Meteorology’s daily regional and global SST analyses (RAMSSA and GAMSSA).\\nThe new IMOS AVHRR L2P SSTs exhibit approximately 75% the error of the Bureau’s pre-existing HRPT AVHRR level 2 SST data, with standard deviations compared with drifting buoys during night-time of around 0.3°C and during daytime of around 0.4°C for quality level 5 (highest). This significant improvement in accuracy has been achieved by improving cloud clearing and calibration - using regional rather than global drifting buoy SST observations and incorporating a dependence on latitude.\\nFor further details on the AVHRR GHRSST products see Paltoglou et al. (2010) (http://imos.org.au/srsdoc.html). Enquiries can be directed to Helen Beggs (h.beggs(at)bom.gov.au).\\n\\n\\nAll the IMOS satellite SST products are supplied in GHRSST netCDF format and are either geolocated swath (\\"L2P\\") files or level 3 composite, gridded files that will have gaps where there were no observations during the specified time period. The various L3U (single swath), L3C (single sensor, multiple swath) and L3S (multiple sensors, multiple swaths) are designed to suit different applications. Some current applications of the various IMOS satellite SST products are:\\n\\nHRPT AVHRR data:\\n\\nL2P: Ingestion into optimally interpolated SST analysis systems (eg. RAMSSA, GAMSSA, G1SST, ODYSSEA);\\n\\nL3U: Calculation of surface ocean currents (IMOS OceanCurrents);\\n\\nL3C: Estimation of diurnal warming of the surface ocean (GHRSST Tropical Warm Pool Diurnal Variation (TWP+) Project);\\n\\nL3S: Estimation of likelihood of coral bleaching events (ReefTemp II).\\n\\nL3P: Legacy 14-day Mosaic AVHRR SST which is a weighted mean SST produced daily from multiple NOAA satellites in a cut-down GHRSST netCDF format. This product is still used in a coral bleaching prediction system run at CMAR. The product is produced using the legacy BoM processing system and is less accurate than the new IMOS L3S product.\\n\\nGeostationary satellite MTSAT-1R data:\\n\\nL3U: Hourly, 0.05 deg x 0.05 deg SST used for estimation of the diurnal warming of the surface ocean and validation of diurnal warming models (TWP+ Project)."}',
        },
        {
          href: "uuid:28f8bfed-ca6a-472a-84e4-42563ce4df3f",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - Ocean Colour - Ships of Opportunity - Radiometer Sub-Facility","recordAbstract":"Calibrated DALEC Transect data The Dynamic above water radiance and irradiance collector (DALEC) is a radiometrically calibrated hyperspectral radiometer developed by In situ Marine Optics for autonomous ship based deployment. It contains three Zeiss UV-Vis enhanced spectroradiometers designed to measure near-simultaneous spectral upwelling radiance (Lu), downwelling radiance (Lsky) and downwelling irradiance (Ed). DALEC0001 is deployed on the foremast of the RV Southern Surveyor (VLHJ) and on the RV Solander. Spectra are collected during daylight hours when the ship is at sea subject to suitable sea conditions. Ancillary attitude data for the DALEC included in the dataset are pitch (degrees), pitch standard deviation (degrees), roll (degrees), roll standard deviation (degrees) and gear position (degrees from the bow). The dataset begins July 2011 and is on-going."}',
        },
        {
          href: "uuid:57de0207-649c-4be6-ac22-6f92361dc992",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"Satellite Remote Sensing-A Satellite SST Products","recordAbstract":"The aim of the Australian Satellite SST L2P Products sub-facility is to provide real-time and reprocessed, high-resolution (1 km and 5 km), locally received, satellite sea surface temperature (SST) data products in the internationally accepted GHRSST L2P and L3P format using new, best practice, processing and calibration methods. The satellite sensors to be used are the AVHRR infrared sensors on the NOAA polar-orbiting satellites, the MODIS infrared sensors on Aqua and Terra and infrared sensors on available geostationary satellites (eg. MTSAT-1R)."}',
        },
        {
          href: '"https://nbviewer.org/github/aodn/aodn_cloud_optimised/blob/main/notebooks/mooring_satellite_altimetry_calibration_validation.ipynb"',
          rel: "related",
          type: "application/x-ipynb+json",
          title: "Python notebook example",
          "ai:group": "Python Notebook",
        },
        {
          href: "http://localhost:8080/api/v1/ogc/collections/78d588ed-79dd-47e2-b806-d39025194e7e/items/summary",
          rel: "summary",
          type: "application/x-parquet",
          title: "Summary",
        },
      ],
      extent: {
        spatial: {
          bbox: [
            [145.0, -44.0, 147.5, -40.0],
            [146.5, -44.0, 147.5, -43.0],
            [145.0, -41.0, 146.0, -40.0],
          ],
          crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        },
        temporal: {
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {
        status: "onGoing",
      },
      id: "95d6314c-cfc7-40ae-b439-85f14541db71",
      title:
        "Satellite Relay Tagging Program - Southern Ocean - MEOP Quality Controlled CTD Profiles",
      description:
        "CTD (Conductivity-Temperature_Depth)-Satellite Relay Data Loggers (CTD-SRDLs) are used to explore how marine animal behaviour relates to their oceanic environment. Loggers developed at the University of St Andrews Sea Mammal Research Unit transmit data in near real-time via the Argo satellite system. Data represented here was collected in the Southern Ocean, from elephant, fur and Weddell Seals. In 2024 data was added from flatback and olive ridley turtles, from a pilot study co-funded by the Royal Australian Navy in collaboration with the Australian Institute of Marine Science and Indigenous Ranger groups.\n\nData parameters measured by the instruments include time, conductivity (salinity), temperature, pressure and depth. The data represented by this record have been Qc'd and are the Australian subset of the MEOP-CTD database (MEOP: Marine Mammals Exploring the Oceans Pole to Pole), complemented with the most recent Southern Ocean deployment data. This Australian subset of the Southern Ocean database represents about one quarter of the entire MEOP-CTD database, which currently is about 52,000 profiles obtained from 275 CTD-SRDL tag deployments. The Australian dataset originated in 2004, and was initially collected by Mark Hindell's team based at the University of Tasmania, and in later years his data has formed part of the Animal Tracking Facility of Integrated Marine Observing System (IMOS).",
      links: [
        {
          href: "http://imos.org.au/animaltracking.html",
          rel: "related",
          type: "text/html",
          title: "Animal Tracking Facility page on IMOS website",
          "ai:group": "Other",
        },
        {
          href: "http://www.nature.com/articles/sdata201428",
          rel: "related",
          type: "text/html",
          title: "Data Paper describing the Southern Ocean Database",
          "ai:group": "Other",
        },
        {
          href: "http://www.tos.org/oceanography/assets/docs/30-2_treasure.pdf",
          rel: "related",
          type: "text/html",
          title: "Paper - A review of the MEOP consortium",
          "ai:group": "Document",
        },
        {
          href: "https://github.com/fabien-roquet/meop_qc",
          rel: "related",
          type: "text/html",
          title: "GitHub repository for MEOP",
          "ai:group": "Other",
        },
        {
          href: "https://content.aodn.org.au/Documents/IMOS/Facilities/animal_tracking/IMOS_Animal_Tracking_Best_Practice_Manual_for_SMRU_CTD_Satellite_Relay_Data_Loggers_LATEST.pdf",
          rel: "related",
          type: "text/html",
          title:
            "Best Practice Manual for SMRU CTD Satellite Relay Data Loggers",
          "ai:group": "Document",
        },
        {
          href: "https://portal.aodn.org.au/search?uuid=95d6314c-cfc7-40ae-b439-85f14541db71",
          rel: "related",
          type: "text/html",
          title: "View and download data though the AODN Portal",
        },
        {
          href: "http://oceancurrent.imos.org.au/aatams.php",
          rel: "data",
          type: "",
          title: "View profile plots from Oceancurrent SealCTDs page",
          "ai:group": "Data Access",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/wms",
          rel: "wms",
          type: "",
          title: "imos:aatams_sattag_qc_ctd_profile_map",
          "ai:group": "Data Access > wms",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/ows",
          rel: "wfs",
          type: "",
          title: "aatams_sattag_qc_ctd_profile_data",
          "ai:group": "Data Access > wfs",
        },
        {
          href: "https://help.aodn.org.au/web-services/ogc-wfs/",
          rel: "related",
          type: "text/html",
          title: "OGC WFS help documentation",
          "ai:group": "Document",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/ows",
          rel: "IMOS:AGGREGATION--bodaac",
          type: "",
          title: "aatams_sattag_qc_ctd_profile_map#url",
        },
        {
          href: "https://help.aodn.org.au/web-services/ncurllist-service/",
          rel: "related",
          type: "text/html",
          title: "ncUrlList help documentation",
        },
        {
          href: "https://registry.opendata.aws/aodn_animal_ctd_satellite_relay_tagging_delayed_qc/",
          rel: "related",
          type: "text/html",
          title:
            "Access To AWS Open Data Program registry for the Cloud Optimised version of this dataset",
          "ai:group": "Data Access > aws",
        },
        {
          href: "https://github.com/aodn/aodn_cloud_optimised/blob/main/notebooks/animal_ctd_satellite_relay_tagging_delayed_qc.ipynb",
          rel: "related",
          type: "application/x-ipynb+json",
          title:
            "Access to Jupyter notebook to query Cloud Optimised converted dataset",
          "ai:group": "Python Notebook",
        },
        {
          href: "https://geonetwork.edge.aodn.org.au:443/geonetwork/images/logos/2976cf80-3906-41aa-8916-4adfbc507438.png",
          rel: "icon",
          type: "image/png",
          title: "Suggest icon for dataset",
        },
        {
          href: "https://catalogue-imos.aodn.org.au:443/geonetwork/srv/api/records/95d6314c-cfc7-40ae-b439-85f14541db71",
          rel: "describedby",
          type: "text/html",
          title: "Full metadata link",
        },
        {
          href: "https://licensebuttons.net/l/by/4.0/88x31.png",
          rel: "license",
          type: "image/png",
        },
        {
          href: "http://creativecommons.org/licenses/by/4.0/",
          rel: "license",
          type: "text/html",
        },
        {
          href: "uuid:4637bd9b-8fba-4a10-bf23-26a511e17042",
          rel: "parent",
          type: "application/json",
          title:
            '{"title":"IMOS - Animal Tracking Facility Satellite Relay Tagging Program","recordAbstract":"The Animal Tracking Facility (formerly known as the Australian Animal Tracking And Monitoring System (AATAMS)) is a coordinated marine animal tagging project. \\n\\nSatellite Relay Data Loggers (SRDL) (most with CTDs, and some also with fluorometers) are used to explore how marine mammal behaviour relates to their oceanic environment. Loggers developed at the University of St Andrews Sea Mammal Research Unit transmit data in near real time via the Argo satellite system.\\n\\nThe Satellite Relay Data Loggers are deployed on marine mammals, including Elephant Seals, Weddell Seals, Australian Fur Seals, Australian Sea Lions, New Zealand Fur Seals. Data parameters measured by the instruments include time, conductivity (salinity), temperature, speed, fluorescence (available in the future) and depth.\\n\\nData is being collected in the Southern Ocean, the Great Australian Bight, and off the South-East Coast of Australia."}',
        },
        {
          href: "uuid:b4e742f9-58e5-46b8-b365-15430ea45599",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Animal Tracking Facility - Satellite Relay Tagging Program - Near real-time CTD profile data","recordAbstract":"The Animal Tracking Facility (formerly known as the Australian Animal Tracking And Monitoring System (AATAMS)) is a coordinated marine animal tagging project. Satellite Relay Data Loggers (SRDL) (most with CTDs, and some also with fluorometers) are used to explore how marine mammal behaviour relates to their oceanic environment. Loggers developed at the University of St Andrews Sea Mammal Research Unit transmit data in near real-time via the Argo satellite system. The Satellite Relay Data Loggers are deployed on marine mammals, including Elephant Seals, Weddell Seals, Australian Fur Seals, Australian Sea Lions, New Zealand Fur Seals. Data is being collected in the Southern Ocean, the Great Australian Bight, and off the South-East Coast of Australia. Data parameters measured by the instruments include time, conductivity (salinity), temperature, and depth. The data represented by this record are presented in near real-time.\\n\\nAs of the 19/11/2019, this data collection has been decommissioned. Historical files are still available on the IMOS THREDDS catalog. \\n\\nAll subsequent CTD data is available via the current “IMOS - AATAMS Facility - Satellite Relay Tagging Program - Delayed mode data” collection (https://catalogue-imos.aodn.org.au:443/geonetwork/srv/api/records/06b09398-d3d0-47dc-a54a-a745319fbece) in csv format, as opposed to NetCDF as was previously delivered via this “Near real-time” collection."}',
        },
        {
          href: "uuid:b2548767-514f-4a31-b65e-36bb894382d5",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Animal Tracking Facility - Satellite Relay Tagging Program - Near real-time data with quality-controlled locations","recordAbstract":"The Animal Tagging Sub-Facility of the IMOS Animal Tracking Facility (formerly known as the Australian Animal Tracking And Monitoring System (AATAMS)) is a coordinated marine animal satellite-tracking project. Satellite Relay Data Loggers (SRDL) (most with Conductivity-Temperature-Depth (CTD) sensors, and some with CTD/fluorometers) are used to explore how marine animals (e.g. mammals) interact with their oceanic environment. The primary focus of this program is to collect CTD data from marine mammals, such as southern elephant seals (Mirounga leonina) and Weddell seals (Leptonychotes weddellii), in the southern Indian Ocean and along the East Antarctic coast. This is achieved through international collaborations with the French national polar program\'s long-term National Observatory Services: Mammals as Ocean Bio-Samplers (SNO-MEMO), the National Institute of Water and Atmospheric Research as part of the Ross Sea Research and Monitoring Programme, and the CNES (Centre National d\'Etudes Spatiales) TOSCA programme (Phoques de Weddell bio-oceanographes de la banquise antarctique et outils satellites) in Terre Adelie. SRDL loggers developed at the Sea Mammal Research Unit (SMRU, University of St Andrews, UK) transmit data in near real time via the Argos satellite system. This metadata record, represents several different datasets listed hereafter, which can all be accessed through a multi-WFS service. \\nThe data represented by this record are presented in near real-time. \\nCTD - parameters measured by the instruments include time, depth, conductivity (salinity), temperature, speed and fluorescence (available in some deployments). \\nDiving - parameters measured by the instruments include individual dive start and end time, longitude/latitude at dive end time, post-dive surface duration, dive duration, maximum dive depth, intermediate dive depths and times. \\nHaulout - a haulout begins when the SRDL has been continuously dry for a specified length of time (usually 10 minutes). It ends when continuously wet for another interval (usually 40 seconds). Haulout data parameters measured by the instruments include haulout start and end dates and longitude/latitude, and haulout number. \\nArgos Locations - location data parameters measured by the instruments include time, longitude, latitude, location quality, along with other diagnostic information provided by Argos (http://www.argos-system.org/). \\nSummary Statistics - as well as sending records of individual events such as dives and haulouts, the SRDL also calculates summary statistics of those events over a specified time period (usually 3, 4 or 6 hours). Summary statistics computed by the instruments include the proportion of time spent diving, at the surface and hauled-out, the number of dives, and the average, standard deviation and maximum dive duration and dive depth during each summary period. These statistics are based on all the data recorded by the SRDL and thus are not prone to distortion by variations in the efficiency of transmission via Argos. \\nSSM QC Locations - SSM-predicted locations and uncertainty at 6-h intervals from the location quality-control process. SSM-predicted locations are also appended to records in the CTD, Diving, Haulout, Argos Locations, and Summary Statistics datasets. See Jonsen et al. 2020 for further details on the SSM used for location quality control"}',
        },
        {
          href: "uuid:70f148b1-7040-4fad-944a-456413c95472",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Animal Tracking Facility - Satellite Relay Tagging Program - Delayed mode data with quality-controlled locations","recordAbstract":"The Animal Tagging Sub-Facility of the IMOS Animal Tracking Facility (formerly known as the Australian Animal Tracking And Monitoring System (AATAMS)) is a coordinated marine animal satellite-tracking project. Satellite Relay Data Loggers (SRDL) (most with Conductivity-Temperature-Depth (CTD) sensors, and some with CTD/fluorometers) are used to explore how marine animals (e.g. mammals) interact with their oceanic environment. The primary focus of this program is to collect CTD data from marine mammals, such as southern elephant seals (Mirounga leonina) and Weddell seals (Leptonychotes weddellii), in the southern Indian Ocean and along the East Antarctic coast. This is achieved through international collaborations with the French national polar program\'s long-term National Observatory Services: Mammals as Ocean Bio-Samplers (SNO-MEMO), the National Institute of Water and Atmospheric Research as part of the Ross Sea Research and Monitoring Programme, and the CNES (Centre National d\'Etudes Spatiales) TOSCA programme (Phoques de Weddell bio-oceanographes de la banquise antarctique et outils satellites) in Terre Adelie. SRDL loggers developed at the Sea Mammal Research Unit (SMRU, University of St Andrews, UK) transmit data in near real time via the Argos satellite system. \\n\\nBetween January 2022 and June 2024, a pilot study co-funded by the Royal Australian Navy in collaboration with the Australian Institute of Marine Science and Indigenous Ranger groups was initiated to determine whether conductivity-temperature-depth instruments mounted on turtles could provide essential observations spatially and vertically in the seas of Northern Australia. \\n\\nThis metadata record, represents several different datasets listed hereafter, which can all be accessed through a multi-WFS service. \\nThe data represented by this record are presented in delayed mode. \\nCTD - parameters measured by the instruments include time, depth, conductivity (salinity), temperature, speed and fluorescence (available in some deployments). \\nDiving - parameters measured by the instruments include individual dive start and end time, longitude/latitude at dive end time, post-dive surface duration, dive duration, maximum dive depth, intermediate dive depths and times. \\nHaulout - a haulout begins when the SRDL has been continuously dry for a specified length of time (usually 10 minutes). It ends when continuously wet for another interval (usually 40 seconds). Haulout data parameters measured by the instruments include haulout start and end dates and longitude/latitude, and haulout number. \\nArgos Locations - location data parameters measured by the instruments include time, longitude, latitude, location quality, along with other diagnostic information provided by Argos (http://www.argos-system.org/). \\nSummary Statistics - as well as sending records of individual events such as dives and haulouts, the SRDL also calculates summary statistics of those events over a specified time period (usually 3, 4 or 6 hours). Summary statistics computed by the instruments include the proportion of time spent diving, at the surface and hauled-out, the number of dives, and the average, standard deviation and maximum dive duration and dive depth during each summary period. These statistics are based on all the data recorded by the SRDL and thus are not prone to distortion by variations in the efficiency of transmission via Argos. \\nSSM QC Locations - SSM-predicted locations and uncertainty at 6-h intervals from the location quality-control process. SSM-predicted locations are also appended to records in the CTD, Diving, Haulout, Argos Locations, and Summary Statistics datasets. See Jonsen et al. 2020 for further details on the SSM used for location quality control.\\n\\n** For data prior to October 2018, please consult IMOS - Animal Tracking Facility - Satellite Relay Tagging Program - Delayed mode data (https://catalogue-imos.aodn.org.au:443/geonetwork/srv/api/records/06b09398-d3d0-47dc-a54a-a745319fbece), to access data without improved satellite locations. In the near future all historical delayed mode data will be reprocessed with the new quality control (QC) process, to improve the accuracy of the satellite location data, and this dataset will replace the original one. **"}',
        },
        {
          href: "uuid:06b09398-d3d0-47dc-a54a-a745319fbece",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Animal Tracking Facility - Satellite Relay Tagging Program - Delayed mode data","recordAbstract":"The Animal Tracking Facility (formerly known as the Australian Animal Tracking And Monitoring System (AATAMS)) is a coordinated marine animal tagging project. Satellite Relay Data Loggers (SRDL) (most with CTDs, and some also with fluorometers) are used to explore how marine mammal behaviour relates to their oceanic environment. Loggers developed at the University of St Andrews Sea Mammal Research Unit transmit data in near real time via the Argo satellite system. The Satellite Relay Data Loggers are deployed on marine mammals, including Elephant Seals, Weddell Seals, Australian Fur Seals, Australian Sea Lions, New Zealand Fur Seals. Data is being collected in the Southern Ocean, the Great Australian Bight, and off the South-East Coast of Australia. \\nThis metadata record, represents several different datasets listed hereafter, which can all be accessed through a multi-WFS service. The data represented by this record are presented in delayed mode. \\nCTD - parameters measured by the instruments include time, conductivity (salinity), temperature, speed, fluorescence (available in the future) and depth. \\nDiving - parameters measured by the instruments include start and end time and longitude/latitude of each individual dive, post-dive surface duration, dive duration, maximum dive depth, intermediate dive depths and times. \\nHaulout - a haulout begins when the SRDL has been continuously dry for a specified length of time (usually 10 minutes). It ends when continuously wet for another interval (usually 40 seconds). Haulout data parameters measured by the instruments include haulout start and end dates and longitude/latitude, and haulout number. \\nArgos locations - location data parameters measured by the instruments include time, longitude, latitude, location quality, along with other diagnostic information provided by Argos (http://www.argos-system.org/). \\nSummary Statistics - as well as sending records of individual events such as dives and haulouts, the SRDL also calculates summary statistics of those events over a specified time period (usually 3, 4 or 6 hours). Summary statistics computed by the instruments include the proportion of time spent diving, at the surface and hauled-out, the number of dives, and the average, standard deviation and maximum dive duration and dive depth during each summary period. These statistics are based on all the data recorded by the SRDL and so are not prone to distortion by variations in the efficiency of transmission via Argos.\\n\\n** For data after October 2018, please consult IMOS - Animal Tracking Facility - Satellite Relay Tagging Program - Delayed mode data with quality-controlled locations (https://catalogue-imos.aodn.org.au:443/geonetwork/srv/api/records/70f148b1-7040-4fad-944a-456413c95472), to access data with improved satellite locations. In the near future all historical delayed mode data will be reprocessed with the new quality control (QC) process, to improve the accuracy of the satellite location data, and this dataset will be replaced by the new QC’d one. **"}',
        },
        {
          href: '"https://nbviewer.org/github/aodn/aodn_cloud_optimised/blob/main/notebooks/animal_ctd_satellite_relay_tagging_delayed_qc.ipynb"',
          rel: "related",
          type: "application/x-ipynb+json",
          title: "Python notebook example",
          "ai:group": "Python Notebook",
        },
        {
          href: "http://localhost:8080/api/v1/ogc/collections/95d6314c-cfc7-40ae-b439-85f14541db71/items/summary",
          rel: "summary",
          type: "application/x-parquet",
          title: "Summary",
        },
      ],
      extent: {
        spatial: {
          bbox: [
            [-180.0, -78.0, 180.0, 38.0],
            [-58.0, 34.0, -52.0, 38.0],
            [-168.0, 32.0, -160.0, 38.0],
            [172.0, 18.0, 178.0, 24.0],
            [120.0, -18.0, 142.0, -4.0],
            [140.0, -42.0, 156.0, -32.0],
            [-180.0, -50.0, -174.0, -44.0],
            [152.0, -70.0, 154.0, -68.0],
            [-180.0, -74.0, -148.0, -50.0],
            [-36.0, -76.0, -26.0, -74.0],
            [-10.0, -78.0, 180.0, -38.0],
          ],
          crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        },
        temporal: {
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {
        status: "onGoing",
      },
      id: "c317b0fe-02e8-4ff9-96c9-563fd58e82ac",
      title: "IMOS - Ocean Gliders - delayed mode glider deployments",
      description:
        "The Ocean Gliders Facility (formerly known as the Australian National Facility for Ocean Gliders (ANFOG)), deploys a fleet of gliders around Australia. The data represented by this record, are presented in delayed mode. \n\nThe underwater ocean glider represents a technological revolution for oceanography. Autonomous ocean gliders can be built relatively cheaply, are controlled remotely and are reusable allowing them to make repeated subsurface ocean observations at a fraction of the cost of conventional methods. The data retrieved from the glider fleet will contribute to the study of the major boundary current systems surrounding Australia and their links to coastal ecosystems. The glider fleet consists of two types; Slocum gliders and Seagliders. Slocum gliders (named for Joshua Slocum, the first solo global circumnavigator), manufactured by Webb Research Corp are optimised for shallow coastal waters (<200m) where high manoeuvrability is needed. The facility has Slocum gliders for deployment on the continental shelf. Seagliders, built at the University of Washington, are designed to operate more efficiently in the open ocean up to 1000m water depth. The facility uses their Seagliders to monitor the boundary currents and continental shelves, which is valuable for gathering long-term environmental records of physical, chemical and biological data not widely measured to date. Whilst the Slocum gliders, due to their low cost and operational flexibility, will be of great use in intensive coastal monitoring, both types of gliders weigh only 52kg, enabling them to be launched from small boats. They have a suite of sensors able to record temperature, salinity, dissolved oxygen, turbidity, dissolved organic matter and chlorophyll against position and depth. \n\nSustained ocean observations will allow researchers to document the natural variability of the ocean, and better understand the effect of climate change on coastal ecosystems. The IMOS gliders will focus particularly on the major boundary currents that run down the Australian coast, the Leeuwin in the west and the East Australian Current (EAC). The study of these currents is critical for understanding the north-south transport of freshwater, heat and biogeochemical properties. The currents exert a large influence on coastal ecosystems, shipping lanes and fisheries.",
      links: [
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/wms",
          rel: "wms",
          type: "",
          title: "imos:anfog_dm_trajectory_map",
          "ai:group": "Data Access > wms",
        },
        {
          href: "https://imos.org.au/facility/ocean-gliders",
          rel: "related",
          type: "text/html",
          title: "Ocean Gliders page on IMOS website",
          "ai:group": "Other",
        },
        {
          href: "http://content.aodn.org.au/Documents/IMOS/Facilities/Ocean_glider/Delayed_Mode_QAQC_Best_Practice_Manual_OceanGliders_LATEST.pdf",
          rel: "related",
          type: "text/html",
          title: "Delayed Mode QA/QC Best Practice Manual",
          "ai:group": "Document",
        },
        {
          href: "https://content.aodn.org.au/Documents/IMOS/Facilities/Ocean_glider/glider_data_management.pdf",
          rel: "related",
          type: "text/html",
          title:
            "Link to the Ocean Gliders data management document - former version",
          "ai:group": "Document",
        },
        {
          href: "http://content.aodn.org.au/Documents/IMOS/Facilities/satellite_remote_sensing/IMOS_radiometry_community-of-practice_document_v1.0.pdf",
          rel: "related",
          type: "text/html",
          title: "IMOS radiometry community-of-practice document",
          "ai:group": "Document",
        },
        {
          href: "https://data.aodn.org.au/?prefix=IMOS/ANFOG/",
          rel: "related",
          type: "text/html",
          title:
            "Detailed mission reports, which include data processing and quality control summaries, are accessible for each mission here",
          "ai:group": "Document",
        },
        {
          href: "http://thredds.aodn.org.au/thredds/catalog/IMOS/ANFOG/catalog.html",
          rel: "related",
          type: "text/html",
          title: "NetCDF files via THREDDS catalog",
          "ai:group": "Data Access > thredds",
        },
        {
          href: "https://portal.aodn.org.au/search?uuid=c317b0fe-02e8-4ff9-96c9-563fd58e82ac",
          rel: "related",
          type: "text/html",
          title: "View and download data though the AODN Portal",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/ows",
          rel: "wfs",
          type: "",
          title: "anfog_dm_trajectory_data",
          "ai:group": "Data Access > wfs",
        },
        {
          href: "https://help.aodn.org.au/web-services/ogc-wfs/",
          rel: "related",
          type: "text/html",
          title: "OGC WFS help documentation",
          "ai:group": "Document",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/ows",
          rel: "IMOS:AGGREGATION--bodaac",
          type: "",
          title: "anfog_dm_trajectory_map#url",
        },
        {
          href: "https://help.aodn.org.au/web-services/ncurllist-service/",
          rel: "related",
          type: "text/html",
          title: "ncUrlList help documentation",
        },
        {
          href: "https://registry.opendata.aws/aodn_slocum_glider_delayed_qc/",
          rel: "related",
          type: "text/html",
          title:
            "Access To AWS Open Data Program registry for the Cloud Optimised version of this dataset",
          "ai:group": "Data Access > aws",
        },
        {
          href: "https://github.com/aodn/aodn_cloud_optimised/blob/main/notebooks/slocum_glider_delayed_qc.ipynb",
          rel: "related",
          type: "application/x-ipynb+json",
          title:
            "Access to Jupyter notebook to query Cloud Optimised converted dataset",
          "ai:group": "Python Notebook",
        },
        {
          href: "https://geonetwork.edge.aodn.org.au:443/geonetwork/images/logos/2976cf80-3906-41aa-8916-4adfbc507438.png",
          rel: "icon",
          type: "image/png",
          title: "Suggest icon for dataset",
        },
        {
          href: "https://catalogue-imos.aodn.org.au:443/geonetwork/srv/api/records/c317b0fe-02e8-4ff9-96c9-563fd58e82ac",
          rel: "describedby",
          type: "text/html",
          title: "Full metadata link",
        },
        {
          href: "https://licensebuttons.net/l/by/4.0/88x31.png",
          rel: "license",
          type: "image/png",
        },
        {
          href: "http://creativecommons.org/licenses/by/4.0/",
          rel: "license",
          type: "text/html",
        },
        {
          href: "uuid:11b3ccd0-d9e0-11dc-8635-00188b4c0af8",
          rel: "parent",
          type: "application/json",
          title:
            '{"title":"IMOS - Ocean Gliders Facility","recordAbstract":"The Ocean Gliders Facility (formerly known as the Australian National Facility for Ocean Gliders (ANFOG)), deploys a fleet of gliders around Australia.\\n\\nThe underwater ocean glider represents a technological revolution for oceanography. Autonomous ocean gliders can be built relatively cheaply, are controlled remotely and are reusable allowing them to make repeated subsurface ocean observations at a fraction of the cost of conventional methods. The data retrieved from the glider fleet will contribute to the study of the major boundary current systems surrounding Australia and their links to coastal ecosystems.\\n\\nThe facilities\' fleet consists of two types; Slocum gliders and Seagliders. \\nSlocum gliders (named for Joshua Slocum, the first solo global circumnavigator), manufactured by Webb Research Corp are optimised for shallow coastal waters (<200m) where high manoeuvrability is needed. The facility will have Slocum gliders for deployment on the continental shelf. Seagliders, built at the University of Washington, are designed to operate more efficiently in the open ocean up to 1000m water depth. The facility uses their Seagliders to monitor the boundary currents and continental shelves, which is valuable for gathering long-term environmental records of physical, chemical and biological data not widely measured to date. Whilst the Slocum gliders, due to their low cost and operational flexibility, will be of great use in intensive coastal monitoring, both types of gliders weigh only 52kg, enabling them to be launched from small boats. They have a suite of sensors able to record temperature, salinity, dissolved oxygen, turbidity, dissolved organic matter and chlorophyll against position and depth\\n\\nThe use of these contemporary gliders provides a unique opportunity to effectively measure the boundary currents off Australia, which are the main link between open-ocean and coastal processes. A number of gliders are operated with target regions including the Coral Sea, East Australian Current off New South Wales and Tasmania, Southern Ocean southwest of Tasmania, the Leeuwin and Capes Currents off South Western Australia and the Pilbara and Kimberly regions off North Western Australia."}',
        },
        {
          href: "uuid:0d9c8283-6aca-4c21-8495-deed7f316c75",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"Seaglider : a platform of the IMOS Ocean Gliders facility","recordAbstract":"The Ocean Gliders Facility (formerly known as the Australian National Facility for Ocean Gliders (ANFOG)), manages Sea gliders to monitor the boundary currents surroundings Australia.\\n\\nSeagliders are autonomous underwater vehicles (AUV) which harvest their propulsion from the ocean itself. By changing its buoyancy via an inflatable oil-filled bladder, the Seaglider is able to descend and ascend. This momentum is converted to forward motion by its wings. Pitch adjustments are made by moving an internal mass (battery pack) forward or backward, and steering is done by rolling the battery packs. Moving at an average horizontal velocity of 25 - 40 cm s-1, the glider navigates its way to a series of waypoints using GPS, internal dead reckoning and altimeter measurements. Because the gliders are programmed to provide data and vehicle technical parameters through satellite communication when it is at the surface and glider pilots at the Ocean Gliders facility control centre (at the University of Western Australia) can continuously trim the Seaglider for optimal flight, change the voyage route, and examine the scientific data during the mission.\\n\\nSea gliders, built at the University of Washington, are designed to operate most efficiently in the open ocean up to 1000m water depth. Sea gliders have a maximum endurance time of up to 6 months and are used to gather long term environmental records.\\n\\nSea gliders are equipped with a Seabird CTD (SBE 41), WETLabs ECO Triplet (measuring chlorophyll-a, CDOM and 660nm Backscatter) and a Seabird oxygen sensor (SBE 43)."}',
        },
        {
          href: "uuid:2436c7a9-59a2-4ed1-8e7c-f513e945bd6e",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"Slocum glider : a platform of the IMOS Ocean Gliders facility","recordAbstract":"The Ocean Gliders Facility (formerly known as the Australian National Facility for Ocean Gliders (ANFOG)), manages Slocum gliders to be deployed on the continental shelf.\\n\\nOcean gliders are autonomous underwater vehicles (AUV) which harvest their propulsion from the ocean itself. By changing its buoyancy, the glider is able to descend and ascend. This momentum is converted to forward motion by its wings. Pitch adjustments are made by moving an internal mass (battery pack) and steering is done using a rudder and/or battery packs. Moving at an average horizontal velocity of 25 - 40 cm s-1 the glider navigates its way to a series of pre-programmed waypoints using GPS, internal dead reckoning and altimeter measurements. The gliders are programmed to provide data through satellite communication when it is at the surface and it is also possible to control the path of the glider during its mission. \\n\\nSlocum gliders, manufactured by Webb Research Corp are optimised for shallow coastal water (< 200m) where high maneuverability is needed. Slocum gliders have a maximum endurance of 30 days and are used in intensive coastal monitoring.\\n\\nSlocum gliders are commonly instrumented with a Seabird-CTD (SBE 41 or GPCTD), WETLabs ECO Triplet (measuring Chlorophyll-a, CDOM & Backscatter), a Satlantic OCR-504 multispectral radiometer and an Aanderaa Oxygen optode."}',
        },
        {
          href: "uuid:a681fdba-c6d9-44ab-90b9-113b0ed03536",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Ocean Gliders - Real-time glider deployments","recordAbstract":"The Ocean Gliders Facility (formerly known as the Australian National Facility for Ocean Gliders (ANFOG)), deploys a fleet of eight gliders around Australia. The data represented by this record, are presented in real-time. \\n\\nThe underwater ocean glider represents a technological revolution for oceanography. Autonomous ocean gliders can be built relatively cheaply, are controlled remotely and are reusable allowing them to make repeated subsurface ocean observations at a fraction of the cost of conventional methods. The data retrieved from the glider fleet will contribute to the study of the major boundary current systems surrounding Australia and their links to coastal ecosystems. The glider fleet consists of two types; Slocum gliders and Seagliders. Slocum gliders (named for Joshua Slocum, the first solo global circumnavigator), manufactured by Webb Research Corp are optimised for shallow coastal waters (<200m) where high manoeuvrability is needed. The facility has Slocum gliders for deployment on the continental shelf. Seagliders, built at the University of Washington, are designed to operate more efficiently in the open ocean up to 1000m water depth. The facility uses their Seagliders to monitor the boundary currents and continental shelves, which is valuable for gathering long-term environmental records of physical, chemical and biological data not widely measured to date. Whilst the Slocum gliders, due to their low cost and operational flexibility, will be of great use in intensive coastal monitoring, both types of gliders weigh only 52kg, enabling them to be launched from small boats. They have a suite of sensors able to record temperature, salinity, dissolved oxygen, turbidity, dissolved organic matter and chlorophyll against position and depth. \\n\\nSustained ocean observations will allow researchers to document the natural variability of the ocean, and better understand the effect of climate change on coastal ecosystems. The IMOS gliders will focus particularly on the major boundary currents that run down the Australian coast, the Leeuwin in the west and the East Australian Current (EAC). The study of these currents is critical for understanding the north-south transport of freshwater, heat and biogeochemical properties. The currents exert a large influence on coastal ecosystems, shipping lanes and fisheries."}',
        },
        {
          href: "uuid:b82ec5c4-3b6a-4a39-a4e7-f1adba2d5372",
          rel: "child",
          type: "application/json",
          title:
            '{"title":"IMOS - Ocean Gliders - Delayed Mode QA/QC Best Practice Manual","recordAbstract":"This document is the IMOS Ocean Gliders\' (formerly known as Australian National Facility for Ocean Gliders (ANFOG)) Best Practice manual for delayed mode processed data. Ocean Gliders is a facility under Australia’s Integrated Marine Observing System (IMOS).\\n\\nThis document describes the quality analyses/quality control (QA/QC) methods and correction procedures employed by the Ocean Gliders facility for delayed mode glider data files available for public download through the Australian Ocean Data Network (AODN) portal (https://portal.aodn.org.au/)."}',
        },
        {
          href: '"https://nbviewer.org/github/aodn/aodn_cloud_optimised/blob/main/notebooks/slocum_glider_delayed_qc.ipynb"',
          rel: "related",
          type: "application/x-ipynb+json",
          title: "Python notebook example",
          "ai:group": "Python Notebook",
        },
        {
          href: "http://localhost:8080/api/v1/ogc/collections/c317b0fe-02e8-4ff9-96c9-563fd58e82ac/items/summary",
          rel: "summary",
          type: "application/x-parquet",
          title: "Summary",
        },
      ],
      extent: {
        spatial: {
          bbox: [
            [78.0, -48.0, 158.0, 10.0],
            [78.0, 0.0, 84.0, 10.0],
            [146.0, -8.0, 150.0, -2.0],
            [126.0, -10.0, 128.0, -8.0],
            [140.0, -14.0, 142.0, -12.0],
            [144.0, -20.0, 150.0, -10.0],
            [150.0, -24.0, 154.0, -22.0],
            [110.0, -34.0, 124.0, -12.0],
            [116.0, -36.0, 124.0, -34.0],
            [130.0, -40.0, 144.0, -32.0],
            [140.0, -48.0, 158.0, -26.0],
          ],
          crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        },
        temporal: {
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {
        status: "onGoing",
      },
      id: "2d496463-600c-465a-84a1-8a4ab76bd505",
      title: "IMOS - Satellite Remote Sensing - SST - L4 - GAMSSA - World",
      description:
        "An International Group for High-Resolution Sea Surface Temperature (GHRSST) Level 4 sea surface temperature analysis, produced daily on an operational basis at the Australian Bureau of Meteorology using optimal interpolation (OI) on a global 0.25 degree grid.  This Global Australian Multi-Sensor SST Analysis (GAMSSA) v1.0 system blends infra-red SST observations from the Advanced Very High Resolution Radiometer (AVHRR) on NOAA and METOP polar-orbiting satellites, microwave SST observations from the Advanced Microwave Scanning Radiometer-2 (AMSR-2) on GCOM-W, and in situ data from ships, and drifting and moored buoys from the Global Telecommunications System (GTS).  \n\nAll SST observations are filtered for those values suspected to be affected by diurnal warming by excluding cases which have experienced recent surface wind speeds of below 6 m/s during the day and less than 2 m/s during the night, thereby resulting in daily foundation SST estimates that are largely free of diurnal warming effects.",
      links: [
        {
          href: "http://imos.org.au/sstproducts.html",
          rel: "related",
          type: "text/html",
          title: "Sea Surface Temperatures Derived from NOAA Satellite Data",
          "ai:group": "Other",
        },
        {
          href: "http://thredds.aodn.org.au/thredds/catalog/IMOS/SRS/SST/ghrsst/L4/GAMSSA/catalog.html",
          rel: "related",
          type: "text/html",
          title: "NetCDF files via THREDDS catalog",
          "ai:group": "Data Access > thredds",
        },
        {
          href: "https://imos.aodn.org.au/imos123/home?uuid=2d496463-600c-465a-84a1-8a4ab76bd505",
          rel: "related",
          type: "text/html",
          title: "View and download data though the AODN Portal",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/ncwms",
          rel: "wms",
          type: "",
          title: "srs_ghrsst_l4_gamssa_url/analysed_sst",
          "ai:group": "Data Access > wms",
        },
        {
          href: "https://processes.aodn.org.au/wps",
          rel: "OGC:WPS--gogoduck",
          type: "",
          title: "srs_ghrsst_l4_gamssa_url",
        },
        {
          href: "https://help.aodn.org.au/web-services/gogoduck-aggregator/",
          rel: "related",
          type: "text/html",
          title: "GoGoDuck help documentation",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/ows",
          rel: "IMOS:AGGREGATION--bodaac",
          type: "",
          title: "srs_ghrsst_l4_gamssa_url#file_url",
        },
        {
          href: "https://help.aodn.org.au/web-services/ncurllist-service/",
          rel: "related",
          type: "text/html",
          title: "BODAAC help documentation",
          "ai:group": "Document",
        },
        {
          href: "https://registry.opendata.aws/aodn_satellite_ghrsst_l4_gamssa_1day_multi_sensor_world/",
          rel: "related",
          type: "text/html",
          title:
            "Access To AWS Open Data Program registry for the Cloud Optimised version of this dataset",
          "ai:group": "Data Access > aws",
        },
        {
          href: "https://github.com/aodn/aodn_cloud_optimised/blob/main/notebooks/satellite_ghrsst_l4_gamssa_1day_multi_sensor_world.ipynb",
          rel: "related",
          type: "application/x-ipynb+json",
          title:
            "Access to Jupyter notebook to query Cloud Optimised converted dataset]",
          "ai:group": "Python Notebook",
        },
        {
          href: "https://geonetwork.edge.aodn.org.au:443/geonetwork/images/logos/2976cf80-3906-41aa-8916-4adfbc507438.png",
          rel: "icon",
          type: "image/png",
          title: "Suggest icon for dataset",
        },
        {
          href: "https://catalogue-imos.aodn.org.au:443/geonetwork/srv/api/records/2d496463-600c-465a-84a1-8a4ab76bd505",
          rel: "describedby",
          type: "text/html",
          title: "Full metadata link",
        },
        {
          href: "https://licensebuttons.net/l/by/4.0/88x31.png",
          rel: "license",
          type: "image/png",
        },
        {
          href: "http://creativecommons.org/licenses/by/4.0/",
          rel: "license",
          type: "text/html",
        },
        {
          href: "uuid:5356744f-10f7-442e-8dd5-8a05f016588d",
          rel: "parent",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - Satellite Sea Surface Temperature (SST) Products Sub-Facility","recordAbstract":"As part of the Integrated Marine Observing System (IMOS), the Australian Bureau of Meteorology produce high-resolution satellite sea surface temperature (SST) products over the Australian region, designed to suit a range of operational and research applications. All these products follow the latest International Group for High Resolution Sea Surface Temperature (GHRSST: www.ghrsst.org) file formats, assisting international data exchange and collaboration.\\nThe highest spatial resolution (1 km x 1 km) data from Advanced Very High Resolution Radiometer (AVHRR) sensors on NOAA polar-orbiting satellites can only be obtained through receiving direct broadcast “HRPT” data from the satellite. In Australia, HRPT data is received by a number of agencies (Bureau of Meteorology, Geoscience Australia, AIMS and CSIRO) and consortia (WASTAC and TERSS) at ground-stations located in Darwin, Townsville, Melbourne, Hobart, Perth and Alice Springs and in Antarctica at Casey and Davis Stations.\\n\\nThe Bureau of Meteorology, in collaboration with CSIRO Marine and Atmospheric Research, is combining raw data from the various ground-stations and producing real-time HRPT AVHRR skin (~ 10 micron depth) SST data files in the GHRSST GDS v2.0 L2P (single swath, geolocated), L3U (single swath, gridded), one and three day daytime/night-time L3C (single sensor, multiple swath, gridded) and one, three and six day daytime/night-time L3S (multiple sensors, multiple swath, gridded) formats. The L2P, L3U, L3C and L3S files for NOAA-15, 17, 18 and 19 satellite data are available through the IMOS FTP server (ftp://aodaac2-cbr.act.csiro.au/imos/GHRSST), IMOS AO-DAAC (http://www.marine.csiro.au/remotesensing/imos/aggregator.html# ) and IMOS Ocean Portal (http://imos.aodn.org.au/webportal/), and will eventually be available through the GHRSST Global Data Assembly Centre (http://ghrsst.jpl.nasa.gov). Archived raw HRPT AVHRR data from Australian and Antarctic ground-stations back to 1992 will be progressively reprocessed into skin SST L2P, L3U, L3C and L3S files and be available to GHRSST and IMOS by June 2013.\\nFor the user, there are several advantages to using GHRSST-format SST products. For each SST value the GHRSST files contain a quality level flag (based on proximity to cloud, satellite zenith angle and day/night) and bias and standard deviation error estimates based on 60 day match-ups with drifting buoy SST data. Note that the closer an SST pixel is to cloud, the higher the standard deviation. Therefore, the presence of these quality level flags and error information enable users to tailor the L2P, L3U, L3C or L3S files for their particular research application by trading SST spatial coverage for accuracy and vice versa. Users have the ability to access L3U, L3C and L3S SST products through IMOS OPeNDAP servers, greatly simplifying data access and extraction. Providing real-time HRPT AVHRR SST files in GHRSST-L2P format enables them to be incorporated into global and regional, gap-free, analyses of L2P SST from multiple satellites such as NASA’s G1SST global 1 km daily SST analysis and the Bureau of Meteorology’s daily regional and global SST analyses (RAMSSA and GAMSSA).\\nThe new IMOS AVHRR L2P SSTs exhibit approximately 75% the error of the Bureau’s pre-existing HRPT AVHRR level 2 SST data, with standard deviations compared with drifting buoys during night-time of around 0.3°C and during daytime of around 0.4°C for quality level 5 (highest). This significant improvement in accuracy has been achieved by improving cloud clearing and calibration - using regional rather than global drifting buoy SST observations and incorporating a dependence on latitude.\\nFor further details on the AVHRR GHRSST products see Paltoglou et al. (2010) (http://imos.org.au/srsdoc.html). Enquiries can be directed to Helen Beggs (h.beggs(at)bom.gov.au).\\n\\n\\nAll the IMOS satellite SST products are supplied in GHRSST netCDF format and are either geolocated swath (\\"L2P\\") files or level 3 composite, gridded files that will have gaps where there were no observations during the specified time period. The various L3U (single swath), L3C (single sensor, multiple swath) and L3S (multiple sensors, multiple swaths) are designed to suit different applications. Some current applications of the various IMOS satellite SST products are:\\n\\nHRPT AVHRR data:\\n\\nL2P: Ingestion into optimally interpolated SST analysis systems (eg. RAMSSA, GAMSSA, G1SST, ODYSSEA);\\n\\nL3U: Calculation of surface ocean currents (IMOS OceanCurrents);\\n\\nL3C: Estimation of diurnal warming of the surface ocean (GHRSST Tropical Warm Pool Diurnal Variation (TWP+) Project);\\n\\nL3S: Estimation of likelihood of coral bleaching events (ReefTemp II).\\n\\nL3P: Legacy 14-day Mosaic AVHRR SST which is a weighted mean SST produced daily from multiple NOAA satellites in a cut-down GHRSST netCDF format. This product is still used in a coral bleaching prediction system run at CMAR. The product is produced using the legacy BoM processing system and is less accurate than the new IMOS L3S product.\\n\\nGeostationary satellite MTSAT-1R data:\\n\\nL3U: Hourly, 0.05 deg x 0.05 deg SST used for estimation of the diurnal warming of the surface ocean and validation of diurnal warming models (TWP+ Project)."}',
        },
        {
          href: "uuid:34110d06-707b-4f73-970e-9b38e9fcb7da",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Single Sensor - 3 day - day and night time - Australia","recordAbstract":"This is a single-sensor multi-satellite SSTfnd product for a 72 hour period, derived using observations from AVHRR instruments on all available NOAA polar-orbiting satellites. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70°E to 170°W, 20°N to 70°S. Each grid cell contains the 72 hour average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. The diagram at https://help.aodn.org.au/satellite-data/product-information/ indicates where this product fits within the GHRSST suite of NOAA/AVHRR products. The SSTfnd is derived by adding a constant 0.17 degC to the SSTskin observations after rejecting observations with low surface wind speeds (<6m/s by day and <2m/s at night) (see http://www.bom.gov.au/amoj/docs/2011/beggs.pdf). Matchups with buoy SSTfnd observations for the central date indicate typical 2014 biases of < 0.05 degC and standard deviations of 0.6 degC. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html and Beggs et al. (2013) at http://imos.org.au/sstdata_references.html for further information.\\n\\nProduction of this single sensor product ceased in June 2025, due to decommissioning of the NOAA-18 satellite. Please refer to the following multi sensor product for data after June 2025 - IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 3 day - day and night time - Australia (https://catalogue-imos.aodn.org.au/geonetwork/srv/eng/catalog.search#/metadata/4cbb9eeb-9ed3-4079-a180-2293a2c219b9)"}',
        },
        {
          href: "uuid:35bf740e-792c-4e8f-b505-db40a166f27b",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3U - NOAA 19 - Australia","recordAbstract":"This is a single sensor, single swath SSTskin product for a single overpass, without distinction between day or night. It is derived using observations from the AVHRR instrument on the NOAA-XX satellites. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70°E to 170°W, 20°N to 70°S. Each grid cell contains a single observation from the AVHRR radiometer. The diagram at https://help.aodn.org.au/satellite-data/product-information/ indicates where this product fits within the GHRSST suite of NOAA/AVHRR products. Matchups with buoy SST observations (adjusted to skin depths) indicate typical 2014 biases of < 0.1 degC and standard deviations of 0.5 degC to 0.6 degC for NOAA-18 and NOAA-19. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html and Beggs et al. (2013) at http://imos.org.au/sstdata_references.html for further information."}',
        },
        {
          href: "uuid:46ebc1a9-c503-4435-b85c-11fe16176c8d",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3C - NOAA 19 - 1 day - night time - Australia","recordAbstract":"This is a single sensor, multiple swath SSTskin product for a single night-time period, derived using observations from the AVHRR instrument on the NOAA-XX satellites. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70°E to 170°W, 20°N to 70°S. Only night time passes are included in the product. Each grid cell contains the 1 night average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. The diagram at https://help.aodn.org.au/satellite-data-product-information/ indicates where this product fits within the GHRSST suite of NOAA/AVHRR productsMatchups with buoy SST observations (adjusted to skin depths) indicate typical 2014 biases of < 0.05 degC and standard deviations of 0.5 degC to 0.6 degC for NOAA-18 and NOAA-19. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html and Beggs et al. (2013) at http://imos.org.au/sstdata_references.html for further information."}',
        },
        {
          href: "uuid:4cbb9eeb-9ed3-4079-a180-2293a2c219b9",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 3 day - day and night time - Australia","recordAbstract":"This is a multi-sensor SSTfnd L3S product for a single 72 hour period, derived using sea surface temperature retrievals from the VIIRS sensor on the Suomi-NPP satellite and JPSS series of satellites, and AVHRR sensor on the NOAA and Metop series of Polar-orbiting satellites. The sensors and satellite platforms contributing to each file are listed in the sensor and platform global attributes in the file header. The SSTfnd is derived by adding a constant 0.17 degC to the NOAA AVHRR SSTskin observations, and 0 degC to the Metop and VIIRS SSTsubskin observations, after rejecting observations with low surface wind speeds (<6 m/s by day and <2 m/s at night). The Multi-sensor L3S product is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70E to 170W, 20N to 70S. The quality level for each pixel was remapped using the original ACSPO VIIRS and AVHRR L3U quality levels and Sensor Specific Error Statistics (SSES), as described in Griffin et al. (2017) Appendix at http://imos.org.au/facilities/srs/sstproducts/sstdata0/sstdata-references/, before compositing single swaths from the sensors. Each grid cell contains the 72 hour average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html for further information."}',
        },
        {
          href: "uuid:52ad55a5-b537-4e10-8a81-22d9317c81f2",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 1 day - day time - Australia","recordAbstract":"This is a multi-sensor SSTskin L3S product for a single day-time period, derived using sea surface temperature retrievals from the VIIRS sensor on the Suomi-NPP satellite and JPSS series of satellites, and AVHRR sensor on the NOAA and Metop series of Polar-orbiting satellites. The sensors and satellite platforms contributing to each file are listed in the sensor and platform global attributes in the file header. The Multi-sensor L3S product is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70E to 170W, 20N to 70S. The quality level for each pixel was remapped using the original ACSPO VIIRS and AVHRR L3U quality levels and Sensor Specific Error Statistics (SSES), as described in Griffin et al. (2017) Appendix at http://imos.org.au/facilities/srs/sstproducts/sstdata0/sstdata-references/, before compositing single swaths from the sensors. Each grid cell contains the 1 day average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html for further information."}',
        },
        {
          href: "uuid:52c92036-cea9-4b1a-b4f0-cc94b8b5df98",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3C - NOAA 19 - 3 day - day time - Australia","recordAbstract":"This is a single sensor, multiple swath SSTskin product for three consecutive night-time periods, derived using observations from the AVHRR instrument on the NOAA-XX satellites. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70°E to 170°W, 20°N to 70°S. Only day time passes are included in the product. Each grid cell contains the 3 day average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. The diagram at https://help.aodn.org.au/satellite-data/product-information/ indicates where this product fits within the GHRSST suite of NOAA/AVHRR products. Matchups with buoy SST observations (adjusted to skin depths) indicate typical 2014 biases of < 0.1 degC and standard deviations of 0.5 degC to 0.6 degC for NOAA-18 and NOAA-19. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html and Beggs et al. (2013) at http://imos.org.au/sstdata_references.html for further information."}',
        },
        {
          href: "uuid:671c53fa-b114-4a1c-af18-c131b11b8c85",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Single Sensor - 3 day - day time - Australia","recordAbstract":"This is a single-sensor multi-satellite SSTskin product for three consecutive day-time periods, derived using observations from AVHRR instruments on all available NOAA polar-orbiting satellites. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70°E to 170°W, 20°N to 70°S. Each grid cell contains the 3 day average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. The diagram at https://help.aodn.org.au/satellite-data/product-information/ indicates where this product fits within the GHRSST suite of NOAA/AVHRR products. Matchups with buoy SST observations for the central date (adjusted to skin depths) indicate typical 2014 biases of < 0.2 degC and standard deviations of 0.6 degC. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html and Beggs et al. (2013) at http://imos.org.au/sstdata_references.html for further information.\\n\\nProduction of this single sensor product ceased in June 2025, due to decommissioning of the NOAA-18 satellite. Please refer to the following multi sensor product for data after June 2025 - IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 3 day - day time - Australia (https://catalogue-imos.aodn.org.au/geonetwork/srv/eng/catalog.search#/metadata/08e04227-4da1-479b-bec1-06ee27a69a40)"}',
        },
        {
          href: "uuid:7fda8e44-d00a-4e0b-b686-b24c33c6c3ab",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3C - NOAA 19 - 3 day - night time - Australia","recordAbstract":"This is a single sensor, multiple swath SSTskin product for three consecutive night-time periods, derived using observations from the AVHRR instrument on the NOAA-XX satellites. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70°E to 170°W, 20°N to 70°S. Only night time passes are included in the product. Each grid cell contains the 3 night average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. The diagram at https://help.aodn.org.au/satellite-data/product-informa\\ntion/ indicates where this product fits within the GHRSST suite of NOAA/AVHRR products. Matchups with buoy SST observations (adjusted to skin depths) indicate typical 2014 biases of < 0.1 degC and standard deviations of 0.5 degC to 0.6 degC for NOAA-18 and NOAA-19. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html and Beggs et al. (2013) at http://imos.org.au/sstdata_references.html for further information."}',
        },
        {
          href: "uuid:91495e9a-6590-4fb9-bb63-0901a8a4b7b1",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3C - NOAA 19 - 1 day - night time - Southern Ocean","recordAbstract":"This is a single sensor, multiple swath SSTskin product for a single night-time period, derived using observations from the AVHRR instrument on the NOAA-XX satellites. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the Southern Ocean region 3°E to 158°W, 27°S to 78°S. Only night time passes are included in the product. Each grid cell contains the 1 night average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. The diagram at https://help.aodn.org.au/satellite-data-product-information/ indicates where this product fits within the GHRSST suite of NOAA/AVHRR productsMatchups with buoy SST observations (adjusted to skin depths) indicate typical 2014 biases of < 0.05 degC and standard deviations of 0.5 degC to 0.6 degC for NOAA-18 and NOAA-19. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html and Beggs et al. (2013) at http://imos.org.au/sstdata_references.html for further information."}',
        },
        {
          href: "uuid:95b81267-bad2-4939-8559-45b0d0c6f2e9",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 6 day - day and night time - Australia","recordAbstract":"This is a multi-sensor SSTfnd L3S product for a single 144 hour period, derived using sea surface temperature retrievals from the VIIRS sensor on the Suomi-NPP satellite and JPSS series of satellites, and AVHRR sensor on the NOAA and Metop series of Polar-orbiting satellites. The sensors and satellite platforms contributing to each file are listed in the sensor and platform global attributes in the file header. The SSTfnd is derived by adding a constant 0.17 degC to the NOAA AVHRR SSTskin observations, and 0 degC to the Metop and VIIRS SSTsubskin observations, after rejecting observations with low surface wind speeds (<6 m/s by day and <2 m/s at night). The Multi-sensor L3S product is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70E to 170W, 20N to 70S. The quality level for each pixel was remapped using the original ACSPO VIIRS and AVHRR L3U quality levels and Sensor Specific Error Statistics (SSES), as described in Griffin et al. (2017) Appendix at http://imos.org.au/facilities/srs/sstproducts/sstdata0/sstdata-references/, before compositing single swaths from the sensors. Each grid cell contains the 144 hour average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html for further information."}',
        },
        {
          href: "uuid:8bd3fe33-fd98-4307-ad23-424ad9a2907b",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Single Sensor - 1 day - day time - Australia","recordAbstract":"This is a single-sensor multi-satellite SSTskin product for a single day-time period, derived using observations from AVHRR instruments on all available NOAA polar-orbiting satellites. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70°E to 170°W, 20°N to 70°S. Each grid cell contains the 1 day average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. The diagram at https://help.aodn.org.au/satellite-data-product-information/ indicates where this product fits within the GHRSST suite of NOAA/AVHRR products. Matchups with buoy SST observations (adjusted to skin depths) indicate typical 2014 biases of < 0.1 degC and standard deviations of 0.6 degC. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html and Beggs et al. (2013) at http://imos.org.au/sstdata_references.html for further information.\\n\\nProduction of this single sensor product ceased in June 2025, due to decommissioning of the NOAA-18 satellite. Please refer to the following multi sensor product for data after June 2025 - IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 1 day - day time - Australia (https://catalogue-imos.aodn.org.au/geonetwork/srv/eng/catalog.search#/metadata/52ad55a5-b537-4e10-8a81-22d9317c81f2)"}',
        },
        {
          href: "uuid:73e6608c-cbf5-4a01-9c95-1f137de6cbac",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 1 month - day and night time - Australia","recordAbstract":"This is a multi-sensor SSTfnd L3S product for a one month period, derived using sea surface temperature retrievals from the VIIRS sensor on the Suomi-NPP satellite and JPSS series of satellites, and AVHRR sensor on the NOAA and Metop series of Polar-orbiting satellites. The sensors and satellite platforms contributing to each file are listed in the sensor and platform global attributes in the file header. The SSTfnd is derived by adding a constant 0.17 degC to the NOAA AVHRR SSTskin observations, and 0 degC to the Metop and VIIRS SSTsubskin observations, after rejecting observations with low surface wind speeds (<6 m/s by day and <2 m/s at night). The Multi-sensor L3S product is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70E to 170W, 20N to 70S. The quality level for each pixel was remapped using the original ACSPO VIIRS and AVHRR L3U quality levels and Sensor Specific Error Statistics (SSES), as described in Griffin et al. (2017) Appendix at http://imos.org.au/facilities/srs/sstproducts/sstdata0/sstdata-references/, before compositing single swaths from the sensors. Each grid cell contains the 1 month average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html for further information."}',
        },
        {
          href: "uuid:a05817da-fdab-483a-a965-b26fe364ad7c",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3C - SNPP - 1 day - night time - Australia","recordAbstract":"This is a single sensor, multiple swath SSTskin product for a single night-time period, derived using observations from the VIIRS instrument on the Suomi-NPP satellite. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70°E to 170°W, 20°N to 70°S. Only night time passes are included in the product. The quality level for each pixel was remapped using the original ACSPO VIIRS L3U quality levels and Sensor Specific Error Statistics (SSES), as described in Griffin et al. (2017) Appendix at http://imos.org.au/facilities/srs/sstproducts/sstdata0/sstdata-references/, before compositing single swaths from the sensor. Each grid cell contains the 1 night average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html for further information."}',
        },
        {
          href: "uuid:a05d8ceb-ab0c-4bad-8126-d16d535e73c1",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Single Sensor - 1 month - day and night time - Southern Ocean","recordAbstract":"This is a single-sensor SSTfnd product for a one month period, derived using observations from AVHRR instruments on all available NOAA polar-orbiting satellites. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the Southern Ocean region 3°E to 158°W, 27°S to 78°S. Each grid cell contains the one month average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. The diagram at https://help.aodn.org.au/satellite-data-product-information/ indicates where this product fits within the GHRSST suite of NOAA/AVHRR products. The SSTfnd is derived by adding a constant 0.17 degC to the SSTskin observations after rejecting observations with low surface wind speeds (<6m/s by day and <2m/s at night) (see http://www.bom.gov.au/amoj/docs/2011/beggs.pdf). Matchups with buoy SSTfnd observations for the central date indicate typical 2014 biases of < 0.03 degC and standard deviations of 0.6 degC. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html and Beggs et al. (2013) at http://imos.org.au/sstdata_references.html for further information.\\n\\nProduction of this single sensor product ceased in June 2025, due to decommissioning of the NOAA-18 satellite. Please refer to the following multi sensor product for data after June 2025 - IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 1 month - day and night time - Southern Ocean (https://catalogue-imos.aodn.org.au/geonetwork/srv/eng/catalog.search#/metadata/579fc1ac-6ee5-40e2-9170-6a857e9b40da)."}',
        },
        {
          href: "uuid:b28ab00c-06f9-4cef-9053-4ff3bf537bb7",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 3 day - night time - Australia","recordAbstract":"This is a multi-sensor SSTskin L3S product for three consecutive night-time periods, derived using sea surface temperature retrievals from the VIIRS sensor on the Suomi-NPP satellite and JPSS series of satellites, and AVHRR sensor on the NOAA and Metop series of Polar-orbiting satellites. The sensors and satellite platforms contributing to each file are listed in the sensor and platform global attributes in the file header. The Multi-sensor L3S product is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70E to 170W, 20N to 70S. The quality level for each pixel was remapped using the original ACSPO VIIRS and AVHRR L3U quality levels and Sensor Specific Error Statistics (SSES), as described in Griffin et al. (2017) Appendix at http://imos.org.au/facilities/srs/sstproducts/sstdata0/sstdata-references/, before compositing single swaths from the sensors. Each grid cell contains the 3 night average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html for further information."}',
        },
        {
          href: "uuid:a227ebf9-8f7b-49a1-b933-3f3402350731",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Single Sensor - 14 day - day and night time - Australia","recordAbstract":"This is a multi-sensor SSTfnd product for a 336 hour period, derived using observations from AVHRR instruments on all available NOAA polar-orbiting satellites. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70°E to 170°W, 20°N to 70°S. Each grid cell contains the 336 hour average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. The diagram at https://help.aodn.org.au/satellite-data/product-information/ indicates where this product fits within the GHRSST suite of NOAA/AVHRR products. The SSTfnd is derived by adding a constant 0.17 degC to the SSTskin observations after rejecting observations with low surface wind speeds (<6m/s by day and <2m/s at night) (see http://www.bom.gov.au/amoj/docs/2011/beggs.pdf). Matchups with buoy SSTfnd observations for the central date indicate typical 2014 biases of < 0.03 degC and standard deviations of 0.6 degC. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html and Beggs et al. (2013) at http://imos.org.au/sstdata_references.html for further information.\\n\\nProduction of this product ceased in 2018."}',
        },
        {
          href: "uuid:a5cad244-c33e-4083-b8a9-09ef59500b3d",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Single Sensor - 6 day - day time - Australia","recordAbstract":"This is a single-sensor multi-satellite SSTskin product for six consecutive day-time periods, derived using observations from AVHRR instruments on all available NOAA polar-orbiting satellites. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70°E to 170°W, 20°N to 70°S. Each grid cell contains the 6 day average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. The diagram at https://help.aodn.org.au/satellite-data-product-information/ indicates where this product fits within the GHRSST suite of NOAA/AVHRR products. Matchups with buoy SST observations for the central date (adjusted to skin depths) indicate typical 2014 biases of < 0.3 degC and standard deviations of 0.7 degC. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html and Beggs et al. (2013) at http://imos.org.au/sstdata_references.html for further information.\\n\\nProduction of this single sensor product ceased in June 2025, due to decommissioning of the NOAA-18 satellite. Please refer to the following multi sensor product for data after June 2025 - IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 6 day - day time - Australia (https://catalogue-imos.aodn.org.au/geonetwork/srv/eng/catalog.search#/metadata/f07c3d3f-547b-4818-9d2f-12e872c7e158)"}',
        },
        {
          href: "uuid:a0309f9d-81cd-48dc-bb2c-dc0c516c516a",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Single Sensor - 14 day - night time - Australia","recordAbstract":"This is a multi-sensor SSTskin product for fourteen consecutive night-time periods, derived using observations from AVHRR instruments on all available NOAA polar-orbiting satellites. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70°E to 170°W, 20°N to 70°S. Each grid cell contains the 14 night average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. The diagram at https://help.aodn.org.au/satellite-data/product-information/ indicates where this product fits within the GHRSST suite of NOAA/AVHRR products. Matchups with buoy SST observations for the central date (adjusted to skin depths) indicate typical 2014 biases of < 0.05 degC and standard deviations of 0.6 degC. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html and Beggs et al. (2013) at http://imos.org.au/sstdata_references.html for further information.\\n\\nProduction of this product ceased in 2018."}',
        },
        {
          href: "uuid:a136eee7-a990-4c06-a4f6-915657a2464e",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Single Sensor - 1 day - day and night time - Australia","recordAbstract":"This is a single-sensor multi-satellite SSTfnd product for a single 24 hour period, derived using observations from AVHRR instruments on all available NOAA polar-orbiting satellites. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70°E to 170°W, 20°N to 70°S. Each grid cell contains the 24 hour average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. The diagram at https://help.aodn.org.au/satellite-data-product-information/ indicates where this product fits within the GHRSST suite of NOAA/AVHRR products. The SSTfnd is derived by adding a constant 0.17 degC to the SSTskin observations after rejecting observations with low surface wind speeds (<6m/s by day and <2m/s at night) (see http://www.bom.gov.au/amoj/docs/2011/beggs.pdf). Matchups with buoy SSTfnd observations indicate typical 2014 biases of < 0.01 degC and standard deviations of 0.6 degC. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html and Beggs et al. (2013) at http://imos.org.au/sstdata_references.html for further information.\\n\\nProduction of this single sensor product ceased in June 2025, due to decommissioning of the NOAA-18 satellite. Please refer to the following multi sensor product for data after June 2025 - IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 1 day - day and night time - Australia (https://catalogue-imos.aodn.org.au/geonetwork/srv/eng/catalog.search#/metadata/d7f3178d-869a-4eac-959d-71d1f5e24888)"}',
        },
        {
          href: "uuid:a4170ca8-0942-4d13-bdb8-ad4718ce14bb",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L4 - RAMSSA - Australia","recordAbstract":"An International Group for High Resolution Sea Surface Temperature (GHRSST) Level 4 sea surface temperature analysis, produced daily on an operational basis at the Australian Bureau of Meteorology using optimal interpolation (OI) on a regional 1/12 degree grid over the Australian region (20N - 70S, 60E - 170W). This Regional Australian Multi-Sensor SST Analysis (RAMSSA) v1.0 system blends infra-red SST observations from the Advanced Very High Resolution Radiometer (AVHRR) on NOAA and METOP polar-orbiting satellites, microwave SST observations from the Advanced Microwave Scanning Radiometer-2 (AMSR-2) on GCOM-W, and in situ data from ships, and drifting and moored buoys from the Global Telecommunications System (GTS). \\n\\nAll SST observations are filtered for those values suspected to be affected by diurnal warming by excluding cases which have experienced recent surface wind speeds of below 6 m/s during the day and less than 2 m/s during the night, thereby resulting in daily foundation SST estimates that are largely free of diurnal warming effects."}',
        },
        {
          href: "uuid:aaad092c-c3af-42e6-87e0-bdaef945f522",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Single Sensor - 1 day - night time - Australia","recordAbstract":"This is a single-sensor multi-satellite SSTskin product for a single night-time period, derived using observations from AVHRR instruments on all available NOAA polar-orbiting satellites. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70°E to 170°W, 20°N to 70°S. Each grid cell contains the 1 night average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. The diagram at https://help.aodn.org.au/satellite-data-product-information/ indicates where this product fits within the GHRSST suite of NOAA/AVHRR products. Matchups with buoy SST observations (adjusted to skin depths) indicate typical 2014 biases of < 0.01 degC and standard deviations of 0.6 degC. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html and Beggs et al. (2013) at http://imos.org.au/sstdata_references.html for further information.\\n\\nProduction of this single sensor product ceased in June 2025, due to decommissioning of the NOAA-18 satellite. Please refer to the following multi sensor product for data after June 2025 - IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 1 day - night time - Australia (https://catalogue-imos.aodn.org.au/geonetwork/srv/eng/catalog.search#/metadata/d3e3bce3-adb4-433a-a192-93abc91899d3)"}',
        },
        {
          href: "uuid:b4884b14-a33c-47f1-89f9-baaeb400eff5",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3U - NOAA 19 - Southern Ocean","recordAbstract":"This is a single sensor, single swath SSTskin product for a single overpass, without distinction between day or night. It is derived using observations from the AVHRR instrument on the NOAA-XX satellites. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the Southern Ocean region 3°E to 158°W, 27°S to 78°S. Each grid cell contains a single observation from the AVHRR radiometer. The diagram at https://help.aodn.org.au/satellite-data/product-information/ indicates where this product fits within the GHRSST suite of NOAA/AVHRR products. Matchups with buoy SST observations (adjusted to skin depths) indicate typical 2014 biases of < 0.1 degC and standard deviations of 0.5 degC to 0.6 degC for NOAA-18 and NOAA-19. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html and Beggs et al. (2013) at http://imos.org.au/sstdata_references.html for further information."}',
        },
        {
          href: "uuid:b8e9f613-9611-4692-a958-07f100d2c763",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Single Sensor - 1 month - day time - Australia","recordAbstract":"This is a single-sensor multi-satellite SSTskin product for 1 month of consecutive day-time periods, derived using observations from AVHRR instruments on all available NOAA polar-orbiting satellites. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70°E to 170°W, 20°N to 70°S. Each grid cell contains the 1 month average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. The diagram at https://help.aodn.org.au/satellite-data-product-information/ indicates where this product fits within the GHRSST suite of NOAA/AVHRR products. Matchups with buoy SST observations for the central date (adjusted to skin depths) indicate typical 2014 biases of < 0.3 degC and standard deviations of 0.7 degC. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html and Beggs et al. (2013) at http://imos.org.au/sstdata_references.html for further information.\\n\\nProduction of this single sensor product ceased in June 2025, due to decommissioning of the NOAA-18 satellite. Please refer to the following multi sensor product for data after June 2025 - IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 1 month - day time - Australia (https://catalogue-imos.aodn.org.au/geonetwork/srv/eng/catalog.search#/metadata/e3b2531b-a662-43de-9a8b-8e2b385267b3)"}',
        },
        {
          href: "uuid:bcf6a870-2591-492e-b340-931f38de5975",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3C - SNPP - 1 day - day time - Australia","recordAbstract":"This is a single sensor, multiple swath SSTskin product for a single day-time period, derived using observations from the VIIRS instrument on the Suomi-NPP satellite. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70°E to 170°W, 20°N to 70°S. Only day time passes are included in the product. The quality level for each pixel was remapped using the original ACSPO VIIRS L3U quality levels and Sensor Specific Error Statistics (SSES), as described in Griffin et al. (2017) Appendix at http://imos.org.au/facilities/srs/sstproducts/sstdata0/sstdata-references/, before compositing single swaths from the sensor. Each grid cell contains the 1 day average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html for further information."}',
        },
        {
          href: "uuid:d9618fb2-1a71-4afd-b1c8-56a6871b224a",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Single Sensor - 1 month - night time - Australia","recordAbstract":"This is a single-sensor multi-satellite SSTskin product for one month of consecutive night-time periods, derived using observations from AVHRR instruments on all available NOAA polar-orbiting satellites. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70°E to 170°W, 20°N to 70°S. Each grid cell contains the 1 month average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. The diagram at https://help.aodn.org.au/satellite-data-product-information/ indicates where this product fits within the GHRSST suite of NOAA/AVHRR products. Matchups with buoy SST observations for the central date (adjusted to skin depths) indicate typical 2014 biases of < 0.05 degC and standard deviations of 0.6 degC. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html and Beggs et al. (2013) at http://imos.org.au/sstdata_references.html for further information.\\n\\nProduction of this single sensor product ceased in June 2025, due to decommissioning of the NOAA-18 satellite. Please refer to the following multi sensor product for data after June 2025 - IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 1 month - night time - Australia (https://catalogue-imos.aodn.org.au/geonetwork/srv/eng/catalog.search#/metadata/1aa787da-a9ba-494a-ae22-0c3eee2491e1)"}',
        },
        {
          href: "uuid:be9103bd-dbbb-42a8-949d-92e8543a4d92",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3C - NOAA 19 - 1 day - day time - Southern Ocean","recordAbstract":"This is a single sensor, multiple swath SSTskin product for a single day-time period, derived using observations from the AVHRR instrument on the NOAA-XX satellites. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the Southern Ocean region 3°E to 158°W, 27°S to 78°S. Only day time passes are included in the product. Each grid cell contains the 1 day average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. The diagram at https://help.aodn.org.au/satellite-data-product-information/ indicates where this product fits within the GHRSST suite of NOAA/AVHRR products. Matchups with buoy SST observations (adjusted to skin depths) indicate typical 2014 biases of < 0.1 degC and standard deviations of 0.5 degC to 0.6 degC for NOAA-18 and NOAA-19. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html and Beggs et al. (2013) at http://imos.org.au/sstdata_references.html for further information."}',
        },
        {
          href: "uuid:d6f49c4a-8b75-4d05-acd4-b9c085bf4de0",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Single Sensor - 1 month - day and night time - Australia","recordAbstract":"This is a single-sensor multi-satellite SSTfnd product for a one month period, derived using observations from AVHRR instruments on all available NOAA polar-orbiting satellites. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70°E to 170°W, 20°N to 70°S. Each grid cell contains the one month average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. The diagram at https://help.aodn.org.au/satellite-data-product-information/ indicates where this product fits within the GHRSST suite of NOAA/AVHRR products. The SSTfnd is derived by adding a constant 0.17 degC to the SSTskin observations after rejecting observations with low surface wind speeds (<6m/s by day and <2m/s at night) (see http://www.bom.gov.au/amoj/docs/2011/beggs.pdf). Matchups with buoy SSTfnd observations for the central date indicate typical 2014 biases of < 0.03 degC and standard deviations of 0.6 degC. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html and Beggs et al. (2013) at http://imos.org.au/sstdata_references.html for further information.\\n\\nProduction of this single sensor product ceased in June 2025, due to decommissioning of the NOAA-18 satellite. Please refer to the following multi sensor product for data after June 2025 - IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 1 month - day and night time - Australia (https://catalogue-imos.aodn.org.au/geonetwork/srv/eng/catalog.search#/metadata/73e6608c-cbf5-4a01-9c95-1f137de6cbac)"}',
        },
        {
          href: "uuid:d7f3178d-869a-4eac-959d-71d1f5e24888",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 1 day - day and night time - Australia","recordAbstract":"This is a multi-sensor SSTfnd L3S product for a single 24 hour period, derived using sea surface temperature retrievals from the VIIRS sensor on the Suomi-NPP satellite and JPSS series of satellites, and AVHRR sensor on the NOAA and Metop series of Polar-orbiting satellites. The sensors and satellite platforms contributing to each file are listed in the sensor and platform global attributes in the file header. The SSTfnd is derived by adding a constant 0.17 degC to the NOAA AVHRR SSTskin observations, and 0 degC to the Metop and VIIRS SSTsubskin observations, after rejecting observations with low surface wind speeds (<6 m/s by day and <2 m/s at night). The Multi-sensor L3S product is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70E to 170W, 20N to 70S. The quality level for each pixel was remapped using the original ACSPO VIIRS and AVHRR L3U quality levels and Sensor Specific Error Statistics (SSES), as described in Griffin et al. (2017) Appendix at http://imos.org.au/facilities/srs/sstproducts/sstdata0/sstdata-references/, before compositing single swaths from the sensors. Each grid cell contains the 24 hour average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html for further information."}',
        },
        {
          href: "uuid:e3b2531b-a662-43de-9a8b-8e2b385267b3",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 1 month - day time - Australia","recordAbstract":"This is a multi-sensor SSTskin L3S product for 1 month of consecutive day-time periods, derived using sea surface temperature retrievals from the VIIRS sensor on the Suomi-NPP satellite and JPSS series of satellites, and AVHRR sensor on the NOAA and Metop series of Polar-orbiting satellites. The sensors and satellite platforms contributing to each file are listed in the sensor and platform global attributes in the file header. The Multi-sensor L3S product is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70E to 170W, 20N to 70S. The quality level for each pixel was remapped using the original ACSPO VIIRS and AVHRR L3U quality levels and Sensor Specific Error Statistics (SSES), as described in Griffin et al. (2017) Appendix at http://imos.org.au/facilities/srs/sstproducts/sstdata0/sstdata-references/, before compositing single swaths from the sensors. Each grid cell contains the 1 month average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html for further information."}',
        },
        {
          href: "uuid:e1908591-b3cf-42aa-a32f-424322b28165",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 6 day - night time - Australia","recordAbstract":"This is a multi-sensor SSTskin L3S product for six consecutive night-time periods, derived using sea surface temperature retrievals from the VIIRS sensor on the Suomi-NPP satellite and JPSS series of satellites, and AVHRR sensor on the NOAA and Metop series of Polar-orbiting satellites. The sensors and satellite platforms contributing to each file are listed in the sensor and platform global attributes in the file header. The Multi-sensor L3S product is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70E to 170W, 20N to 70S. The quality level for each pixel was remapped using the original ACSPO VIIRS and AVHRR L3U quality levels and Sensor Specific Error Statistics (SSES), as described in Griffin et al. (2017) Appendix at http://imos.org.au/facilities/srs/sstproducts/sstdata0/sstdata-references/, before compositing single swaths from the sensors. Each grid cell contains the 6 night average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html for further information."}',
        },
        {
          href: "uuid:d3e3bce3-adb4-433a-a192-93abc91899d3",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 1 day - night time - Australia","recordAbstract":"This is a multi-sensor SSTskin L3S product for a single night-time period, derived using sea surface temperature retrievals from the VIIRS sensor on the Suomi-NPP satellite and JPSS series of satellites, and AVHRR sensor on the NOAA and Metop series of Polar-orbiting satellites. The sensors and satellite platforms contributing to each file are listed in the sensor and platform global attributes in the file header. The Multi-sensor L3S product is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70E to 170W, 20N to 70S. The quality level for each pixel was remapped using the original ACSPO VIIRS and AVHRR L3U quality levels and Sensor Specific Error Statistics (SSES), as described in Griffin et al. (2017) Appendix at http://imos.org.au/facilities/srs/sstproducts/sstdata0/sstdata-references/, before compositing single swaths from the sensors. Each grid cell contains the 1 night average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html for further information."}',
        },
        {
          href: "uuid:e6782131-821c-4237-b2a9-27c6aaa8608c",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3C - NOAA 19 - 1 day - day time - Australia","recordAbstract":"This is a single sensor, multiple swath SSTskin product for a single day-time period, derived using observations from the AVHRR instrument on the NOAA-XX satellites. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70°E to 170°W, 20°N to 70°S. Only day time passes are included in the product. Each grid cell contains the 1 day average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. The diagram at https://help.aodn.org.au/satellite-data-product-information/ indicates where this product fits within the GHRSST suite of NOAA/AVHRR products. Matchups with buoy SST observations (adjusted to skin depths) indicate typical 2014 biases of < 0.1 degC and standard deviations of 0.5 degC to 0.6 degC for NOAA-18 and NOAA-19. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html and Beggs et al. (2013) at http://imos.org.au/sstdata_references.html for further information."}',
        },
        {
          href: "uuid:f9d6616a-f359-4418-979a-e7b89b5b9086",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Single Sensor - 6 day - night time - Australia","recordAbstract":"This is a single-sensor multi-satellite SSTskin product for six consecutive night-time periods, derived using observations from AVHRR instruments on all available NOAA polar-orbiting satellites. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70°E to 170°W, 20°N to 70°S. Each grid cell contains the 6 night average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. The diagram at https://help.aodn.org.au/satellite-data-product-information/ indicates where this product fits within the GHRSST suite of NOAA/AVHRR products. Matchups with buoy SST observations for the central date (adjusted to skin depths) indicate typical 2014 biases of < 0.05 degC and standard deviations of 0.6 degC. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html and Beggs et al. (2013) at http://imos.org.au/sstdata_references.html for further information.\\n\\nProduction of this single sensor product ceased in June 2025, due to decommissioning of the NOAA-18 satellite. Please refer to the following multi sensor product for data after June 2025 - IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 6 day - night time - Australia (https://catalogue-imos.aodn.org.au/geonetwork/srv/eng/catalog.search#/metadata/e1908591-b3cf-42aa-a32f-424322b28165)"}',
        },
        {
          href: "uuid:fbe4dbce-3435-48df-a054-f0e399886e2b",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Single Sensor - 14 day - day time - Australia","recordAbstract":"This is a multi-sensor SSTskin product for fourteen consecutive day-time periods, derived using observations from AVHRR instruments on all available NOAA polar-orbiting satellites. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70°E to 170°W, 20°N to 70°S. Each grid cell contains the 14 day average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. The diagram at https://help.aodn.org.au/satellite-data/product-information/ indicates where this product fits within the GHRSST suite of NOAA/AVHRR products. Matchups with buoy SST observations for the central date (adjusted to skin depths) indicate typical 2014 biases of < 0.3 degC and standard deviations of 0.7 degC. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html and Beggs et al. (2013) at http://imos.org.au/sstdata_references.html for further information.\\n\\nProduction of this product ceased in 2018."}',
        },
        {
          href: "uuid:f07c3d3f-547b-4818-9d2f-12e872c7e158",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 6 day - day time - Australia","recordAbstract":"This is a multi-sensor SSTskin L3S product for 6 consecutive day-time periods, derived using sea surface temperature retrievals from the VIIRS sensor on the Suomi-NPP satellite and JPSS series of satellites, and AVHRR sensor on the NOAA and Metop series of Polar-orbiting satellites. The sensors and satellite platforms contributing to each file are listed in the sensor and platform global attributes in the file header. The Multi-sensor L3S product is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70E to 170W, 20N to 70S. The quality level for each pixel was remapped using the original ACSPO VIIRS and AVHRR L3U quality levels and Sensor Specific Error Statistics (SSES), as described in Griffin et al. (2017) Appendix at http://imos.org.au/facilities/srs/sstproducts/sstdata0/sstdata-references/, before compositing single swaths from the sensors. Each grid cell contains the 6 day average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html for further information."}',
        },
        {
          href: "uuid:023ae12a-8c0c-4abc-997a-7884f9fec9cd",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Single Sensor - 6 day - day and night time - Australia","recordAbstract":"This is a single-sensor multi-satellite SSTfnd product for a 144 hour period, derived using observations from AVHRR instruments on all available NOAA polar-orbiting satellites. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70°E to 170°W, 20°N to 70°S. Each grid cell contains the 144 hour average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. The diagram at https://help.aodn.org.au/satellite-data-product-information/ indicates where this product fits within the GHRSST suite of NOAA/AVHRR products. The SSTfnd is derived by adding a constant 0.17 degC to the SSTskin observations after rejecting observations with low surface wind speeds (<6m/s by day and <2m/s at night) (see http://www.bom.gov.au/amoj/docs/2011/beggs.pdf). Matchups with buoy SSTfnd observations for the central date indicate typical 2014 biases of < 0.03 degC and standard deviations of 0.6 degC. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html and Beggs et al. (2013) at http://imos.org.au/sstdata_references.html for further information.\\n\\nProduction of this single sensor product ceased in June 2025, due to decommissioning of the NOAA-18 satellite. Please refer to the following multi sensor product for data after June 2025 - IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 6 day - day and night time - Australia (https://catalogue-imos.aodn.org.au/geonetwork/srv/eng/catalog.search#/metadata/95b81267-bad2-4939-8559-45b0d0c6f2e9)"}',
        },
        {
          href: "uuid:08e04227-4da1-479b-bec1-06ee27a69a40",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 3 day - day time - Australia","recordAbstract":"This is a multi-sensor SSTskin L3S product for three consecutive day-time periods, derived using sea surface temperature retrievals from the VIIRS sensor on the Suomi-NPP satellite and JPSS series of satellites, and AVHRR sensor on the NOAA and Metop series of Polar-orbiting satellites. The sensors and satellite platforms contributing to each file are listed in the sensor and platform global attributes in the file header. The Multi-sensor L3S product is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70E to 170W, 20N to 70S. The quality level for each pixel was remapped using the original ACSPO VIIRS and AVHRR L3U quality levels and Sensor Specific Error Statistics (SSES), as described in Griffin et al. (2017) Appendix at http://imos.org.au/facilities/srs/sstproducts/sstdata0/sstdata-references/, before compositing single swaths from the sensors. Each grid cell contains the 3 day average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html for further information."}',
        },
        {
          href: "uuid:165a23d7-5ef3-4cab-9e02-90c8adb941dd",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Single Sensor - 1 day - day and night time - Southern Ocean","recordAbstract":"This is a single-sensor SSTfnd product for a single 24 hour period, derived using observations from AVHRR instruments on all available NOAA polar-orbiting satellites. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the Southern Ocean region 3°E to 158°W, 27°S to 78°S. Each grid cell contains the 24 hour average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. The diagram at https://help.aodn.org.au/satellite-data-product-information/ indicates where this product fits within the GHRSST suite of NOAA/AVHRR products. The SSTfnd is derived by adding a constant 0.17 degC to the SSTskin observations after rejecting observations with low surface wind speeds (<6m/s by day and <2m/s at night) (see http://www.bom.gov.au/amoj/docs/2011/beggs.pdf). Matchups with buoy SSTfnd observations indicate typical 2014 biases of < 0.01 degC and standard deviations of 0.6 degC. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html and Beggs et al. (2013) at http://imos.org.au/sstdata_references.html for further information.\\n\\nProduction of this single sensor product ceased in June 2025, due to decommissioning of the NOAA-18 satellite. Please refer to the following multi sensor product for data after June 2025 - IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 1 day - day and night time - Southern Ocean (https://catalogue-imos.aodn.org.au/geonetwork/srv/eng/catalog.search#/metadata/4a136fc6-3ac7-4af1-870f-f5827d6dfcb4)."}',
        },
        {
          href: "uuid:18a2dca4-2c18-4d45-8ae5-55b1c0bd38c8",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Single Sensor - 3 day - night time - Australia","recordAbstract":"This is a single-sensor multi-satellite SSTskin product for three consecutive night-time periods, derived using observations from AVHRR instruments on all available NOAA polar-orbiting satellites. It is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70°E to 170°W, 20°N to 70°S. Each grid cell contains the 3 night average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. The diagram at https://help.aodn.org.au/satellite-data/product-information/ indicates where this product fits within the GHRSST suite of NOAA/AVHRR products. Matchups with buoy SST observations for the central date (adjusted to skin depths) indicate typical 2014 biases of < 0.02 degC and standard deviations of 0.6 degC. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html and Beggs et al. (2013) at http://imos.org.au/sstdata_references.html for further information.\\n\\nProduction of this single sensor product ceased in June 2025, due to decommissioning of the NOAA-18 satellite. Please refer to the following multi sensor product for data after June 2025 - IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 3 day - night time - Australia (https://catalogue-imos.aodn.org.au/geonetwork/srv/eng/catalog.search#/metadata/b28ab00c-06f9-4cef-9053-4ff3bf537bb7)"}',
        },
        {
          href: "uuid:1aa787da-a9ba-494a-ae22-0c3eee2491e1",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - SST - L3S - Multi Sensor - 1 month - night time - Australia","recordAbstract":"This is a multi-sensor SSTskin L3S product for 1 month of consecutive night-time periods, derived using sea surface temperature retrievals from the VIIRS sensor on the Suomi-NPP satellite and JPSS series of satellites, and AVHRR sensor on the NOAA and Metop series of Polar-orbiting satellites. The sensors and satellite platforms contributing to each file are listed in the sensor and platform global attributes in the file header. The Multi-sensor L3S product is provided as a 0.02deg x 0.02deg cylindrical equidistant projected map over the region 70E to 170W, 20N to 70S. The quality level for each pixel was remapped using the original ACSPO VIIRS and AVHRR L3U quality levels and Sensor Specific Error Statistics (SSES), as described in Griffin et al. (2017) Appendix at http://imos.org.au/facilities/srs/sstproducts/sstdata0/sstdata-references/, before compositing single swaths from the sensors. Each grid cell contains the 1 month average of all the highest available quality SSTs that overlap with that cell, weighted by the area of overlap. Refer to the IMOS SST products web page at http://imos.org.au/sstproducts.html for further information."}',
        },
        {
          href: '"https://nbviewer.org/github/aodn/aodn_cloud_optimised/blob/main/notebooks/satellite_ghrsst_l4_gamssa_1day_multi_sensor_world.ipynb"',
          rel: "related",
          type: "application/x-ipynb+json",
          title: "Python notebook example",
          "ai:group": "Python Notebook",
        },
        {
          href: "http://localhost:8080/api/v1/ogc/collections/2d496463-600c-465a-84a1-8a4ab76bd505/items/summary",
          rel: "summary",
          type: "application/x-zarr",
          title: "Summary",
        },
      ],
      extent: {
        spatial: {
          bbox: [
            [-180.0, -80.0, 180.0, 80.0],
            [-180.0, -80.0, 180.0, 80.0],
          ],
          crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        },
        temporal: {
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {
        status: "onGoing",
      },
      id: "35234913-aa3c-48ec-b9a4-77f822f66ef8",
      title:
        "IMOS - SOOP Expendable Bathythermographs (XBT) Research Group - XBT real-time data",
      description:
        "XBT real-time data is available through the IMOS portal. Data is acquired by technicians who ride the ships of opportunity in order to perform high density sampling along well established transit lines. The data acquisition system used is the Quoll developed by Turo Technology. Data collected and is stored in netcdf files, with real-time data messages (JJVV bathy messages) created on the ship and sent to shore by iridium sbd. This is inserted onto the GTS by our colleagues at the Australian Bureau of Meteorology. The full resolution data is collected from the ship and returned for processing to scientists at CSIRO in Hobart. It undergoes a full scientific QC process which identifies both bad data and oceanic features such as eddies, fronts and temperature inversions. Finally, the data is distributed to the GTSPP global data acquisition centre in Washington DC where it is made freely available to all. This SOOP dataset covers waters around Australia and across to New Zealand.",
      links: [
        {
          href: "http://imos.org.au/expendablebathythermograph.html",
          rel: "related",
          type: "text/html",
          title: "Link to Expendable Bathythermograph page on IMOS website",
          "ai:group": "Other",
        },
        {
          href: "https://catalogue-imos.aodn.org.au:443/geonetwork/srv/api/records/35234913-aa3c-48ec-b9a4-77f822f66ef8/attachments/Devil_Data_Formats.pdf",
          rel: "data",
          type: "",
          title: "Devil_Data_Formats.pdf",
          "ai:group": "Document",
        },
        {
          href: "http://content.aodn.org.au/Documents/IMOS/Facilities/ships_of_opportunity/IMOS_XBT_realtime_data_delivery_GTS.pdf",
          rel: "related",
          type: "text/html",
          title:
            "PDF document describing the delivery of XBT data in realtime to the AODN and the GTS",
          "ai:group": "Document",
        },
        {
          href: "http://data.aodn.org.au/?prefix=IMOS/SOOP/SOOP-XBT/REALTIME/",
          rel: "related",
          type: "text/html",
          title: "Files via Amazon Web Services S3 storage",
          "ai:group": "Other",
        },
        {
          href: "https://portal.aodn.org.au/search?uuid=35234913-aa3c-48ec-b9a4-77f822f66ef8",
          rel: "related",
          type: "text/html",
          title: "View and download data though the AODN Portal",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/wms",
          rel: "wms",
          type: "",
          title: "imos:soop_xbt_nrt_profiles_map",
          "ai:group": "Data Access > wms",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/ows",
          rel: "wfs",
          type: "",
          title: "soop_xbt_nrt_profiles_data",
          "ai:group": "Data Access > wfs",
        },
        {
          href: "https://help.aodn.org.au/web-services/ogc-wfs/",
          rel: "related",
          type: "text/html",
          title: "OGC WFS help documentation",
          "ai:group": "Document",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/ows",
          rel: "IMOS:AGGREGATION--bodaac",
          type: "",
          title: "soop_xbt_nrt_profiles_map#url",
        },
        {
          href: "https://help.aodn.org.au/web-services/ncurllist-service/",
          rel: "related",
          type: "text/html",
          title: "ncUrlList help documentation",
        },
        {
          href: "https://registry.opendata.aws/aodn_vessel_xbt_realtime_nonqc/",
          rel: "related",
          type: "text/html",
          title:
            "Access To AWS Open Data Program registry for the Cloud Optimised version of this dataset",
          "ai:group": "Data Access > aws",
        },
        {
          href: "https://github.com/aodn/aodn_cloud_optimised/blob/main/notebooks/vessel_xbt_realtime_nonqc.ipynb",
          rel: "related",
          type: "application/x-ipynb+json",
          title:
            "Access to Jupyter notebook to query Cloud Optimised converted dataset",
          "ai:group": "Python Notebook",
        },
        {
          href: "https://geonetwork.edge.aodn.org.au:443/geonetwork/images/logos/2976cf80-3906-41aa-8916-4adfbc507438.png",
          rel: "icon",
          type: "image/png",
          title: "Suggest icon for dataset",
        },
        {
          href: "https://catalogue-imos.aodn.org.au:443/geonetwork/srv/api/records/35234913-aa3c-48ec-b9a4-77f822f66ef8",
          rel: "describedby",
          type: "text/html",
          title: "Full metadata link",
        },
        {
          href: "https://licensebuttons.net/l/by/4.0/88x31.png",
          rel: "license",
          type: "image/png",
        },
        {
          href: "http://creativecommons.org/licenses/by/4.0/",
          rel: "license",
          type: "text/html",
        },
        {
          href: "uuid:190c2c53-5d0f-46be-b2ed-fd08313386e5",
          rel: "parent",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP Expendable Bathythermographs (XBT) Research Group","recordAbstract":"IMOS Ship of Opportunity Underway Expendable Bathythermographs (XBT) group is a research and data collection project working within the IMOS Ship of Opportunity Multi-Disciplinary Underway Network sub-facility.\\n\\nFive major (HRX) high-resolution XBT lines provide boundary to boundary profiling and closely spaced sampling to resolve mesoscale eddies, fronts and boundary currents. The lines are repeated 4 times per year by an on-board technician. The routes sample each major boundary current system using available commercial vessel traffic. All of the transects transmit data in real-time."}',
        },
        {
          href: "uuid:40248cb4-09a5-41de-8790-504a1ed8e997",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected on the line IX15-IX31 (Mauritius - Fremantle - Melbourne)","recordAbstract":"This dataset contains temperature data obtained from XBTs (expendable bathythermographs) deployed by vessels during different cruises between Mauritius, Fremantle (Australia) and Melbourne (Australia).\\n\\nExpendable Bathythermographs (XBTs) have been used for many years by oceanographers to measure the temperature of the upper ocean. These instruments are simple devices which are designed to be deployed from moving vessels, enabling broad scale coverage of the world\'s oceans."}',
        },
        {
          href: "uuid:486d8463-36b3-47b1-a8d5-f73139cbdd16",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected on the line PX13 (New Zealand- California)","recordAbstract":"This dataset contains temperature data obtained from XBTs (expendable bathythermographs) deployed by vessels during different cruises between New Zealand and California (USA).\\n\\nExpendable Bathythermographs (XBTs) have been used for many years by oceanographers to measure the temperature of the upper ocean. These instruments are simple devices which are designed to be deployed from moving vessels, enabling broad scale coverage of the world\'s oceans."}',
        },
        {
          href: "uuid:55b6a183-e942-424e-b3bd-476dfb284fc0",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected in the Tasman Sea","recordAbstract":"This dataset contains temperature data obtained from XBTs (expendable bathythermographs) deployed by vessels during different cruises in the Tasman Sea.\\n\\nExpendable Bathythermographs (XBTs) have been used for many years by oceanographers to measure the temperature of the upper ocean. These instruments are simple devices which are designed to be deployed from moving vessels, enabling broad scale coverage of the world\'s oceans."}',
        },
        {
          href: "uuid:562edcbc-a5fa-4122-9167-60e8f6768e33",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected on the line IX1 (Fremantle-Sunda Strait)","recordAbstract":"Temperature data from the TOGA/WOCE transect IX1 from Fremantle to Sunda Strait has been collected since 1983 and are ongoing. The transect is repeated approximately 18 times a year with profiles obtained approximately every 50-100 Km. \\nThe data are obtained from XBTs (expendable bathythermographs) deployed vie marchant vessels, and are managed by the Joint Australian Facility for Ocean Observing Systems (JAFOOS), a collaborative venture between CSIRO Marine Research and the Bureau of Meteorology Research Centre (BMRC)."}',
        },
        {
          href: "uuid:5c0aa127-40d7-4c1a-a936-a80d624f8bf0",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected on the line PX5 (Brisbane - Japan and New Zealand- Japan)","recordAbstract":"This dataset contains temperature data obtained from XBTs (expendable bathythermographs) deployed by vessels during different cruises between Brisbane (Australia) and Japan AND between New Zealand and Japan.\\n\\nExpendable Bathythermographs (XBTs) have been used for many years by oceanographers to measure the temperature of the upper ocean. These instruments are simple devices which are designed to be deployed from moving vessels, enabling broad scale coverage of the world\'s oceans."}',
        },
        {
          href: "uuid:6159cfe9-fc3e-46d2-9fd8-fe407b24944e",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected on the high density line IX28 (Dumont d\'Urville-Hobart)","recordAbstract":"Temperature data from the TOGA/WOCE transect IX28 across the Southern Ocean has been collected since 1992 and are ongoing. The transect is repeated approximately 6 times a year in the Austral summer, with profiles obtained approximately every 10-50 Km. The data are obtained from XBTs (expendable bathythermographs) deployed by the French Antarctic resupply vessel L\'Astrolabe, and are managed by the French Polar Institute (IPEV) and the Joint Australian Facility for Ocean Observing Systems (JAFOOS), a collaborative venture between CSIRO Marine Research and the Bureau of Meteorology Research Centre (BMRC)."}',
        },
        {
          href: "uuid:74861aae-7e5c-4ebd-9bc4-d10b0bf2c5c4",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected on the line PX55 (Melbourne - Wellington)","recordAbstract":"This dataset contains temperature data obtained from XBTs (expendable bathythermographs) deployed by vessels during different cruises between Melbourne (Australia) and Wellington (New Zealand).\\n\\nExpendable Bathythermographs (XBTs) have been used for many years by oceanographers to measure the temperature of the upper ocean. These instruments are simple devices which are designed to be deployed from moving vessels, enabling broad scale coverage of the world\'s oceans."}',
        },
        {
          href: "uuid:75fd5ac5-180b-463f-aa76-6ce4f0a13345",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected in the Indian Ocean","recordAbstract":"This dataset contains temperature data obtained from XBTs (expendable bathythermographs) deployed by vessels during different cruises in the Indian Ocean.\\n\\nExpendable Bathythermographs (XBTs) have been used for many years by oceanographers to measure the temperature of the upper ocean. These instruments are simple devices which are designed to be deployed from moving vessels, enabling broad scale coverage of the world\'s oceans."}',
        },
        {
          href: "uuid:78aa4a11-f448-4a91-a24b-3fc13045a902",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected on the line PX2 (across the Banda Sea)","recordAbstract":"Temperature data from the TOGA/WOCE transect PX2 across the Banda Sea (Flores Sea - Torres Strait) has been collected since 1983 and are ongoing. The transect is repeated approximately 12 times a year with profiles obtained approximately every 50-100 Km. \\nThe data are obtained from XBTs (expendable bathythermographs) deployed vie marchant vessels, and are managed by the Joint Australian Facility for Ocean Observing Systems (JAFOOS), a collaborative venture between CSIRO Marine Research and the Bureau of Meteorology Research Centre (BMRC)."}',
        },
        {
          href: "uuid:7d3a2249-6f9a-4dc9-8bbb-354009f5b254",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected on the line PX17 (Tahiti - Panama)","recordAbstract":"This dataset contains temperature data obtained from XBTs (expendable bathythermographs) deployed by vessels during different cruises between Tahiti and Panama.\\n\\nExpendable Bathythermographs (XBTs) have been used for many years by oceanographers to measure the temperature of the upper ocean. These instruments are simple devices which are designed to be deployed from moving vessels, enabling broad scale coverage of the world\'s oceans."}',
        },
        {
          href: "uuid:937111f2-21e8-45e8-81d5-032a7c8b0c81",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected on the high density line PX34 (Sydney-Wellington)","recordAbstract":"Temperature data from the TOGA/WOCE transect PX34 across the Tasman Sea has been collected since 1991 and are ongoing. The transect is repeated approximately 4 times a year, with profiles obtained approximately every 10-50 Km. \\nThe data are obtained from XBTs (expendable bathythermographs) deployed via merchant vessels, and are managed by the Joint Australian Facility for Ocean Observing Systems (JAFOOS), a collaborative venture between CSIRO Marine Research and the Bureau of Meteorology Research Centre (BMRC)."}',
        },
        {
          href: "uuid:82bf07d2-6a6f-412e-b02e-1b96c204a009",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected during a cruise between Sydney and Noumea (New Caledonia)","recordAbstract":"This dataset contains temperature data obtained from XBTs (expendable bathythermographs) deployed during a cruise between Sydney and Noumea (New Caledonia)."}',
        },
        {
          href: "uuid:8be275bb-6951-45cd-9dd1-0c5adffd1ec6",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected on the line IX22-PX11 (Port Hedland - Japan)","recordAbstract":"Temperature data from the TOGA/WOCE transect IX22/PX11 from Port Hedland to Japan has been collected since 1983 and are ongoing. The transect is repeated approximately 12 times a year with profiles obtained approximately every 50-100 Km. \\nThe data are obtained from XBTs (expendable bathythermographs) deployed vie marchant vessels, and are managed by the Joint Australian Facility for Ocean Observing Systems (JAFOOS), a collaborative venture between CSIRO Marine Research and the Bureau of Meteorology Research Centre (BMRC)."}',
        },
        {
          href: "uuid:9b462449-329b-4d0b-8af6-af1c35959869",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected on the line PX57 (Brisbane - Wellington)","recordAbstract":"This dataset contains temperature data obtained from XBTs (expendable bathythermographs) deployed by vessels during different cruises between Brisbane (Australia) and Wellington (New Zealand).\\n\\nExpendable Bathythermographs (XBTs) have been used for many years by oceanographers to measure the temperature of the upper ocean. These instruments are simple devices which are designed to be deployed from moving vessels, enabling broad scale coverage of the world\'s oceans."}',
        },
        {
          href: "uuid:b4f241f5-a5d8-4365-8b69-41dc48879c6c",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected on the line IX8 (Mauritius - Bombay)","recordAbstract":"This dataset contains temperature data obtained from XBTs (expendable bathythermographs) deployed by vessels during different cruises between Mauritius and Bombay (India).\\n\\nExpendable Bathythermographs (XBTs) have been used for many years by oceanographers to measure the temperature of the upper ocean. These instruments are simple devices which are designed to be deployed from moving vessels, enabling broad scale coverage of the world\'s oceans."}',
        },
        {
          href: "uuid:b36e91b1-7cdf-491d-8685-1e91312b94c8",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected on the line IX21-IX06 (Cape of Good Hope - Mauritius - Malacca Strait)","recordAbstract":"This dataset contains temperature data obtained from XBTs (expendable bathythermographs) deployed by vessels during different cruises between the Cape of Good Hope (South Africa), Mauritius and the Malacca Strait.\\n\\nExpendable Bathythermographs (XBTs) have been used for many years by oceanographers to measure the temperature of the upper ocean. These instruments are simple devices which are designed to be deployed from moving vessels, enabling broad scale coverage of the world\'s oceans."}',
        },
        {
          href: "uuid:c1ec90fe-c89f-429c-a897-1c1583b22394",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected on the line IX12 (Fremantle-Red Sea)","recordAbstract":"Temperature data from the TOGA/WOCE transect IX12 from Fremantle to the Red Sea has been collected since 1983 and are ongoing. The transect is repeated approximately 12-15 times a year with profiles obtained approximately every 50-100 Km. \\nThe data are obtained from XBTs (expendable bathythermographs) deployed vie marchant vessels, and are managed by the Joint Australian Facility for Ocean Observing Systems (JAFOOS), a collaborative venture between CSIRO Marine Research and the Bureau of Meteorology Research Centre (BMRC)."}',
        },
        {
          href: "uuid:c7831608-9a2a-4eec-881d-4b632858a4bc",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected on the line IX9 (Fremantle-Persian Gulf) November 1985 - January 1996.","recordAbstract":"This dataset contains temperature data from the TOGA/WOCE transect IX9 across the Indian Ocean, between Fremantle and the Persian Gulf. Data have been collected since November 1985 until January 1996. The transect is repeated approximately monthly. Profiles are obtained approximately every 60km (a 1 degree latitude / 1.5 degree longitude grid). \\n\\nThe data are obtained from XBTs (expendable bathythermographs) deployed via the Ship-of-Opportunity Program (SOOP) of the IOC/WMO Integrated Global Ocean Services System (IGOSS), and are now managed by the Joint Australian Facility for Ocean Observing Systems (JAFOOS), a collaborative venture between CSIRO Marine Research and the Bureau of Meteorology Research Centre (BMRC).\\n\\nExpendable Bathythermographs (XBTs) have been used for many years by oceanographers to measure the temperature of the upper ocean. These instruments are simple devices which are designed to be deployed from moving vessels, enabling broad scale coverage of the world\'s oceans."}',
        },
        {
          href: "uuid:ebf306f3-e4df-4b2f-8df5-7e143b1bef29",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected on the line IX22 (Fremantle-Flores Sea)","recordAbstract":"This dataset contains temperature data from the TOGA/WOCE transect IX22 from Fremantle to Flores Sea.\\nThe data are obtained from XBTs (expendable bathythermographs) deployed vie marchant vessels, and are managed by the Joint Australian Facility for Ocean Observing Systems (JAFOOS), a collaborative venture between CSIRO Marine Research and the Bureau of Meteorology Research Centre (BMRC)."}',
        },
        {
          href: "uuid:fb42c8b8-1006-4ec6-b347-1a36e80c1f5a",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected in the Southern Ocean","recordAbstract":"This dataset contains temperature data obtained from XBTs (expendable bathythermographs) deployed by vessels during different cruises in the Southern Ocean.\\n\\nExpendable Bathythermographs (XBTs) have been used for many years by oceanographers to measure the temperature of the upper ocean. These instruments are simple devices which are designed to be deployed from moving vessels, enabling broad scale coverage of the world\'s oceans."}',
        },
        {
          href: "uuid:e537589d-4ae1-4ab4-818b-31708491901e",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected on the line PX6 (Suva, Fiji- Auckland, New Zealand)","recordAbstract":"This dataset contains temperature data obtained from XBTs (expendable bathythermographs) deployed by vessels during different cruises between Suva (Fiji) and Auckland (New Zealand).\\n\\nExpendable Bathythermographs (XBTs) have been used for many years by oceanographers to measure the temperature of the upper ocean. These instruments are simple devices which are designed to be deployed from moving vessels, enabling broad scale coverage of the world\'s oceans."}',
        },
        {
          href: "uuid:dd85beec-6ad4-4a3a-94bf-b5c39d17ecb5",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected on the line IX15 (Mauritius - Fremantle)","recordAbstract":"This dataset contains temperature data obtained from XBTs (expendable bathythermographs) deployed by vessels during different cruises between Mauritius and Fremantle (Australia).\\n\\nExpendable Bathythermographs (XBTs) have been used for many years by oceanographers to measure the temperature of the upper ocean. These instruments are simple devices which are designed to be deployed from moving vessels, enabling broad scale coverage of the world\'s oceans."}',
        },
        {
          href: "uuid:e0df3463-b68a-4a3f-873e-30bc562d4222",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected on the line PX35 (Melbourne - Dunedin)","recordAbstract":"This dataset contains temperature data obtained from XBTs (expendable bathythermographs) deployed by vessels during different cruises between Melbourne (Australia) and Dunedin (New Zealand).\\n\\nExpendable Bathythermographs (XBTs) have been used for many years by oceanographers to measure the temperature of the upper ocean. These instruments are simple devices which are designed to be deployed from moving vessels, enabling broad scale coverage of the world\'s oceans."}',
        },
        {
          href: "uuid:e7520889-b939-4109-bf3f-5cfdcf30f870",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected on the high density line PX30/31 (Brisbane-Noumea-Suva/Lautoka)","recordAbstract":"Temperature data from the TOGA/WOCE transect PX30/31 across the Pacific Ocean has been collected since 1991 and are ongoing. The transect is repeated approximately 4 times a year, with profiles obtained approximately every 10-50 Km. \\nThe data are obtained from XBTs (expendable bathythermographs) deployed via merchant vessels, and are managed by the Joint Australian Facility for Ocean Observing Systems (JAFOOS), a collaborative venture between CSIRO Marine Research and the Bureau of Meteorology Research Centre (BMRC)."}',
        },
        {
          href: "uuid:cecf39f4-9cc2-4ff2-9134-f6adaf65b846",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected on the line PX33 (Hobart - Macquarie Island)","recordAbstract":"Temperature data from the TOGA/WOCE transect PX33 between Hobart and Macquarie Island has been collected since december 1992 and are ongoing. The transect is repeated irregularly.\\nThe data are obtained from XBTs (expendable bathythermographs) deployed by the French Antarctic resupply vessel L\'Astrolabe, and are managed by the French Polar Institute (IPEV) and the Joint Australian Facility for Ocean Observing Systems (JAFOOS), a collaborative venture between CSIRO Marine Research and the Bureau of Meteorology Research Centre (BMRC)."}',
        },
        {
          href: "uuid:911f6b96-fa33-4621-9d8c-4d1cc14d94d0",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - SOOP Expendable Bathythermographs (XBT) Research Group - XBT delayed mode data","recordAbstract":"IMOS Ship of Opportunity Underway Expendable Bathythermographs (XBT) group is a research and data collection project working within the IMOS Ship of Opportunity Multi-Disciplinary Underway Network sub-facility. Five major (HRX) high-resolution XBT lines provide boundary to boundary profiling and closely spaced sampling to resolve mesoscale eddies, fronts and boundary currents. The lines are repeated 4 times per year by an on-board technician. The routes sample each major boundary current system using available commercial vessel traffic. All of the transects transmit data in real-time. The data represented by this record are presented in delayed mode. This SOOP dataset covers the Indian Ocean, Southern Ocean and Pacific Oceans."}',
        },
        {
          href: "uuid:0659b103-0843-4b18-8d16-f0fb59eae536",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected on the line PX3 (Coral Sea)","recordAbstract":"This dataset contains temperature data from the TOGA/WOCE line PX3 in the Coral Sea. \\n\\nThe data were obtained from XBTs (expendable bathythermographs) deployed via the vessel Nimos, and are now managed by the Joint Australian Facility for Ocean Observing Systems (JAFOOS), a collaborative venture between CSIRO Marine Research and the Bureau of Meteorology Research Centre (BMRC). \\n\\nExpendable Bathythermographs (XBTs) have been used for many years by oceanographers to measure the temperature of the upper ocean. These instruments are simple devices which are designed to be deployed from moving vessels, enabling broad scale coverage of the world\'s oceans."}',
        },
        {
          href: "uuid:0443254b-fd39-468f-923f-1469f8caa9aa",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected on the line IX21 (Cape of Good Hope - Mauritius)","recordAbstract":"This dataset contains temperature data obtained from XBTs (expendable bathythermographs) deployed by vessels during different cruises between Cape of Good Hope and Mauritius.\\n\\nExpendable Bathythermographs (XBTs) have been used for many years by oceanographers to measure the temperature of the upper ocean. These instruments are simple devices which are designed to be deployed from moving vessels, enabling broad scale coverage of the world\'s oceans."}',
        },
        {
          href: "uuid:2a347914-9786-4cb0-872d-9d436735d53d",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS SOOP-XBT Upper Ocean Thermal Data collected on the line PX28 (Tahiti - Auckland)","recordAbstract":"This dataset contains temperature data obtained from XBTs (expendable bathythermographs) deployed by vessels during different cruises between Tahiti and Auckland (New Zealand).\\n\\nExpendable Bathythermographs (XBTs) have been used for many years by oceanographers to measure the temperature of the upper ocean. These instruments are simple devices which are designed to be deployed from moving vessels, enabling broad scale coverage of the world\'s oceans."}',
        },
        {
          href: '"https://nbviewer.org/github/aodn/aodn_cloud_optimised/blob/main/notebooks/vessel_xbt_realtime_nonqc.ipynb"',
          rel: "related",
          type: "application/x-ipynb+json",
          title: "Python notebook example",
          "ai:group": "Python Notebook",
        },
        {
          href: "http://localhost:8080/api/v1/ogc/collections/35234913-aa3c-48ec-b9a4-77f822f66ef8/items/summary",
          rel: "summary",
          type: "application/x-parquet",
          title: "Summary",
        },
      ],
      extent: {
        spatial: {
          bbox: [
            [128.0, -68.0, 180.0, -8.0],
            [130.0, -10.0, 132.0, -8.0],
            [148.0, -40.0, 150.0, -38.0],
            [150.0, -42.0, 180.0, -16.0],
            [128.0, -68.0, 160.0, -42.0],
          ],
          crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        },
        temporal: {
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {
        status: "completed",
      },
      id: "19da2ce7-138f-4427-89de-a50c724f5f54",
      title:
        "IMOS - Ocean Radar - South Australia Gulfs HF ocean radar site (South Australia, Australia) - Delayed mode wave",
      description:
        "The South Australia Gulfs (SAG) HF ocean radar system covers the area of about 40,000 square kilometres bounded by Kangaroo Island to the east and the Eyre Peninsula to the north.  This is a dynamic region where warm water from the remnants of the Leeuwin current is moving from the west, and water with varying density is exchanging with Spencer Gulf and the Gulf of St Vincent.  Upwelling events occur from the deep ocean on the south side of the observation area.  This is a key ocean area for aquaculture and fishing, and is a major shipping thoroughfare.  The data from this HF ocean radar system link the dynamics of the Great Australian Bight to the Bonney Coast and on to Tasmania. \n\nSpecific research questions identified by the SA Node of IMOS are: What is the detailed connection between shelf currents and the Flinders Current to non-regional influences (e.g. Southern Ocean, WA)?  What is the nature of oceanic currents and processes (e.g. wave drift, mixing, eddies) that drive both winter and summer cross and along shelf exchange including the summertime upwelling systems and flushing of the gulfs?  How does the ocean circulation, wave drift, eddies and environmental variability affect the distribution of sediments, nutrients, the production of lower trophic levels\n(phytoplankton and zooplankton), the dispersal of larvae that underpin productive fisheries in the region and the effects of environment on aquaculture\n\nThe SAG HF ocean radar is a WERA phased array system with 16-element receive arrays located at Cape Wiles (34.943 S, 135.681 E) and Cape Spencer (35.294 S, 136.879 E).  These radars operate at a frequency of 8.512 MHz, with a bandwidth of 33 KHz and a maximum range of 200 Km.  Within the HF radar coverage area surface currents are measured.  Data are also collected from which wind directions and significant wave height can be calculated.  \n\nMost of the capital was contributed by the South Australia Research and Development Institute.",
      links: [
        {
          href: "http://imos.org.au/facilities/oceanradar",
          rel: "related",
          type: "text/html",
          title: "Ocean Radar page on IMOS website",
          "ai:group": "Other",
        },
        {
          href: "https://thredds.aodn.org.au/thredds/catalog/IMOS/ACORN/gridded_1h-avg-wave-site-map_QC/SAG/catalog.html",
          rel: "related",
          type: "text/html",
          title: "NetCDF files via THREDDS catalog",
          "ai:group": "Data Access > thredds",
        },
        {
          href: "http://content.aodn.org.au/Documents/IMOS/Facilities/ocean_radar/QC_procedures_for_IMOS_Ocean_Radar_manual_LATEST.pdf",
          rel: "related",
          type: "text/html",
          title: "Quality Control procedures for IMOS Ocean Radar Manual",
          "ai:group": "Document",
        },
        {
          href: "https://portal.aodn.org.au/search?uuid=19da2ce7-138f-4427-89de-a50c724f5f54",
          rel: "related",
          type: "text/html",
          title: "View and download data though the AODN Portal",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/ncwms",
          rel: "wms",
          type: "",
          title: "acorn_wave_site_qc_sag_url/VAVH",
          "ai:group": "Data Access > wms",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/ncwms",
          rel: "wms",
          type: "",
          title: "acorn_wave_site_qc_sag_url/VDIRT",
          "ai:group": "Data Access > wms",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/ows",
          rel: "IMOS:AGGREGATION--bodaac",
          type: "",
          title: "acorn_wave_site_qc_sag_url#file_url",
        },
        {
          href: "https://help.aodn.org.au/web-services/ncurllist-service/",
          rel: "related",
          type: "text/html",
          title: "ncUrlList help documentation",
        },
        {
          href: "https://processes.aodn.org.au/wps",
          rel: "OGC:WPS--gogoduck",
          type: "",
          title: "acorn_wave_site_qc_sag_url",
        },
        {
          href: "https://help.aodn.org.au/web-services/gogoduck-aggregator/",
          rel: "related",
          type: "text/html",
          title: "GoGoDuck help documentation",
        },
        {
          href: "https://registry.opendata.aws/aodn_radar_southaustraliagulfs_wave_delayed_qc/",
          rel: "related",
          type: "text/html",
          title:
            "Access To AWS Open Data Program registry for the Cloud Optimised version of this dataset",
          "ai:group": "Data Access > aws",
        },
        {
          href: "https://github.com/aodn/aodn_cloud_optimised/blob/main/notebooks/radar_SouthAustraliaGulfs_wave_delayed_qc.ipynb",
          rel: "related",
          type: "application/x-ipynb+json",
          title:
            "Access to Jupyter notebook to query Cloud Optimised converted dataset",
          "ai:group": "Python Notebook",
        },
        {
          href: "https://geonetwork.edge.aodn.org.au:443/geonetwork/images/logos/2976cf80-3906-41aa-8916-4adfbc507438.png",
          rel: "icon",
          type: "image/png",
          title: "Suggest icon for dataset",
        },
        {
          href: "https://catalogue-imos.aodn.org.au:443/geonetwork/srv/api/records/19da2ce7-138f-4427-89de-a50c724f5f54",
          rel: "describedby",
          type: "text/html",
          title: "Full metadata link",
        },
        {
          href: "https://licensebuttons.net/l/by/4.0/88x31.png",
          rel: "license",
          type: "image/png",
        },
        {
          href: "http://creativecommons.org/licenses/by/4.0/",
          rel: "license",
          type: "text/html",
        },
        {
          href: "uuid:c95de3c2-1edb-41a6-8525-935434405fcc",
          rel: "parent",
          type: "application/json",
          title:
            '{"title":"IMOS - Ocean Radar - South Australia Gulfs HF ocean radar site (South Australia, Australia)","recordAbstract":"The South Australia Gulfs (SAG) HF ocean radar system covers the area of about 40,000 square kilometres bounded by Kangaroo Island to the east and the Eyre Peninsula to the north. This is a dynamic region where warm water from the remnants of the Leeuwin current is moving from the west, and water with varying density is exchanging with Spencer Gulf and the Gulf of St Vincent. Upwelling events occur from the deep ocean on the south side of the observation area. This is a key ocean area for aquaculture and fishing, and is a major shipping thoroughfare. The data from this HF ocean radar system link the dynamics of the Great Australian Bight to the Bonney Coast and on to Tasmania. \\n\\nSpecific research questions identified by the SA Node of IMOS are: What is the detailed connection between shelf currents and the Flinders Current to non-regional influences (e.g. Southern Ocean, WA)? What is the nature of oceanic currents and processes (e.g. wave drift, mixing, eddies) that drive both winter and summer cross and along shelf exchange including the summertime upwelling systems and flushing of the gulfs? How does the ocean circulation, wave drift, eddies and environmental variability affect the distribution of sediments, nutrients, the production of lower trophic levels\\n(phytoplankton and zooplankton), the dispersal of larvae that underpin productive fisheries in the region and the effects of environment on aquaculture\\n\\nThe SAG HF ocean radar is a WERA phased array system with 16-element receive arrays located at Cape Wiles (34.943 S, 135.681 E) and Cape Spencer (35.294 S, 136.879 E). These radars operate at a frequency of 8.512 MHz, with a bandwidth of 33 KHz and a maximum range of 200 Km. Within the HF radar coverage area surface currents are measured. Data are also collected from which wind directions and significant wave height can be calculated. \\n\\nMost of the capital was contributed by the South Australia Research and Development Institute."}',
        },
        {
          href: "uuid:5fbe8b2b-9044-4dc5-8c3e-d3de74baa6e6",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Ocean Radar - Cape Spencer HF ocean radar station (South Australia Gulfs, South Australia, Australia)","recordAbstract":"The Cape Spencer (CSP) HF ocean radar site (35.294 S, 136.879 E) is one of two HF ocean radars covering the area between Eyre Peninsula and Kangaroo Island. The other HF ocean radar station is at Cape Wiles. The HF ocean radar coverage is from the coast to beyond the edge of the continental shelf. \\n\\nThe CSP HF ocean radar is a WERA phased array system with a 16-element receive array. This radar operates at a frequency of 8.512 MHz, with a bandwidth of 33 KHz, a maximum range of 200 Km and a range resolution of 4.5 Km. Azimuthally the radar covers a sweep 60 deg either side of a bore sight direction of 237 deg true east of north (approximately north by north-west).\\n\\nWithin the HF radar coverage area surface current radials are measured. Data are also collected from which wind directions and significant wave height can be calculated."}',
        },
        {
          href: "uuid:d83ef640-827e-4990-8c35-7c1a1aa587a9",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Ocean Radar - South Australia Gulfs HF ocean radar site (South Australia, Australia) - Real-time sea water velocity","recordAbstract":"The South Australia Gulfs (SAG) HF ocean radar system covers the area of about 40,000 square kilometres bounded by Kangaroo Island to the east and the Eyre Peninsula to the north. This is a dynamic region where warm water from the remnants of the Leeuwin current is moving from the west, and water with varying density is exchanging with Spencer Gulf and the Gulf of St Vincent. Upwelling events occur from the deep ocean on the south side of the observation area. This is a key ocean area for aquaculture and fishing, and is a major shipping thoroughfare. The data from this HF ocean radar system link the dynamics of the Great Australian Bight to the Bonney Coast and on to Tasmania. \\n\\nSpecific research questions identified by the SA Node of IMOS are: What is the detailed connection between shelf currents and the Flinders Current to non-regional influences (e.g. Southern Ocean, WA)? What is the nature of oceanic currents and processes (e.g. wave drift, mixing, eddies) that drive both winter and summer cross and along shelf exchange including the summertime upwelling systems and flushing of the gulfs? How does the ocean circulation, wave drift, eddies and environmental variability affect the distribution of sediments, nutrients, the production of lower trophic levels\\n(phytoplankton and zooplankton), the dispersal of larvae that underpin productive fisheries in the region and the effects of environment on aquaculture\\n\\nThe SAG HF ocean radar is a WERA phased array system with 16-element receive arrays located at Cape Wiles (34.943 S, 135.681 E) and Cape Spencer (35.294 S, 136.879 E). These radars operate at a frequency of 8.512 MHz, with a bandwidth of 33 KHz and a maximum range of 200 Km. Within the HF radar coverage area surface currents are measured. Data are also collected from which wind directions and significant wave height can be calculated. \\n\\nMost of the capital was contributed by the South Australia Research and Development Institute."}',
        },
        {
          href: "uuid:cb2e22b5-ebb9-460b-8cff-b446fe14ea2f",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Ocean Radar - South Australia Gulfs HF ocean radar site (South Australia, Australia) - Delayed mode sea water velocity","recordAbstract":"The South Australia Gulfs (SAG) HF ocean radar system covers the area of about 40,000 square kilometres bounded by Kangaroo Island to the east and the Eyre Peninsula to the north. This is a dynamic region where warm water from the remnants of the Leeuwin current is moving from the west, and water with varying density is exchanging with Spencer Gulf and the Gulf of St Vincent. Upwelling events occur from the deep ocean on the south side of the observation area. This is a key ocean area for aquaculture and fishing, and is a major shipping thoroughfare. The data from this HF ocean radar system link the dynamics of the Great Australian Bight to the Bonney Coast and on to Tasmania. \\n\\nSpecific research questions identified by the SA Node of IMOS are: What is the detailed connection between shelf currents and the Flinders Current to non-regional influences (e.g. Southern Ocean, WA)? What is the nature of oceanic currents and processes (e.g. wave drift, mixing, eddies) that drive both winter and summer cross and along shelf exchange including the summertime upwelling systems and flushing of the gulfs? How does the ocean circulation, wave drift, eddies and environmental variability affect the distribution of sediments, nutrients, the production of lower trophic levels\\n(phytoplankton and zooplankton), the dispersal of larvae that underpin productive fisheries in the region and the effects of environment on aquaculture\\n\\nThe SAG HF ocean radar is a WERA phased array system with 16-element receive arrays located at Cape Wiles (34.943 S, 135.681 E) and Cape Spencer (35.294 S, 136.879 E). These radars operate at a frequency of 8.512 MHz, with a bandwidth of 33 KHz and a maximum range of 200 Km. Within the HF radar coverage area surface currents are measured. Data are also collected from which wind directions and significant wave height can be calculated. \\n\\nMost of the capital was contributed by the South Australia Research and Development Institute."}',
        },
        {
          href: "uuid:db049981-3d4e-4cb2-9c4b-e697650845b9",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Ocean Radar - South Australia Gulfs HF ocean radar site (South Australia, Australia) - Delayed mode wind","recordAbstract":"The South Australia Gulfs (SAG) HF ocean radar system covers the area of about 40,000 square kilometres bounded by Kangaroo Island to the east and the Eyre Peninsula to the north. This is a dynamic region where warm water from the remnants of the Leeuwin current is moving from the west, and water with varying density is exchanging with Spencer Gulf and the Gulf of St Vincent. Upwelling events occur from the deep ocean on the south side of the observation area. This is a key ocean area for aquaculture and fishing, and is a major shipping thoroughfare. The data from this HF ocean radar system link the dynamics of the Great Australian Bight to the Bonney Coast and on to Tasmania. \\n\\nSpecific research questions identified by the SA Node of IMOS are: What is the detailed connection between shelf currents and the Flinders Current to non-regional influences (e.g. Southern Ocean, WA)? What is the nature of oceanic currents and processes (e.g. wave drift, mixing, eddies) that drive both winter and summer cross and along shelf exchange including the summertime upwelling systems and flushing of the gulfs? How does the ocean circulation, wave drift, eddies and environmental variability affect the distribution of sediments, nutrients, the production of lower trophic levels\\n(phytoplankton and zooplankton), the dispersal of larvae that underpin productive fisheries in the region and the effects of environment on aquaculture\\n\\nThe SAG HF ocean radar is a WERA phased array system with 16-element receive arrays located at Cape Wiles (34.943 S, 135.681 E) and Cape Spencer (35.294 S, 136.879 E). These radars operate at a frequency of 8.512 MHz, with a bandwidth of 33 KHz and a maximum range of 200 Km. Within the HF radar coverage area surface currents are measured. Data are also collected from which wind directions and significant wave height can be calculated. \\n\\nMost of the capital was contributed by the South Australia Research and Development Institute."}',
        },
        {
          href: "uuid:0fa0140a-786a-4de8-8a4f-28552205bb57",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Ocean Radar - Cape Wiles HF ocean radar station (South Australia Gulfs, South Australia, Australia)","recordAbstract":"The Cape Wiles (CWI) HF ocean radar site (34.943 S, 135.681 E) is one of two HF ocean radars covering the area between Eyre Peninsula and Kangaroo Island. The other HF ocean radar station is at Cape Spencer. The HF ocean radar coverage is from the coast to beyond the edge of the continental shelf. \\n\\nThe CWI HF ocean radar is a WERA phased array system with a 16-element receive array. This radar operates at a frequency of 8.512 MHz, with a bandwidth of 33 KHz, a maximum range of 200 Km and a range resolution of 4.5 Km. Azimuthally the radar covers a sweep 60 deg either side of a bore sight direction of 190 deg true east of north (approximately south).\\n\\nWithin the HF radar coverage area surface current radials are measured. Data are also collected from which wind directions and significant wave height can be calculated."}',
        },
        {
          href: '"https://nbviewer.org/github/aodn/aodn_cloud_optimised/blob/main/notebooks/radar_SouthAustraliaGulfs_wave_delayed_qc.ipynb"',
          rel: "related",
          type: "application/x-ipynb+json",
          title: "Python notebook example",
          "ai:group": "Python Notebook",
        },
        {
          href: "http://localhost:8080/api/v1/ogc/collections/19da2ce7-138f-4427-89de-a50c724f5f54/items/summary",
          rel: "summary",
          type: "application/x-zarr",
          title: "Summary",
        },
      ],
      extent: {
        spatial: {
          bbox: [
            [133.0, -37.4, 137.4, -34.8],
            [133.0, -37.4, 137.4, -34.8],
          ],
          crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        },
        temporal: {
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {
        status: "onGoing",
      },
      id: "28f8bfed-ca6a-472a-84e4-42563ce4df3f",
      title:
        "IMOS - Satellite Remote Sensing - Ocean Colour - Ships of Opportunity - Radiometer Sub-Facility",
      description:
        "Calibrated DALEC Transect data The Dynamic above water radiance and irradiance collector (DALEC) is a radiometrically calibrated hyperspectral radiometer developed by In situ Marine Optics for autonomous ship based deployment. It contains three Zeiss UV-Vis enhanced spectroradiometers designed to measure near-simultaneous spectral upwelling radiance (Lu), downwelling radiance (Lsky) and downwelling irradiance (Ed). DALEC0001 is deployed on the foremast of the RV Southern Surveyor (VLHJ) and on the RV Solander. Spectra are collected during daylight hours when the ship is at sea subject to suitable sea conditions. Ancillary attitude data for the DALEC included in the dataset are pitch (degrees), pitch standard deviation (degrees), roll (degrees), roll standard deviation (degrees) and gear position (degrees from the bow). The dataset begins July 2011 and is on-going.",
      links: [
        {
          href: "http://imos.org.au/ljco.html",
          rel: "related",
          type: "text/html",
          title:
            "Support cal/val activities specifically for Case 1 products using two ship-mounted radiometers (SRS-OC-SOOP_Rad)",
          "ai:group": "Other",
        },
        {
          href: "http://imos.org.au/srs.html",
          rel: "related",
          type: "text/html",
          title: "Satellite Remote Sensing page on IMOS website",
          "ai:group": "Other",
        },
        {
          href: "https://thredds.aodn.org.au/thredds/catalog/IMOS/SRS/OC/radiometer/catalog.html",
          rel: "related",
          type: "text/html",
          title: "NetCDF files via THREDDS catalog",
          "ai:group": "Data Access > thredds",
        },
        {
          href: "https://portal.aodn.org.au/search?uuid=28f8bfed-ca6a-472a-84e4-42563ce4df3f",
          rel: "related",
          type: "text/html",
          title: "View and download data though the AODN Portal",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/wms",
          rel: "wms",
          type: "",
          title: "imos:srs_oc_soop_rad_trajectory_map",
          "ai:group": "Data Access > wms",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/ows",
          rel: "IMOS:AGGREGATION--bodaac",
          type: "",
          title: "srs_oc_soop_rad_trajectory_map#url",
        },
        {
          href: "https://help.aodn.org.au/web-services/ncurllist-service/",
          rel: "related",
          type: "text/html",
          title: "ncUrlList help documentation",
        },
        {
          href: "http://content.aodn.org.au/Documents/IMOS/Facilities/satellite_remote_sensing/IMOS_radiometry_community-of-practice_document_v1.0.pdf",
          rel: "related",
          type: "text/html",
          title: "IMOS radiometry community-of-practice document",
          "ai:group": "Document",
        },
        {
          href: "http://content.aodn.org.au/Documents/IMOS/Facilities/satellite_remote_sensing/IMOS-radiometry_RTT-final-report.pdf",
          rel: "related",
          type: "text/html",
          title: "IMOS Radiometry Task Team final report document",
          "ai:group": "Document",
        },
        {
          href: "https://geonetwork.edge.aodn.org.au:443/geonetwork/images/logos/2976cf80-3906-41aa-8916-4adfbc507438.png",
          rel: "icon",
          type: "image/png",
          title: "Suggest icon for dataset",
        },
        {
          href: "https://catalogue-imos.aodn.org.au:443/geonetwork/srv/api/records/28f8bfed-ca6a-472a-84e4-42563ce4df3f",
          rel: "describedby",
          type: "text/html",
          title: "Full metadata link",
        },
        {
          href: "https://licensebuttons.net/l/by/4.0/88x31.png",
          rel: "license",
          type: "image/png",
        },
        {
          href: "http://creativecommons.org/licenses/by/4.0/",
          rel: "license",
          type: "text/html",
        },
        {
          href: "uuid:744ac2a9-689c-40d3-b262-0df6863f0327",
          rel: "parent",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing Facility","recordAbstract":"The aim of the Satellite Remote Sensing facility is to provide access to a range of satellite derived marine data products covering the Australian region.\\n\\nThe facility has established a new X-Band reception facility at the Australian Institute of Marine Research near Townsville and upgraded the Tasmanian Earth Resource Satellite Station near Hobart. \\n\\nThese stations and facilities in Perth, Melbourne, Alice Springs and Darwin form a network supplying the facility with near real-time data. These data are combined and processed to a number of products which are placed on disk storage systems in Melbourne, Canberra and Perth.\\n\\nThe Bureau of Meteorology has developed a sea surface temperature (SST) product in GHRSST-PP (http://ghrsst-pp.metoffice.com/) L3P format. The Bureau is developing some other SST products including daily and skin SSTs.\\nThese new products and some \\"ocean colour\\" products from MODIS will gradually become available.\\n\\nScientific users can access these data products are available through OPeNDAP and THREDDS supported technology and also through interfaces provided by AODN and the facility (www.imos.org.au and www.imos.org.au/srs)."}',
        },
        {
          href: "uuid:4ac6bf81-cd37-4611-8da8-4d5ae5e2bda3",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - Ocean Colour Sub-Facility - Lucinda Jetty Coastal Observatory (LJCO)","recordAbstract":"The Lucinda Jetty Coastal Observatory (LJCO) is located on the end of the 5.8 km long Lucinda Jetty (18.52 S, 146.39 E) in the coastal waters of the Great Barrier Reef World Heritage Area close to the Herbert River Estuary and the Hinchinbrook Channel in Queensland.\\n\\nThe observatory acquires continuous above and in-water optical measurements with the objective to support satellite ocean colour validation and algorithm development. Data collection and delivery was interrupted in 2011 with tropical cyclone Yasi. Currently, LJCO is the only southern-hemisphere ocean colour validation site integrated into NASA’s AERONET-OC global network of ground-based radiometers and one of a few sites globally that combines the acquisition of both atmospheric and in-water optical measurements. \\n\\nMounted instruments on the LJCO included:\\n- Met Station (Vaisala WXT520)\\n- Above-water radiometry\\n--- CIMEL SeaPRISM\\n--- Satlantic HyperOCR\\n--- DALEC instrument (added in mid-2016 for continuous hyper-spectral radiometric measurements)\\n-Instrument telemetry\\n--- Power supply\\n--- UPS\\n--- NextG Router\\n--- WETLabs DAPCS\\n--- PC controller\\n--- Automated winch\\n- Underwater optics\\n--- WETLabs WQM\\n--- WETLabs Eco Triplet\\n--- WETLabs ac-s\\n--- WETLabs BB9\\n- Campbell Scientific submersible pressure transducer\\n\\nThe above-water measurements collected at LJCO compromise of multi-spectral water-leaving radiance and atmospheric observations for retrieving aerosol optical properties using an autonomous CIMEL SeaPRISM radiometer, in addition to hyper-spectral down-welling radiance\\nmeasurements using the a Satlantic Hyper-OCR. In mid 2016 continuous hyper-spectral radiometric measurements were added using the DALEC instrument.\\n\\nThe in-water optical measurements consist of conductivity, temperature, pressure, dissolved oxygen, chlorophyll fluorescence and turbidity using a WETLabs WQM, coloured dissolved organic matter (CDOM) fluorescence using a WETLabs EcoTriplet, as well as particulate and dissolved spectral absorption and attenuation coefficients using a WETLabs AC-S. Further, total backscattering coefficients are measured using a WETLabs BB9 radiometer. \\n\\nAdditional meteorological and sea state measurements are continuously recorded such as barometric pressure, relative humidity, air emperature, wind speed and direction using a Vaisala WXT520 weather transmitter. Wave height and water temperature are measured with a Campbell Scientific submersible pressure transducer that is used to keep the caged in-water optical instruments at a constant depth.\\n\\nAll data streams are processed in delayed-mode with automatic quality control applied and made publicly available through the AODN portal; and the data presented here is the daily in-water generated products."}',
        },
        {
          href: "uuid:5356744f-10f7-442e-8dd5-8a05f016588d",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - Satellite Sea Surface Temperature (SST) Products Sub-Facility","recordAbstract":"As part of the Integrated Marine Observing System (IMOS), the Australian Bureau of Meteorology produce high-resolution satellite sea surface temperature (SST) products over the Australian region, designed to suit a range of operational and research applications. All these products follow the latest International Group for High Resolution Sea Surface Temperature (GHRSST: www.ghrsst.org) file formats, assisting international data exchange and collaboration.\\nThe highest spatial resolution (1 km x 1 km) data from Advanced Very High Resolution Radiometer (AVHRR) sensors on NOAA polar-orbiting satellites can only be obtained through receiving direct broadcast “HRPT” data from the satellite. In Australia, HRPT data is received by a number of agencies (Bureau of Meteorology, Geoscience Australia, AIMS and CSIRO) and consortia (WASTAC and TERSS) at ground-stations located in Darwin, Townsville, Melbourne, Hobart, Perth and Alice Springs and in Antarctica at Casey and Davis Stations.\\n\\nThe Bureau of Meteorology, in collaboration with CSIRO Marine and Atmospheric Research, is combining raw data from the various ground-stations and producing real-time HRPT AVHRR skin (~ 10 micron depth) SST data files in the GHRSST GDS v2.0 L2P (single swath, geolocated), L3U (single swath, gridded), one and three day daytime/night-time L3C (single sensor, multiple swath, gridded) and one, three and six day daytime/night-time L3S (multiple sensors, multiple swath, gridded) formats. The L2P, L3U, L3C and L3S files for NOAA-15, 17, 18 and 19 satellite data are available through the IMOS FTP server (ftp://aodaac2-cbr.act.csiro.au/imos/GHRSST), IMOS AO-DAAC (http://www.marine.csiro.au/remotesensing/imos/aggregator.html# ) and IMOS Ocean Portal (http://imos.aodn.org.au/webportal/), and will eventually be available through the GHRSST Global Data Assembly Centre (http://ghrsst.jpl.nasa.gov). Archived raw HRPT AVHRR data from Australian and Antarctic ground-stations back to 1992 will be progressively reprocessed into skin SST L2P, L3U, L3C and L3S files and be available to GHRSST and IMOS by June 2013.\\nFor the user, there are several advantages to using GHRSST-format SST products. For each SST value the GHRSST files contain a quality level flag (based on proximity to cloud, satellite zenith angle and day/night) and bias and standard deviation error estimates based on 60 day match-ups with drifting buoy SST data. Note that the closer an SST pixel is to cloud, the higher the standard deviation. Therefore, the presence of these quality level flags and error information enable users to tailor the L2P, L3U, L3C or L3S files for their particular research application by trading SST spatial coverage for accuracy and vice versa. Users have the ability to access L3U, L3C and L3S SST products through IMOS OPeNDAP servers, greatly simplifying data access and extraction. Providing real-time HRPT AVHRR SST files in GHRSST-L2P format enables them to be incorporated into global and regional, gap-free, analyses of L2P SST from multiple satellites such as NASA’s G1SST global 1 km daily SST analysis and the Bureau of Meteorology’s daily regional and global SST analyses (RAMSSA and GAMSSA).\\nThe new IMOS AVHRR L2P SSTs exhibit approximately 75% the error of the Bureau’s pre-existing HRPT AVHRR level 2 SST data, with standard deviations compared with drifting buoys during night-time of around 0.3°C and during daytime of around 0.4°C for quality level 5 (highest). This significant improvement in accuracy has been achieved by improving cloud clearing and calibration - using regional rather than global drifting buoy SST observations and incorporating a dependence on latitude.\\nFor further details on the AVHRR GHRSST products see Paltoglou et al. (2010) (http://imos.org.au/srsdoc.html). Enquiries can be directed to Helen Beggs (h.beggs(at)bom.gov.au).\\n\\n\\nAll the IMOS satellite SST products are supplied in GHRSST netCDF format and are either geolocated swath (\\"L2P\\") files or level 3 composite, gridded files that will have gaps where there were no observations during the specified time period. The various L3U (single swath), L3C (single sensor, multiple swath) and L3S (multiple sensors, multiple swaths) are designed to suit different applications. Some current applications of the various IMOS satellite SST products are:\\n\\nHRPT AVHRR data:\\n\\nL2P: Ingestion into optimally interpolated SST analysis systems (eg. RAMSSA, GAMSSA, G1SST, ODYSSEA);\\n\\nL3U: Calculation of surface ocean currents (IMOS OceanCurrents);\\n\\nL3C: Estimation of diurnal warming of the surface ocean (GHRSST Tropical Warm Pool Diurnal Variation (TWP+) Project);\\n\\nL3S: Estimation of likelihood of coral bleaching events (ReefTemp II).\\n\\nL3P: Legacy 14-day Mosaic AVHRR SST which is a weighted mean SST produced daily from multiple NOAA satellites in a cut-down GHRSST netCDF format. This product is still used in a coral bleaching prediction system run at CMAR. The product is produced using the legacy BoM processing system and is less accurate than the new IMOS L3S product.\\n\\nGeostationary satellite MTSAT-1R data:\\n\\nL3U: Hourly, 0.05 deg x 0.05 deg SST used for estimation of the diurnal warming of the surface ocean and validation of diurnal warming models (TWP+ Project)."}',
        },
        {
          href: "uuid:57de0207-649c-4be6-ac22-6f92361dc992",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"Satellite Remote Sensing-A Satellite SST Products","recordAbstract":"The aim of the Australian Satellite SST L2P Products sub-facility is to provide real-time and reprocessed, high-resolution (1 km and 5 km), locally received, satellite sea surface temperature (SST) data products in the internationally accepted GHRSST L2P and L3P format using new, best practice, processing and calibration methods. The satellite sensors to be used are the AVHRR infrared sensors on the NOAA polar-orbiting satellites, the MODIS infrared sensors on Aqua and Terra and infrared sensors on available geostationary satellites (eg. MTSAT-1R)."}',
        },
        {
          href: "uuid:8209bf83-0c3c-4fbe-9f36-41f7a5ee9913",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - Ocean colour Sub-Facility","recordAbstract":"The Aqua satellite platform carries a MODIS sensor that observes sunlight reflected from within the ocean surface layer at multiple wavelengths. These multi-spectral measurements are used to infer the concentration of chlorophyll-a (Chl-a), most typically due to phytoplankton, present in the water. \\n\\nThe data are produced from the near real time (nrt) data stream formed by combining data from all the available direct broadcast reception stations in Australia (Alice Springs, Melbourne, Townsville, Perth, Hobart). The data are presented as a sequence of granules, each with a maximum size corresponding to 5 minutes of data, and beginning on UTC-5 minute boundary (eg. 04:05, 04:10, 04:15). The granules have been remapped from satellite projection into a geographic (Latitude/Longitude axes) projection and are formatted as CF-compliant netCDF files. It should be noted that the data are not processed until the definitive spacecraft ephemeris becomes available, usually 12-24 hours after the overpass. This means that the geolocation should be of a uniformly high standard.\\n\\nThere are multiple retrieval algorithms for estimating Chl-a. These data use the OC3 method recommended by the NASA Ocean Biology Processing Group and implemented in the SeaDAS processing software l2gen. The radiometric sensitivity of the MODIS sensor is evolving continuously during its mission and is being monitored regularly. The SeaDAS software uses tables of calibration coefficients that are updated periodically. From time to time upgrades to the algorithms and thand/or the format of the calibration tables are required, in which case a new version of SeaDAS is released. These data are initially being produced using SeaDAS 6.1, then SeaDAS 6.4 and eventually with SeaDAS 7.x. The data processed with each different version can be distinguished by the digits at the end of the root URL for the data; for example l2oc.nrt.61 is level-2 ocean colour (l2oc), using the near real time (nrt) data stream, produced using SeaDAS 6.1."}',
        },
        {
          href: "uuid:97b9fe73-ee44-437f-b2ae-5b8613f81042",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - Ocean Colour - Bio Optical Database of Australian Waters","recordAbstract":"Establishment of a bio-optical database of Australian Waters by harvesting all bio-geochemical and bio-optical data from all the IMOS data streams (National Mooring Network, National Reference Stations, Ocean Gliders, Satellite Remote Sensing Ocean Colour - Lucinda Jetty) and from legacy databases (e.g SRFME/WAMSI, Great Barrier Reef Long Term Monitoring Program, Aquafin CRC, Port Hacking transect, Research cruises in the Southern Ocean) it is possible to establish an Australian Database of bio-geochemical and bio-optical data. This Satellite Remote Sensing dataset covers the southern oceans worldwide and Indonesian waters. The Australian Antarctic Division (AAD) and the Australian Institute of Marine Science (AIMS) are providing some of the data to the bio-optical database. This activity aims to collate measurements undertaken prior to the commencement of IMOS by several members of the Australian biological oceanography community. This database is used to assess accuracy of Satellite ocean colour products for current and forthcoming satellite missions for the Australian Waters. The bio-optical database underpins the assessment of ocean colour products in the Australian region (e.g. chlorophyll a concentrations, phytoplankton species composition and primary production). Such a data set is crucial to quantify the uncertainty in the ocean colour products in our region. Further, it is essential to assessing new ocean colour data products generated for the Australian region. The contribution of such a database to international space agencies ensures that the accuracy of global algorithm developed for future sensors will increase for Australian waters as bias towards Northern Hemisphere observation will be reduced. The database contains biooptical data (i.e. HPLC, Chlorophyll by spectrophotometric methods, full spectral absorptions, TSS ) and in situ optical data (Vertical attenuation, water leaving radiance, reflectances, Atmospheric Optical Depth, spectral and single channel absorption and backscattering)."}',
        },
        {
          href: "uuid:c2d47a05-2bb7-4649-ba05-d314e8f2105b",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - Surface Waves Sub-Facility","recordAbstract":"The Surface Waves Sub-Facility, part of the Satellite Remote Sensing Facility, will calibrate, collect and distribute ocean surface wave data from current and next-generation satellite missions.\\n\\nThe Sub-Facility will build Australia’s capability in Satellite Remotely Sensed wave data-streams and deliver global validated, processed wave data streams, with a focused effort in the Australian region. Activities will include:\\n\\n•\\tbuilding on the wave measurements obtained from the Bass Strait altimeter calibration sites for calibration of the current satellite missions in the Australian region,\\n•\\tusing the Southern Ocean Flux Station to validate wave data in the extreme Southern Ocean wave climate,\\n•\\tdelivering historical and near-real-time altimeter-derived significant wave heights to the IMOS OceanCurrent Facility, producing daily maps and animations that will be used by researchers and the broader community,\\n•\\tmanaging the delivery of wind-wave data derived from altimeter and synthetic aperture radar (SAR) satellite platforms to the Australian marine and coastal science community."}',
        },
        {
          href: "uuid:78d588ed-79dd-47e2-b806-d39025194e7e",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Satellite Remote Sensing - Satellite Altimetry Calibration and Validation Sub-Facility","recordAbstract":"Satellite-based altimeters provide fundamental observations of sea surface height that continue to underpin our understanding of the ocean’s role in the Earth’s climate system. Understanding changes in mean sea level at global to regional scales is critical for understanding the response of the ocean to a warming climate – both through the thermal expansion of the ocean and the melting of mountain glaciers and polar ice caps. Sea surface height also provides a lens into ocean dynamic processes at regional to local scales. As with all scientific observations, validation of instrumentation is vital to ensure that measurements are accurate and reliable.\\n\\nThe IMOS Satellite Altimeter Calibration and Validation Sub-Facility maintains a suite of instrumentation primarily in Bass Strait, providing the only southern hemisphere in situ calibration and validation site that has operated since the launch of the TOPEX/Poseidon mission in 1992. The facility uses Global Navigation Satellite Systems (GNSS) equipped buoys on the ocean surface as well as an array of sub-surface moored oceanographic instrumentation that includes temperature, pressure and salinity sensors and advanced 5-beam acoustic doppler current profilers (ADCPs). Data from this infrastructure is combined to derive a sustained Sea Surface Height (SSH) record that can be directly compared to altimeter measurements. These data provide important contributions to Ocean Surface Topography Science Team (OSTST) and other mission-specific validation teams including those associated with the Sentinel-6 Michael Freilich, Sentinel-3A and 3B, and SWOT missions. For validation of nadir altimeters, the key metric of interest to mission science teams the altimeter absolute bias, the difference between altimeter and in situ measurements of SSH in an absolute reference frame. Analysis of the absolute bias record over time helps ensure data produced from satellite altimeters are accurate and precise on a global scale.\\n\\nIn addition to the primary site located in Bass Strait, the sub-facility operates some sensors opportunistically at other sites including at the Southern Ocean Flux Station (SOFS) in the Southern Ocean, and at Davies Reef and Yongala in and adjacent to Great Barrier Reef. Data made available from the sub-facility includes:\\n\\nBass Strait (various locations corresponding to different altimeter comparison points) \\n•\\tBottom pressure, temperature and salinity (P, T, S)\\n•\\tWater current (U, V)\\n•\\tSignificant Wave Height (SWH)\\n•\\tSea Surface Height (SSH)\\n•\\tNote different temporal extents and sampling rates are provided on a site-by-site basis deploying on deployments and variable of choice.\\n\\nSouthern Ocean\\n•\\tSea Surface Height\\n•\\tSignificant Wave Height\\n•\\tNote two different sampling rates are provided. The temporal extent depends on the SOFS deployment.\\n\\nDavies Reef and Yongala\\n•\\tBottom pressure, temperature and salinity (P, T, S)\\n•\\tSea Surface Height\\n•\\tNote different temporal extents and sampling rates are provided on a site-by-site basis deploying on deployments and variable of choice."}',
        },
        {
          href: '"https://nbviewer.org/github/aodn/aodn_cloud_optimised/blob/main/notebooks/vessel_satellite_radiance_delayed_qc.ipynb"',
          rel: "related",
          type: "application/x-ipynb+json",
          title: "Python notebook example",
          "ai:group": "Python Notebook",
        },
        {
          href: "http://localhost:8080/api/v1/ogc/collections/28f8bfed-ca6a-472a-84e4-42563ce4df3f/items/summary",
          rel: "summary",
          type: "application/x-zarr",
          title: "Summary",
        },
      ],
      extent: {
        spatial: {
          bbox: [
            [-180.0, -48.0, 180.0, -6.0],
            [-180.0, -18.0, -174.0, -12.0],
            [171.0, -18.0, 180.0, -15.0],
            [99.0, -36.0, 117.0, -24.0],
            [120.0, -39.0, 138.0, -33.0],
            [138.0, -42.0, 144.0, -39.0],
            [75.0, -48.0, 174.0, -6.0],
          ],
          crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        },
        temporal: {
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {
        status: "completed",
      },
      id: "ffe8f19c-de4a-4362-89be-7605b2dd6b8c",
      title:
        "IMOS - Ocean Radar - Coffs Harbour HF ocean radar site (New South Wales, Australia) - Delayed mode wind",
      description:
        "The Coffs Harbour (COF) HF ocean radar site is located near the point at which the East Australian Current (EAC) begins to separate from the coast.  Here the EAC is at its narrowest and swiftest: to the north it is forming from the westwards subtropical jet, and to the south it forms eddies and eventually the warm water moves eastwards across the Tasman Sea, forming a front with the cold water of the Southern Ocean.  \n\nThe connection between coastal and continental shelf waters is fundamental to the understanding of the anthropogenic impact on the coastal ocean and the role of the ocean in mitigating urban marine water quality. The oceans off Eastern Australia and in particular in the region of New South Wales have a complex circulation structure, and are strongly connected with other regional seas and currents. \n\nThe East Australia Current (EAC) flows from tropical regions southward along the NSW continental slope, bringing tropical biota southward. These current structures provide strong physical and biological connectivity, allowing substantial transport and dispersion of biota between regions, and influencing the transport and upwelling of nutrients, which are fundamental to biological productivity.  \n\nThe COF HF ocean radar is a WERA phased array system with 16-element receive arrays located at Red Rock (-23.942 S, 151.371 E) to the north of Coffs Harbour and North Nambucca (-24.111 S, 152.713 E) to the south.  The area of focus is off Coffs Harbour where IMOS and the NSW government have mooring sites.  These radars operate at a frequency of 13.920 MHz, with a bandwidth of 100 KHz and a maximum range of 100 Km.  Within the HF radar coverage area surface currents are measured.  Data are also collected from which wind directions and significant wave height can be calculated.",
      links: [
        {
          href: "http://imos.org.au/facilities/oceanradar",
          rel: "related",
          type: "text/html",
          title: "Ocean Radar page on IMOS website",
          "ai:group": "Other",
        },
        {
          href: "http://thredds.aodn.org.au/thredds/catalog/IMOS/ACORN/gridded_1h-avg-wind-map_QC/COF/catalog.html",
          rel: "related",
          type: "text/html",
          title: "NetCDF files via THREDDS catalog",
          "ai:group": "Data Access > thredds",
        },
        {
          href: "http://content.aodn.org.au/Documents/IMOS/Facilities/ocean_radar/QC_procedures_for_IMOS_Ocean_Radar_manual_LATEST.pdf",
          rel: "related",
          type: "text/html",
          title: "Quality Control procedures for IMOS Ocean Radar Manual",
          "ai:group": "Document",
        },
        {
          href: "https://portal.aodn.org.au/search?uuid=ffe8f19c-de4a-4362-89be-7605b2dd6b8c",
          rel: "related",
          type: "text/html",
          title: "View and download data though the AODN Portal",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/ncwms",
          rel: "wms",
          type: "",
          title: "acorn_wind_qc_cof_url/WDIR",
          "ai:group": "Data Access > wms",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/ncwms",
          rel: "wms",
          type: "",
          title: "acorn_wind_qc_cof_url/WWAV",
          "ai:group": "Data Access > wms",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/ncwms",
          rel: "wms",
          type: "",
          title: "acorn_wind_qc_cof_url/WWDS",
          "ai:group": "Data Access > wms",
        },
        {
          href: "http://geoserver-123.aodn.org.au/geoserver/ows",
          rel: "IMOS:AGGREGATION--bodaac",
          type: "",
          title: "acorn_wind_qc_cof_url#file_url",
        },
        {
          href: "https://help.aodn.org.au/web-services/ncurllist-service/",
          rel: "related",
          type: "text/html",
          title: "ncUrlList help documentation",
        },
        {
          href: "https://processes.aodn.org.au/wps",
          rel: "OGC:WPS--gogoduck",
          type: "",
          title: "acorn_wind_qc_cof_url",
        },
        {
          href: "https://help.aodn.org.au/web-services/gogoduck-aggregator/",
          rel: "related",
          type: "text/html",
          title: "GoGoDuck help documentation",
        },
        {
          href: "https://registry.opendata.aws/aodn_radar_coffsharbour_wind_delayed_qc/",
          rel: "related",
          type: "text/html",
          title:
            "Access To AWS Open Data Program registry for the Cloud Optimised version of this dataset",
          "ai:group": "Data Access > aws",
        },
        {
          href: "https://github.com/aodn/aodn_cloud_optimised/blob/main/notebooks/radar_CoffsHarbour_wind_delayed_qc.ipynb",
          rel: "related",
          type: "application/x-ipynb+json",
          title:
            "Access to Jupyter notebook to query Cloud Optimised converted dataset",
          "ai:group": "Python Notebook",
        },
        {
          href: "https://geonetwork.edge.aodn.org.au:443/geonetwork/images/logos/2976cf80-3906-41aa-8916-4adfbc507438.png",
          rel: "icon",
          type: "image/png",
          title: "Suggest icon for dataset",
        },
        {
          href: "https://catalogue-imos.aodn.org.au:443/geonetwork/srv/api/records/ffe8f19c-de4a-4362-89be-7605b2dd6b8c",
          rel: "describedby",
          type: "text/html",
          title: "Full metadata link",
        },
        {
          href: "https://licensebuttons.net/l/by/4.0/88x31.png",
          rel: "license",
          type: "image/png",
        },
        {
          href: "http://creativecommons.org/licenses/by/4.0/",
          rel: "license",
          type: "text/html",
        },
        {
          href: "uuid:b2f73bf6-39d4-4467-80ea-49084aea211d",
          rel: "parent",
          type: "application/json",
          title:
            '{"title":"IMOS - Ocean Radar - Coffs Harbour HF ocean radar site (New South Wales, Australia)","recordAbstract":"The Coffs Harbour (COF) HF ocean radar site is located near the point at which the East Australian Current (EAC) begins to separate from the coast. Here the EAC is at its narrowest and swiftest: to the north it is forming from the westwards subtropical jet, and to the south it forms eddies and eventually the warm water moves eastwards across the Tasman Sea, forming a front with the cold water of the Southern Ocean. \\n\\nThe connection between coastal and continental shelf waters is fundamental to the understanding of the anthropogenic impact on the coastal ocean and the role of the ocean in mitigating urban marine water quality. The oceans off Eastern Australia and in particular in the region of New South Wales have a complex circulation structure, and are strongly connected with other regional seas and currents. \\n\\nThe East Australia Current (EAC) flows from tropical regions southward along the NSW continental slope, bringing tropical biota southward. These current structures provide strong physical and biological connectivity, allowing substantial transport and dispersion of biota between regions, and influencing the transport and upwelling of nutrients, which are fundamental to biological productivity. \\n\\nThe COF HF ocean radar is a WERA phased array system with 16-element receive arrays located at Red Rock (-23.942 S, 151.371 E) to the north of Coffs Harbour and North Nambucca (-24.111 S, 152.713 E) to the south. The area of focus is off Coffs Harbour where IMOS and the NSW government have mooring sites. These radars operate at a frequency of 13.920 MHz, with a bandwidth of 100 KHz and a maximum range of 100 Km. Within the HF radar coverage area surface currents are measured. Data are also collected from which wind directions and significant wave height can be calculated."}',
        },
        {
          href: "uuid:331c5030-545c-4bf9-a0e0-1018accc1ec0",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Ocean Radar - Red Rock HF ocean radar station (Coffs Harbour, New South Wales, Australia)","recordAbstract":"The Red Rock (RRK) HF ocean radar site (32.031 S, 115.746 E) is one of two HF ocean radars covering the waters off Coffs Harbour, New South Wales. The other HF ocean radar station is at North Nambucca. \\n\\nThe RRK HF ocean radar is a WERA phased array system with a 16-element receive array. This radar operates at a frequency of 13.912 MHz, with a bandwidth of 100 KHz, a maximum range of 100 Km and a range resolution of 1.5 Km. Azimuthally the radar covers a sweep 60 deg either side of a bore sight direction of 285 deg true east of north (approximately west by north-west).\\n\\nWithin the HF radar coverage area surface current radials are measured. Data are also collected from which wind directions and significant wave height can be calculated."}',
        },
        {
          href: "uuid:82bc6673-c9cb-4afc-8b5d-0e65b097bfdc",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Ocean Radar - Coffs Harbour HF ocean radar site (New South Wales, Australia) - Real-time sea water velocity","recordAbstract":"The Coffs Harbour (COF) HF ocean radar site is located near the point at which the East Australian Current (EAC) begins to separate from the coast. Here the EAC is at its narrowest and swiftest: to the north it is forming from the westwards subtropical jet, and to the south it forms eddies and eventually the warm water moves eastwards across the Tasman Sea, forming a front with the cold water of the Southern Ocean. \\n\\nThe connection between coastal and continental shelf waters is fundamental to the understanding of the anthropogenic impact on the coastal ocean and the role of the ocean in mitigating urban marine water quality. The oceans off Eastern Australia and in particular in the region of New South Wales have a complex circulation structure, and are strongly connected with other regional seas and currents. \\n\\nThe East Australia Current (EAC) flows from tropical regions southward along the NSW continental slope, bringing tropical biota southward. These current structures provide strong physical and biological connectivity, allowing substantial transport and dispersion of biota between regions, and influencing the transport and upwelling of nutrients, which are fundamental to biological productivity. \\n\\nThe COF HF ocean radar is a WERA phased array system with 16-element receive arrays located at Red Rock (-23.942 S, 151.371 E) to the north of Coffs Harbour and North Nambucca (-24.111 S, 152.713 E) to the south. The area of focus is off Coffs Harbour where IMOS and the NSW government have mooring sites. These radars operate at a frequency of 13.920 MHz, with a bandwidth of 100 KHz and a maximum range of 100 Km. Within the HF radar coverage area surface currents are measured. Data are also collected from which wind directions and significant wave height can be calculated."}',
        },
        {
          href: "uuid:85da1645-2c63-45fa-97b5-4125165b999d",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Ocean Radar - Coffs Harbour HF ocean radar site (New South Wales, Australia) - Delayed mode sea water velocity","recordAbstract":"The Coffs Harbour (COF) HF ocean radar site is located near the point at which the East Australian Current (EAC) begins to separate from the coast. Here the EAC is at its narrowest and swiftest: to the north it is forming from the westwards subtropical jet, and to the south it forms eddies and eventually the warm water moves eastwards across the Tasman Sea, forming a front with the cold water of the Southern Ocean. \\n\\nThe connection between coastal and continental shelf waters is fundamental to the understanding of the anthropogenic impact on the coastal ocean and the role of the ocean in mitigating urban marine water quality. The oceans off Eastern Australia and in particular in the region of New South Wales have a complex circulation structure, and are strongly connected with other regional seas and currents. \\n\\nThe East Australia Current (EAC) flows from tropical regions southward along the NSW continental slope, bringing tropical biota southward. These current structures provide strong physical and biological connectivity, allowing substantial transport and dispersion of biota between regions, and influencing the transport and upwelling of nutrients, which are fundamental to biological productivity. \\n\\nThe COF HF ocean radar is a WERA phased array system with 16-element receive arrays located at Red Rock (-23.942 S, 151.371 E) to the north of Coffs Harbour and North Nambucca (-24.111 S, 152.713 E) to the south. The area of focus is off Coffs Harbour where IMOS and the NSW government have mooring sites. These radars operate at a frequency of 13.920 MHz, with a bandwidth of 100 KHz and a maximum range of 100 Km. Within the HF radar coverage area surface currents are measured. Data are also collected from which wind directions and significant wave height can be calculated."}',
        },
        {
          href: "uuid:e32e51d9-b0a5-4b95-9906-44e0c6c8d516",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Ocean Radar - Coffs Harbour HF ocean radar site (New South Wales, Australia) - Delayed mode wave","recordAbstract":"The Coffs Harbour (COF) HF ocean radar site is located near the point at which the East Australian Current (EAC) begins to separate from the coast. Here the EAC is at its narrowest and swiftest: to the north it is forming from the westwards subtropical jet, and to the south it forms eddies and eventually the warm water moves eastwards across the Tasman Sea, forming a front with the cold water of the Southern Ocean. \\n\\nThe connection between coastal and continental shelf waters is fundamental to the understanding of the anthropogenic impact on the coastal ocean and the role of the ocean in mitigating urban marine water quality. The oceans off Eastern Australia and in particular in the region of New South Wales have a complex circulation structure, and are strongly connected with other regional seas and currents. \\n\\nThe East Australia Current (EAC) flows from tropical regions southward along the NSW continental slope, bringing tropical biota southward. These current structures provide strong physical and biological connectivity, allowing substantial transport and dispersion of biota between regions, and influencing the transport and upwelling of nutrients, which are fundamental to biological productivity. \\n\\nThe COF HF ocean radar is a WERA phased array system with 16-element receive arrays located at Red Rock (-23.942 S, 151.371 E) to the north of Coffs Harbour and North Nambucca (-24.111 S, 152.713 E) to the south. The area of focus is off Coffs Harbour where IMOS and the NSW government have mooring sites. These radars operate at a frequency of 13.920 MHz, with a bandwidth of 100 KHz and a maximum range of 100 Km. Within the HF radar coverage area surface currents are measured. Data are also collected from which wind directions and significant wave height can be calculated."}',
        },
        {
          href: "uuid:bf85e06d-4b8e-4df5-b479-924624cb09b3",
          rel: "sibling",
          type: "application/json",
          title:
            '{"title":"IMOS - Ocean Radar - North Nambucca HF ocean radar station (Coffs Harbour, New South Wales, Australia)","recordAbstract":"The North Nambucca (NNB) HF ocean radar site (32.031 S, 115.746 E) is one of two HF ocean radars covering the waters off Coffs Harbour, New South Wales. The other HF ocean radar station is at Red Rock. \\n\\nThe NNB HF ocean radar is a WERA phased array system with a 16-element receive array. This radar operates at a frequency of 13.912 MHz, with a bandwidth of 100 KHz, a maximum range of 100 Km and a range resolution of 1.5 Km. Azimuthally the radar covers a sweep 60 deg either side of a bore sight direction of 285 deg true east of north (approximately west by north-west).\\n\\nWithin the HF radar coverage area surface current radials are measured. Data are also collected from which wind directions and significant wave height can be calculated."}',
        },
        {
          href: '"https://nbviewer.org/github/aodn/aodn_cloud_optimised/blob/main/notebooks/radar_CoffsHarbour_wind_delayed_qc.ipynb"',
          rel: "related",
          type: "application/x-ipynb+json",
          title: "Python notebook example",
          "ai:group": "Python Notebook",
        },
        {
          href: "http://localhost:8080/api/v1/ogc/collections/ffe8f19c-de4a-4362-89be-7605b2dd6b8c/items/summary",
          rel: "summary",
          type: "application/x-zarr",
          title: "Summary",
        },
      ],
      extent: {
        spatial: {
          bbox: [
            [152.9, -31.0, 154.0, -29.8],
            [152.9, -31.0, 154.0, -29.8],
          ],
          crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        },
        temporal: {
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
  ],
  total: 13,
  search_after: ["1.0", "88", "str:ffe8f19c-de4a-4362-89be-7605b2dd6b8c"],
};

export { response1 };
