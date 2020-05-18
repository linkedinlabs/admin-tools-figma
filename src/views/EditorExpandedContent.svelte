<script>
  import FigmaInput from './forms-controls/FigmaInput';
  import FigmaSwitch from './forms-controls/FigmaSwitch';
  import FormLabel from './forms-controls/FormLabel';
  import FormUnit from './forms-controls/FormUnit';
</script>

<section class="expanded-content editor">
  <span class="divider-top"><hr class="inner"></span>

  <span class="form-element-holder">
    <span class="form-row">
      <FormUnit
        className="form-unit split-40"
        invertView={true}
        kind="inputText"
        labelText="Group&nbsp;&nbsp;&nbsp;/"
        nameId="editor-test-group"
        value="Container"
      />
      <FormUnit
        className="form-unit split-60"
        invertView={true}
        kind="inputText"
        labelText="Name"
        nameId="editor-test-name"
        value="color-bg-container-dark"
      />
    </span>

    <FormUnit
      className="form-row"
      invertView={true}
      kind="inputText"
      labelText="Label text here"
      nameId="editor-test-label-link"
      placeholder="Type something…"
      value="I am some text to measure against"
    />
    
    <span class="form-row">
      <FormLabel
        invertView={true}
        labelText="Add new…"
        nameId="add-new-label"
        disableActions={true}
      />
      <FigmaInput
        className="form-element element-type-text-new split-40"
        invertView={true}
        nameId="add-new-label"
        placeholder="Add stuff to me…"
      />
      <FigmaInput
        className="form-element element-type-text-new split-60"
        invertView={true}
        nameId="add-new-text"
        placeholder="Add other stuff to me…"
      />
    </span>

    <FormUnit
      className="form-row"
      invertView={true}
      kind="inputTextarea"
      labelText="Description"
      nameId="editor-test-description"
      placeholder="Description"
      value="Vape stumptown taxidermy brooklyn offal. Hell of YOLO affogato four loko palo santo church-key DIY activated charcoal salvia. Vape stumptown taxidermy brooklyn offal."
    />

    <FormUnit
      className="form-row"
      disableCopy={true}
      invertView={true}
      kind="inputSelect"
      labelText="Library"
      nameId="editor-test-library"
      value="component"
    />

    <span class="form-row">
      <FigmaSwitch
        className="form-element element-type-switch"
        invertView={true}
        labelText="Interactive?"
        nameId="is-interactive"
      />
    </span>
    
  </span>
</section>
