import Header from "../header/header.tsx";
import Footer from "../footer/footer.tsx";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Header isLandingPage={location.pathname == "/"} />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
