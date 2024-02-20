import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import SiderLayout from "./SiderLayout";

const MainLayout = () => {
  //

  const baseUrl = "http://localhost:3000";

  const [tags, setTags] = useState([]);

  const reload = async () => {
    const config = { method: "GET", headers: { "Content-Type": "application/json" } };
    const response = await fetch(`${baseUrl}/controllers`, config);
    setTags(await response.json());
  };

  useEffect(() => {
    reload();
  }, []);

  return (
    <BrowserRouter>
      <SiderLayout tags={tags} />
    </BrowserRouter>
  );
};

export default MainLayout;
