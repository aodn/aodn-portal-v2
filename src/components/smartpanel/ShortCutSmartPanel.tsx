import { SmartCard11, SmartCard21, SmartCard22 } from "./SmartCard";
import ComplexSmartPanel from "./ComplexSmartPanel";
import { CARD_ID } from "./utils";

interface ShortCutSmartPanelProps {
  onCardClicked?: (id: number) => void;
}
/**
 * The panel below the text search box
 * @constructor
 */
const ShortCutSmartPanel = (props: ShortCutSmartPanelProps) => {
  return (
    <ComplexSmartPanel rows={2} columns={9}>
      <SmartCard21
        caption="Get started"
        onCardClicked={() =>
          props.onCardClicked && props.onCardClicked(CARD_ID.GET_START)
        }
      />
      <SmartCard11
        caption="All Topics"
        imageUrl="/smartcard/all_topics.png"
        onCardClicked={() =>
          props.onCardClicked && props.onCardClicked(CARD_ID.ALL_TOPICS)
        }
      />
      <SmartCard22
        caption="Surface Waves"
        underline={
          <>
            Surface Temperature
            <br />
            Current Velocity
            <br />
            Salinity
          </>
        }
        imageUrl="/smartcard/wave.png"
        onCardClicked={() =>
          props.onCardClicked && props.onCardClicked(CARD_ID.SURFACE_WAVES)
        }
      />
      <SmartCard11
        caption="Reef"
        imageUrl="/smartcard/reef.png"
        onCardClicked={() =>
          props.onCardClicked && props.onCardClicked(CARD_ID.REEF)
        }
      />
      <SmartCard11
        caption="Satelite"
        imageUrl="/smartcard/satellite.png"
        onCardClicked={() =>
          props.onCardClicked && props.onCardClicked(CARD_ID.SATELITE)
        }
      />
      <SmartCard21
        caption="Popular Search"
        onCardClicked={() =>
          props.onCardClicked && props.onCardClicked(CARD_ID.ADVANCED_SEARCH)
        }
      />
      <SmartCard11
        caption="Tutorials"
        imageUrl="/smartcard/tutorials.png"
        onCardClicked={() =>
          props.onCardClicked && props.onCardClicked(CARD_ID.TUTORIAL)
        }
      />
      <SmartCard11
        caption="Location"
        imageUrl="/smartcard/location.png"
        onCardClicked={() =>
          props.onCardClicked && props.onCardClicked(CARD_ID.LOCATION)
        }
      />
      <SmartCard11
        caption="Ocean Biota"
        imageUrl="/smartcard/ocean_biota.png"
        onCardClicked={() =>
          props.onCardClicked && props.onCardClicked(CARD_ID.OCEAN_BIOTA)
        }
      />
      <SmartCard21
        caption="Explore on Map"
        onCardClicked={() =>
          props.onCardClicked && props.onCardClicked(CARD_ID.EXPLORER_ON_MAP)
        }
      />
      <SmartCard11
        caption="Fishery"
        imageUrl="/smartcard/fishery.png"
        onCardClicked={() =>
          props.onCardClicked && props.onCardClicked(CARD_ID.FISHERY)
        }
      />
      <SmartCard11
        caption="Tourism"
        imageUrl="/smartcard/tour.png"
        onCardClicked={() =>
          props.onCardClicked && props.onCardClicked(CARD_ID.TOURISM)
        }
      />
    </ComplexSmartPanel>
  );
};

export default ShortCutSmartPanel;
