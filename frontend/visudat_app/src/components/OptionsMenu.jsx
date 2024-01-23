import React, { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { DropdownMenu, Box, Flex, Button } from "@radix-ui/themes";
import { CaretDownIcon, CheckIcon } from "@radix-ui/react-icons";
import LogoutButton from "./LogoutButton";
import { DarkmodeContext } from "./Context";

const OptionsMenu = () => {
  const { t } = useTranslation(["navbar", "dropdown"]);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [darkMode, setDarkMode] = useContext(DarkmodeContext);

  const changeLanguage = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
    localStorage.setItem("usrLng", newLanguage);
  };

  useEffect(() => {
    i18n.on("languageChanged", (lng) => setSelectedLanguage(lng));
    i18n.changeLanguage(localStorage.getItem("usrLng"));
    setDarkMode(localStorage.getItem("darkmode"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDarkMode = () => {
    setDarkMode(darkMode === "dark" ? "light" : "dark");
    localStorage.setItem("darkmode", darkMode === "dark" ? "light" : "dark");
    //console.log(darkMode);
  };

  return (
    <Flex gap={"2"}>
      <LogoutButton />
      <Box>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant="soft">
              {t("dropdown.Settings")} <CaretDownIcon />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger>{t("Language")}</DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <DropdownMenu.Item onClick={() => changeLanguage("de")}>
                  {t("German")} {console.log("HII", selectedLanguage)}
                  {selectedLanguage === "de" && <CheckIcon />}
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => changeLanguage("en")}>
                  {t("English")}{" "}
                  {selectedLanguage === "en" ? <CheckIcon /> : null}
                </DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>

            <DropdownMenu.Item onClick={handleDarkMode}>
              Darkmode {darkMode === "dark" ? <CheckIcon /> : null}
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Box>
    </Flex>
  );
};

export default OptionsMenu;
