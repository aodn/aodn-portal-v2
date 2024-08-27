import { FC } from "react";
import MainMenu from "./MainMenu";
import { padding } from "../../../styles/constants";
import AODNSiteLogo from "./AODNSiteLogo";
import SectionContainer from "./SectionContainer";

const Header: FC = () => {
  return (
    <SectionContainer
      sectionAreaStyle={{
        backgroundColor: "#fff",
        paddingY: padding.medium,
      }}
      contentAreaStyle={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <AODNSiteLogo />
      <MainMenu />
    </SectionContainer>
  );
};

export default Header;
