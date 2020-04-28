<script>
  import FigmaInput from './forms-controls/FigmaInput';
  import FormLabel from './forms-controls/FormLabel';
  import FigmaSwitch from './forms-controls/FigmaSwitch';
  import FigmaTextarea from './forms-controls/FigmaTextarea';
</script>

<section class="options" id="action-options">
  <ul id="sample-list">
    <li class="bulk-editor">
      <header class="item-group-header">
        <span class="left">
          <span class="text">
            Modify all unlocked
          </span>
        </span>
        <span class="right">
          <span class="actions">
            <button class="item-toggle action-open-close open">
              <span class="text">
                Toggle Open or Closed
              </span>
              <span class="icon">
                <svg viewBox="0 0 16 16">
                  <path d="M8.5 12L14.5 4L2.5 4L8.5 12Z"/>
                </svg>
              </span>
            </button>
          </span>
        </span>
      </header>
    </li>

    <li class="style-type">
      <header class="item-group-header">
        <span class="left">
          <span class="text">
            Typography
          </span>
        </span>
        <span class="right">
          <span class="actions">
            <button class="item-toggle action-lock-toggle">
              <span class="label">
                Lock/unlock item
              </span>
              <span class="icon locked">
                <svg viewBox="0 0 16 16">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 5.5V7H6.5V5.5C6.5 4.67157 7.17157 4 8 4C8.82843 4 9.5 4.67157 9.5 5.5ZM5.5 7V5.5C5.5 4.11929 6.61929 3 8 3C9.38071 3 10.5 4.11929 10.5 5.5V7H11C11.2761 7 11.5 7.22386 11.5 7.5V12.5C11.5 12.7761 11.2761 13 11 13H5C4.72386 13 4.5 12.7761 4.5 12.5V7.5C4.5 7.22386 4.72386 7 5 7H5.5Z"/>
                </svg>
              </span>
              <span class="icon unlocked">
                <svg viewBox="0 0 16 16">
                  <g clip-path="url(#clip0)">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10 6V7H10.5C10.7761 7 11 7.22386 11 7.5V12.5C11 12.7761 10.7761 13 10.5 13H4.5C4.22386 13 4 12.7761 4 12.5V7.5C4 7.22386 4.22386 7 4.5 7H9V4.5C9 3.11929 10.1193 2 11.5 2C12.8807 2 14 3.11929 14 4.5V6H13V4.5C13 3.67157 12.3284 3 11.5 3C10.6716 3 10 3.67157 10 4.5V6Z"/>
                  </g>
                  <defs>
                    <clipPath id="clip0">
                    <path d="M0 0H16V16H0V0Z" fill="white"/>
                  </clipPath>
                  </defs>
                </svg>
              </span>
            </button>
            <button class="item-toggle action-open-close open">
              <span class="text">
                Toggle Open or Closed
              </span>
              <span class="icon">
                <svg viewBox="0 0 16 16">
                  <path d="M8.5 12L14.5 4L2.5 4L8.5 12Z"/>
                </svg>
              </span>
            </button>
          </span>
        </span>
      </header>
    </li>

    <li class="group-type">
      <header class="item-group-header">
        <span class="left">
          <span class="text">
            Display Typography
          </span>
        </span>
        <span class="right">
          <span class="actions">
            <button class="item-toggle action-lock-toggle">
              <span class="label">
                Lock/unlock item
              </span>
              <span class="icon locked">
                <svg viewBox="0 0 16 16">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 5.5V7H6.5V5.5C6.5 4.67157 7.17157 4 8 4C8.82843 4 9.5 4.67157 9.5 5.5ZM5.5 7V5.5C5.5 4.11929 6.61929 3 8 3C9.38071 3 10.5 4.11929 10.5 5.5V7H11C11.2761 7 11.5 7.22386 11.5 7.5V12.5C11.5 12.7761 11.2761 13 11 13H5C4.72386 13 4.5 12.7761 4.5 12.5V7.5C4.5 7.22386 4.72386 7 5 7H5.5Z"/>
                </svg>
              </span>
              <span class="icon unlocked">
                <svg viewBox="0 0 16 16">
                  <g clip-path="url(#clip0)">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10 6V7H10.5C10.7761 7 11 7.22386 11 7.5V12.5C11 12.7761 10.7761 13 10.5 13H4.5C4.22386 13 4 12.7761 4 12.5V7.5C4 7.22386 4.22386 7 4.5 7H9V4.5C9 3.11929 10.1193 2 11.5 2C12.8807 2 14 3.11929 14 4.5V6H13V4.5C13 3.67157 12.3284 3 11.5 3C10.6716 3 10 3.67157 10 4.5V6Z"/>
                  </g>
                  <defs>
                    <clipPath id="clip0">
                    <path d="M0 0H16V16H0V0Z" fill="white"/>
                  </clipPath>
                  </defs>
                </svg>
              </span>
            </button>
            <button class="item-toggle action-open-close open">
              <span class="text">
                Toggle Open or Closed
              </span>
              <span class="icon">
                <svg viewBox="0 0 16 16">
                  <path d="M8.5 12L14.5 4L2.5 4L8.5 12Z"/>
                </svg>
              </span>
            </button>
          </span>
        </span>
      </header>
    </li>
    
    <li class="master-item">
      <header class="item-group-header">
        <span class="left">
          <span class="text">
            <em>Display</em> Display Large
          </span>
        </span>
        <span class="right">
          <span class="actions">
            <button class="item-toggle action-lock-toggle locked">
              <span class="label">
                Lock/unlock item
              </span>
              <span class="icon locked">
                <svg viewBox="0 0 16 16">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 5.5V7H6.5V5.5C6.5 4.67157 7.17157 4 8 4C8.82843 4 9.5 4.67157 9.5 5.5ZM5.5 7V5.5C5.5 4.11929 6.61929 3 8 3C9.38071 3 10.5 4.11929 10.5 5.5V7H11C11.2761 7 11.5 7.22386 11.5 7.5V12.5C11.5 12.7761 11.2761 13 11 13H5C4.72386 13 4.5 12.7761 4.5 12.5V7.5C4.5 7.22386 4.72386 7 5 7H5.5Z"/>
                </svg>
              </span>
              <span class="icon unlocked">
                <svg viewBox="0 0 16 16">
                  <g clip-path="url(#clip0)">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10 6V7H10.5C10.7761 7 11 7.22386 11 7.5V12.5C11 12.7761 10.7761 13 10.5 13H4.5C4.22386 13 4 12.7761 4 12.5V7.5C4 7.22386 4.22386 7 4.5 7H9V4.5C9 3.11929 10.1193 2 11.5 2C12.8807 2 14 3.11929 14 4.5V6H13V4.5C13 3.67157 12.3284 3 11.5 3C10.6716 3 10 3.67157 10 4.5V6Z"/>
                  </g>
                  <defs>
                    <clipPath id="clip0">
                    <path d="M0 0H16V16H0V0Z" fill="white"/>
                  </clipPath>
                  </defs>
                </svg>
              </span>
            </button>
            <button class="item-toggle action-open-close">
              <span class="text">
                Toggle Open or Closed
              </span>
              <span class="icon">
                <svg viewBox="0 0 16 16">
                  <path d="M8.5 12L14.5 4L2.5 4L8.5 12Z"/>
                </svg>
              </span>
            </button>
          </span>
        </span>
      </header>
    </li>
    <li class="master-item">
      <header class="item-group-header">
        <span class="left">
          <span class="text">
            <em>Display</em> Display Large Bold
          </span>
        </span>
        <span class="right">
          <span class="actions">
            <button class="item-toggle action-lock-toggle">
              <span class="label">
                Lock/unlock item
              </span>
              <span class="icon locked">
                <svg viewBox="0 0 16 16">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 5.5V7H6.5V5.5C6.5 4.67157 7.17157 4 8 4C8.82843 4 9.5 4.67157 9.5 5.5ZM5.5 7V5.5C5.5 4.11929 6.61929 3 8 3C9.38071 3 10.5 4.11929 10.5 5.5V7H11C11.2761 7 11.5 7.22386 11.5 7.5V12.5C11.5 12.7761 11.2761 13 11 13H5C4.72386 13 4.5 12.7761 4.5 12.5V7.5C4.5 7.22386 4.72386 7 5 7H5.5Z"/>
                </svg>
              </span>
              <span class="icon unlocked">
                <svg viewBox="0 0 16 16">
                  <g clip-path="url(#clip0)">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10 6V7H10.5C10.7761 7 11 7.22386 11 7.5V12.5C11 12.7761 10.7761 13 10.5 13H4.5C4.22386 13 4 12.7761 4 12.5V7.5C4 7.22386 4.22386 7 4.5 7H9V4.5C9 3.11929 10.1193 2 11.5 2C12.8807 2 14 3.11929 14 4.5V6H13V4.5C13 3.67157 12.3284 3 11.5 3C10.6716 3 10 3.67157 10 4.5V6Z"/>
                  </g>
                  <defs>
                    <clipPath id="clip0">
                    <path d="M0 0H16V16H0V0Z" fill="white"/>
                  </clipPath>
                  </defs>
                </svg>
              </span>
            </button>
            <button class="item-toggle action-open-close">
              <span class="text">
                Toggle Open or Closed
              </span>
              <span class="icon">
                <svg viewBox="0 0 16 16">
                  <path d="M8.5 12L14.5 4L2.5 4L8.5 12Z"/>
                </svg>
              </span>
            </button>
          </span>
        </span>
      </header>
    </li>
    <li class="master-item expanded">
      <header class="item-group-header">
        <span class="left">
          <span class="text">
            <em>Display</em> Display XLarge
          </span>
        </span>
        <span class="right">
          <span class="actions">
            <button class="item-toggle action-lock-toggle">
              <span class="label">
                Lock/unlock item
              </span>
              <span class="icon locked">
                <svg viewBox="0 0 16 16">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 5.5V7H6.5V5.5C6.5 4.67157 7.17157 4 8 4C8.82843 4 9.5 4.67157 9.5 5.5ZM5.5 7V5.5C5.5 4.11929 6.61929 3 8 3C9.38071 3 10.5 4.11929 10.5 5.5V7H11C11.2761 7 11.5 7.22386 11.5 7.5V12.5C11.5 12.7761 11.2761 13 11 13H5C4.72386 13 4.5 12.7761 4.5 12.5V7.5C4.5 7.22386 4.72386 7 5 7H5.5Z"/>
                </svg>
              </span>
              <span class="icon unlocked">
                <svg viewBox="0 0 16 16">
                  <g clip-path="url(#clip0)">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10 6V7H10.5C10.7761 7 11 7.22386 11 7.5V12.5C11 12.7761 10.7761 13 10.5 13H4.5C4.22386 13 4 12.7761 4 12.5V7.5C4 7.22386 4.22386 7 4.5 7H9V4.5C9 3.11929 10.1193 2 11.5 2C12.8807 2 14 3.11929 14 4.5V6H13V4.5C13 3.67157 12.3284 3 11.5 3C10.6716 3 10 3.67157 10 4.5V6Z"/>
                  </g>
                  <defs>
                    <clipPath id="clip0">
                    <path d="M0 0H16V16H0V0Z" fill="white"/>
                  </clipPath>
                  </defs>
                </svg>
              </span>
            </button>
            <button class="item-toggle action-open-close open">
              <span class="text">
                Toggle Open or Closed
              </span>
              <span class="icon">
                <svg viewBox="0 0 16 16">
                  <path d="M8.5 12L14.5 4L2.5 4L8.5 12Z"/>
                </svg>
              </span>
            </button>
          </span>
        </span>
      </header>
      <section class="expanded-content">
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
            <span class="form-element element-type-select split-50">
              <select class="styled-select select-menu" id="test-library">
                <option value="unassigned" selected>Not assigned</option>
                <option value="avatar-company">Component</option>
                <option value="avatar-person">Foundational Element</option>
              </select>
            </span>
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
    </li>
  </ul>
</section>
