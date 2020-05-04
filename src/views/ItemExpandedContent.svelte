<script>
  export let item = null;

  import FigmaInput from './forms-controls/FigmaInput';
  import FormLabel from './forms-controls/FormLabel';
  import FigmaSelectmenu from './forms-controls/FigmaSelectmenu';
  import FigmaSwitch from './forms-controls/FigmaSwitch';
  import FigmaTextarea from './forms-controls/FigmaTextarea';
</script>

<section class={`expanded-content${item.isLocked ? ' locked' : ''}`}>
  <span class="divider-top"><hr class="inner"></span>

  <span class="form-element-holder">
    <span class="form-row">
      <span class="form-unit split-40">
        <FormLabel
          labelText="Group&nbsp;&nbsp;&nbsp;/"
          nameId="test-group"
        />
        <FigmaInput
          className="form-element element-type-text"
          nameId="test-group"
          value="Container"
        />
      </span>
      <span class="form-unit split-60">
        <FormLabel
          labelText="Name"
          nameId="test-name"
        />
        <FigmaInput
          className="form-element element-type-text"
          nameId="test-name"
          value="color-bg-container-dark"
        />
      </span>
    </span>

    <span class="form-row">
      <FormLabel
        labelText="Label text here"
        nameId="test-label-link"
      />
      <FigmaInput
        className="form-element element-type-text"
        nameId="test-label-link"
        value="I am some text to measure against"
      />
    </span>
    
    <span class="form-row">
      <FormLabel
        labelText="Add new…"
        nameId="add-new-label"
        disableActions={true}
      />
      <FigmaInput
        className="form-element element-type-text-new split-40"
        nameId="add-new-label"
        placeholder="Add stuff to me…"
      />
      <FigmaInput
        className="form-element element-type-text-new split-60"
        nameId="add-new-text"
        placeholder="Add other stuff to me…"
      />
    </span>

    <span class="form-row">
      <FormLabel
        labelText="Description"
        nameId="test-description"
      />
      <FigmaTextarea
        className="form-element element-type-textarea"
        nameId="test-description"
        placeholder="Description"
        value="Vape stumptown taxidermy brooklyn offal. Hell of YOLO affogato four loko palo santo church-key DIY activated charcoal salvia. Vape stumptown taxidermy brooklyn offal."
      />
    </span>
    
    <span class="form-row">
      <FormLabel
        labelText="Library"
        nameId="test-library"
      />
      <FigmaSelectmenu
        className="form-element element-type-select split-50"
        nameId="test-library"
      />
    </span>
    
    <span class="form-row">
      <FigmaSwitch
        className="form-element element-type-switch"
        labelText="Interactive?"
        nameId="is-interactive"
      />
    </span>
    
  </span>
</section>
