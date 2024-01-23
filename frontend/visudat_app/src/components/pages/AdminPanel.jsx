import { useState } from "react";
import { Flex, Box, Heading } from "@radix-ui/themes";
import NavbarFixed from "../NavbarFixed";
import NavbarAdmin from "../NavbarAdmin";
import DataTable from "../DataTable";
import OptionsMenu from "../OptionsMenu";
import { useTranslation } from "react-i18next";

const AdminPanel = () => {
  const [headline, setHeadline] = useState("Eigentümer Liste");
  const [tabledata, setTabledata] = useState([]);
  const [formData, setFormData] = useState([""]);
  const { t } = useTranslation("table_header", "header");

  const table_headers = [
    ["ID", t("company"), "Name", "Vorname", "Email", "Telefon", "Handy"],
    ["ID", "Anlage", "Ort", "Eigentümer", "IDs"],
    ["ID", "Seriennummer", "PV Anlage", "IDs"],
    ["ID", "Benutzer Name", "Vorname", "Nachname", "Email", "Rechte"],
    ["ID", "Datenbus", "LastAddress", "Anlage", "ID", "Datenlogger", "ID"],
  ];

  // set the right table headers
  let table_header_list = [];
  switch (headline) {
    case "Eigentümer Liste":
      table_header_list = table_headers[0];
      break;

    case "PV Anlagen Liste":
      table_header_list = table_headers[1];
      break;

    case "Datenlogger Liste":
      table_header_list = table_headers[2];
      break;

    case "Benutzer Liste":
      table_header_list = table_headers[3];
      break;

    case "Daten Bus Liste":
      table_header_list = table_headers[4];
      break;

    default:
      break;
  }

  return (
    <Flex height={"100%"} direction={"column"}>
      <NavbarFixed title={t("title", { ns: "header" })} />
      <Flex justify={"end"} mt={"5"} mr={"5"}>
        <OptionsMenu />
      </Flex>
      <Flex
        height={"100%"}
        gap={"3"}
        px={"5"}
        py={"5"}
        wrap={"wrap"}
        style={{ overflowY: "auto" }}
      >
        <Box style={{ backgroundColor: "", flexGrow: "1", overflowX: "auto" }}>
          <NavbarAdmin
            onShow={setHeadline}
            setTableData={setTabledata}
            formData={formData}
            setFormData={setFormData}
          />
        </Box>
        <Box
          style={{
            backgroundColor: "var(--accent-a3)",
            flexGrow: "2",
          }}
          p={"5"}
        >
          <Heading size={"3"}>{headline}</Heading>
          <DataTable
            table_header={table_header_list}
            data={tabledata}
            headLine={headline}
            setFormData={setFormData}
          />
        </Box>
      </Flex>
    </Flex>
  );
};
export default AdminPanel;
