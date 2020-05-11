<script>
  import FigmaInput from './forms-controls/FigmaInput';
  import FigmaSwitch from './forms-controls/FigmaSwitch';
  import FormLabel from './forms-controls/FormLabel';
  import FormUnit from './forms-controls/FormUnit';

  export let item = null;
</script>

<section class={`expanded-content${item.locked ? ' locked' : ''}`}>
  <span class="divider-top"><hr class="inner"></span>

  <span class="form-element-holder">
    <span class="form-row">
      <FormUnit
        className="form-unit split-40"
        itemIsLocked={item.locked}
        kind="inputText"
        labelText="Group&nbsp;&nbsp;&nbsp;/"
        nameId={`test-group-${item.id}`}
        value="Container"
      />
      <FormUnit
        className="form-unit split-60"
        itemIsLocked={item.locked}
        kind="inputText"
        labelText="Name"
        nameId={`test-name-${item.id}`}
        value="color-bg-container-dark"
      />
    </span>

    <FormUnit
      className="form-row"
      itemIsLocked={item.locked}
      kind="inputText"
      labelText="Label text here"
      nameId={`test-label-link-${item.id}`}
      placeholder="Type something…"
      value="I am some text to measure against"
    />

    <span class="form-row">
      <FormLabel
        labelText="Add new…"
        nameId={`add-new-label-${item.id}`}
        disableActions={true}
      />
      <FigmaInput
        className="form-element element-type-text-new split-40"
        disabled={item.locked}
        nameId={`add-new-label-${item.id}`}
        placeholder="Add stuff to me…"
      />
      <FigmaInput
        className="form-element element-type-text-new split-60"
        disabled={item.locked}
        nameId={`add-new-text-${item.id}`}
        placeholder="Add other stuff to me…"
      />
    </span>

    <FormUnit
      className="form-row"
      itemIsLocked={item.locked}
      kind="inputTextarea"
      labelText="Description"
      nameId={`test-description-${item.id}`}
      placeholder="Description"
      value="Vape stumptown taxidermy brooklyn offal. Hell of YOLO affogato four loko palo santo church-key DIY activated charcoal salvia. Vape stumptown taxidermy brooklyn offal."
    />

    <FormUnit
      className="form-row"
      itemIsLocked={item.locked}
      kind="inputSelect"
      labelText="Library"
      nameId={`test-library-${item.id}`}
      value="unassigned"
    />
    
    <span class="form-row">
      <FigmaSwitch
        className="form-element element-type-switch"
        disabled={item.locked}
        labelText="Interactive?"
        nameId="is-interactive"
      />
    </span>
    
  </span>
</section>
