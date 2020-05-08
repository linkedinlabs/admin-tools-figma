<script>
  import FigmaInput from './forms-controls/FigmaInput';
  import FigmaSelectmenu from './forms-controls/FigmaSelectmenu';
  import FigmaSwitch from './forms-controls/FigmaSwitch';
  import FigmaTextarea from './forms-controls/FigmaTextarea';
  import FormLabel from './forms-controls/FormLabel';
  import FormUnit from './forms-controls/FormUnit';
</script>

<section class="expanded-content editor">
  <span class="divider-top"><hr class="inner"></span>

  <span class="form-element-holder">
    <span class="form-row">
      <FormUnit
        className="split-40"
        invertView={true}
        kind="inputText"
        labelText="Group&nbsp;&nbsp;&nbsp;/"
        nameId="editor-test-group"
        value="Container"
      />
      <FormUnit
        className="split-60"
        invertView={true}
        kind="inputText"
        labelText="Name"
        nameId="editor-test-name"
        value="color-bg-container-dark"
      />
    </span>

    <span class="form-row">
      <FormLabel
        invertView={true}
        labelText="Label text here"
        nameId="test-label-link"
      />
      <FigmaInput
        className="form-element element-type-text"
        invertView={true}
        nameId="test-label-link"
        value="I am some text to measure against"
      />
    </span>
    
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

    <span class="form-row">
      <FormLabel
        invertView={true}
        labelText="Description"
        nameId="test-description"
      />
      <FigmaTextarea
        className="form-element element-type-textarea"
        invertView={true}
        nameId="test-description"
        placeholder="Description"
        value="Vape stumptown taxidermy brooklyn offal. Hell of YOLO affogato four loko palo santo church-key DIY activated charcoal salvia. Vape stumptown taxidermy brooklyn offal."
      />
    </span>
    
    <span class="form-row">
      <FormLabel
        invertView={true}
        labelText="Library"
        nameId="test-library"
      />
      <FigmaSelectmenu
        className="form-element element-type-select split-50"
        invertView={true}
        nameId="editor-test-library"
      />
    </span>
    
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
