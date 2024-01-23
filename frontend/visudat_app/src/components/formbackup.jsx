<Form.Root className="FormRoot" action="" onSubmit={handleSubmit}>
  <Form.Field name="serial" onChange={handleChange} value={data.serial}>
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
      }}
    >
      <Form.Label>
        <p style={{ color: "var(--accent-a9)" }}>Seriennummer</p>{" "}
      </Form.Label>
      <Form.Message match="valueMissing">
        <p style={{ color: "var(--accent-a9)" }}>
          Bitte Seriennummer eintragen
        </p>
      </Form.Message>
    </div>
    <Form.Control asChild>
      <TextField.Input type="text" required />
    </Form.Control>
  </Form.Field>
  <Form.FormField
    name="plant"
    style={{ marginTop: "20px" }}
    onChange={handleChange}
    value={data.plant}
  >
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
      }}
    >
      <Form.Label>
        <p style={{ color: "var(--accent-a9)" }}>PV Anlage</p>{" "}
      </Form.Label>
      <Form.Message match="valueMissing">
        <p style={{ color: "var(--accent-a9)" }}>Bitte Anlage eintragen</p>
      </Form.Message>
    </div>
    <Form.Control asChild>
      <TextField.Input type="text" required />
    </Form.Control>
  </Form.FormField>
  <Form.Field
    name="bus"
    style={{ marginTop: "20px" }}
    onChange={handleChange}
    value={data.bus}
  >
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
      }}
    >
      <Form.Label>
        <p style={{ color: "var(--accent-a9)" }}>Anschluss an BUS</p>{" "}
      </Form.Label>
      <Form.Message match="valueMissing">
        <p style={{ color: "var(--accent-a9)" }}>Bitte BUS eintragen</p>
      </Form.Message>
    </div>
    <Form.Control asChild>
      <TextField.Input type="text" required />
    </Form.Control>
  </Form.Field>
  <Form.Submit asChild>
    <Button className="Button" style={{ marginTop: 10 }}>
      senden
    </Button>
  </Form.Submit>
</Form.Root>;
