/**
 * This record is same as the json collection returned from ogcapi. So please
 * update this record if the collection structure of ogcapi was changed
 */
const NORMAL_COLLECTION = {
  properties: {
    credits: [
      "Australia’s Integrated Marine Observing System (IMOS) is enabled by the National Collaborative Research Infrastructure Strategy (NCRIS). It is operated by a consortium of institutions as an unincorporated joint venture, with the University of Tasmania as Lead Agent.",
      "Australian Institute of Marine Science (AIMS)",
      "Bainbridge, Scott, Mr",
    ],
    license: "Creative Commons Attribution 3.0 Australia License",
    status: "onGoing",
    citation: {
      suggestedCitation:
        'Attribution: Format for citation of metadata sourced from Australian Institute of Marine Science (AIMS) in a list of reference is as follows: "Australian Institute of Marine Science (AIMS). (2020). Northern Australia Automated Marine Weather and Oceanographic Stations, Sites: [Davies Reef]. https://doi.org/10.25845/5c09bf93f315d, accessed[date-of-access]".',
      otherConstraints: [
        'Use Limitation: All AIMS data, products and services are provided "as is" and AIMS does not warrant their fitness for a particular purpose or non-infringement. While AIMS has made every reasonable effort to ensure high quality of the data, products and services, to the extent permitted by law the data, products and services are provided without any warranties of any kind, either expressed or implied, including without limitation any implied warranties of title, merchantability, and fitness for a particular purpose or non-infringement. AIMS make no representation or warranty that the data, products and services are accurate, complete, reliable or current. To the extent permitted by law, AIMS exclude all liability to any person arising directly or indirectly from the use of the data, products and services.',
        "",
      ],
    },
    creation: "2009-11-17T00:00:00",
    revision: "2024-02-15T00:00:00",
    contacts: [
      {
        name: "Bainbridge, S",
        organization: "Australian Institute of Marine Science (AIMS)",
        position: "",
        emails: ["reception@aims.gov.au"],
        addresses: [
          {
            city: "TOWNSVILLE",
            country: "Australia",
            delivery_point: ["PRIVATE MAIL BAG 3, TOWNSVILLE MAIL CENTRE"],
            administrative_area: "Queensland",
            postal_code: "4810",
          },
        ],
        links: [
          {
            href: "https://www.aims.gov.au",
            type: "WWW:LINK-1.0-http--link",
            title: "AIMS Web Site",
          },
        ],
        roles: ["principalInvestigator", "about"],
        phones: [
          {
            value: "+61 7 4753 4444",
            roles: ["voice"],
          },
          {
            value: "",
            roles: ["facsimile"],
          },
        ],
      },
      {
        name: "Data Manager, AIMS Data Centre",
        organization: "Australian Institute of Marine Science (AIMS)",
        position: "",
        emails: ["adc@aims.gov.au"],
        addresses: [
          {
            city: "TOWNSVILLE",
            country: "Australia",
            delivery_point: ["PRIVATE MAIL BAG 3, TOWNSVILLE MAIL CENTRE"],
            administrative_area: "Queensland",
            postal_code: "4810",
          },
        ],
        links: [
          {
            href: "https://www.aims.gov.au",
            type: "WWW:LINK-1.0-http--link",
            title: "AIMS Web Site",
          },
        ],
        roles: ["pointOfContact", "about"],
        phones: [
          {
            value: "+61 7 4753 4444",
            roles: ["voice"],
          },
          {
            value: "",
            roles: ["facsimile"],
          },
        ],
      },
      {
        name: "",
        organization: "Australian Institute of Marine Science (AIMS)",
        position: "AIMS Data Centre",
        emails: ["adc@aims.gov.au"],
        addresses: [
          {
            city: "TOWNSVILLE MAIL CENTRE",
            country: "Australia",
            delivery_point: ["PRIVATE MAIL BAG 3"],
            administrative_area: "Queensland",
            postal_code: "4810",
          },
        ],
        links: [
          {
            href: "https://www.aims.gov.au/adc",
            type: "WWW:LINK-1.0-http--link",
          },
        ],
        roles: ["pointOfContact", "metadata"],
        phones: [
          {
            value: "+61 7 4753 4444",
            roles: ["voice"],
          },
          {
            value: "+61 7 4772 5852",
            roles: ["facsimile"],
          },
        ],
      },
      {
        name: "",
        organization: "Australian Institute of Marine Science (AIMS)",
        position: "",
        emails: ["reception@aims.gov.au"],
        addresses: [
          {
            city: "TOWNSVILLE",
            country: "Australia",
            delivery_point: ["PRIVATE MAIL BAG 3, TOWNSVILLE MAIL CENTRE"],
            administrative_area: "Queensland",
            postal_code: "4810",
          },
        ],
        links: [
          {
            href: "https://www.aims.gov.au",
            type: "WWW:LINK-1.0-http--link",
            title: "AIMS Web Site",
          },
        ],
        roles: ["publisher", "citation"],
        phones: [
          {
            value: "+61 7 4753 4444",
            roles: ["voice"],
          },
          {
            value: "",
            roles: ["facsimile"],
          },
        ],
      },
      {
        name: "",
        organization: "Australian Institute of Marine Science (AIMS)",
        position: "",
        emails: ["reception@aims.gov.au"],
        addresses: [
          {
            city: "TOWNSVILLE",
            country: "Australia",
            delivery_point: ["PRIVATE MAIL BAG 3, TOWNSVILLE MAIL CENTRE"],
            administrative_area: "Queensland",
            postal_code: "4810",
          },
        ],
        links: [
          {
            href: "https://www.aims.gov.au",
            type: "WWW:LINK-1.0-http--link",
            title: "AIMS Web Site",
          },
        ],
        roles: ["owner", "citation"],
        phones: [
          {
            value: "+61 7 4753 4444",
            roles: ["voice"],
          },
          {
            value: "",
            roles: ["facsimile"],
          },
        ],
      },
    ],
    geometry: {
      geometries: [
        {
          type: "Point",
          coordinates: [147.683, -18.833],
        },
      ],
      type: "GeometryCollection",
    },
    themes: [
      {
        scheme: "",
        concepts: [
          {
            id: "surface_downwelling_photosynthetic_radiative_flux_in_air",
            description: "",
            title: "",
          },
        ],
      },
      {
        scheme: "theme",
        concepts: [
          {
            id: "Depth of observation or sample collection",
            url: "user contributed",
            description: "",
            title: "AODN Discovery Parameter Vocabulary",
          },
          {
            id: "Practical salinity of the water body",
            url: "http://vocab.nerc.ac.uk/collection/P01/current/PSLTZZ01",
            description: "",
            title: "AODN Discovery Parameter Vocabulary",
          },
          {
            id: "Precipitation rate (liquid water equivalent) in the atmosphere",
            url: "http://vocab.aodn.org.au/def/discovery_parameter/entity/94",
            description: "",
            title: "AODN Discovery Parameter Vocabulary",
          },
          {
            id: "Thickness of precipitation amount (liquid water equivalent) in the atmosphere",
            url: "http://vocab.aodn.org.au/def/discovery_parameter/entity/386",
            description: "",
            title: "AODN Discovery Parameter Vocabulary",
          },
          {
            id: "Pressure (measured variable) in the water body exerted by overlying sea water only",
            url: "http://vocab.aodn.org.au/def/discovery_parameter/entity/566",
            description: "",
            title: "AODN Discovery Parameter Vocabulary",
          },
          {
            id: "Temperature of the atmosphere",
            url: "http://vocab.nerc.ac.uk/collection/P01/current/CTMPZZ01",
            description: "",
            title: "AODN Discovery Parameter Vocabulary",
          },
          {
            id: "Relative humidity of the atmosphere",
            url: "http://vocab.nerc.ac.uk/collection/P01/current/CRELZZ01",
            description: "",
            title: "AODN Discovery Parameter Vocabulary",
          },
          {
            id: "Wind from direction in the atmosphere",
            url: "http://vocab.nerc.ac.uk/collection/P01/current/EWDAZZ01",
            description: "",
            title: "AODN Discovery Parameter Vocabulary",
          },
          {
            id: "Wind speed in the atmosphere",
            url: "http://vocab.nerc.ac.uk/collection/P01/current/ESSAZZ01",
            description: "",
            title: "AODN Discovery Parameter Vocabulary",
          },
          {
            id: "Specific electrical conductivity of the water body",
            url: "http://vocab.aodn.org.au/def/discovery_parameter/entity/730",
            description: "",
            title: "AODN Discovery Parameter Vocabulary",
          },
          {
            id: "Temperature of the water body",
            url: "http://vocab.nerc.ac.uk/collection/P01/current/TEMPPR01",
            description: "",
            title: "AODN Discovery Parameter Vocabulary",
          },
          {
            id: "Pressure (measured variable) exerted by the atmosphere",
            url: "http://vocab.nerc.ac.uk/collection/P01/current/CAPHZZ01",
            description: "",
            title: "AODN Discovery Parameter Vocabulary",
          },
          {
            id: "Precipitation duration (liquid water equivalent) in the atmosphere",
            url: "http://vocab.aodn.org.au/def/discovery_parameter/entity/405",
            description: "",
            title: "AODN Discovery Parameter Vocabulary",
          },
        ],
      },
    ],
    statement:
      "Statement: Data from AIMS weather stations are subjected to two quality control processes.\n\nThe first quality control process involves applying automatic rules to the raw data to flag data points that are unlikely to be correct. These rules flag:\n- Values frequently associated with sensors which are faulty, in need of a service or are not working properly.\n- Values outside believable ranges.\n- Values that are out of range compared to other nearby stations.\n\nThe second quality control process involves manual visualisation of all data. Data from all sensors are individually graphed and compared to sensors on the same station (e.g. water temperature 1 and water temperature 2), calibrated temperature loggers, predicted values (e.g. PAR) or compared to sensors from nearby stations (including Bureau of Meteorology stations in the case of barometric pressure, wind speed and direction).\n\nAfter these processes have been applied the data can be categorised in the following three levels.\n\nLevel 0: Raw unprocessed data as received from the AWS. This data has had no quality control process applied to it.\n\nLevel 1: Level 1 data has had all suspect data points removed but no suspect data points are corrected.\n\nLevel 2: Level 2 data has had all suspect data points that were removed in Level 1 corrected where possible.\n\nData from all three levels can be accessed from the AIMS weather station web site.\n\n\n \n\n\n IMOS Sensor Floats:\n\n\nAll sensors are factory calibrated and serviced every six months.\nData are checked against a set of rules and then flagged using the IODE set of flags.",
    temporal: [
      {
        start: "1991-10-17T13:00:00Z",
      },
    ],
  },
  id: "5fc91100-4ade-11dc-8f56-00008a07204e",
  title: "Davies Reef Automated Marine Weather And Oceanographic Station",
  description:
    'This dataset contains meteorological and sea temperature data from the weather station moored in the lagoon on Davies Reef on the Great Barrier Reef.\n These data are collected to support scientific research at AIMS. Data are made available on request to other researchers and to the public.\n The weather station is an AIMS Mk3 System.Data recorded: Sea Temperature (4m, 8.5m and 18.5m at MSL), Barometric Pressure, Air Temperature, Solar Radiation (PAR), Wind Direction True (vector averaged), Wind Speed True (30 min average).1. Operation and Weather SensorsThe weather stations collect and store data in electronic memory every half-hour. A central base station calls each remote station regularly using HF radio or telephone lines. The data is transmitted over the radio as a frequency shift keyed signal, organised as packets of information. Errors are detected using parity and check sum methods. Invalid packets are identified by the Base Station, which requests they be sent again. This concept allows recovery of a very high percentage of the data despite poor communications. Remote stations store data for 21 days. Features such as automatic operation, remote control, remote time setting, built in diagnostics, have been developed and incorporated.The sensors are a key part of a weather station. The following are chosen considering the cost, reliability and accuracy.* R.M.Young manufactures the wind sensor, a model number 05103. It is a propeller type with the advantages of being highly linear, highly interchangeable and having a low threshold. Wind direction is measured as the direction the wind is coming from.* The solar radiation sensor is an Under Water Quantum Sensor made by Licor. It measures light in terms of its "Photosynthetically Active Radiation" (PAR). The spectral response is defined and weighted. Drift due to aging of the filters has proven to be a problem, but this applies to similar units too.* Temperature sensors are all Omega Interchangeable Thermistors. These are interchangeable and have high accuracy, but reliability has proven a problem. We are considering alternatives.* The barometric sensor was a modified Aanderaa type on earlier stations. The Mk2 stations were fitted with a Weathertronics Unit. Now all stations are Mk3 stations fitted with a Vaisala barometer which is more interchangeable and more accurate.2. System AccuracySystem accuracy is calculated as the sum of errors caused by: * Calibration * Interchanging sensors * Drift with time * Effects of an ambient temperature range from 0-40 degrees C.The following are the specifications of the sensors used with Mk3 stations. A new sensor suite will be used with Mk5 stations, partly based on the Vaisala WXT510 weather sensor.Both the temperature and wind sensors are interchangeable, and not individually calibrated, though some individual sensors have been checked against standards.* Air Temperature: Interchangeable thermistor and electronics is within +/- 0.4 deg. C, with a 30 seconds settling time in air. There are additional errors due to the aspiration of the temperature screen at low wind speeds.* Water temperature: Interchangeable thermistor and electronics is within +/- 0.4 deg. C, with a 30 minutes settling time in water. A higher precision in situ calibration is normally used (around +/- 0.1 degrees), traceable to a 0.04 degrees standard.* Solar radiation (PAR): +/- 5% of reading. Sensor drift is approximately -4% per year initially.* Barometric pressure: +/- 1 hecto Pascal.* Wind speed: 2% of reading +/- 0.1% FSD.* Wind direction: 2% of reading +/- 0.1% FSD.Electrical settling time for solar radiation and wind parameters is 7 seconds. This is necessary for anti-aliasing filters. Mk1 and Mk2 stations averaged 16 samples over the 16 seconds before logging. Mk3 stations use a continuously averaging software system. The wind readings are vector averaged, so direction is accounted for properly.Calibration procedures and routines are detailed on the Engineering website.3. Wind Sensor SpecificationThe following are additional specifications of the wind sensors used with Mk3 stations. A new sensor will be used with Mk5 stations. Wind sensors are mounted at a nominal 10 meters above water. The R.M. Young sensor has the following characteristics:* Wind SpeedRange: 0-60 m/sPitch: 29.4 cm air passes per rev.Distance constant: 2.7 m for 63% recovery* Wind DirectionRange: 360 deg, with 5 deg electrically open at northDamping ratio: 0.25Delay distance: 1.5 m for 50% recoveryThreshold: 1.0 m/s @ 10 deg.Displacement: 1.5 m/s @ 5 deg. displacement Damped w/length: 7.4 mUndamped w/length: 7.2 m4. Underwater Temperature SensorsThese sensors are interchangeable thermistors in Mk3 stations. They can be mounted a significant distance from the weather station, using a 2 wire connection. The basic accuracy is due to the use of interchangeable units. However improved accuracy is obtained by calibrating against a precision reference sensor in situ. These are in turn calibrated against a standard traceable to 0.04 degrees.',
  links: [
    {
      href: "https://docs.ropensci.org/dataaimsr/",
      rel: "related",
      type: "",
      title: "Data access using R",
    },
    {
      href: "https://weather.aims.gov.au/#/station/4",
      rel: "related",
      type: "",
      title: "Marine Weather Observations for Davies Reef",
    },
    {
      href: "https://portal.aodn.org.au/search?uuid=0887cb5b-b443-4e08-a169-038208109466",
      rel: "related",
      type: "",
      title: "Data access via AODN Portal",
    },
    {
      href: "https://open-aims.github.io/data-platform/",
      rel: "related",
      type: "",
      title: "Data access via Programming API",
    },
    {
      href: "https://geonetwork-edge.edge.aodn.org.au:443/geonetwork/images/logos/81465e5f-731c-4f72-9b4e-68f2f5e52f41.png",
      rel: "icon",
      type: "image/png",
      title: "Suggest icon for dataset",
    },
    {
      href: "https://apps.aims.gov.au/metadata/view/5fc91100-4ade-11dc-8f56-00008a07204e",
      rel: "describedby",
      type: "text/html",
      title: "Full metadata link",
    },
    {
      href: "http://i.creativecommons.org/l/by/3.0/au/88x31.png",
      rel: "license",
      type: "image/png",
    },
    {
      href: "http://creativecommons.org/licenses/by/3.0/au/",
      rel: "license",
      type: "text/html",
    },
    {
      href: "uuid:0887cb5b-b443-4e08-a169-038208109466",
      rel: "parent",
      type: "application/json",
      title:
        '{"title":"Northern Australia Automated Marine Weather and Oceanographic Stations","recordAbstract":"Automatic weather stations have been deployed by AIMS since 1980. Most of the stations are along the Great Barrier Reef including the Torres Strait in North-Eastern Australia but there is also a station in Darwin and one in Ningaloo Reef in Western Australia. Many of the stations are located on the reef itself either on poles located in the reef lagoon or on tourist pontoons or other structures. The following is a list of the weather stations which have been deployed by AIMS and the period of time for which data may be available. Records may not be continuous for the time spans given. \\n\\nCurrently Active Stations:\\n\\n\\nQueensland:\\nAgincourt Reef: Start 1/11/1989\\nCape Bowling Green: Start 9/7/1983\\nCleveland Bay: Start 3/7/1990\\nDavies Reef: Start 18/10/1991\\nSquare Rocks: Start 19/12/2009\\nHardy Reef: Start 14/6/1989\\nLizard Island: Start 13/08/2010\\nHeron Island: Start 02/08/2008\\nMyrmidon Reef: Start 2/11/1987\\nWreck of the Yongala: Start 30/10/2010\\n\\n\\nNorthern Territory:\\nDarwin: Start 14/02/2015\\n\\n\\nWestern Australia:\\nNingaloo Reef (Milyering): Start 12/2/1997\\n\\n\\nTorres Strait:\\nThursday Island: Start 06/02/12\\nBramble Cay (Maizab Kaur): Start 15/7/2015\\nMasig (Yorke) Island: Start 6/2/2012\\n\\n\\nHistorical Data:\\nBadu Island: Start 08/05/2018: End 03/06/2021\\nBeagle Gulf Mooring: Start 24/5/2015: End 16/7/2017\\nCape Cleveland: Start 2/6/1993: End 30/9/1996\\nCape Ferguson: Start 1/11/1983: End 30/5/1985\\nCoconut Island: Start 30/9/1988: End 5/11/1991 (Data not yet located)\\nCoral Creek (Hinchinbrook Island): Start 16/10/1980: End 30/7/1985\\nDaintree River: Start 12/2/97: End 31/5/98\\nHalftide Rock: Start 26/7/2000: End 19/12/2009\\nJohn Brewer Reef: Start 31/7/1987: End 30/5/1988\\nOne Tree Island: Start 18/11/2008: End 11/06/2021\\nOrpheus Island: Start 20/12/2002: End 02/09/2010\\nRaine Island: Start 08/08/2012: End - Station currently maintained by Qld National Parks\\nRib Reef: Start 29/2/1980: End 3/12/1985\\nSaibai Island: Start 01/05/2016: End 05/03/2021\\n\\n\\nWeather stations may be equipped with sensors to measure some or all of the following parameters: sea temperature at a range of depths, atmospheric pressure, air temperature, relative humidity, solar radiation (light as PAR), wind direction and wind speed.\\n\\n\\nThese data are collected to support scientific research at AIMS. A number of funding bodies have contributed to the infrastructure and data collection, or continue to contribute to and support the program. In addition to the Northern Australia Automated Marine Weather and Oceanographic Stations Program, these include: \\n\\n\\n-Australian Institute of Marine Science (AIMS)\\n-Integrated Marine Observing System (IMOS). IMOS is a national collaborative research infrastructure, supported by the Australian Government.\\n-Queensland State Government Integrated Marine Observing System (IMOS) - an initiative of the Australian Government being conducted as part of the National Research Infrastructure Strategy\\n-Wireless Sensor Networks Facility (formerly known as Facility for The Automated Intelligent Monitoring of Marine Systems (FAIMMS)), part of the Great Barrier Reef Ocean Observing System project (GBROOS) (IMOS)\\n-The Tropical Water Quality Hub of the National Environmental Science Programme (NESP) and preceeding body Tropical Ecosystems Hub of the National Environmental Research Program (NERP), funded by the Australian Government.\\n\\n\\n\\nDownload via the AODN Portal is currently unavailable, access through programming links below or the AIMS Time Series Explorer - https://apps.aims.gov.au/ts-explorer/"}',
    },
    {
      href: "uuid:19c035cc-8ac2-42af-a9fd-d00554b280d4",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"Rib Reef Automated Marine Weather And Oceanographic Station","recordAbstract":"This data contains weather data from Rib Reef, covering the periods 29-2-1980 to 25-6-1983, and 3-7-1983 to 30-12-1985. Both sets of data were recorded at the same location, the Rib Reef beacon. The earlier sequence was derived from data recorded on tape at the station, collected and then uploaded back at AIMS. The second sequence used telemetery to send binary data daily to a computer controlled base station. Data was verified by comparing three sets of the same data, received over three days. The base station passed data to the central computing facility at AIMS for processing. Lightning destroyed this system in 1985.\\n\\nData recorded: Wind direction (0-360&deg;); Wind speed (km/hr); Air temperature (&deg;C); Barometric pressure (mb); Solar radiation PAR (&micro;E/sec/m&sup2;).\\nOther variables: Time of day (e.g. 21:53:54); Day of year (e.g.118); Year (e.g. 86).\\n\\n\\nSensor network infrastructure was installed at Rib Reef in the central Great Barrier Reef off Townsville, Australia from 14-12-2011 to 20-04-2016. The infrastructure consists of a single 1300 mm buoy located off the north (front) of the reef. The buoy has an Inductive Modem (IM) line that extends from the buoy to the bottom and then along the bottom for around 50 m and then rises to flotation located 9 m below the surface. Instruments are located on this riser to give a profile through the water column.\\n\\nThe station is designed to measure temperature of the water column at the front of the reef and in particular to detect upwelling and other events where warmer bottom water is pushed across the shelf onto the reefs. This not only indicates processes operating across the shelf but also conditions when coral bleaching may be more common.\\n\\n\\nThe sensor network lnfrastructure is part of the Wireless Sensor Networks Facility (formerly known as Facility for The Automated Intelligent Monitoring of Marine Systems (FAIMMS)), part of the Great Barrier Reef Ocean Observing System project (GBROOS) (IMOS) is part of the GBROOS or Great Barrier Reef Ocean Observing System project which in turn is part of the Australian Integrated Marine Observing System or IMOS.\\n\\n\\nThese data were collected to support scientific research at AIMS. Data are available on request to other researchers and to the public.\\n\\n\\nInformation about accuracy and the sensors used are in the Data Quality section of this metadata record."}',
    },
    {
      href: "uuid:508fcf30-55f6-11dc-8d3c-00008a07204e",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"Daintree Automated Marine Weather And Oceanographic Station","recordAbstract":"This dataset contains historical meteorological data from the weather station, which was located north of the Daintree River in North Queensland, between 12 February 1997 and 31 May 1998.Data recorded: Barometric Pressure, Air Temperature, Solar Radiation (PAR), Wind Direction True (vector averaged), Wind Speed True (30 min average), Humidity, Rainfall.\\n These data were collected to support scientific research at AIMS. Data are made available on request to other researchers and to the public.\\n The weather station was an AIMS Mk3 System1. Operation and Weather SensorsThe weather stations collect and store data in electronic memory every half-hour. A central base station calls each remote station regularly using HF radio or telephone lines. The data is transmitted over the radio as a frequency shift keyed signal, organised as packets of information. Errors are detected using parity and check sum methods. Invalid packets are identified by the Base Station, which requests they be sent again. This concept allows recovery of a very high percentage of the data despite poor communications. Remote stations store data for 21 days. Features such as automatic operation, remote control, remote time setting, built in diagnostics, have been developed and incorporated.The sensors are a key part of a weather station. The following are chosen considering the cost, reliability and accuracy.* R.M.Young manufactures the wind sensor, a model number 05103. It is a propeller type with the advantages of being highly linear, highly interchangeable and having a low threshold. Wind direction is measured as the direction the wind is coming from.* The solar radiation sensor is an Under Water Quantum Sensor made by Licor. It measures light in terms of its \\"Photosynthetically Active Radiation\\" (PAR). The spectral response is defined and weighted. Drift due to aging of the filters has proven to be a problem, but this applies to similar units too.* Temperature sensors are all Omega Interchangeable Thermistors. These are interchangeable and have high accuracy, but reliability has proven a problem. We are considering alternatives.* The barometric sensor was a modified Aanderaa type on earlier stations. The Mk2 stations were fitted with a Weathertronics Unit. Now all stations are Mk3 stations fitted with a Vaisala barometer which is more interchangeable and more accurate.2. System AccuracySystem accuracy is calculated as the sum of errors caused by: * Calibration * Interchanging sensors * Drift with time * Effects of an ambient temperature range from 0-40 degrees C.The following are the specifications of the sensors used with Mk3 stations. A new sensor suite will be used with Mk5 stations, partly based on the Vaisala WXT510 weather sensor.Both the temperature and wind sensors are interchangeable, and not individually calibrated, though some individual sensors have been checked against standards.* Air Temperature: Interchangeable thermistor and electronics is within +/- 0.4 deg. C, with a 30 seconds settling time in air. There are additional errors due to the aspiration of the temperature screen at low wind speeds.* Solar radiation (PAR): +/- 5% of reading. Sensor drift is approximately -4% per year initially.* Barometric pressure: +/- 1 hecto Pascal.* Wind speed: 2% of reading +/- 0.1% FSD.* Wind direction: 2% of reading +/- 0.1% FSD.Electrical settling time for solar radiation and wind parameters is 7 seconds. This is necessary for anti-aliasing filters. Mk1 and Mk2 stations averaged 16 samples over the 16 seconds before logging. Mk3 stations use a continuously averaging software system. The wind readings are vector averaged, so direction is accounted for properly.Calibration procedures and routines are detailed on the Engineering website.3. Wind Sensor SpecificationThe following are additional specifications of the wind sensors used with Mk3 stations. A new sensor will be used with Mk5 stations. Wind sensors are mounted at a nominal 10 meters above water. The R.M. Young sensor has the following characteristics:* Wind SpeedRange: 0-60 m/sPitch: 29.4 cm air passes per rev.Distance constant: 2.7 m for 63% recovery* Wind DirectionRange: 360 deg, with 5 deg electrically open at northDamping ratio: 0.25Delay distance: 1.5 m for 50% recoveryThreshold: 1.0 m/s @ 10 deg.Displacement: 1.5 m/s @ 5 deg. displacement Damped w/length: 7.4 mUndamped w/length: 7.2 m"}',
    },
    {
      href: "uuid:df3d7659-0335-4cfb-80be-f044039c735f",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"Raine Island Automated Marine Weather And Oceanographic Station","recordAbstract":"This dataset contains meteorological data from Raine Island, Great Barrier Reef, from August 2012. The weather station is located on the Raine Island tower under a project with the Queensland Department of Environment and Resource Management (DERM).\\n These data are collected to support scientific research at AIMS and DERM, data are part of a study into the breeding success of turtles on Raine Island. Data are made available on request to other researchers and to the public.\\n The weather station is an AIMS Mk5 System.Data recorded: Barometric Pressure, Air Temperature, Wind Direction True (vector averaged), Wind Speed True (30 min average) and Humidity using a Vaisala WXT-520 weather station.Addditional data collected includes ground water levels and temperatures using bore-hole sensors along with video and still cameras to record turtle movements.1. Operation and Weather SensorsThe weather stations collect and store data in electronic memory every half-hour. A central base station calls each remote station regularly using a satellite link. Remote stations store data for 21 days. Features such as automatic operation, remote control, remote time setting, built in diagnostics, have been developed and incorporated.The sensors are a key part of a weather station. The station uses a Vaisala WXT520 weather station with additional sealing.2. System AccuracySystem accuracy is calculated as the sum of errors caused by: * Calibration * Interchanging sensors * Drift with time * Effects of an ambient temperature range from 0-40 degrees C."}',
    },
    {
      href: "uuid:ee22a601-97cf-4b91-ac85-36c0198f912c",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"One Tree Island Automated Marine Weather And Oceanographic Station","recordAbstract":"Sensor network infrastructure was installed at One Tree Island in the southern Great Barrier Reef off Gladstone, Australia. The infrastructure consists of a base station mounted on the existing water tower and three sensor poles located in each of the major lagoon systems around the island. Each pole has a thermistor mounted at the base and then a thermistor string with five additional sensors that are located down the wall of the coral structure into the lagoon.\\n\\nThe initial design is to monitor the flow of water through the lagoon which is often &#39;ponded&#39; due to the high coral rim to the lagoon, this creates complex in and out flows and flushing of the lagoon system.\\n\\nThe deployment in August 2008 consisted of the base station using the Telstra nextG service, three 6m relay-sensor poles located in the lagoons.\\n\\n\\nThe project looks to deploy sensor networks at seven sites along the Great Barrier Reef to measure a range of physical parameters at a range of scales. The project will install communications, data and platform infrastructure that will support future sensor work looking at biological and chemical parameters.\\n\\n\\nThis project is part of the Wireless Sensor Networks Facility (formerly known as Facility for The Automated Intelligent Monitoring of Marine Systems (FAIMMS)), part of the Great Barrier Reef Ocean Observing System project (GBROOS) (IMOS)"}',
    },
    {
      href: "uuid:23257155-fa16-4361-ae82-b2a09e4bf9ac",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"Beagle Gulf Mooring (NRSBEG) Automated Marine Weather And Oceanographic Station","recordAbstract":"The Beagle Gulf Surface Buoy was deployed from May 2015 to July, 2017. The nearby Darwin mooring (NRSDAR) provides ongoing observations in this region. \\n\\n\\nData recorded: Air Pressure, Air Temperature, Current, Depth, Dissolved Oxygen, Fluorescence, Humidity, Light, Rain, Salinity, Turbidity, Water Temperature, Wave and Wind Speed and Direction.\\n\\n\\nThe Beagle Gulf mooring extended seaward oceanographic observations from Darwin Harbour and complemented the National Reference Station located at Channel Marker Buoy#5. The mooring was upgraded to near real time in September 2014. Channel marker number 5 was removed in February 2015, resulting in the mooring being moved to Channel marker 1. For full instrumentation specifications see the informaition recorded for each deployment at link https://www.aims.gov.au/imosmoorings/\\n\\n\\nThe marine observing systems deliver the information needed to support the development and operational management of ports and harbours. Most ports and harbours are multi-use regions supporting industry and recreational activities, and observing systems play an important role in both port operations, and in generating understanding of processes that impact the sustainable use and development of these areas (e.g. sediment transport, water quality). Water current profiles and wave measurements directly assist shipping operations and feed into a model that seeks to evaluate impacts on the health of the harbour.\\n\\n\\nThe NRS Darwin mooring (IMOS platform code: NRSDAR), is one of 9 IMOS ANMN National Reference Stations (NRS) designed to monitor oceanographic phenomena in Australian coastal ocean waters. The NRSDAR buoy is deployed at Latitude: -12.3382, Longitude: 130.6952.\\n\\n\\nThe IMOS national reference stations will extend the number of long term time series observations in Australian coastal waters in terms of variables recorded both in their temporal distribution and geographical extent. It will also provide for biological, physical and chemical sampling and for &#39;ground truth&#39; of remotely sensed observations.\\n\\n\\nIMOS is an Australian Government initiative established under the National Collaborative Research Infrastructure Strategy and the Super Science Initiative and supported by Queensland and Western Australian State Governments."}',
    },
    {
      href: "uuid:adc44fac-9c8a-4e32-adfd-e68201c44dd9",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"Cape Ferguson (AIMS Wharf) Automated Marine Weather And Oceanographic Station","recordAbstract":"This historical weather data from the Cape Ferguson (AIMS Wharf) weather outstation covers the period 1-11-1983 to 30-5-1984.\\n\\nAfterwards, the same unit was deployed at Cape Bowling Green and collected data at that location for the period 18-9-1984 to 4-10-1985.\\n\\nBoth data collection periods used telemetery to send binary data daily to a computer controlled base station. Data was verified by comparing three sets of the same data, received over three days. The base station passed data to the central computing facility at AIMS for processing.\\n\\nData recorded covers: Wind direction (0-360&deg;); Wind run (km/hr); Air temperature (0-40&deg;C); Water temperature (0-40&deg;C); Barometric pressure (mB); Solar radiation (0-2500 &micro;E/sec/M2).\\n\\nOther variables:\\nTime of day (e.g. 23:46:03); Day of the year (e.g. 118); Year (e.g. 86).\\n\\n\\nThese data are collected to support scientific research. Data are made available on request to other researchers and to the public as well as being available from the AIMS web site\\n\\n\\nInformation about accuracy and the sensors used are in the Data Quality section of this metadata record."}',
    },
    {
      href: "uuid:35446fc0-4af6-11dc-b9a3-00008a07204e",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"Orpheus Island Automated Marine Weather And Oceanographic Station","recordAbstract":"This dataset contains meteorological and sea temperature data from the weather station located on Orpheus Island on the Great Barrier Reef.\\n These data are collected to support scientific research at AIMS. Data are made available on request to other researchers and to the public.\\n The weather station is a Campbell Scientific Australia System.Data recorded: Sea Temperature (1.9m and 6m at MSL), Air Temperature, Solar Radiation (PAR), Wind Direction True (scalar averaged), Wind Speed True (10 min average prior to every half hour and maximum wind gust), Rainfall.Wind speeds shown are NOT indicative of wind speeds generally in this area. This is because the Orpheus AWS is situated on the lee side of Orpheus island and is protected from SE winds.1. Operation and Weather SensorsThe weather stations collect and store data in electronic memory every half-hour. A central base station calls each remote station regularly using HF radio or telephone lines. The data is transmitted over the radio as a frequency shift keyed signal, organised as packets of information. Errors are detected using parity and check sum methods. Invalid packets are identified by the Base Station, which requests they be sent again. This concept allows recovery of a very high percentage of the data despite poor communications. Remote stations store data for 21 days. Features such as automatic operation, remote control, remote time setting, built in diagnostics, have been developed and incorporated.The sensors are a key part of a weather station. The following are chosen considering the cost, reliability and accuracy.* R.M.Young manufactures the wind sensor, a model number 05103. It is a propeller type with the advantages of being highly linear, highly interchangeable and having a low threshold. Wind direction is measured as the direction the wind is coming from.* The solar radiation sensor is an Under Water Quantum Sensor made by Licor. It measures light in terms of its \\"Photosynthetically Active Radiation\\" (PAR). The spectral response is defined and weighted. Drift due to aging of the filters has proven to be a problem, but this applies to similar units too.* Temperature sensors are all Omega Interchangeable Thermistors. These are interchangeable and have high accuracy, but reliability has proven a problem. We are considering alternatives.* The barometric sensor was a modified Aanderaa type on earlier stations. The Mk2 stations were fitted with a Weathertronics Unit. Now all stations are Mk3 stations fitted with a Vaisala barometer which is more interchangeable and more accurate.2. System AccuracySystem accuracy is calculated as the sum of errors caused by: * Calibration * Interchanging sensors * Drift with time * Effects of an ambient temperature range from 0-40 degrees C.The following are the specifications of the sensors used with Mk3 stations. A new sensor suite will be used with Mk5 stations, partly based on the Vaisala WXT510 weather sensor.Both the temperature and wind sensors are interchangeable, and not individually calibrated, though some individual sensors have been checked against standards.* Air Temperature: Interchangeable thermistor and electronics is within +/- 0.4 deg. C, with a 30 seconds settling time in air. There are additional errors due to the aspiration of the temperature screen at low wind speeds.* Water temperature: Interchangeable thermistor and electronics is within +/- 0.4 deg. C, with a 30 minutes settling time in water. A higher precision in situ calibration is normally used (around +/- 0.1 degrees), traceable to a 0.04 degrees standard.* Solar radiation (PAR): +/- 5% of reading. Sensor drift is approximately -4% per year initially.* Barometric pressure: +/- 1 hecto Pascal.* Wind speed: 2% of reading +/- 0.1% FSD.* Wind direction: 2% of reading +/- 0.1% FSD.Electrical settling time for solar radiation and wind parameters is 7 seconds. This is necessary for anti-aliasing filters. Mk1 and Mk2 stations averaged 16 samples over the 16 seconds before logging. Mk3 stations use a continuously averaging software system. The wind readings are vector averaged, so direction is accounted for properly.Calibration procedures and routines are detailed on the Engineering website.3. Wind Sensor SpecificationThe following are additional specifications of the wind sensors used with Mk3 stations. A new sensor will be used with Mk5 stations. Wind sensors are mounted at a nominal 10 meters above water. The R.M. Young sensor has the following characteristics:* Wind SpeedRange: 0-60 m/sPitch: 29.4 cm air passes per rev.Distance constant: 2.7 m for 63% recovery* Wind DirectionRange: 360 deg, with 5 deg electrically open at northDamping ratio: 0.25Delay distance: 1.5 m for 50% recoveryThreshold: 1.0 m/s @ 10 deg.Displacement: 1.5 m/s @ 5 deg. displacement Damped w/length: 7.4 mUndamped w/length: 7.2 m4. Underwater Temperature SensorsThese sensors are interchangeable thermistors in Mk3 stations. They can be mounted a significant distance from the weather station, using a 2 wire connection. The basic accuracy is due to the use of interchangeable units. However improved accuracy is obtained by calibrating against a precision reference sensor in situ. These are in turn calibrated against a standard traceable to 0.04 degrees."}',
    },
    {
      href: "uuid:2fdf37c3-7937-4eac-b31b-2efb88e42c4d",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"Bramble Cay Automated Marine Weather And Oceanographic Station","recordAbstract":"This dataset contains meteorological and light data from the weather station located on Bramble Cay in the northern part of the Torres Strait. The station was installed under funding from the National Environmental Science Programme (NESP) Tropical Water Quality Hub under Projects 2.2.1 and Project 5.14 with support from the Torres Strait Regional Authority (TSRA).\\n\\n\\nThese data are collected to support scientific research. Data are made available on request to other researchers and to the public as well as being available from the AIMS web site. This weather station is funded by NESP with support from the Torres Strait Regional Authority (TSRA).\\n\\n\\nThe weather station is an AIMS Mk5 system consisting of a Vaisala WXT520 weather station and a LiCor 192 Light Sensor. The system has seperate underwater sensors that are logged (and so not transmitted in real time). These sensors include a WetLabs NTUS turbidity sensor and a SeaBird SBE37 CDT (Condutivity (salinity), Temperature and Depth) located just off the Cay in 3m of water.\\n\\nNote that this station is located on land and has NO in-water sensors. \\n\\nData recorded: Barometric Pressure, Air Temperature, Humidity, Solar Radiation (PAR), Wind Direction True (vector averaged), Wind Speed True (30 min average), rain duration and rate, precipitation amount.\\n\\nThe weather stations collect and store data in electronic memory every ten minutes, the station uses the 3G phone network to send the data to AIMS where it is stored in a database and then made available via the web and other systems. \\n\\nThe data are then checked for accuracy using a number of range and historical checks, longer term summeries are then calculated along with indicies of potential thermal stress."}',
    },
    {
      href: "uuid:efc69c33-528f-4853-99aa-74d73e0daffa",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"Lizard Island Automated Marine Weather and Oceanographic Station","recordAbstract":"Sensor network infrastructure was installed at Lizard Island in the northern Great Barrier Reef off Cooktown, Australia. The infrastructure consists of a base station mounted on the workshop of the Lizard Island Research Station (LIRS), two sensor poles that create the on-reef network and four sensor floats on which the sensors are attached. The network uses both 802.11 links and slower spread-spectrum links between the deployed equipment and a Telstra nextG link back to the mainland.\\n\\nThe sensors deployed consist of a Vaisala WXT520 weather station mounted on RP2, MEA Thermistors mounted on each of the buoys to give surface temperature and a mix of SeaBird SBE37 CTD and SeaBird SBE39 TD via inductive cables / modems on the buoys. Sensor strings (inductive cables) are run across the sea bed to position the instruments in deeper water.\\n\\n\\nThe project looks to deploy sensor networks at seven sites along the Great Barrier Reef to measure a range of physical parameters at a range of scales. The project will install communications, data and platform infrastructure that will support future sensor work looking at biological and chemical parameters.\\n\\n\\nSensor Floats: \\nA round 1.4m yellow buoy has been deployed in the southern part of the main lagoon of Lizard Island to the east of Palfrey Island. The buoy is configured as a sensor-float with a Campbell Scientific logger, spread-spectrum radio and 2.4/5 GHz 802.11 wireless for communicating with the base station (located at the workshop near the Research Station) a surface mounted (60cm under the water surface) thermistor and an inductive modem to support a range of inductive sensors, initially this will be a SeaBird SBE39 measuring temperature and pressure (depth) and a SeaBird SBE37 measuring conductivity (salinity), temperature and depth.\\n\\nAs of August 2010 the inductive sensors are located along a 30m cable that runs north into the main lagoon with a SBE39 located at the base of the buoy and the SBE37 at the end of the sensor run.The unit will be serviced every six months and will be used in the future for attaching new sets of sensors.\\n\\n\\nThe buoy is one of four buoys and two relay-poles being deployed on Lizard Island as part of the GBROOS Project. The design looks to measure the water within the lagoon as well as water impinging onto the reef and potentially any upwelling or movement of warm water that may cause thermal stress such as coral bleaching.\\n\\nThe buoys initially have a Campbell Scientific loggers powered off four 5W solar panels, a wind turbine and one thermistor located at the base of the buoy around 60cm below the water line. The buoys use a Campbell Scientific spread-spectrum radio as well as 802.11 Wi-Fi to talk back to Relay Pole 2 and then to Replay-Pole 1 and then to the Base Station.\\n\\n\\nWeather Stations on Relay Pole 2:\\nA Vaisala WXT520 integrated weather station has been installed on RP2, a 6m steel pole which has been installed within the lagoon of Lizard Island on the northern Great Barrier Reef. The sensor-relay pole provides a platform for the installation of sensors to measure and monitor water conditions within the lagoon of Lizard Island. The pole has real time communications using 900MHz spread spectrum radio back to a base station on Lizard Island.\\n\\nThe weather station provides measurement of air temperature (Deg. C.), humidity as relative percent, barometric pressure (milliBars or hPa), rainfall amount, intensity and duration, hail amount, intensity and duration (not common on coral reefs!) and wind speed and direction. The wind speed and direction and processed into scalar and vector (directional) based readings and presented as 10 and 30 minute averages to give mean values and maximum values. From these you can get the average wind conditions at either 10 minute or 30 minute periods as well as the gust or maximum wind conditions.\\n\\nThe weather station is connected via an SDI-12 interface to a Campbell Scientific CR1000 logger which uses a RF411 radio to transmit the data, every 10 minutes, to the base station on Lizard Island and then a Telstra nextG link is used to send the data back to AIMS. Identical weather stations are also on Heron Island (southern GBR), One Tree Island (near by) and Orpheus Island (central GBR). A light sensor is also located on the Island itself to give measures of PAR.\\n\\n\\nThe weather station is to provide on-reef weather conditions to allow the interaction with the atmosphere and the water to be understood. It is NOT set up as a meteorological grade station (for example it is too low to the water) but rather to give an indication of the atmospheric conditions at the surface of the water actually on the reef. If you need meteorological grade observations then use the data available for near by locations from www.bom.gov.au\\n\\n\\nPower Supply\\nBattery Backed (1 x 33Ahr AGM with Solar Regulator), 4 x 5W Solar Panel Supply.\\n\\nLogger Settings -\\nPakbus Address - 150\\nLogger Setup as router (isRouter = True)\\nSDC7 comms board rate set at 34K\\nSDC7 neighbours range: 1 - 180\\nSDC7 Beacon: 3600\\n\\nOver-Reef RF Network -\\nRF411 attached to the CSIO port of the logger\\n\\nRadio Settings -\\nActive Interface - Datalogger CSDC\\nSDC Address 7\\nProtocol: Pakbus aware\\nRadio Net Address - 0\\nHop Sequence - 0\\nPower mode - &lt; 2mA 1 Second\\nRetry level - Low\\n\\n\\nThis project is part of the Wireless Sensor Networks Facility (formerly known as Facility for The Automated Intelligent Monitoring of Marine Systems (FAIMMS)), part of the Great Barrier Reef Ocean Observing System project (GBROOS) (IMOS)"}',
    },
    {
      href: "uuid:60b0d8f0-4ade-11dc-8f56-00008a07204e",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"Myrmidon Reef Automated Marine Weather And Oceanographic Station","recordAbstract":"This dataset contains meteorological and sea temperature data from the weather station moored on Myrmidon Reef on the Great Barrier Reef.\\n These data are collected to support scientific research at AIMS. Data are made available on request to other researchers and to the public.\\n The weather station is an AIMS Mk3 System.Data recorded: Sea Temperature (~2m, ~4m, ~7m and ~18m at MSL), Barometric Pressure, Air Temperature, Solar Radiation (PAR), Wind Direction True (vector averaged), Wind Speed True (30 min average).This weather station has been deployed in two different locations on Myrmidon Reef.Location 1: -18.2746, 147.3830 from 1987 until June 1999Location 2: -18.267, 147.367 from June 1999 to present.1. Operation and Weather SensorsThe weather stations collect and store data in electronic memory every half-hour. A central base station calls each remote station regularly using HF radio or telephone lines. The data is transmitted over the radio as a frequency shift keyed signal, organised as packets of information. Errors are detected using parity and check sum methods. Invalid packets are identified by the Base Station, which requests they be sent again. This concept allows recovery of a very high percentage of the data despite poor communications. Remote stations store data for 21 days. Features such as automatic operation, remote control, remote time setting, built in diagnostics, have been developed and incorporated.The sensors are a key part of a weather station. The following are chosen considering the cost, reliability and accuracy.* R.M.Young manufactures the wind sensor, a model number 05103. It is a propeller type with the advantages of being highly linear, highly interchangeable and having a low threshold. Wind direction is measured as the direction the wind is coming from.* The solar radiation sensor is an Under Water Quantum Sensor made by Licor. It measures light in terms of its \\"Photosynthetically Active Radiation\\" (PAR). The spectral response is defined and weighted. Drift due to aging of the filters has proven to be a problem, but this applies to similar units too.* Temperature sensors are all Omega Interchangeable Thermistors. These are interchangeable and have high accuracy, but reliability has proven a problem. We are considering alternatives.* The barometric sensor was a modified Aanderaa type on earlier stations. The Mk2 stations were fitted with a Weathertronics Unit. Now all stations are Mk3 stations fitted with a Vaisala barometer which is more interchangeable and more accurate.2. System AccuracySystem accuracy is calculated as the sum of errors caused by: * Calibration * Interchanging sensors * Drift with time * Effects of an ambient temperature range from 0-40 degrees C.The following are the specifications of the sensors used with Mk3 stations. A new sensor suite will be used with Mk5 stations, partly based on the Vaisala WXT510 weather sensor.Both the temperature and wind sensors are interchangeable, and not individually calibrated, though some individual sensors have been checked against standards.* Air Temperature: Interchangeable thermistor and electronics is within +/- 0.4 deg. C, with a 30 seconds settling time in air. There are additional errors due to the aspiration of the temperature screen at low wind speeds.* Water temperature: Interchangeable thermistor and electronics is within +/- 0.4 deg. C, with a 30 minutes settling time in water. A higher precision in situ calibration is normally used (around +/- 0.1 degrees), traceable to a 0.04 degrees standard.* Solar radiation (PAR): +/- 5% of reading. Sensor drift is approximately -4% per year initially.* Barometric pressure: +/- 1 hecto Pascal.* Wind speed: 2% of reading +/- 0.1% FSD.* Wind direction: 2% of reading +/- 0.1% FSD.Electrical settling time for solar radiation and wind parameters is 7 seconds. This is necessary for anti-aliasing filters. Mk1 and Mk2 stations averaged 16 samples over the 16 seconds before logging. Mk3 stations use a continuously averaging software system. The wind readings are vector averaged, so direction is accounted for properly.Calibration procedures and routines are detailed on the Engineering website.3. Wind Sensor SpecificationThe following are additional specifications of the wind sensors used with Mk3 stations. A new sensor will be used with Mk5 stations. Wind sensors are mounted at a nominal 10 meters above water. The R.M. Young sensor has the following characteristics:* Wind SpeedRange: 0-60 m/sPitch: 29.4 cm air passes per rev.Distance constant: 2.7 m for 63% recovery* Wind DirectionRange: 360 deg, with 5 deg electrically open at northDamping ratio: 0.25Delay distance: 1.5 m for 50% recoveryThreshold: 1.0 m/s @ 10 deg.Displacement: 1.5 m/s @ 5 deg. displacement Damped w/length: 7.4 mUndamped w/length: 7.2 m4. Underwater Temperature SensorsThese sensors are interchangeable thermistors in Mk3 stations. They can be mounted a significant distance from the weather station, using a 2 wire connection. The basic accuracy is due to the use of interchangeable units. However improved accuracy is obtained by calibrating against a precision reference sensor in situ. These are in turn calibrated against a standard traceable to 0.04 degrees."}',
    },
    {
      href: "uuid:82422310-5a9d-11dc-8d3c-00008a07204e",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"Cleveland Bay Automated Marine Weather And Oceanographic Station","recordAbstract":"This dataset contains meteorological and sea temperature data from two automatic weather stations moored at different times and locations within Cleveland Bay (Townsville).\\n\\nThe first weather station was deployed on Channel Marker #10 (19&deg; 11.95S, 146&deg; 51.89 E). Data from this weather station covers the period 3rd July 1990 to 21st October 1992. This weather station was then removed and redeployed on Cape Cleveland.\\n\\nThe current weather station is located on channel marker #S5, approximately 1 kilometre from Bremner Point on Magnetic Island (19&deg; 09.35S, 146&deg;52.87E). Data collection from this station commenced on the 7th December, 1999.\\n\\n\\nThese data are collected to support scientific research at AIMS. Data are made available on request to other researchers and to the public.\\n\\n\\nThe current weather station is a Campbell Scientific Australia System.\\n\\nData recorded: Sea Temperature (1.9m and 8.5m at MSL), Barometric Pressure, Air Temperature, Solar Radiation (PAR), Wind Direction True (scalar averaged), Wind Speed True (10 min average prior to every half hour and maximum wind gust).\\n\\n1. Operation and Weather Sensors\\n\\nThe weather stations collect and store data in electronic memory every half-hour. A central base station calls each remote station regularly using HF radio or telephone lines. The data is transmitted over the radio as a frequency shift keyed signal, organised as packets of information. Errors are detected using parity and check sum methods. Invalid packets are identified by the Base Station, which requests they be sent again. This concept allows recovery of a very high percentage of the data despite poor communications. Remote stations store data for 21 days. Features such as automatic operation, remote control, remote time setting, built in diagnostics, have been developed and incorporated.\\n\\nThe sensors are a key part of a weather station. The following are chosen considering the cost, reliability and accuracy.\\n* R.M.Young manufactures the wind sensor, a model number 05103. It is a propeller type with the advantages of being highly linear, highly interchangeable and having a low threshold. Wind direction is measured as the direction the wind is coming from.\\n* The solar radiation sensor is an Under Water Quantum Sensor made by Licor. It measures light in terms of its &quot;Photosynthetically Active Radiation&quot; (PAR). The spectral response is defined and weighted. Drift due to aging of the filters has proven to be a problem, but this applies to similar units too.\\n* Temperature sensors are all Omega Interchangeable Thermistors. These are interchangeable and have high accuracy, but reliability has proven a problem. We are considering alternatives.\\n* The barometric sensor was a modified Aanderaa type on earlier stations. The Mk2 stations were fitted with a Weathertronics Unit. Now all stations are Mk3 stations fitted with a Vaisala barometer which is more interchangeable and more accurate.\\n\\n2. System Accuracy\\n\\nSystem accuracy is calculated as the sum of errors caused by:\\n* Calibration\\n* Interchanging sensors\\n* Drift with time\\n* Effects of an ambient temperature range from 0-40 degrees C.\\n\\nThe following are the specifications of the sensors used with Mk3 stations. A new sensor suite will be used with Mk5 stations, partly based on the Vaisala WXT510 weather sensor.\\n\\nBoth the temperature and wind sensors are interchangeable, and not individually calibrated, though some individual sensors have been checked against standards.\\n\\n* Air Temperature: Interchangeable thermistor and electronics is within +/- 0.4 deg. C, with a 30 seconds settling time in air. There are additional errors due to the aspiration of the temperature screen at low wind speeds.\\n* Water temperature: Interchangeable thermistor and electronics is within +/- 0.4 deg. C, with a 30 minutes settling time in water. A higher precision in situ calibration is normally used (around +/- 0.1 degrees), traceable to a 0.04 degrees standard.\\n* Solar radiation (PAR): +/- 5% of reading. Sensor drift is approximately -4% per year initially.\\n* Barometric pressure: +/- 1 hecto Pascal.\\n* Wind speed: 2% of reading +/- 0.1% FSD.\\n* Wind direction: 2% of reading +/- 0.1% FSD.\\n\\nElectrical settling time for solar radiation and wind parameters is 7 seconds. This is necessary for anti-aliasing filters. Mk1 and Mk2 stations averaged 16 samples over the 16 seconds before logging. Mk3 stations use a continuously averaging software system. The wind readings are vector averaged, so direction is accounted for properly.\\n\\nCalibration procedures and routines are detailed on the Engineering website.\\n\\n3. Wind Sensor Specification\\n\\nThe following are additional specifications of the wind sensors used with Mk3 stations. A new sensor will be used with Mk5 stations. Wind sensors are mounted at a nominal 10 meters above water.\\n\\nThe R.M. Young sensor has the following characteristics:\\n* Wind Speed\\nRange: 0-60 m/s\\nPitch: 29.4 cm air passes per rev.\\nDistance constant: 2.7 m for 63% recovery\\n* Wind Direction\\nRange: 360 deg, with 5 deg electrically open at north\\nDamping ratio: 0.25\\nDelay distance: 1.5 m for 50% recovery\\nThreshold: 1.0 m/s @ 10 deg.\\nDisplacement: 1.5 m/s @ 5 deg. displacement\\nDamped w/length: 7.4 m\\nUndamped w/length: 7.2 m\\n\\n4. Underwater Temperature Sensors\\n\\nThese sensors are interchangeable thermistors in Mk3 stations. They can be mounted a significant distance from the weather station, using a 2 wire connection. The basic accuracy is due to the use of interchangeable units. However improved accuracy is obtained by calibrating against a precision reference sensor in situ. These are in turn calibrated against a standard traceable to 0.04 degrees."}',
    },
    {
      href: "uuid:66cfc323-b745-44a7-9622-7ac5a46e4529",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"Halftide Rock Automated Marine Weather And Oceanographic Station","recordAbstract":"This dataset contains meteorological and sea temperature data from the weather station which was originally located on Halftide Rock (-23.15, 150.933) and later moved to Square Rocks (-23.098625, 150.885541). The weather station operated at Halftide Rock from 26/7/2000 until 19/12/2009 and has operated from Square Rocks since the 19/12/2009.\\n\\n\\nThese data are collected to support scientific research at AIMS. Data are made available on request to other researchers and to the public.\\n\\n\\nThe weather station is a Campbell Scientific Australia System.\\n\\nData recorded: Sea Temperature (Halftide Rock 2.4m and 7.2m at MSL), Barometric Pressure, Air Temperature, Solar Radiation (PAR), Wind Direction True (scalar averaged), Wind Speed True (10 min average prior to every half hour and maximum wind gust).\\n\\n1. Operation and Weather Sensors\\n\\nThe weather stations collect and store data in electronic memory every half-hour. A central base station calls each remote station regularly using HF radio or telephone lines. The data is transmitted over the radio as a frequency shift keyed signal, organised as packets of information. Errors are detected using parity and check sum methods. Invalid packets are identified by the Base Station, which requests they be sent again. This concept allows recovery of a very high percentage of the data despite poor communications. Remote stations store data for 21 days. Features such as automatic operation, remote control, remote time setting, built in diagnostics, have been developed and incorporated.\\n\\nThe sensors are a key part of a weather station. The following are chosen considering the cost, reliability and accuracy.\\n* R.M.Young manufactures the wind sensor, a model number 05103. It is a propeller type with the advantages of being highly linear, highly interchangeable and having a low threshold. Wind direction is measured as the direction the wind is coming from.\\n* The solar radiation sensor is an Under Water Quantum Sensor made by Licor. It measures light in terms of its &quot;Photosynthetically Active Radiation&quot; (PAR). The spectral response is defined and weighted. Drift due to aging of the filters has proven to be a problem, but this applies to similar units too.\\n* Temperature sensors are all Omega Interchangeable Thermistors. These are interchangeable and have high accuracy, but reliability has proven a problem. We are considering alternatives.\\n* The barometric sensor was a modified Aanderaa type on earlier stations. The Mk2 stations were fitted with a Weathertronics Unit. Now all stations are Mk3 stations fitted with a Vaisala barometer which is more interchangeable and more accurate.\\n\\n2. System Accuracy\\n\\nSystem accuracy is calculated as the sum of errors caused by:\\n* Calibration\\n* Interchanging sensors\\n* Drift with time\\n* Effects of an ambient temperature range from 0-40 degrees C.\\n\\nThe following are the specifications of the sensors used with Mk3 stations. A new sensor suite will be used with Mk5 stations, partly based on the Vaisala WXT510 weather sensor.\\n\\nBoth the temperature and wind sensors are interchangeable, and not individually calibrated, though some individual sensors have been checked against standards.\\n\\n* Air Temperature: Interchangeable thermistor and electronics is within +/- 0.4 deg. C, with a 30 seconds settling time in air. There are additional errors due to the aspiration of the temperature screen at low wind speeds.\\n* Water temperature: Interchangeable thermistor and electronics is within +/- 0.4 deg. C, with a 30 minutes settling time in water. A higher precision in situ calibration is normally used (around +/- 0.1 degrees), traceable to a 0.04 degrees standard.\\n* Solar radiation (PAR): +/- 5% of reading. Sensor drift is approximately -4% per year initially.\\n* Barometric pressure: +/- 1 hecto Pascal.\\n* Wind speed: 2% of reading +/- 0.1% FSD.\\n* Wind direction: 2% of reading +/- 0.1% FSD.\\n\\nElectrical settling time for solar radiation and wind parameters is 7 seconds. This is necessary for anti-aliasing filters. Mk1 and Mk2 stations averaged 16 samples over the 16 seconds before logging. Mk3 stations use a continuously averaging software system. The wind readings are vector averaged, so direction is accounted for properly.\\n\\nCalibration procedures and routines are detailed on the Engineering website.\\n\\n3. Wind Sensor Specification\\n\\nThe following are additional specifications of the wind sensors used with Mk3 stations. A new sensor will be used with Mk5 stations. Wind sensors are mounted at a nominal 10 meters above water.\\n\\nThe R.M. Young sensor has the following characteristics:\\n* Wind Speed\\nRange: 0-60 m/s\\nPitch: 29.4 cm air passes per rev.\\nDistance constant: 2.7 m for 63% recovery\\n* Wind Direction\\nRange: 360 deg, with 5 deg electrically open at north\\nDamping ratio: 0.25\\nDelay distance: 1.5 m for 50% recovery\\nThreshold: 1.0 m/s @ 10 deg.\\nDisplacement: 1.5 m/s @ 5 deg. displacement\\nDamped w/length: 7.4 m\\nUndamped w/length: 7.2 m\\n\\n4. Underwater Temperature Sensors\\n\\nThese sensors are interchangeable thermistors in Mk3 stations. They can be mounted a significant distance from the weather station, using a 2 wire connection. The basic accuracy is due to the use of interchangeable units. However improved accuracy is obtained by calibrating against a precision reference sensor in situ. These are in turn calibrated against a standard traceable to 0.04 degrees."}',
    },
    {
      href: "uuid:06ea6230-55f3-11dc-8d3c-00008a07204e",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"Ningaloo (Milyering) Automated Marine Weather And Oceanographic Station","recordAbstract":"This dataset contains meteorological data from the weather station located at the CALM Milyering Visitor Centre in Western Australia.\\n These data are collected to support scientific research at AIMS. Data are made available on request to other researchers and to the public.\\n The weather station is an AIMS Mk3 SystemData recorded: Barometric Pressure, Air Temperature, Solar Radiation (PAR), Wind Direction True (vector averaged), Wind Speed True (30 min average).1. Operation and Weather SensorsThe weather stations collect and store data in electronic memory every half-hour. A central base station calls each remote station regularly using HF radio or telephone lines. The data is transmitted over the radio as a frequency shift keyed signal, organised as packets of information. Errors are detected using parity and check sum methods. Invalid packets are identified by the Base Station, which requests they be sent again. This concept allows recovery of a very high percentage of the data despite poor communications. Remote stations store data for 21 days. Features such as automatic operation, remote control, remote time setting, built in diagnostics, have been developed and incorporated.The sensors are a key part of a weather station. The following are chosen considering the cost, reliability and accuracy.* R.M.Young manufactures the wind sensor, a model number 05103. It is a propeller type with the advantages of being highly linear, highly interchangeable and having a low threshold. Wind direction is measured as the direction the wind is coming from.* The solar radiation sensor is an Under Water Quantum Sensor made by Licor. It measures light in terms of its \\"Photosynthetically Active Radiation\\" (PAR). The spectral response is defined and weighted. Drift due to aging of the filters has proven to be a problem, but this applies to similar units too.* Temperature sensors are all Omega Interchangeable Thermistors. These are interchangeable and have high accuracy, but reliability has proven a problem. We are considering alternatives.* The barometric sensor was a modified Aanderaa type on earlier stations. The Mk2 stations were fitted with a Weathertronics Unit. Now all stations are Mk3 stations fitted with a Vaisala barometer which is more interchangeable and more accurate.2. System AccuracySystem accuracy is calculated as the sum of errors caused by: * Calibration * Interchanging sensors * Drift with time * Effects of an ambient temperature range from 0-40 degrees C.The following are the specifications of the sensors used with Mk3 stations. A new sensor suite will be used with Mk5 stations, partly based on the Vaisala WXT510 weather sensor.Both the temperature and wind sensors are interchangeable, and not individually calibrated, though some individual sensors have been checked against standards.* Air Temperature: Interchangeable thermistor and electronics is within +/- 0.4 deg. C, with a 30 seconds settling time in air. There are additional errors due to the aspiration of the temperature screen at low wind speeds.* Solar radiation (PAR): +/- 5% of reading. Sensor drift is approximately -4% per year initially.* Barometric pressure: +/- 1 hecto Pascal.* Wind speed: 2% of reading +/- 0.1% FSD.* Wind direction: 2% of reading +/- 0.1% FSD.Electrical settling time for solar radiation and wind parameters is 7 seconds. This is necessary for anti-aliasing filters. Mk1 and Mk2 stations averaged 16 samples over the 16 seconds before logging. Mk3 stations use a continuously averaging software system. The wind readings are vector averaged, so direction is accounted for properly.Calibration procedures and routines are detailed on the Engineering website.3. Wind Sensor SpecificationThe following are additional specifications of the wind sensors used with Mk3 stations. A new sensor will be used with Mk5 stations. Wind sensors are mounted at a nominal 10 meters above water. The R.M. Young sensor has the following characteristics:* Wind SpeedRange: 0-60 m/sPitch: 29.4 cm air passes per rev.Distance constant: 2.7 m for 63% recovery* Wind DirectionRange: 360 deg, with 5 deg electrically open at northDamping ratio: 0.25Delay distance: 1.5 m for 50% recoveryThreshold: 1.0 m/s @ 10 deg.Displacement: 1.5 m/s @ 5 deg. displacement Damped w/length: 7.4 mUndamped w/length: 7.2 m"}',
    },
    {
      href: "uuid:aefce70d-0ca2-494a-a8f9-47499e2c7f6e",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"Heron Island Automated Marine Weather And Oceanographic Station","recordAbstract":"Sensor network infrastructure was installed at Heron Island in the southern Great Barrier Reef off Gladstone, Australia. The infrastructure consists of a base station mounted on the existing communications tower, a number of network relay poles installed in the lagoon and a number of buoys which carry the actual sensors.\\n\\nThe initial design is to monitor the flow of water through the lagoon which is often &#39;ponded&#39; due to the high coral rim to the lagoon, this creates complex in and out flows and flushing of the lagoon system.\\n\\nThe deployment in August 2008 consisted of the base station using the Telstra nextG service, six 6m relay poles located in the lagoon and five sensor floats also located in the lagoon. The poles carry one bottom thermistor, the floats currently have surface thermistors only. Additional instrumentation will be added by the end of 2008.\\n\\n\\nThe project looks to deploy sensor networks at seven sites along the Great Barrier Reef to measure a range of physical parameters at a range of scales. The project will install communications, data and platform infrastructure that will support future sensor work looking at biological and chemical parameters.\\n\\n\\nThis project is part of the Wireless Sensor Networks Facility (formerly known as Facility for The Automated Intelligent Monitoring of Marine Systems (FAIMMS)), part of the Great Barrier Reef Ocean Observing System project (GBROOS) (IMOS)"}',
    },
    {
      href: "uuid:5e211d53-549b-4162-b67c-9c05c1897a7b",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"Masig (Yorke) Island Automated Marine Weather And Oceanographic Station","recordAbstract":"This dataset contains meteorological and sea temperature data from the weather station located near Masig (Yorke) Island in the Torres Strait, installed under the Tropical Ecosystems hub of the National Environmental Research Program (NERP) and supported by the Torres Strait Regional Authority (TSRA).\\n These data are collected to support scientific research within the Tropical Ecosystems hub of the National Environmental Research Program (NERP - see: http://www.environment.gov.au/biodiversity/science/nerp/ ) Theme 1, Program 2.3 (Torres Strait).Data are made available on request to other researchers and to the public. This weather station is funded under the Tropical Ecosystems hub of the National Environmental Research Program (NERP) in conjunction with the Torres Strait Regional Authority (TSRA).\\n The weather station is an AIMS Mk5 system consisting of a Vaisala WXT520 weather station, a LiCor 192 Light Sensor and a number of in-water sensors including a SeaBird SBE37 CTD (Conductivity, Temperature and Depth) and SeaBird SBE39 (Temperature and Depth).Data recorded: Water Temperature (3m, 6.4 at MSL), Barometric Pressure, Air Temperature, Humidity, Solar Radiation (PAR), Wind Direction True (vector averaged), Wind Speed True (30 min average).The weather stations collect and store data in electronic memory every ten minutes, the station uses the 3G phone network to send the data to AIMS where it is stored in a database and then made available via the web and other systems. The data are then checked for accuracy using a number of range and historical checks, longer term summeries are then calculated along with indicies of potential thermal stress."}',
    },
    {
      href: "uuid:5f5c4570-4ade-11dc-8f56-00008a07204e",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"Cape Cleveland Automated Marine Weather And Oceanographic Station","recordAbstract":"This dataset contains meteorological data from a land-based weather station, which was located on Cape Cleveland, near Townsville, from June 1993 to September 1996.\\n These data are collected to support scientific research at AIMS. Data are made available on request to other researchers and to the public.\\n The weather station was a Steedman EMS System.Data recorded: Barometric Pressure, Air Temperature, Wind Direction True (vector averaged), Wind Speed True (10 min average prior to every half hour)."}',
    },
    {
      href: "uuid:60757da0-4ade-11dc-8f56-00008a07204e",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"John Brewer Reef Automated Marine Weather And Oceanographic Station","recordAbstract":"This dataset contains meteorological and sea temperature data collected from the weather station, which was moored on John Brewer Reef on the Great Barrier Reef for the period from 31 July 1987 to 30 May 1988. The system used automatic relaying of data in \\"real time\\" mode.Data Recorded: Sea Temperature, Sea Surface Temperature, Atmospheric Pressure, Air Temperature, Solar Radiation, Wind Direction True, Wind Speed True.\\n These data are collected to support scientific research at AIMS. Data are made available on request to other researchers and to the public.\\n The weather station was an AIMS Mk2 System."}',
    },
    {
      href: "uuid:5ee39300-4ade-11dc-8f56-00008a07204e",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"Agincourt Reef Automated Marine Weather and Oceanographic Station","recordAbstract":"This dataset contains meteorological data from Agincourt Reef, Great Barrier Reef, from November 1989 with breaks. The weather station is located on Quicksilver\'s northern pontoon.\\n These data are collected to support scientific research at AIMS. Data are made available on request to other researchers and to the public.\\n The weather station is an AIMS Mk3 System.Data recorded: Sea Temperature (1m and 10m at MSL), Barometric Pressure, Air Temperature, Solar Radiation (PAR), Wind Direction True (vector averaged), Wind Speed True (30 min average).This weather station has been deployed in three different locations on Agincourt Reef.Location 1: -15.9617, 145.8225 from November 1989 to 1996Location 2: -16.0381, 145.8325 from 1996 to October 2000Location 3: -16.033, 145.817 from October 2000 to present.1. Operation and Weather SensorsThe weather stations collect and store data in electronic memory every half-hour. A central base station calls each remote station regularly using HF radio or telephone lines. The data is transmitted over the radio as a frequency shift keyed signal, organised as packets of information. Errors are detected using parity and check sum methods. Invalid packets are identified by the Base Station, which requests they be sent again. This concept allows recovery of a very high percentage of the data despite poor communications. Remote stations store data for 21 days. Features such as automatic operation, remote control, remote time setting, built in diagnostics, have been developed and incorporated.The sensors are a key part of a weather station. The following are chosen considering the cost, reliability and accuracy.* R.M.Young manufactures the wind sensor, a model number 05103. It is a propeller type with the advantages of being highly linear, highly interchangeable and having a low threshold. Wind direction is measured as the direction the wind is coming from.* The solar radiation sensor is an Under Water Quantum Sensor made by Licor. It measures light in terms of its \\"Photosynthetically Active Radiation\\" (PAR). The spectral response is defined and weighted. Drift due to aging of the filters has proven to be a problem, but this applies to similar units too.* Temperature sensors are all Omega Interchangeable Thermistors. These are interchangeable and have high accuracy, but reliability has proven a problem. We are considering alternatives.* The barometric sensor was a modified Aanderaa type on earlier stations. The Mk2 stations were fitted with a Weathertronics Unit. Now all stations are Mk3 stations fitted with a Vaisala barometer which is more interchangeable and more accurate.2. System AccuracySystem accuracy is calculated as the sum of errors caused by: * Calibration * Interchanging sensors * Drift with time * Effects of an ambient temperature range from 0-40 degrees C.The following are the specifications of the sensors used with Mk3 stations. A new sensor suite will be used with Mk5 stations, partly based on the Vaisala WXT510 weather sensor.Both the temperature and wind sensors are interchangeable, and not individually calibrated, though some individual sensors have been checked against standards.* Air Temperature: Interchangeable thermistor and electronics is within +/- 0.4 deg. C, with a 30 seconds settling time in air. There are additional errors due to the aspiration of the temperature screen at low wind speeds.* Water temperature: Interchangeable thermistor and electronics is within +/- 0.4 deg. C, with a 30 minutes settling time in water. A higher precision in situ calibration is normally used (around +/- 0.1 degrees), traceable to a 0.04 degrees standard.* Solar radiation (PAR): +/- 5% of reading. Sensor drift is approximately -4% per year initially.* Barometric pressure: +/- 1 hecto Pascal.* Wind speed: 2% of reading +/- 0.1% FSD.* Wind direction: 2% of reading +/- 0.1% FSD.Electrical settling time for solar radiation and wind parameters is 7 seconds. This is necessary for anti-aliasing filters. Mk1 and Mk2 stations averaged 16 samples over the 16 seconds before logging. Mk3 stations use a continuously averaging software system. The wind readings are vector averaged, so direction is accounted for properly.Calibration procedures and routines are detailed on the Engineering website.3. Wind Sensor SpecificationThe following are additional specifications of the wind sensors used with Mk3 stations. A new sensor will be used with Mk5 stations. Wind sensors are mounted at a nominal 10 meters above water. The R.M. Young sensor has the following characteristics:* Wind SpeedRange: 0-60 m/sPitch: 29.4 cm air passes per rev.Distance constant: 2.7 m for 63% recovery* Wind DirectionRange: 360 deg, with 5 deg electrically open at northDamping ratio: 0.25Delay distance: 1.5 m for 50% recoveryThreshold: 1.0 m/s @ 10 deg.Displacement: 1.5 m/s @ 5 deg. displacement Damped w/length: 7.4 mUndamped w/length: 7.2 m4. Underwater Temperature SensorsThese sensors are interchangeable thermistors in Mk3 stations. They can be mounted a significant distance from the weather station, using a 2 wire connection. The basic accuracy is due to the use of interchangeable units. However improved accuracy is obtained by calibrating against a precision reference sensor in situ. These are in turn calibrated against a standard traceable to 0.04 degrees."}',
    },
    {
      href: "uuid:603df2e0-4ade-11dc-8f56-00008a07204e",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"Hardy Reef Automated Marine Weather And Oceanographic Station","recordAbstract":"This dataset contains meteorological and sea temperature data from the weather station attached to the Fantasea pontoon on Hardy Reef on the Great Barrier Reef.\\n These data are collected to support scientific research at AIMS. Data are made available on request to other researchers and to the public.\\n The weather station is an AIMS Mk3 SystemData recorded: Sea Temperature (2.5m and 9m at MSL), Barometric Pressure, Air Temperature, Solar Radiation (PAR), Wind Direction True (vector averaged), Wind Speed True (30 min average).This weather station has been deployed in three different locations on Hardy Reef.Location 1: -19.7340, 149.1808 from June 1989 to November 1993Location 2: -19.7358, 149.1808 from November 1993 to January 1996Location 3: -19.733, 149.167 from January 1996 to present.1. Operation and Weather SensorsThe weather stations collect and store data in electronic memory every half-hour. A central base station calls each remote station regularly using HF radio or telephone lines. The data is transmitted over the radio as a frequency shift keyed signal, organised as packets of information. Errors are detected using parity and check sum methods. Invalid packets are identified by the Base Station, which requests they be sent again. This concept allows recovery of a very high percentage of the data despite poor communications. Remote stations store data for 21 days. Features such as automatic operation, remote control, remote time setting, built in diagnostics, have been developed and incorporated.The sensors are a key part of a weather station. The following are chosen considering the cost, reliability and accuracy.* R.M.Young manufactures the wind sensor, a model number 05103. It is a propeller type with the advantages of being highly linear, highly interchangeable and having a low threshold. Wind direction is measured as the direction the wind is coming from.* The solar radiation sensor is an Under Water Quantum Sensor made by Licor. It measures light in terms of its \\"Photosynthetically Active Radiation\\" (PAR). The spectral response is defined and weighted. Drift due to aging of the filters has proven to be a problem, but this applies to similar units too.* Temperature sensors are all Omega Interchangeable Thermistors. These are interchangeable and have high accuracy, but reliability has proven a problem. We are considering alternatives.* The barometric sensor was a modified Aanderaa type on earlier stations. The Mk2 stations were fitted with a Weathertronics Unit. Now all stations are Mk3 stations fitted with a Vaisala barometer which is more interchangeable and more accurate.2. System AccuracySystem accuracy is calculated as the sum of errors caused by: * Calibration * Interchanging sensors * Drift with time * Effects of an ambient temperature range from 0-40 degrees C.The following are the specifications of the sensors used with Mk3 stations. A new sensor suite will be used with Mk5 stations, partly based on the Vaisala WXT510 weather sensor.Both the temperature and wind sensors are interchangeable, and not individually calibrated, though some individual sensors have been checked against standards.* Air Temperature: Interchangeable thermistor and electronics is within +/- 0.4 deg. C, with a 30 seconds settling time in air. There are additional errors due to the aspiration of the temperature screen at low wind speeds.* Water temperature: Interchangeable thermistor and electronics is within +/- 0.4 deg. C, with a 30 minutes settling time in water. A higher precision in situ calibration is normally used (around +/- 0.1 degrees), traceable to a 0.04 degrees standard.* Solar radiation (PAR): +/- 5% of reading. Sensor drift is approximately -4% per year initially.* Barometric pressure: +/- 1 hecto Pascal.* Wind speed: 2% of reading +/- 0.1% FSD.* Wind direction: 2% of reading +/- 0.1% FSD.Electrical settling time for solar radiation and wind parameters is 7 seconds. This is necessary for anti-aliasing filters. Mk1 and Mk2 stations averaged 16 samples over the 16 seconds before logging. Mk3 stations use a continuously averaging software system. The wind readings are vector averaged, so direction is accounted for properly.Calibration procedures and routines are detailed on the Engineering website.3. Wind Sensor SpecificationThe following are additional specifications of the wind sensors used with Mk3 stations. A new sensor will be used with Mk5 stations. Wind sensors are mounted at a nominal 10 meters above water. The R.M. Young sensor has the following characteristics:* Wind SpeedRange: 0-60 m/sPitch: 29.4 cm air passes per rev.Distance constant: 2.7 m for 63% recovery* Wind DirectionRange: 360 deg, with 5 deg electrically open at northDamping ratio: 0.25Delay distance: 1.5 m for 50% recoveryThreshold: 1.0 m/s @ 10 deg.Displacement: 1.5 m/s @ 5 deg. displacement Damped w/length: 7.4 mUndamped w/length: 7.2 m4. Underwater Temperature SensorsThese sensors are interchangeable thermistors in Mk3 stations. They can be mounted a significant distance from the weather station, using a 2 wire connection. The basic accuracy is due to the use of interchangeable units. However improved accuracy is obtained by calibrating against a precision reference sensor in situ. These are in turn calibrated against a standard traceable to 0.04 degrees."}',
    },
    {
      href: "uuid:6e1c51cb-c4ac-4a2b-b8d9-e32c579e4853",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"Coral Creek (Hinchinbrook Island) Automated Marine Weather And Oceanographic Station","recordAbstract":"This data contains historical weather data from Coral Creek (Hinchinbrook Island), covering the period 16-10-1980 to 30-7-1985.These data were collected initially using tapes which were regularly exchanged and later by telemetery which sent binary data daily to a computer controlled base station. Data were verified by comparing three sets of the same data, received over three days. The base station passed data to the central computing facility at AIMS for processing.Data recorded: Wind direction (0-360°); Wind speed (km/hr); Air temperature (0-40°C); Barometric pressure (mB); Solar radiation (µE/sec/M2, PAR).Other variables:Time of day (e.g. 21:53:54); Day of year (e.g.118); Year (e.g. 86).\\n These data were collected to support scientific research at AIMS. Data are made available on request to other researchers and to the public.\\n Information about the sensors used and accuracy are in the metadata section on data quality."}',
    },
    {
      href: "uuid:1b1c2a50-4f9e-11dc-9c63-00008a07204e",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"Square Rocks Automated Marine Weather And Oceanographic Station","recordAbstract":"This dataset contains meteorological and sea temperature data from the weather station which was originally located on Halftide Rock (-23.15, 150.933) and later moved to Square Rocks (-23.098625, 150.885541). The weather station operated at Halftide Rock from 26/7/2000 until 19/12/2009 and has operated from Square Rocks since the 19/12/2009.\\n\\n\\nThese data are collected to support scientific research at AIMS. Data are made available on request to other researchers and to the public.\\n\\n\\nThe weather station is a Campbell Scientific Australia System.\\n\\nData recorded: Sea Temperature (Halftide Rock 2.4m and 7.2m at MSL and Square Rocks 2.9m and 7.9m at MSL ), Barometric Pressure, Air Temperature, Solar Radiation (PAR), Wind Direction True (scalar averaged), Wind Speed True (10 min average prior to every half hour and maximum wind gust).\\n\\n1. Operation and Weather Sensors\\n\\nThe weather stations collect and store data in electronic memory every half-hour. A central base station calls each remote station regularly using HF radio or telephone lines. The data is transmitted over the radio as a frequency shift keyed signal, organised as packets of information. Errors are detected using parity and check sum methods. Invalid packets are identified by the Base Station, which requests they be sent again. This concept allows recovery of a very high percentage of the data despite poor communications. Remote stations store data for 21 days. Features such as automatic operation, remote control, remote time setting, built in diagnostics, have been developed and incorporated.\\n\\nThe sensors are a key part of a weather station. The following are chosen considering the cost, reliability and accuracy.\\n* R.M.Young manufactures the wind sensor, a model number 05103. It is a propeller type with the advantages of being highly linear, highly interchangeable and having a low threshold. Wind direction is measured as the direction the wind is coming from.\\n* The solar radiation sensor is an Under Water Quantum Sensor made by Licor. It measures light in terms of its &quot;Photosynthetically Active Radiation&quot; (PAR). The spectral response is defined and weighted. Drift due to aging of the filters has proven to be a problem, but this applies to similar units too.\\n* Temperature sensors are all Omega Interchangeable Thermistors. These are interchangeable and have high accuracy, but reliability has proven a problem. We are considering alternatives.\\n* The barometric sensor was a modified Aanderaa type on earlier stations. The Mk2 stations were fitted with a Weathertronics Unit. Now all stations are Mk3 stations fitted with a Vaisala barometer which is more interchangeable and more accurate.\\n\\n2. System Accuracy\\n\\nSystem accuracy is calculated as the sum of errors caused by:\\n* Calibration\\n* Interchanging sensors\\n* Drift with time\\n* Effects of an ambient temperature range from 0-40 degrees C.\\n\\nThe following are the specifications of the sensors used with Mk3 stations. A new sensor suite will be used with Mk5 stations, partly based on the Vaisala WXT510 weather sensor.\\n\\nBoth the temperature and wind sensors are interchangeable, and not individually calibrated, though some individual sensors have been checked against standards.\\n\\n* Air Temperature: Interchangeable thermistor and electronics is within +/- 0.4 deg. C, with a 30 seconds settling time in air. There are additional errors due to the aspiration of the temperature screen at low wind speeds.\\n* Water temperature: Interchangeable thermistor and electronics is within +/- 0.4 deg. C, with a 30 minutes settling time in water. A higher precision in situ calibration is normally used (around +/- 0.1 degrees), traceable to a 0.04 degrees standard.\\n* Solar radiation (PAR): +/- 5% of reading. Sensor drift is approximately -4% per year initially.\\n* Barometric pressure: +/- 1 hecto Pascal.\\n* Wind speed: 2% of reading +/- 0.1% FSD.\\n* Wind direction: 2% of reading +/- 0.1% FSD.\\n\\nElectrical settling time for solar radiation and wind parameters is 7 seconds. This is necessary for anti-aliasing filters. Mk1 and Mk2 stations averaged 16 samples over the 16 seconds before logging. Mk3 stations use a continuously averaging software system. The wind readings are vector averaged, so direction is accounted for properly.\\n\\nCalibration procedures and routines are detailed on the Engineering website.\\n\\n3. Wind Sensor Specification\\n\\nThe following are additional specifications of the wind sensors used with Mk3 stations. A new sensor will be used with Mk5 stations. Wind sensors are mounted at a nominal 10 meters above water.\\n\\nThe R.M. Young sensor has the following characteristics:\\n* Wind Speed\\nRange: 0-60 m/s\\nPitch: 29.4 cm air passes per rev.\\nDistance constant: 2.7 m for 63% recovery\\n* Wind Direction\\nRange: 360 deg, with 5 deg electrically open at north\\nDamping ratio: 0.25\\nDelay distance: 1.5 m for 50% recovery\\nThreshold: 1.0 m/s @ 10 deg.\\nDisplacement: 1.5 m/s @ 5 deg. displacement\\nDamped w/length: 7.4 m\\nUndamped w/length: 7.2 m\\n\\n4. Underwater Temperature Sensors\\n\\nThese sensors are interchangeable thermistors in Mk3 stations. They can be mounted a significant distance from the weather station, using a 2 wire connection. The basic accuracy is due to the use of interchangeable units. However improved accuracy is obtained by calibrating against a precision reference sensor in situ. These are in turn calibrated against a standard traceable to 0.04 degrees."}',
    },
    {
      href: "uuid:911a0982-240e-4461-ac0c-107f6e59a355",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"Thursday Island Automated Marine Weather And Oceanographic Station","recordAbstract":"This dataset contains meteorological and sea temperature data from the weather station located on the channel marker on Madge Reef, located between Thursday Island and Horn Island in the Torres Strait, installed under the Tropical Ecosystems hub of the National Environmental Research Program (NERP) and supported by the Torres Strait Regional Authority (TSRA).\\n These data are collected to support scientific research within the Tropical Ecosystems hub of the National Environmental Research Program (NERP - see: http://www.environment.gov.au/biodiversity/science/nerp/ ) Theme 1, Program 2.3 (Torres Strait).Data are made available on request to other researchers and to the public. This weather station is funded under the Tropical Ecosystems hub of the National Environmental Research Program (NERP) in conjunction with the Torres Strait Regional Authority (TSRA).\\n The weather station is an AIMS Mk5 system consisting of a Vaisala WXT520 weather station, a LiCor 192 Light Sensor and a number of in-water sensors including a SeaBird SBE37 CTD (Conductivity, Temperature and Depth) and SeaBird SBE39 (Temperature and Depth).Data recorded: Water Temperature (3m, 6.4 at MSL), Barometric Pressure, Air Temperature, Humidity, Solar Radiation (PAR), Wind Direction True (vector averaged), Wind Speed True (30 min average).The weather stations collect and store data in electronic memory every ten minutes, the station uses the 3G phone network to send the data to AIMS where it is stored in a database and then made available via the web and other systems. The data are then checked for accuracy using a number of range and historical checks, longer term summeries are then calculated along with indicies of potential thermal stress."}',
    },
    {
      href: "uuid:edd96151-16f3-46f0-9310-4ed36a0ce791",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"Badu Island Automated Marine Weather And Oceanographic Station","recordAbstract":"This dataset contains meteorological and light data from the weather station located on Badu Island in the Central / Western part of the Torres Strait. The station was installed under funding from the Torres Strait Regional Authority (TSRA).\\n\\n\\nThese data are collected to support scientific research.\\nData are made available on request to other researchers and to the public. This weather station is funded by the Torres Strait Regional Authority (TSRA).\\n\\n\\nThe weather station is an AIMS Mk5 system consisting of a Vaisala WXT520 weather station and a LiCor 192 Light Sensor.\\n\\nNote that this station is located on land and has NO in-water sensors. \\n\\nData recorded: Barometric Pressure, Air Temperature, Humidity, Solar Radiation (PAR), Wind Direction True (vector averaged), Wind Speed True (30 min average).\\n\\nThe weather stations collect and store data in electronic memory every ten minutes, the station uses the 3G phone network to send the data to AIMS where it is stored in a database and then made available via the web and other systems. \\n\\nThe data are then checked for accuracy using a number of range and historical checks, longer term summeries are then calculated along with indicies of potential thermal stress."}',
    },
    {
      href: "uuid:88ef50ff-262e-49b5-90a1-70c3a570045d",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"Yongala Mooring (NRSYON) Automated Marine Weather And Oceanographic Station","recordAbstract":"The NRS Yongala Mooring (IMOS platform code: NRSYON) is one of a series of 9 IMOS - ANMN National Reference Station (NRS) designed to monitor oceanographic phenomena in Australian coastal ocean waters . The buoy is located near the Yongala Wreck, out from Cape Bowling Green in the central Great Barrier Reef, at Latitude: -19.305, Longitude: 147.622.\\n\\n\\nThe IMOS national reference stations will extend the number of long term time series observations in Australian coastal waters in terms of variables recorded both in their temporal distribution and geographical extent. It will also provide for biological, physical and chemical sampling and for &#39;ground truth&#39; of remotely sensed observations."}',
    },
    {
      href: "uuid:5f30a190-4ade-11dc-8f56-00008a07204e",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"Cape Bowling Green Automated Marine Weather And Oceanographic Station","recordAbstract":"This dataset contains meteorological data from the weather station located on Cape Bowling Green in North Queensland which has been collected since 31 July 1987.\\n\\nHistorical records for the period 9-7-1983 to 4-10-1985 have been retrospectively added to the dataset from a former Cape Bowling Green outstation (at the same location) after conversion from the original Fortran files. Note that there is a break in this middle of this data series as the outstation source was moved to Cape Ferguson (AIMS Wharf) and collected data there for the period 1-11-1983 to 30-5-1984. These historic data were collected using telemetery to send binary data daily to a computer controlled base station. Data were verified by comparing three sets of the same data, received over three days. The base station passed data to the central computing facility at AIMS for processing. Lightning destroyed this system in 1985.\\n\\nData recorded: Barometric Pressure, Air Temperature, Solar Radiation (PAR), Wind Direction True (vector averaged), Wind Speed True (30 min average).\\n\\n\\nThese data are collected to support scientific research at AIMS. Data are made available on request to other researchers and to the public.\\n\\n\\nThe current weather station is an AIMS Mk3 System.\\n\\n1. Operation and Weather Sensors\\n\\nThe weather stations collect and store data in electronic memory every half-hour. A central base station calls each remote station regularly using HF radio or telephone lines. The data is transmitted over the radio as a frequency shift keyed signal, organised as packets of information. Errors are detected using parity and check sum methods. Invalid packets are identified by the Base Station, which requests they be sent again. This concept allows recovery of a very high percentage of the data despite poor communications. Remote stations store data for 21 days. Features such as automatic operation, remote control, remote time setting, built in diagnostics, have been developed and incorporated.\\n\\nThe sensors are a key part of a weather station. The following are chosen considering the cost, reliability and accuracy.\\n* R.M.Young manufactures the wind sensor, a model number 05103. It is a propeller type with the advantages of being highly linear, highly interchangeable and having a low threshold. Wind direction is measured as the direction the wind is coming from.\\n* The solar radiation sensor is an Under Water Quantum Sensor made by Licor. It measures light in terms of its &quot;Photosynthetically Active Radiation&quot; (PAR). The spectral response is defined and weighted. Drift due to aging of the filters has proven to be a problem, but this applies to similar units too.\\n* Temperature sensors are all Omega Interchangeable Thermistors. These are interchangeable and have high accuracy, but reliability has proven a problem. We are considering alternatives.\\n* The barometric sensor was a modified Aanderaa type on earlier stations. The Mk2 stations were fitted with a Weathertronics Unit. Now all stations are Mk3 stations fitted with a Vaisala barometer which is more interchangeable and more accurate.\\n\\n2. System Accuracy\\n\\nSystem accuracy is calculated as the sum of errors caused by:\\n* Calibration\\n* Interchanging sensors\\n* Drift with time\\n* Effects of an ambient temperature range from 0-40 degrees C.\\n\\nThe following are the specifications of the sensors used with Mk3 stations. A new sensor suite will be used with Mk5 stations, partly based on the Vaisala WXT510 weather sensor.\\n\\nBoth the temperature and wind sensors are interchangeable, and not individually calibrated, though some individual sensors have been checked against standards.\\n\\n* Air Temperature: Interchangeable thermistor and electronics is within +/- 0.4 deg. C, with a 30 seconds settling time in air. There are additional errors due to the aspiration of the temperature screen at low wind speeds.\\n* Solar radiation (PAR): +/- 5% of reading. Sensor drift is approximately -4% per year initially.\\n* Barometric pressure: +/- 1 hecto Pascal.\\n* Wind speed: 2% of reading +/- 0.1% FSD.\\n* Wind direction: 2% of reading +/- 0.1% FSD.\\n\\nElectrical settling time for solar radiation and wind parameters is 7 seconds. This is necessary for anti-aliasing filters. Mk1 and Mk2 stations averaged 16 samples over the 16 seconds before logging. Mk3 stations use a continuously averaging software system. The wind readings are vector averaged, so direction is accounted for properly.\\n\\nCalibration procedures and routines are detailed on the Engineering website.\\n\\n3. Wind Sensor Specification\\n\\nThe following are additional specifications of the wind sensors used with Mk3 stations. A new sensor will be used with Mk5 stations. Wind sensors are mounted at a nominal 10 meters above water.\\n\\nThe R.M. Young sensor has the following characteristics:\\n* Wind Speed\\nRange: 0-60 m/s\\nPitch: 29.4 cm air passes per rev.\\nDistance constant: 2.7 m for 63% recovery\\n* Wind Direction\\nRange: 360 deg, with 5 deg electrically open at north\\nDamping ratio: 0.25\\nDelay distance: 1.5 m for 50% recovery\\nThreshold: 1.0 m/s @ 10 deg.\\nDisplacement: 1.5 m/s @ 5 deg. displacement\\nDamped w/length: 7.4 m\\nUndamped w/length: 7.2 m"}',
    },

    {
      href: "uuid:2eb28c59-84f9-4fb4-8a2d-c62f38e7996e",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"Saibai Island Automated Marine Weather And Oceanographic Station","recordAbstract":"This dataset contains meteorological and light data from the weather station located on Saibai Island in the northern part of the Torres Strait. The station was installed under funding from the Torres Strait Regional Authority (TSRA).\\n These data are collected to support scientific research.Data are made available on request to other researchers and to the public. This weather station is funded by the Torres Strait Regional Authority (TSRA).\\n The weather station is an AIMS Mk5 system consisting of a Vaisala WXT520 weather station and a LiCor 192 Light Sensor.Note that this station is located on land and has NO in-water sensors. Data recorded: Barometric Pressure, Air Temperature, Humidity, Solar Radiation (PAR), Wind Direction True (vector averaged), Wind Speed True (30 min average).The weather stations collect and store data in electronic memory every ten minutes, the station uses the 3G phone network to send the data to AIMS where it is stored in a database and then made available via the web and other systems. The data are then checked for accuracy using a number of range and historical checks, longer term summeries are then calculated along with indicies of potential thermal stress."}',
    },
    {
      href: "uuid:2e573ea5-b17b-4b5a-8462-2464009c013d",
      rel: "child",
      type: "application/json",
      title:
        '{"title":"Davies Reef Salinity From 09 Dec 2009 To 29 Jan 2016","recordAbstract":"The \'Wireless Sensor Networks Facility\' (formerly known as Facility for The Automated Intelligent Monitoring of Marine Systems (FAIMMS)), part of the Great Barrier Reef Ocean Observing System project (GBROOS), is a facility of the Australian \'Integrated Marine Observing System\' (IMOS) project. This data set was collected by the Great Barrier Reef Wireless Sensor Network."}',
    },
    {
      href: "uuid:43a67f6f-849f-4392-ad3d-7607b4bd6447",
      rel: "child",
      type: "application/json",
      title:
        '{"title":"Davies Reef Depth From 07 Dec 2009 To 12 Jul 2016","recordAbstract":"The \'Wireless Sensor Networks Facility\' (formerly known as Facility for The Automated Intelligent Monitoring of Marine Systems (FAIMMS)), part of the Great Barrier Reef Ocean Observing System project (GBROOS), is a facility of the Australian \'Integrated Marine Observing System\' (IMOS) project. This data set was collected by the Great Barrier Reef Wireless Sensor Network."}',
    },
    {
      href: "uuid:6b305c2c-e74b-405b-a26b-11744cfa3bbb",
      rel: "child",
      type: "application/json",
      title:
        '{"title":"Davies Reef Light From 18 Oct 1991","recordAbstract":"This data set was collected by weather sensors deployed on the AIMS Weather Station site Davies Reef."}',
    },
    {
      href: "uuid:38f2c8ae-bdab-47fe-99fe-2b4513938fa5",
      rel: "child",
      type: "application/json",
      title:
        '{"title":"Davies Reef Air Temperature From 18 Oct 1991","recordAbstract":"This data set was collected by weather sensors deployed on the AIMS Weather Station site Davies Reef."}',
    },
    {
      href: "uuid:615ce04b-f3f7-4d22-818e-b484c6a5414e",
      rel: "child",
      type: "application/json",
      title:
        '{"title":"Davies Reef Hail From 17 Sep 2008","recordAbstract":"This data set was collected by weather sensors deployed on the AIMS Weather Station site Davies Reef."}',
    },
    {
      href: "uuid:1a7f1e6b-91c2-4907-b423-9be015763588",
      rel: "child",
      type: "application/json",
      title:
        '{"title":"Davies Reef Wind From 18 Oct 1991","recordAbstract":"This data set was collected by weather sensors deployed on the AIMS Weather Station site Davies Reef."}',
    },
    {
      href: "uuid:0155375c-8070-4662-9c93-b593ee4891b0",
      rel: "child",
      type: "application/json",
      title:
        '{"title":"Davies Reef Water Temperature From 18 Oct 1991","recordAbstract":"The \'Wireless Sensor Networks Facility\' (formerly known as Facility for The Automated Intelligent Monitoring of Marine Systems (FAIMMS)), part of the Great Barrier Reef Ocean Observing System project (GBROOS), is a facility of the Australian \'Integrated Marine Observing System\' (IMOS) project. This data set was collected by the Great Barrier Reef Wireless Sensor Network."}',
    },
    {
      href: "uuid:417fb89b-2826-4224-b868-fb3268ce7677",
      rel: "child",
      type: "application/json",
      title:
        '{"title":"Davies Reef Humidity From 17 Sep 2008","recordAbstract":"This data set was collected by weather sensors deployed on the AIMS Weather Station site Davies Reef."}',
    },
    {
      href: "uuid:5862162e-1640-4d06-ba77-2b413fec64a2",
      rel: "child",
      type: "application/json",
      title:
        '{"title":"Davies Reef Deployments of the Wireless Sensor Network","recordAbstract":"Sensor network infrastructure was installed at Davies Reef in the central Great Barrier Reef off Townsville, Australia. The infrastructure consists of a base station mounted on the existing reef communications tower and a number of buoys which carry the actual sensors.\\n\\nThe initial design is to monitor the flow of water through the lagoon, the connectivity between the lagoon and the open ocean and the presence of an upwelling signal as oceanic water crosses the open shelf in the Townsville region. This site is linked to ones on the edge of the shelf (Myrmidon Reef) and sites closer in such as Rib Reef and Orpheus Island.\\n\\nThe deployment in December 2009 consisted of the base station using the Telstra nextG service and five buoys or sensor floats. The sensor floats carry a mixture of sensors but typically a surface MEA Thermistor and a bottom mounted SeaBird SBE39 (temp + pressure), for some floats the SBE39 is replaced by a SBE37 to give salinity (as conductivity), temperature and presure.\\n\\nOn the tower is a vaisala WXT520 weather station.\\n\\n\\nThe project looks to deploy sensor networks at seven sites along the Great Barrier Reef to measure a range of physical parameters at a range of scales. The project will install communications, data and platform infrastructure that will support future sensor work looking at biological and chemical parameters.\\n\\n\\nWireless Sensor Networks Facility (formerly known as Facility for The Automated Intelligent Monitoring of Marine Systems (FAIMMS)), part of the Great Barrier Reef Ocean Observing System project (GBROOS) (IMOS)"}',
    },
    {
      href: "uuid:2dcc6538-911e-4cf8-abe8-0bc455ff7324",
      rel: "child",
      type: "application/json",
      title:
        '{"title":"Davies Reef Air Pressure From 18 Oct 1991","recordAbstract":"This data set was collected by weather sensors deployed on the AIMS Weather Station site Davies Reef."}',
    },
    {
      href: "uuid:493e3621-93cd-4269-a22f-51fc4d5b84a1",
      rel: "child",
      type: "application/json",
      title:
        '{"title":"Davies Reef Rain From 17 Sep 2008","recordAbstract":"This data set was collected by weather sensors deployed on the AIMS Weather Station site Davies Reef."}',
    },
  ],
  extent: {
    spatial: {
      bbox: [
        [147.683, -18.833, 147.683, -18.833],
        [147.683, -18.833, 147.683, -18.833],
      ],
      crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
    },
    temporal: {
      interval: [
        ["1991-10-17T13:00:00.000+00:00", null],
        ["1991-10-17T13:00:00.000+00:00", null],
      ],
      trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
    },
  },
  itemType: "Collection",
};

export { NORMAL_COLLECTION };
