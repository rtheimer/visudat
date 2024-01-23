import { Tabs, Box, Callout } from "@radix-ui/themes";
import OwnerForm from "./OwnerForm";
import PlantForm from "./PlantForm";
import DataloggerForm from "./DataloggerForm";
import UserForm from "./UserForm";
import DataBusForm from "./DataBusForm";

// Component representing the administrative navigation bar
const NavbarAdmin = ({ onShow, setTableData, formData, setFormData }) => {
  // Function to handle state changes based on the selected tab
  const stateHandler = (data) => {
    // Call the parent component's onShow function
    onShow(data);
    // Reset the table data to an empty array
    setTableData([]);
    setFormData([""]);
  };

  return (
    // Container for the navigation tabs
    <Tabs.Root defaultValue="owner" style={{ width: "", backgroundColor: "" }}>
      {/* List of navigation tabs */}
      <Tabs.List size="2" style={{ color: "var(--accent-a2)" }}>
        {/* Trigger for the "Eigentümer" tab */}
        <Tabs.Trigger
          onClick={() => stateHandler("Eigentümer Liste")}
          value="owner"
        >
          Eigentümer
        </Tabs.Trigger>
        {/* Trigger for the "PV Anlagen" tab */}
        <Tabs.Trigger
          onClick={() => stateHandler("PV Anlagen Liste")}
          value="plant"
        >
          PV Anlagen
        </Tabs.Trigger>
        {/* Trigger for the "Datenlogger" tab */}
        <Tabs.Trigger
          onClick={() => stateHandler("Datenlogger Liste")}
          value="logger"
        >
          Datenlogger
        </Tabs.Trigger>
        {/* Trigger for the "Benutzer" tab */}
        <Tabs.Trigger
          onClick={() => stateHandler("Daten Bus Liste")}
          value="bus"
        >
          Daten Bus
        </Tabs.Trigger>
        <Tabs.Trigger
          onClick={() => stateHandler("Benutzer Liste")}
          value="user"
        >
          Benutzer
        </Tabs.Trigger>
      </Tabs.List>
      {/* Container for tab contents */}
      <Box height={"100%"}>
        {/* Content for the "Eigentümer" tab */}
        <Tabs.Content value="owner">
          <Callout.Root mb={"3"}>
            <Callout.Text size={"6"}>Eigentümer</Callout.Text>
          </Callout.Root>
          {/* Render the form for Eigentümer (Owner) */}
          <OwnerForm
            setTableData={setTableData}
            formData={formData}
            setFormData={setFormData}
          />
        </Tabs.Content>
        {/* Content for the "PV Anlagen" tab */}
        <Tabs.Content value="plant">
          <Callout.Root mb={"3"}>
            <Callout.Text size={"6"}>PV Anlagen</Callout.Text>
          </Callout.Root>
          {/* Render the form for PV Anlagen (Plant) */}
          <PlantForm
            setTableData={setTableData}
            formData={formData}
            setFormData={setFormData}
          />
        </Tabs.Content>
        {/* Content for the "Datenlogger" tab */}
        <Tabs.Content value="logger">
          <Callout.Root mb={"3"}>
            <Callout.Text size={"6"}>Datenlogger</Callout.Text>
          </Callout.Root>
          {/* Render the form for Datenlogger (Datalogger) */}
          <DataloggerForm
            setTableData={setTableData}
            formData={formData}
            setFormData={setFormData}
          />
        </Tabs.Content>
        <Tabs.Content value="bus">
          <Callout.Root mb={"3"}>
            <Callout.Text size={"6"}>Daten Bus</Callout.Text>
          </Callout.Root>
          {/* Render the form for Datenlogger (Datalogger) */}
          <DataBusForm
            setTableData={setTableData}
            formData={formData}
            setFormData={setFormData}
          />
        </Tabs.Content>
        {/* Content for the "Benutzer" tab */}
        <Tabs.Content value="user">
          <Callout.Root mb={"3"}>
            <Callout.Text size={"6"}>Benutzer</Callout.Text>
          </Callout.Root>
          {/* Render the form for Benutzer (User) */}
          <UserForm
            setTableData={setTableData}
            formData={formData}
            setFormData={setFormData}
          />
        </Tabs.Content>
      </Box>
    </Tabs.Root>
  );
};

export default NavbarAdmin;
