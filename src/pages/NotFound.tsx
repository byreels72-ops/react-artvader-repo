import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SplitText } from "@/components/site/SplitText";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="page-layer flex min-h-screen flex-col justify-between px-5 pb-6 pt-5 md:px-6">
      <span className="text-[1.45rem] font-bold leading-none tracking-[-0.06em]">The Art Vader</span>
      <div>
        <SplitText as="h1" text="404" className="display-xl" />
        <div className="ui-text mt-6 flex flex-wrap items-baseline justify-between gap-4">
          <p className="text-muted-foreground">Oops! Page not found</p>
          <a href="/" className="link-line">
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
