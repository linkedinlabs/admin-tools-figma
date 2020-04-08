/**
 * @description Simulates Figma’s <select> menu operation. Original provided by Figma.
 * [More info]{@link https://thomas-lowry.github.io/figma-plugin-ds/#select-menu}
 * Heavily tweaked and updated.
 */
(function(){

  'use strict';

  // DEFAULT SETTINGS //////////
  //
  // position options
  // 'positionToSelection' = open menu to selected item
  // 'under' opens drop down below select menu
  // 'overlap' opens dropdown menu with first menu item overlapping select menu
  var defaults = {
    selector: 'select-menu',
    position: 'under'
  }

  // VARIABLES /////////////
  var settings, selector, targets, optionList, selectedItem, itemHeight;
  var init = false;

  // PRIVATE FUNCTIONS //////////
  const watchKeys = (e) => {
    const closeMenu = () => {
      const currentlySelectedItem = document.querySelector(`.${selector}__list--active .${selector}__list-item--active`);
      const currentlyHighlightedItem = document.querySelector(`.${selector}__list--active .${selector}__list-item--indicate`);
      const currentlySelectedButton = document.querySelector(`.${selector}__button--active`);
      const dropdown = currentlySelectedItem.parentNode;

      dropdown.classList.remove(selector + '__list--active');
      currentlySelectedButton.classList.remove(selector + '__button--active');
      if (currentlyHighlightedItem) {
        currentlyHighlightedItem.classList.remove(`${selector}__list-item--indicate`);
      }

      // remove the key listener
      document.removeEventListener('keydown', watchKeys, false);
    }

    const changeMenuValue = () => {
      let currentlySelectedItem = document.querySelector(`.${selector}__list--active .${selector}__list-item--indicate`);
      const previouslySelectedItem = document.querySelector(`.${selector}__list--active .${selector}__list-item--active`);
      if (!currentlySelectedItem) {
        currentlySelectedItem = document.querySelector(`.${selector}__list--active .${selector}__list-item--active`);
      }
      const dropdown = currentlySelectedItem.parentNode;
      const wrapperId = dropdown.parentNode.getAttribute('data-select-id');
      let select = document.querySelector('.' + wrapperId);
      let selectedValue = currentlySelectedItem.getAttribute('data-value');
      let selectItems = select.querySelectorAll('option');
      let selectItemsLen = selectItems.length;
      let event = new Event('change');

      // update the faux menu selected item
      previouslySelectedItem.classList.remove(`${selector}__list-item--active`);
      currentlySelectedItem.classList.add(`${selector}__list-item--active`);

      // update the dropdown button
      const button = dropdown.parentNode.querySelector('BUTTON');
      const buttonLabel = button.querySelector('.' + selector + '__button-label');
      buttonLabel.textContent = currentlySelectedItem.textContent;

      // update the actual select input
      selectItems.forEach((item) => {
        item.removeAttribute("selected");
      });

      if (select && !select.disabled) {
        select.value = selectedValue;
        select.dispatchEvent(event);
      }

      for (let i = 0; i < selectItemsLen; i++) {
        let value = selectItems[i].value;
        if (value == selectedValue) {
          selectItems[i].setAttribute('selected','selected');
        }
      }

      // remove the key listener
      document.removeEventListener('keydown', watchKeys, false);

      closeMenu();
    }

    const selectNext = (direction) => {
      let currentlySelectedItem = document.querySelector(`.${selector}__list--active .${selector}__list-item--indicate`);
      if (!currentlySelectedItem) {
        currentlySelectedItem = document.querySelector(`.${selector}__list--active .${selector}__list-item--active`);
      }
      if (currentlySelectedItem) {
        const dropdown = currentlySelectedItem.parentNode;

        // default is `down`, grab the next sibling
        let nextSelectedItem = currentlySelectedItem.nextSibling;
        if (direction === 'up') {
          // grab the previous sibling
          nextSelectedItem = currentlySelectedItem.previousSibling;

          // skip over separators
          if (nextSelectedItem && nextSelectedItem.tagName !== 'LI') {
            nextSelectedItem = nextSelectedItem.previousSibling;
          }

          // if the previous sibling is missing, must be at the top
          // grab the last element in the list
          if (!nextSelectedItem) {
            nextSelectedItem = currentlySelectedItem.parentNode.lastChild;
          }
        } else {
          // skip over separators
          if (nextSelectedItem && nextSelectedItem.tagName !== 'LI') {
            nextSelectedItem = nextSelectedItem.nextSibling;
          }

          // if the next sibling is missing, must be at the bottom
          // grab the first element in the list
          if (!nextSelectedItem) {
            nextSelectedItem = currentlySelectedItem.parentNode.firstChild;
          }
        }

        currentlySelectedItem.classList.remove(`${selector}__list-item--indicate`);
        nextSelectedItem.classList.add(`${selector}__list-item--indicate`);

        const dropdownHeight = dropdown.offsetHeight;
        const selectedItem = dropdown.querySelector('.' + selector + '__list-item--indicate');
        const selectedItemHeight = selectedItem.offsetHeight;
        const selectedItemTopOffset = selectedItem.getBoundingClientRect().top + window.scrollY
        const refreshedMenuTopInnerOffset = dropdown.getBoundingClientRect().top + window.scrollY;

        if ((selectedItemTopOffset < 0) || ((selectedItemTopOffset + selectedItemHeight) > dropdownHeight)) {
          const scrollPoint = selectedItemTopOffset - refreshedMenuTopInnerOffset;
          dropdown.scrollTop = scrollPoint;
        }
      }
    }

    const { key } = e;
    switch (key) {
      case 'ArrowUp':
        selectNext('up');
        break;
      case 'ArrowDown':
        selectNext('down');
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        changeMenuValue();
        break;
      case 'Escape':
        closeMenu();
        break;
      default:
        return null;
    }
  }

  // create the select menus
  function createMenus() {
    let targetLen = targets.length;
    for (let i = 0; i < targetLen; i++) {
      // create menu element wrapper + ul + button + hide select menu
      createWrapper(document.createElement('div'), i);
      
      let optionGroups = targets[i].getElementsByTagName('optgroup');
      selectedItem = targets[i].selectedIndex;
      itemHeight = 0;

      // create option groups if they are present else create normal list items
      if (optionGroups.length != 0) {
        // yes there are option groups
        // determine if option groups have labels present
        let hasLabels;
        if (!optionGroups[0].label) {
            hasLabels =  false;
        } else {
            hasLabels =  true;
        }

        // loop through option groups
        for (let k = 0; k < optionGroups.length; k++) {
          // get children of option groups
          let optionGroupChildren = optionGroups[k].getElementsByTagName('option');
          
          // create divider element
          let divider = document.createElement('div');
          divider.className = selector + '__divider';

          // if labels are present, put them before the list item
          // otherwise put a divider after (unless it is the last item)
          if (hasLabels == true) {
            // create divider
            let dividerLabel = document.createElement('span');
            let labelText = document.createTextNode(optionGroups[k].label);
            dividerLabel.className = selector + '__divider-label';
            
            if (k === 0) {
              dividerLabel.classList.add(selector + '__divider-label--first');
            }

            dividerLabel.appendChild(labelText);
            divider.appendChild(dividerLabel);
            optionList.appendChild(divider);

            // calculate height of divider
            addItemHeight(dividerLabel);

            // create the list item
            for (let j = 0; j < optionGroupChildren.length; j++) {
              createListItem(optionGroupChildren[j]);
            }
          } else {
            // create the list item 
            for (let j = 0; j < optionGroupChildren.length; j++) {
              createListItem(optionGroupChildren[j]);
            }
            
            if (k != optionGroups.length-1) {
              // create line
              let dividerLine = document.createElement('span');
              dividerLine.className = selector + '__divider-line';
              divider.appendChild(dividerLine);
              optionList.appendChild(divider);

              // calculate height of item to offset menu items
              addItemHeight(dividerLine);
            }
          }

          // prevent clicks on optgroup dividers         
          divider.addEventListener('click', stopProp, false);
        }
      } else {
        // no there are no option groups
        // create select items (no groups)
        for (let k = 0; k < targets[i].length; k++) {
          createListItem(targets[i].options[k]);
        }
      }
    }
  }

  // create wrapper element
  function createWrapper(selectWrapper, count) {
    let element = targets[count];

    // handle the select menu
    element.style.display = 'none'; // hide the select menu

    // set the selected option to the correct element if not set
    element.options[element.selectedIndex].selected = true;

    // create the div wrapper
    element.parentNode.insertBefore(selectWrapper, element);
    selectWrapper.className = selector;
    if (element.disabled) {
      selectWrapper.classList.add(selector + '--disabled');
    }

    // create unique ID and add it to both wrapper and original select element
    var wrapperId = ('id-' + Date.now() + Math.random()).replace('.', '-');
    selectWrapper.setAttribute('data-select-id', wrapperId);
    element.classList.add(wrapperId);

    // create the new button element
    let selectButton = document.createElement('button');
    let selectButtonLabel = document.createElement('span');
    let selectButtonIcon = document.createElement('span');
    optionList = document.createElement('ul');
    
    // determine button label
    let selectButtonLabelText;
    if (element.selectedIndex == 0) {
      selectButtonLabelText = document.createTextNode(element.options[0].text);
    } else {
      let index = element.selectedIndex;
      selectButtonLabelText = document.createTextNode(element.options[index].text);
    }

    // assign class names
    selectButton.className = selector + '__button';
    selectButtonLabel.className = selector + '__button-label';
    selectButtonIcon.className = selector + '__icon';
    optionList.className = selector + '__list';

    if (element.disabled) {
      selectButton.disabled = true;
    }
    
    // add button to dom
    selectWrapper.appendChild(selectButton);
    selectWrapper.appendChild(optionList);
    selectButton.appendChild(selectButtonLabel);
    selectButton.appendChild(selectButtonIcon);
    selectButtonLabel.appendChild(selectButtonLabelText);
    
    // overlap the position of the menu if setting selected
    if (settings.position == 'overlap') {
      optionList.style.top = 0;
    }

    if (settings.position == 'alignBottom') {
      optionList.style.bottom = '0px';
    }
    
    // add event listener    
    selectButton.addEventListener('click', displayMenu, false);
  }

  // create list item
  function createListItem(item) {
    if (item.value != "") {
      let listItem = document.createElement("li");
      let listIcon = document.createElement("span");
      let listText = document.createElement("span");

      listItem.className = selector + '__list-item';
      listIcon.className = selector + '__list-item-icon';
      listText.className = selector + '__list-item-text';

      listItem.setAttribute('data-value', item.value);
      listText.innerHTML +=item.text;
      
      listItem.appendChild(listIcon);
      listItem.appendChild(listText);
      optionList.appendChild(listItem);

      // add data attributes to item if positionToSelection is set
      if (settings.position == 'positionToSelection') {
          listItem.setAttribute('position', itemHeight);
          addItemHeight(listItem);
      }

      // if item is selected, add active class
      if (item.index == selectedItem) {
          listItem.classList.add(selector + '__list-item--active');
          
        if (settings.position == 'positionToSelection') {
          let menuPosition = -Math.abs(parseInt(listItem.getAttribute('position')));
          optionList.style.top = menuPosition + 'px';
        }
      }

      // event listener      
      listItem.addEventListener('click', displayMenu, false);
    }
  }

  // function display menu
  var displayMenu = function(event) {
    let element = this;

    // determine if the the menu button or item is clicked
    if (element.tagName == 'BUTTON') {
      this.classList.toggle(selector + '__button--active');

      // toggle the dropdown
      let dropdown = element.parentNode.querySelector('UL');
      dropdown.classList.toggle(selector + '__list--active');

      // set key listener
      document.addEventListener('keydown', watchKeys, false)

      const docHeight = document.body.offsetHeight;
      let menuHeight = dropdown.offsetHeight;

      // adjust menu height based on plugin container
      if (menuHeight > docHeight) {
        menuHeight = docHeight - 10;
        dropdown.style.height = menuHeight + 'px';
      }

      // adjust menu position
      const buttonTopOffset = this.getBoundingClientRect().top + window.scrollY;
      const menuTopOffset = dropdown.getBoundingClientRect().top + window.scrollY;
      const menuTopInnerOffset = parseInt(dropdown.style.top.replace('px', ''));
      let newMenuTopOffset = null;
      // console.log(`docHeight ${docHeight}; menuHeight ${menuHeight}; menuTopOffset ${menuTopOffset}; menuTopInnerOffset ${menuTopInnerOffset}`)

      if (menuTopOffset < 5) {
        // move menu down
        newMenuTopOffset = menuTopInnerOffset - menuTopOffset + 5;
        dropdown.style.top = newMenuTopOffset + 'px';
      } else if ((menuTopOffset + menuHeight) > docHeight) {
        // move menu up
        newMenuTopOffset = (docHeight - 8) - menuHeight;
        dropdown.style.top = (newMenuTopOffset - buttonTopOffset) + 'px';
      }

      // scroll menu so that selected item is visible
      const dropdownHeight = dropdown.offsetHeight;
      const selectedItem = dropdown.querySelector('.' + selector + '__list-item--active');
      const selectedItemHeight = selectedItem.offsetHeight;
      const selectedItemTopOffset = selectedItem.getBoundingClientRect().top + window.scrollY
      const refreshedMenuTopInnerOffset = dropdown.getBoundingClientRect().top + window.scrollY;

      if ((selectedItemTopOffset < 0) || ((selectedItemTopOffset + selectedItemHeight) > dropdownHeight)) {
        const scrollPoint = selectedItemTopOffset - refreshedMenuTopInnerOffset;
        dropdown.scrollTop = scrollPoint;
      }
    } else if (element.tagName == 'LI') {
      let dropdown = element.parentNode.parentNode.querySelector('UL');

      // remove active classses from all menus
      let listItems = dropdown.getElementsByTagName('LI');
      for (let i = 0; i < listItems.length; i++) {
        listItems[i].classList.remove(selector + '__list-item--active');
        listItems[i].classList.remove(selector + '__list-item--indicate');
      }

      // add active class
      element.classList.add(selector + '__list-item--active');

      // update the value of the select menu
      var wrapperId = dropdown.parentNode.getAttribute('data-select-id');
      let select = document.querySelector('.' + wrapperId);
      let selectedValue = element.getAttribute('data-value');
      let selectItems = select.querySelectorAll('option');
      let selectItemsLen = selectItems.length;
      let event = new Event('change');

      selectItems.forEach((item) => {
        item.removeAttribute("selected");
      });

      if (select && !select.disabled) {
        select.value = selectedValue;
        select.dispatchEvent(event);
      }

      for (let i = 0; i < selectItemsLen; i++) {
        let value = selectItems[i].value;
        if (value == selectedValue) {
          selectItems[i].setAttribute('selected','selected')
        }
      }

      // update the dropdown button
      let button = element.parentNode.parentNode.querySelector('BUTTON');
      let buttonLabel = button.querySelector('.' + selector + '__button-label');
      buttonLabel.textContent = element.textContent;
      button.classList.toggle(selector + '__button--active');

      // toggle the dropdown
      dropdown.classList.toggle(selector + '__list--active');

      if (settings.position == 'positionToSelection') {
        let menuPosition = -Math.abs(parseInt(element.getAttribute('position')));
        element.parentNode.style.top = menuPosition + 'px';
      }
    }
  }

  // EVENT HANDLERS //////////

  // stop event propagation
  var stopProp = function(event) {
    event.stopPropagation();
  }

  // track clicks outside the menu
  var isOutside = function(event) {
    let menus = document.querySelectorAll('select.' + selector);

    menus.forEach((menu) => {
      let parent = menu.parentNode;
      let menuList = parent.querySelector('UL');
      let button = parent.querySelector('BUTTON');

      if (menuList.classList.contains(selector + '__list--active')) {
        let clickInside = parent.contains(event.target);
        if (!clickInside) {
          menuList.classList.remove(selector + '__list--active');
          button.classList.remove(selector + '__button--active');
        }
      }
    });
  }

  // HELPER FUNCTIONS //////////
  
  // increment itemHeight
  function addItemHeight(element) {
    // get key dimensions to calculate height
    let dimensions = [
      parseInt(window.getComputedStyle(element, null).getPropertyValue('margin-top')),
      parseInt(window.getComputedStyle(element, null).getPropertyValue('margin-bottom')),
      parseInt(window.getComputedStyle(element, null).getPropertyValue('padding-top')),
      parseInt(window.getComputedStyle(element, null).getPropertyValue('padding-bottom')),
      parseInt(window.getComputedStyle(element, null).getPropertyValue('height')),
    ];
    itemHeight += arraySum(dimensions);
  }

  // helper function to return sum of array
  function arraySum(data) {
    return data.reduce(function(a,b){
      return a + b
    }, 0);
  }

  // PUBLIC FUNCTIONS /////////////
  window.selectMenu = {
    init: function(opts) {

    if (init == true) {
      // selectMenu.destroy();
    }

    settings = Object.assign({}, defaults, opts);
    selector = settings.selector;
    targets = document.querySelectorAll('.' + selector);

    createMenus();

    // click handler for clicks outside of menu
    document.addEventListener('click', isOutside, false);

    init = true;
  },

  destroy: function() {
    // destroy the elements
    let selectMenus = document.querySelectorAll('select.' + selector);
    
    selectMenus.forEach((menu) => {
      let parent = menu.parentNode;
      let button = parent.querySelector('BUTTON');
      let menuList = parent.querySelector('UL');

      button.remove();
      menuList.remove();

      parent.outerHTML = parent.innerHTML;
    });

    // remove event handler
    document.removeEventListener('click', isOutside, false);

    init = false;
  }
}

})();
