<script>
  import FigmaInput from './forms-controls/FigmaInput';
  import FigmaSwitch from './forms-controls/FigmaSwitch';
  import FormLabel from './forms-controls/FormLabel';
  import FormUnit from './forms-controls/FormUnit';

  export let item = null;
</script>

<section class={`expanded-content${item.isLocked ? ' locked' : ''}`}>
  <span class="divider-top"><hr class="inner"></span>

  <span class="form-element-holder">
    <span class="form-row">
      <FormUnit
        className="form-unit split-40"
        kind="inputText"
        labelText="Group&nbsp;&nbsp;&nbsp;/"
        nameId={`test-group-${item.id}`}
        value="Container"
      />
      <FormUnit
        className="form-unit split-60"
        kind="inputText"
        labelText="Name"
        nameId={`test-name-${item.id}`}
        value="color-bg-container-dark"
      />
    </span>

    <FormUnit
      className="form-row"
      kind="inputText"
      labelText="Label text here"
      nameId={`test-label-link-${item.id}`}
      placeholder="Type something…"
      value="I am some text to measure against"
    />

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

    <FormUnit
      className="form-row"
      kind="inputTextarea"
      labelText="Description"
      nameId={`test-description-${item.id}`}
      placeholder="Description"
      value="Vape stumptown taxidermy brooklyn offal. Hell of YOLO affogato four loko palo santo church-key DIY activated charcoal salvia. Vape stumptown taxidermy brooklyn offal."
    />

    <FormUnit
      className="form-row"
      kind="inputSelect"
      labelText="Library"
      nameId={`test-library-${item.id}`}
      value="unassigned"
    />
    
    <span class="form-row">
      <FigmaSwitch
        className="form-element element-type-switch"
        labelText="Interactive?"
        nameId="is-interactive"
      />
    </span>
    
  </span>
</section>
