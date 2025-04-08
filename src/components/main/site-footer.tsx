import React from "react";
import { siteConfig } from "@/configs/site";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;

const SiteFooter = () => {
  return (
    <footer aria-label="Footer">
<h2 className="text-center text-white py-7 text-sm">Copyright 2025 | {SITE_NAME} </h2>
    </footer>
  );
};

export default SiteFooter;
